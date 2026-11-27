<?php

namespace App\Http\Controllers;

use App\Models\Chamado;
use App\Models\ChamadoAtendimento;
use App\Models\ChamadoHistorico;
use App\Models\Equipamento;
use App\Services\NotificacaoService;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class ChamadoController extends Controller
{
    public function __construct(
        private readonly NotificacaoService $notificacoes
    ) {
    }

    private function baseQueryParaUsuario(Request $request): Builder
    {
        $usuario = $request->user();

        $query = Chamado::query()->with([
            'usuario:id_usuario,nome,email,funcao,perfil,possui_rm,iuid_usuario,ativo',
            'equipamento.sala',
            'responsavelTi:id_usuario,nome,email,funcao,perfil',
            'triadoPor:id_usuario,nome,funcao',
            'visualizadoPor:id_usuario,nome,funcao',
            'historicos.usuario:id_usuario,nome,funcao,perfil',
            'atendimentos.tecnico:id_usuario,nome,funcao,perfil',
        ]);

        if ($usuario->perfil === 'usuario' || $request->boolean('meus')) {
            $query->where('id_usuario', $usuario->id_usuario);
        }

        if ($usuario->perfil === 'ti') {
            $query->where('status', '!=', 'emAnalise')
                ->where('triagem_status', 'aprovado');
        } elseif (!$request->boolean('incluir_recusados')) {
            $query->where('triagem_status', '!=', 'recusado');
        }

        return $query;
    }

    private function aplicarFiltros(Builder $query, Request $request): Builder
    {
        if ($status = $request->query('status')) {
            $query->where('status', $status);
        }

        if ($prioridade = $request->query('prioridade')) {
            $query->where('prioridade', $prioridade);
        }

        if ($sala = $request->query('sala')) {
            $query->where(function (Builder $q) use ($sala) {
                $q->where('sala_chamado', 'like', "%{$sala}%")
                    ->orWhereHas('equipamento', fn (Builder $eq) => $eq->where('num_sala', (int) $sala));
            });
        }

        if ($dispositivo = $request->query('dispositivo')) {
            $query->where('dispositivo', 'like', "%{$dispositivo}%");
        }

        if ($categoria = $request->query('categoria')) {
            $query->where('categoria', $categoria);
        }

        if ($responsavelId = $request->query('id_responsavel_ti')) {
            $query->where('id_responsavel_ti', (int) $responsavelId);
        }

        if ($dataDe = $request->query('data_de')) {
            $query->whereDate('data', '>=', $dataDe);
        }

        if ($dataAte = $request->query('data_ate')) {
            $query->whereDate('data', '<=', $dataAte);
        }

        if ($busca = trim((string) $request->query('busca', ''))) {
            $query->where(function (Builder $q) use ($busca) {
                $q->where('titulo', 'like', "%{$busca}%")
                    ->orWhere('descricao', 'like', "%{$busca}%")
                    ->orWhere('dispositivo', 'like', "%{$busca}%")
                    ->orWhere('sala_chamado', 'like', "%{$busca}%")
                    ->orWhere('cod_chamado', 'like', "%{$busca}%")
                    ->orWhereHas('usuario', fn (Builder $uq) => $uq->where('nome', 'like', "%{$busca}%"));
            });
        }

        return $query;
    }

    public function index(Request $request)
    {
        $usuario = $request->user();

        if (!in_array($usuario->perfil, ['usuario', 'coordenador', 'ti'], true)) {
            return response()->json(['erro' => 'Perfil inválido.'], 403);
        }

        $query = $this->baseQueryParaUsuario($request);
        $this->aplicarFiltros($query, $request);

        $chamados = $query
            ->orderBy('data', 'desc')
            ->orderBy('cod_chamado', 'desc')
            ->get();

        return response()->json($chamados);
    }

    public function show(Request $request, $id)
    {
        $usuario = $request->user();
        $chamado = Chamado::with([
            'usuario:id_usuario,nome,email,funcao,perfil,possui_rm,iuid_usuario,ativo',
            'equipamento.sala',
            'responsavelTi:id_usuario,nome,email,funcao,perfil',
            'triadoPor:id_usuario,nome,funcao',
            'visualizadoPor:id_usuario,nome,funcao',
            'historicos.usuario:id_usuario,nome,funcao,perfil',
            'atendimentos.tecnico:id_usuario,nome,funcao,perfil',
        ])->findOrFail($id);

        if ($usuario->perfil === 'usuario' && (int) $chamado->id_usuario !== (int) $usuario->id_usuario) {
            return response()->json(['erro' => 'Você não tem permissão para visualizar este chamado.'], 403);
        }

        if ($usuario->perfil === 'ti' && ($chamado->status === 'emAnalise' || $chamado->triagem_status !== 'aprovado')) {
            return response()->json([
                'erro' => 'Este chamado ainda aguarda aprovação da coordenação e não está disponível para a equipe de TI.',
            ], 403);
        }

        // Registrar condição de visualização quando um técnico de TI abre o chamado pela primeira vez
        if ($usuario->perfil === 'ti' && $chamado->visualizado_em === null) {
            $chamado->update([
                'visualizado_em' => now(),
                'visualizado_por' => $usuario->id_usuario,
            ]);

            ChamadoHistorico::create([
                'cod_chamado' => $chamado->cod_chamado,
                'id_usuario' => $usuario->id_usuario,
                'tipo_evento' => 'visualizacao',
                'status_anterior' => $chamado->status,
                'status_novo' => $chamado->status,
                'descricao_evento' => 'Chamado visualizado pela equipe de TI.',
            ]);

            $chamado->refresh()->load([
                'usuario:id_usuario,nome,email,funcao,perfil,possui_rm,iuid_usuario,ativo',
                'equipamento.sala',
                'responsavelTi:id_usuario,nome,email,funcao,perfil',
                'triadoPor:id_usuario,nome,funcao',
                'visualizadoPor:id_usuario,nome,funcao',
                'historicos.usuario:id_usuario,nome,funcao,perfil',
                'atendimentos.tecnico:id_usuario,nome,funcao,perfil',
            ]);
        }

        return response()->json($chamado);
    }

    /**
     * RF02 & RF03: Abrir chamado (e reutilizar histórico anterior criando novo registro independente).
     */
    public function store(Request $request)
    {
        $usuario = $request->user();

        if (!in_array($usuario->perfil, ['usuario', 'coordenador'], true)) {
            return response()->json([
                'erro' => 'Apenas solicitantes e coordenadores podem abrir novos chamados.',
            ], 403);
        }

        $dados = $request->validate([
            'titulo' => 'required|string|max:100',
            'sala' => 'required|integer|min:1|max:99999',
            'categoria' => 'required|string|max:30',
            'dispositivo' => 'required|string|max:100',
            'descricao' => 'required|string|max:150',
            'prioridade' => 'nullable|in:Muito alta,Alta,Média,Baixa',
            'chamado_origem_id' => 'nullable|integer|exists:chamados,cod_chamado',
        ], [
            'titulo.required' => 'O título do chamado é obrigatório.',
            'sala.required' => 'O número da sala é obrigatório.',
            'sala.integer' => 'O número da sala deve ser um valor numérico.',
            'categoria.required' => 'Selecione uma categoria.',
            'dispositivo.required' => 'Informe o dispositivo.',
            'descricao.required' => 'A descrição do problema é obrigatória.',
            'descricao.max' => 'A descrição deve ter no máximo 150 caracteres.',
        ]);

        if (!empty($dados['chamado_origem_id'])) {
            $origem = Chamado::find($dados['chamado_origem_id']);
            if (!$origem || (int) $origem->id_usuario !== (int) $usuario->id_usuario) {
                return response()->json([
                    'erro' => 'Somente o usuário que criou o chamado original pode reutilizá-lo.',
                ], 403);
            }
        }

        $equipamento = Equipamento::where('num_sala', (int) $dados['sala'])
            ->where(function (Builder $q) use ($dados) {
                $q->where('equipamentos_col', 'like', '%' . trim($dados['dispositivo']) . '%');
            })
            ->first();

        $chamado = DB::transaction(function () use ($dados, $usuario, $equipamento) {
            $ultimoId = DB::table('chamados')
                ->lockForUpdate()
                ->max('cod_chamado');

            $novo = Chamado::create([
                'cod_chamado' => ($ultimoId ?? 0) + 1,
                'titulo' => trim($dados['titulo']),
                'descricao' => trim($dados['descricao']),
                'categoria' => trim($dados['categoria']),
                'prioridade' => $dados['prioridade'] ?? 'Média',
                'status' => 'emAnalise',
                'data' => now(),
                'id_usuario' => $usuario->id_usuario,
                'num_equipamento' => $equipamento?->num_equipamentos,
                'sala_chamado' => (string) ((int) $dados['sala']),
                'dispositivo' => trim($dados['dispositivo']),
                'visualizado_em' => null,
                'triagem_status' => 'pendente',
                'triagem_por' => null,
                'triagem_em' => null,
            ]);

            $msgHistorico = !empty($dados['chamado_origem_id'])
                ? "Chamado aberto reutilizando dados do chamado #{$dados['chamado_origem_id']} e encaminhado para análise da coordenação."
                : 'Chamado aberto e encaminhado para análise da coordenação.';

            ChamadoHistorico::create([
                'cod_chamado' => $novo->cod_chamado,
                'id_usuario' => $usuario->id_usuario,
                'tipo_evento' => 'abertura',
                'status_anterior' => null,
                'status_novo' => 'emAnalise',
                'descricao_evento' => $msgHistorico,
                'detalhes_json' => [
                    'prioridade' => $novo->prioridade,
                    'sala' => $novo->sala_chamado,
                    'dispositivo' => $novo->dispositivo,
                    'chamado_origem_id' => $dados['chamado_origem_id'] ?? null,
                ],
            ]);

            return $novo;
        });

        $this->notificacoes->notificarPerfil(
            'coordenador',
            $chamado->cod_chamado,
            'abertura',
            "Novo chamado para análise #{$chamado->cod_chamado}",
            "{$usuario->nome} abriu o chamado \"{$chamado->titulo}\" na sala {$chamado->sala_chamado}.",
            $usuario->id_usuario
        );

        $chamado->load([
            'usuario:id_usuario,nome,email,funcao,perfil,possui_rm,iuid_usuario,ativo',
            'equipamento.sala',
            'responsavelTi:id_usuario,nome,email,funcao,perfil',
            'triadoPor:id_usuario,nome,funcao',
            'visualizadoPor:id_usuario,nome,funcao',
            'historicos.usuario:id_usuario,nome,funcao,perfil',
            'atendimentos.tecnico:id_usuario,nome,funcao,perfil',
        ]);

        return response()->json([
            'mensagem' => 'Chamado registrado com sucesso.',
            'chamado' => $chamado,
        ], 201);
    }

    /**
     * Seção 6: Triagem pela Coordenadora (aprovar ou recusar sem alterar o status técnico oficial).
     */
    public function triagem(Request $request, $id)
    {
        $usuario = $request->user();

        if ($usuario->perfil !== 'coordenador') {
            return response()->json([
                'erro' => 'Apenas a coordenação pode realizar a triagem de chamados.',
            ], 403);
        }

        $dados = $request->validate([
            'decisao' => 'required|in:aprovado,recusado',
            'observacao' => 'nullable|string|max:500',
            'prioridade' => 'nullable|in:Muito alta,Alta,Média,Baixa',
        ]);

        $chamado = Chamado::findOrFail($id);

        if ($chamado->status === 'resolvido') {
            return response()->json([
                'erro' => 'Não é possível realizar triagem de um chamado já resolvido.',
            ], 422);
        }

        $statusAnterior = $chamado->status;
        $observacao = !empty($dados['observacao']) ? trim((string) $dados['observacao']) : null;

        $updates = [
            'triagem_status' => $dados['decisao'],
            'triagem_por' => $usuario->id_usuario,
            'triagem_em' => now(),
            'triagem_observacao' => $observacao,
        ];

        if ($dados['decisao'] === 'aprovado' && $chamado->status === 'emAnalise') {
            $updates['status'] = 'naoVisualizado';
        }

        if (!empty($dados['prioridade'])) {
            $updates['prioridade'] = $dados['prioridade'];
        }

        $chamado->update($updates);

        $rotuloDecisao = $dados['decisao'] === 'aprovado' ? 'aprovado na triagem' : 'recusado na triagem';
        $descricaoEvento = "Chamado {$rotuloDecisao} por {$usuario->nome}."
            . ($observacao ? " Motivo: {$observacao}" : '');

        ChamadoHistorico::create([
            'cod_chamado' => $chamado->cod_chamado,
            'id_usuario' => $usuario->id_usuario,
            'tipo_evento' => 'triagem',
            'status_anterior' => $statusAnterior,
            'status_novo' => $chamado->status,
            'descricao_evento' => $descricaoEvento,
            'detalhes_json' => [
                'decisao' => $dados['decisao'],
                'observacao' => $observacao,
                'prioridade' => $chamado->prioridade,
            ],
        ]);

        if ($chamado->id_usuario && (int) $chamado->id_usuario !== (int) $usuario->id_usuario) {
            $msgSolicitante = $dados['decisao'] === 'aprovado'
                ? "Seu chamado \"{$chamado->titulo}\" foi aprovado pela coordenação e encaminhado à TI."
                : "Seu chamado \"{$chamado->titulo}\" foi recusado na triagem."
                    . ($observacao ? " Motivo: {$observacao}" : '');

            $this->notificacoes->notificar(
                (int) $chamado->id_usuario,
                $chamado->cod_chamado,
                'triagem',
                "Triagem do chamado #{$chamado->cod_chamado}",
                $msgSolicitante
            );
        }

        if ($dados['decisao'] === 'aprovado') {
            $this->notificacoes->notificarPerfil(
                'ti',
                $chamado->cod_chamado,
                'triagem',
                "Chamado aprovado para atendimento #{$chamado->cod_chamado}",
                "Chamado \"{$chamado->titulo}\" (Sala {$chamado->sala_chamado}) foi aprovado na triagem."
            );
        }

        $chamado->load([
            'usuario:id_usuario,nome,email,funcao,perfil,possui_rm,iuid_usuario,ativo',
            'equipamento.sala',
            'responsavelTi:id_usuario,nome,email,funcao,perfil',
            'triadoPor:id_usuario,nome,funcao',
            'visualizadoPor:id_usuario,nome,funcao',
            'historicos.usuario:id_usuario,nome,funcao,perfil',
            'atendimentos.tecnico:id_usuario,nome,funcao,perfil',
        ]);

        return response()->json([
            'mensagem' => $dados['decisao'] === 'aprovado'
                ? 'Chamado aprovado na triagem e encaminhado à TI.'
                : 'Chamado recusado na triagem e preservado no histórico.',
            'chamado' => $chamado,
        ]);
    }

    /**
     * RF06 & C05: Atualizar status oficial (restrito exclusivamente à equipe de TI).
     */
    public function atualizarStatus(Request $request, $id)
    {
        $usuario = $request->user();

        if ($usuario->perfil !== 'ti') {
            return response()->json([
                'erro' => 'Somente a equipe de TI autorizada pode alterar o status oficial do atendimento.',
            ], 403);
        }

        $dados = $request->validate([
            'status' => 'required|in:naoVisualizado,emProgresso,resolvido',
            'comentario' => 'nullable|string|max:500',
            'prioridade' => 'nullable|in:Muito alta,Alta,Média,Baixa',
        ]);

        $chamado = Chamado::findOrFail($id);

        if ($chamado->status === 'emAnalise' || $chamado->triagem_status !== 'aprovado') {
            return response()->json([
                'erro' => 'Somente chamados aprovados pela coordenação podem ser atualizados pela equipe de TI.',
            ], 403);
        }

        if ($chamado->status === 'resolvido') {
            return response()->json([
                'erro' => 'Este chamado já está resolvido. Utilize a opção de reabertura com justificativa.',
            ], 422);
        }

        $statusAnterior = $chamado->status;
        $statusNovo = $dados['status'];

        // C05 [FS002]: Encerramento exige atendimento com solução registrada
        if ($statusNovo === 'resolvido') {
            $possuiSolucao = ChamadoAtendimento::where('cod_chamado', $chamado->cod_chamado)
                ->where('tipo_registro', 'solucao')
                ->exists();

            if (!$possuiSolucao) {
                return response()->json([
                    'erro' => 'Para marcar o chamado como resolvido, registre primeiro o atendimento e a solução encontrada.',
                ], 422);
            }
        }

        $chamado->update([
            'status' => $statusNovo,
            'prioridade' => $dados['prioridade'] ?? $chamado->prioridade,
            'id_responsavel_ti' => $usuario->id_usuario,
            'visualizado_em' => $chamado->visualizado_em ?? now(),
            'visualizado_por' => $chamado->visualizado_por ?? $usuario->id_usuario,
        ]);

        $rotulos = [
            'emAnalise' => 'Em Análise',
            'naoVisualizado' => 'Não Visualizado',
            'emProgresso' => 'Em Progresso',
            'resolvido' => 'Resolvido',
        ];

        $rotuloAnterior = $rotulos[$statusAnterior] ?? $statusAnterior;
        $rotuloNovo = $rotulos[$statusNovo] ?? $statusNovo;

        $descricaoEvento = "Status alterado de \"{$rotuloAnterior}\" para \"{$rotuloNovo}\" por {$usuario->nome}."
            . (!empty($dados['comentario']) ? " Observação: {$dados['comentario']}" : '');

        ChamadoHistorico::create([
            'cod_chamado' => $chamado->cod_chamado,
            'id_usuario' => $usuario->id_usuario,
            'tipo_evento' => 'status',
            'status_anterior' => $statusAnterior,
            'status_novo' => $statusNovo,
            'descricao_evento' => $descricaoEvento,
            'detalhes_json' => [
                'comentario' => $dados['comentario'] ?? null,
                'prioridade' => $chamado->prioridade,
            ],
        ]);

        if ($chamado->id_usuario && (int) $chamado->id_usuario !== (int) $usuario->id_usuario) {
            $this->notificacoes->notificar(
                (int) $chamado->id_usuario,
                $chamado->cod_chamado,
                'status',
                "Atualização do chamado #{$chamado->cod_chamado}",
                "O status do chamado \"{$chamado->titulo}\" foi atualizado para {$rotuloNovo} por {$usuario->nome}."
            );
        }

        $chamado->load([
            'usuario:id_usuario,nome,email,funcao,perfil,possui_rm,iuid_usuario,ativo',
            'equipamento.sala',
            'responsavelTi:id_usuario,nome,email,funcao,perfil',
            'triadoPor:id_usuario,nome,funcao',
            'visualizadoPor:id_usuario,nome,funcao',
            'historicos.usuario:id_usuario,nome,funcao,perfil',
            'atendimentos.tecnico:id_usuario,nome,funcao,perfil',
        ]);

        return response()->json([
            'mensagem' => 'Status atualizado com sucesso.',
            'chamado' => $chamado,
        ]);
    }

    public function atualizarPrioridade(Request $request, $id)
    {
        $usuario = $request->user();

        if (!in_array($usuario->perfil, ['ti', 'coordenador'], true)) {
            return response()->json([
                'erro' => 'Você não possui permissão para alterar a prioridade.',
            ], 403);
        }

        $dados = $request->validate([
            'prioridade' => 'required|in:Muito alta,Alta,Média,Baixa',
        ]);

        $chamado = Chamado::findOrFail($id);

        if ($usuario->perfil === 'ti' && ($chamado->status === 'emAnalise' || $chamado->triagem_status !== 'aprovado')) {
            return response()->json([
                'erro' => 'Este chamado ainda aguarda aprovação da coordenação.',
            ], 403);
        }

        $prioridadeAnterior = $chamado->prioridade;

        $chamado->update([
            'prioridade' => $dados['prioridade'],
        ]);

        ChamadoHistorico::create([
            'cod_chamado' => $chamado->cod_chamado,
            'id_usuario' => $usuario->id_usuario,
            'tipo_evento' => 'prioridade',
            'status_anterior' => $chamado->status,
            'status_novo' => $chamado->status,
            'descricao_evento' => "Prioridade alterada de \"{$prioridadeAnterior}\" para \"{$dados['prioridade']}\" por {$usuario->nome}.",
        ]);

        return response()->json([
            'mensagem' => 'Prioridade atualizada com sucesso.',
            'chamado' => $chamado->fresh([
                'usuario:id_usuario,nome,email,funcao,perfil,possui_rm,iuid_usuario,ativo',
                'equipamento.sala',
                'responsavelTi:id_usuario,nome,email,funcao,perfil',
                'triadoPor:id_usuario,nome,funcao',
                'visualizadoPor:id_usuario,nome,funcao',
                'historicos.usuario:id_usuario,nome,funcao,perfil',
                'atendimentos.tecnico:id_usuario,nome,funcao,perfil',
            ]),
        ]);
    }

    /**
     * C06: Registrar atendimento e solução (ou pendência), restrito à equipe de TI.
     */
    public function registrarAtendimento(Request $request, $id)
    {
        $usuario = $request->user();

        if ($usuario->perfil !== 'ti') {
            return response()->json([
                'erro' => 'Somente a equipe de TI pode registrar atendimentos técnicos.',
            ], 403);
        }

        $chamado = Chamado::findOrFail($id);

        if ($chamado->status === 'emAnalise' || $chamado->triagem_status !== 'aprovado') {
            return response()->json([
                'erro' => 'Somente chamados aprovados pela coordenação podem receber atendimento da TI.',
            ], 403);
        }

        $dados = $request->validate([
            'procedimentos' => 'required|string|min:3|max:2000',
            'materiais' => 'nullable|string|max:500',
            'orientacoes' => 'nullable|string|max:2000',
            'tipo_registro' => 'required|in:solucao,pendencia',
            'solucao' => 'required_if:tipo_registro,solucao|nullable|string|max:2000',
            'pendencia' => 'required_if:tipo_registro,pendencia|nullable|string|max:2000',
            'concluir_chamado' => 'nullable|boolean',
        ], [
            'procedimentos.required' => 'Informe os procedimentos realizados.',
            'solucao.required_if' => 'Informe a solução encontrada.',
            'pendencia.required_if' => 'Descreva a pendência identificada.',
        ]);

        DB::transaction(function () use ($chamado, $usuario, $dados) {
            ChamadoAtendimento::create([
                'cod_chamado' => $chamado->cod_chamado,
                'id_tecnico' => $usuario->id_usuario,
                'procedimentos' => trim($dados['procedimentos']),
                'materiais' => !empty($dados['materiais']) ? trim($dados['materiais']) : null,
                'orientacoes' => !empty($dados['orientacoes']) ? trim($dados['orientacoes']) : null,
                'tipo_registro' => $dados['tipo_registro'],
                'solucao' => $dados['tipo_registro'] === 'solucao' ? trim((string) $dados['solucao']) : null,
                'pendencia' => $dados['tipo_registro'] === 'pendencia' ? trim((string) $dados['pendencia']) : null,
            ]);

            $statusAnterior = $chamado->status;
            $statusNovo = $statusAnterior;

            if ($dados['tipo_registro'] === 'solucao' && !empty($dados['concluir_chamado'])) {
                $statusNovo = 'resolvido';
            } elseif ($dados['tipo_registro'] === 'pendencia' && $statusAnterior === 'naoVisualizado') {
                $statusNovo = 'emProgresso';
            }

            $chamado->update([
                'status' => $statusNovo,
                'id_responsavel_ti' => $usuario->id_usuario,
                'visualizado_em' => $chamado->visualizado_em ?? now(),
                'visualizado_por' => $chamado->visualizado_por ?? $usuario->id_usuario,
            ]);

            $desc = $dados['tipo_registro'] === 'solucao'
                ? "Atendimento com solução registrado por {$usuario->nome}: {$dados['solucao']}"
                : "Atendimento com pendência registrado por {$usuario->nome}: {$dados['pendencia']}";

            ChamadoHistorico::create([
                'cod_chamado' => $chamado->cod_chamado,
                'id_usuario' => $usuario->id_usuario,
                'tipo_evento' => 'atendimento',
                'status_anterior' => $statusAnterior,
                'status_novo' => $statusNovo,
                'descricao_evento' => $desc,
                'detalhes_json' => [
                    'tipo_registro' => $dados['tipo_registro'],
                    'materiais' => $dados['materiais'] ?? null,
                ],
            ]);
        });

        if ($chamado->id_usuario && (int) $chamado->id_usuario !== (int) $usuario->id_usuario) {
            $msg = $dados['tipo_registro'] === 'solucao'
                ? "A TI registrou uma solução para o chamado \"{$chamado->titulo}\"."
                : "A TI registrou uma pendência no atendimento do chamado \"{$chamado->titulo}\".";

            $this->notificacoes->notificar(
                (int) $chamado->id_usuario,
                $chamado->cod_chamado,
                'atendimento',
                "Atendimento registrado no chamado #{$chamado->cod_chamado}",
                $msg
            );
        }

        $chamado->refresh()->load([
            'usuario:id_usuario,nome,email,funcao,perfil,possui_rm,iuid_usuario,ativo',
            'equipamento.sala',
            'responsavelTi:id_usuario,nome,email,funcao,perfil',
            'triadoPor:id_usuario,nome,funcao',
            'visualizadoPor:id_usuario,nome,funcao',
            'historicos.usuario:id_usuario,nome,funcao,perfil',
            'atendimentos.tecnico:id_usuario,nome,funcao,perfil',
        ]);

        return response()->json([
            'mensagem' => 'Atendimento registrado com sucesso.',
            'chamado' => $chamado,
        ], 201);
    }

    /**
     * C11: Reabrir chamado concluído exigindo justificativa e preservando atendimentos anteriores.
     */
    public function reabrir(Request $request, $id)
    {
        $usuario = $request->user();
        $chamado = Chamado::findOrFail($id);

        $podeReabrir = $usuario->perfil === 'ti'
            || ((int) $chamado->id_usuario === (int) $usuario->id_usuario);

        if (!$podeReabrir) {
            return response()->json([
                'erro' => 'Você não possui permissão para reabrir este chamado.',
            ], 403);
        }

        if ($chamado->status !== 'resolvido') {
            return response()->json([
                'erro' => 'Somente chamados resolvidos podem ser reabertos.',
            ], 422);
        }

        $dados = $request->validate([
            'motivo' => 'required|string|min:5|max:500',
        ], [
            'motivo.required' => 'Informe o motivo da reabertura do chamado.',
            'motivo.min' => 'O motivo da reabertura deve ter ao menos 5 caracteres.',
        ]);

        $statusAnterior = $chamado->status;

        $chamado->update([
            'status' => 'naoVisualizado',
            'visualizado_em' => null,
            'visualizado_por' => null,
            'triagem_status' => 'aprovado',
        ]);

        ChamadoHistorico::create([
            'cod_chamado' => $chamado->cod_chamado,
            'id_usuario' => $usuario->id_usuario,
            'tipo_evento' => 'reabertura',
            'status_anterior' => $statusAnterior,
            'status_novo' => 'naoVisualizado',
            'descricao_evento' => "Chamado reaberto por {$usuario->nome}. Motivo: {$dados['motivo']}",
            'detalhes_json' => [
                'motivo' => trim($dados['motivo']),
            ],
        ]);

        if ($usuario->perfil !== 'ti') {
            $this->notificacoes->notificarPerfil(
                'ti',
                $chamado->cod_chamado,
                'reabertura',
                "Chamado reaberto #{$chamado->cod_chamado}",
                "{$usuario->nome} reabriu o chamado \"{$chamado->titulo}\". Motivo: {$dados['motivo']}"
            );
        } elseif ($chamado->id_usuario && (int) $chamado->id_usuario !== (int) $usuario->id_usuario) {
            $this->notificacoes->notificar(
                (int) $chamado->id_usuario,
                $chamado->cod_chamado,
                'reabertura',
                "Chamado #{$chamado->cod_chamado} reaberto",
                "Seu chamado \"{$chamado->titulo}\" foi reaberto por {$usuario->nome}. Motivo: {$dados['motivo']}"
            );
        }

        $chamado->load([
            'usuario:id_usuario,nome,email,funcao,perfil,possui_rm,iuid_usuario,ativo',
            'equipamento.sala',
            'responsavelTi:id_usuario,nome,email,funcao,perfil',
            'triadoPor:id_usuario,nome,funcao',
            'visualizadoPor:id_usuario,nome,funcao',
            'historicos.usuario:id_usuario,nome,funcao,perfil',
            'atendimentos.tecnico:id_usuario,nome,funcao,perfil',
        ]);

        return response()->json([
            'mensagem' => 'Chamado reaberto e encaminhado novamente à fila da TI.',
            'chamado' => $chamado,
        ]);
    }

    /**
     * C10: Consultar indicadores reais com filtros por status, prioridade, local, dispositivo, responsável e período.
     */
    public function indicadores(Request $request)
    {
        $usuario = $request->user();
        $query = $this->baseQueryParaUsuario($request);
        $this->aplicarFiltros($query, $request);

        $chamados = $query->get();
        $total = $chamados->count();

        $pct = fn (int $qtd) => $total > 0 ? (int) round(($qtd / $total) * 100) : 0;

        $emAnalise = $chamados->where('status', 'emAnalise')->count();
        $naoVisualizados = $chamados->where('status', 'naoVisualizado')->count();
        $emProgresso = $chamados->where('status', 'emProgresso')->count();
        $urgentes = $chamados->whereIn('prioridade', ['Muito alta', 'Alta'])->count();
        $resolvidos = $chamados->where('status', 'resolvido')->count();

        $porStatus = $usuario->perfil === 'ti'
            ? [
                'naoVisualizado' => $naoVisualizados,
                'emProgresso' => $emProgresso,
                'resolvido' => $resolvidos,
            ]
            : [
                'emAnalise' => $emAnalise,
                'naoVisualizado' => $naoVisualizados,
                'emProgresso' => $emProgresso,
                'resolvido' => $resolvidos,
            ];

        $porPrioridade = [
            'Muito alta' => $chamados->where('prioridade', 'Muito alta')->count(),
            'Alta' => $chamados->where('prioridade', 'Alta')->count(),
            'Média' => $chamados->where('prioridade', 'Média')->count(),
            'Baixa' => $chamados->where('prioridade', 'Baixa')->count(),
        ];

        $porLocal = $chamados
            ->groupBy(fn ($c) => $c->sala_chamado ?: ($c->equipamento?->num_sala ? (string) $c->equipamento->num_sala : 'Não informado'))
            ->map(fn ($grupo, $sala) => ['sala' => $sala, 'total' => $grupo->count()])
            ->sortByDesc('total')
            ->values();

        $porDispositivo = $chamados
            ->groupBy(fn ($c) => $c->dispositivo ?: ($c->equipamento?->equipamentos_col ?: 'Não informado'))
            ->map(fn ($grupo, $disp) => ['dispositivo' => $disp, 'total' => $grupo->count()])
            ->sortByDesc('total')
            ->values();

        $porResponsavel = $chamados
            ->groupBy(fn ($c) => $c->responsavelTi?->nome ?? 'Não atribuído')
            ->map(fn ($grupo, $resp) => ['responsavel' => $resp, 'total' => $grupo->count()])
            ->sortByDesc('total')
            ->values();

        $ocorrenciasRecorrentes = $chamados
            ->groupBy(function ($c) {
                $sala = $c->sala_chamado ?: ($c->equipamento?->num_sala ?? 'S/N');
                $disp = $c->dispositivo ?: ($c->equipamento?->equipamentos_col ?? 'Equipamento');
                return "{$sala}|{$disp}|{$c->categoria}";
            })
            ->map(function ($grupo) {
                $primeiro = $grupo->first();
                return [
                    'sala' => $primeiro->sala_chamado ?: ($primeiro->equipamento?->num_sala ? (string) $primeiro->equipamento->num_sala : 'S/N'),
                    'dispositivo' => $primeiro->dispositivo ?: ($primeiro->equipamento?->equipamentos_col ?? 'Equipamento'),
                    'categoria' => $primeiro->categoria,
                    'total' => $grupo->count(),
                ];
            })
            ->filter(fn ($item) => $item['total'] >= 2)
            ->sortByDesc('total')
            ->values();

        return response()->json([
            'total' => $total,
            'resumo_cards' => [
                'nao_visualizados' => ['quantidade' => $naoVisualizados, 'porcentagem' => $pct($naoVisualizados)],
                'em_progresso' => ['quantidade' => $emProgresso, 'porcentagem' => $pct($emProgresso)],
                'urgentes' => ['quantidade' => $urgentes, 'porcentagem' => $pct($urgentes)],
                'em_analise' => ['quantidade' => $emAnalise, 'porcentagem' => $pct($emAnalise)],
                'resolvidos' => ['quantidade' => $resolvidos, 'porcentagem' => $pct($resolvidos)],
            ],
            'por_status' => $porStatus,
            'por_prioridade' => $porPrioridade,
            'por_local' => $porLocal,
            'por_dispositivo' => $porDispositivo,
            'por_responsavel' => $porResponsavel,
            'ocorrencias_recorrentes' => $ocorrenciasRecorrentes,
        ]);
    }
}
