<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;
use Illuminate\Validation\Rule;

class ChamadoController extends Controller
{
    public function index(): JsonResponse
    {
        $chamados = DB::table('chamados')
            ->leftJoin('usuarios', 'usuarios.id_usuario', '=', 'chamados.id_usuario')
            ->leftJoin('equipamentos', 'equipamentos.num_equipamentos', '=', 'chamados.num_equipamento')
            ->orderByDesc('chamados.data')
            ->orderByDesc('chamados.cod_chamado')
            ->get([
                'chamados.cod_chamado',
                'chamados.descricao',
                'chamados.categoria',
                'chamados.status',
                'chamados.data',
                'chamados.sala_chamado',
                'chamados.dispositivo',
                'chamados.id_usuario',
                'chamados.num_equipamento',
                'usuarios.nome as usuario_nome',
                'usuarios.funcao as usuario_funcao',
                'equipamentos.num_sala',
                'equipamentos.num_computador',
                'equipamentos.equipamentos_col',
            ])
            ->map(fn (object $chamado): array => $this->formatChamado($chamado));

        return response()->json(['data' => $chamados]);
    }

    public function store(Request $request): JsonResponse
    {
        $dados = $request->validate([
            'descricao' => ['required', 'string', 'max:150'],
            'categoria' => ['required', 'string', Rule::in(['Hardware', 'Software'])],
            'sala' => ['required', 'string', 'max:80'],
            'dispositivo' => ['required', 'string', 'max:100'],
        ]);

        $agora = now();
        $sala = trim($dados['sala']);
        $dispositivo = trim($dados['dispositivo']);

        // O catálogo de equipamentos é opcional: guardamos os dados digitados
        // mesmo quando ainda não existe um equipamento correspondente no inventário.
        $equipamento = $this->encontrarEquipamento($sala, $dispositivo);
        $usuarioId = $request->attributes->get('api_user_id');

        $codChamado = DB::transaction(function () use ($dados, $sala, $dispositivo, $equipamento, $agora, $usuarioId): int {
            $id = ((int) DB::table('chamados')->max('cod_chamado')) + 1;

            DB::table('chamados')->insert([
                'cod_chamado' => $id,
                'descricao' => trim($dados['descricao']),
                'categoria' => $dados['categoria'],
                'status' => 'Aberto',
                'data' => $agora,
                'id_usuario' => $usuarioId,
                'num_equipamento' => $equipamento?->num_equipamentos,
                'sala_chamado' => $sala,
                'dispositivo' => $dispositivo,
                'created_at' => $agora,
                'updated_at' => $agora,
            ]);

            return $id;
        });

        $criado = DB::table('chamados')
            ->leftJoin('usuarios', 'usuarios.id_usuario', '=', 'chamados.id_usuario')
            ->leftJoin('equipamentos', 'equipamentos.num_equipamentos', '=', 'chamados.num_equipamento')
            ->where('chamados.cod_chamado', $codChamado)
            ->first([
                'chamados.cod_chamado',
                'chamados.descricao',
                'chamados.categoria',
                'chamados.status',
                'chamados.data',
                'chamados.sala_chamado',
                'chamados.dispositivo',
                'chamados.id_usuario',
                'chamados.num_equipamento',
                'usuarios.nome as usuario_nome',
                'usuarios.funcao as usuario_funcao',
                'equipamentos.num_sala',
                'equipamentos.num_computador',
                'equipamentos.equipamentos_col',
            ]);

        return response()->json([
            'message' => 'Chamado criado com sucesso.',
            'data' => $this->formatChamado($criado),
        ], 201);
    }

    public function destroy(int $id): JsonResponse
    {
        $excluidos = DB::table('chamados')
            ->where('cod_chamado', $id)
            ->delete();

        if ($excluidos === 0) {
            return response()->json(['message' => 'Chamado não encontrado.'], 404);
        }

        return response()->json(['message' => 'Chamado excluído com sucesso.']);
    }

    private function encontrarEquipamento(string $sala, string $dispositivo): ?object
    {
        $numeroSala = preg_match('/\d+/', $sala, $salaMatch) ? (int) $salaMatch[0] : null;
        $numeroDispositivo = preg_match('/\d+/', $dispositivo, $dispositivoMatch)
            ? (int) $dispositivoMatch[0]
            : null;

        return DB::table('equipamentos')
            ->when($numeroSala !== null, fn ($query) => $query->where('num_sala', $numeroSala))
            ->where(function ($query) use ($dispositivo, $numeroDispositivo): void {
                $query->where('equipamentos_col', $dispositivo);
                if ($numeroDispositivo !== null) {
                    $query->orWhere('num_computador', $numeroDispositivo);
                }
            })
            ->first(['num_equipamentos']);
    }

    private function formatChamado(object $chamado): array
    {
        $data = $chamado->data ? now()->parse($chamado->data) : null;
        $status = match (mb_strtolower((string) $chamado->status)) {
            'aberto', 'não iniciado', 'nao iniciado' => 0,
            'em andamento', 'em progresso' => 1,
            'concluído', 'concluido', 'resolvido' => 2,
            'em análise', 'em analise', 'pendente' => 3,
            'urgente', 'urgência', 'urgencia' => 4,
            default => is_numeric($chamado->status) ? (int) $chamado->status : 0,
        };

        return [
            'id' => (int) $chamado->cod_chamado,
            'titulo' => Str::limit(trim((string) $chamado->descricao), 70),
            'nome' => $chamado->usuario_nome ?: 'Solicitante',
            'cargo' => $chamado->usuario_funcao ?: 'Não informado',
            'sala' => $chamado->sala_chamado ?: ($chamado->num_sala ? 'Sala '.$chamado->num_sala : 'Não informada'),
            'descricao' => $chamado->descricao,
            'categoria' => $chamado->categoria,
            'dispositivo' => $chamado->dispositivo ?: ($chamado->equipamentos_col ?: ($chamado->num_computador ? 'Computador '.$chamado->num_computador : 'Não informado')),
            'data' => $data?->locale('pt_BR')->translatedFormat('j, F Y - H:i'),
            'dataIso' => $data?->toIso8601String(),
            'dataDia' => $data?->format('Y-m-d'),
            'status' => $status,
            'salvo' => false,
            'bookmarked' => false,
            'lixeira' => false,
        ];
    }
}
