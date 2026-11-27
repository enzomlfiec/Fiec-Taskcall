<?php

namespace Database\Seeders;

use App\Http\Controllers\AuthController;
use App\Models\Chamado;
use App\Models\ChamadoAtendimento;
use App\Models\ChamadoHistorico;
use App\Models\Usuario;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;

class DemoDadosSeeder extends Seeder
{
    public function run(): void
    {
        $ana = Usuario::where('email', 'ana.picolomini@fiec.edu.br')->first();
        if (!$ana) {
            $this->call(MasterUsersSeeder::class);
            $ana = Usuario::where('email', 'ana.picolomini@fiec.edu.br')->firstOrFail();
        }

        $anaId = (int) $ana->id_usuario;

        // 1. Criar 6 professores fictícios
        $professoresDados = [
            ['nome' => 'Ricardo Almeida', 'email' => 'ricardo.almeida@fiec.edu.br'],
            ['nome' => 'Beatriz Nogueira', 'email' => 'beatriz.nogueira@fiec.edu.br'],
            ['nome' => 'Fernando Rocha', 'email' => 'fernando.rocha@fiec.edu.br'],
            ['nome' => 'Juliana Vasconcelos', 'email' => 'juliana.vasconcelos@fiec.edu.br'],
            ['nome' => 'Marcelo Tavares', 'email' => 'marcelo.tavares@fiec.edu.br'],
            ['nome' => 'Camila Silveira', 'email' => 'camila.silveira@fiec.edu.br'],
        ];

        $professores = [];
        foreach ($professoresDados as $profData) {
            $prof = Usuario::where('email', $profData['email'])->first();
            if (!$prof) {
                $prof = Usuario::create([
                    'nome' => $profData['nome'],
                    'email' => $profData['email'],
                    'iuid_usuario' => AuthController::gerarIdentificadorInternoUnico(),
                    'senha' => Hash::make('prof1234'),
                    'cod_responsavel' => $anaId,
                    'funcao' => 'Professor',
                    'perfil' => 'usuario',
                    'possui_rm' => false,
                    'is_admin_ti' => false,
                    'ativo' => true,
                ]);
            }
            $professores[] = $prof;
        }

        // 2. Criar 6 contas do setor de TI
        $tisDados = [
            ['nome' => 'Lucas Ferreira', 'email' => 'lucas.ferreira@fiec.edu.br', 'rm' => 61001],
            ['nome' => 'Mariana Duarte', 'email' => 'mariana.duarte@fiec.edu.br', 'rm' => 61002],
            ['nome' => 'Rafael Monteiro', 'email' => 'rafael.monteiro@fiec.edu.br', 'rm' => 61003],
            ['nome' => 'Patrícia Gomes', 'email' => 'patricia.gomes@fiec.edu.br', 'rm' => 61004],
            ['nome' => 'Thiago Barbosa', 'email' => 'thiago.barbosa@fiec.edu.br', 'rm' => 61005],
            ['nome' => 'Vanessa Ribeiro', 'email' => 'vanessa.ribeiro@fiec.edu.br', 'rm' => 61006],
        ];

        $tecnicos = [];
        foreach ($tisDados as $tiData) {
            $ti = Usuario::where('email', $tiData['email'])->first();
            if (!$ti) {
                $rm = $tiData['rm'];
                while (Usuario::where('iuid_usuario', $rm)->exists()) {
                    $rm++;
                }
                $ti = Usuario::create([
                    'nome' => $tiData['nome'],
                    'email' => $tiData['email'],
                    'iuid_usuario' => $rm,
                    'senha' => Hash::make('ti123456'),
                    'cod_responsavel' => $anaId,
                    'funcao' => 'Analista de TI',
                    'perfil' => 'ti',
                    'possui_rm' => true,
                    'is_admin_ti' => false,
                    'ativo' => true,
                ]);
            }
            $tecnicos[] = $ti;
        }

        // 3. Criar 10 chamados de professores com datas e salas dispersas
        $chamadosProfessores = [
            [
                'prof_idx' => 0,
                'ti_idx' => 0,
                'titulo' => 'Projetor sem imagem via HDMI',
                'sala' => '14',
                'categoria' => 'Hardware',
                'dispositivo' => 'Projetor Epson 01',
                'descricao' => 'Projetor liga normalmente, mas não exibe imagem do notebook docente.',
                'prioridade' => 'Alta',
                'status' => 'naoVisualizado',
                'triagem' => 'aprovado',
                'visualizado' => false,
                'data' => '2026-08-19 08:20:00',
            ],
            [
                'prof_idx' => 1,
                'ti_idx' => 1,
                'titulo' => 'Veyon não lista máquinas da fila B',
                'sala' => '27',
                'categoria' => 'Software',
                'dispositivo' => 'Máquina Professor',
                'descricao' => 'Ao abrir o Veyon Master, 6 estações da fila B aparecem offline.',
                'prioridade' => 'Média',
                'status' => 'emProgresso',
                'triagem' => 'aprovado',
                'visualizado' => true,
                'data' => '2026-08-25 14:10:00',
            ],
            [
                'prof_idx' => 2,
                'ti_idx' => 2,
                'titulo' => 'Ponto de rede sem link na bancada 04',
                'sala' => '33',
                'categoria' => 'Rede',
                'dispositivo' => 'Máquina 04',
                'descricao' => 'LED da placa de rede apagado mesmo após troca do patch cord.',
                'prioridade' => 'Muito alta',
                'status' => 'emProgresso',
                'triagem' => 'aprovado',
                'visualizado' => true,
                'data' => '2026-09-03 19:35:00',
            ],
            [
                'prof_idx' => 3,
                'ti_idx' => 3,
                'titulo' => 'Instalar Visual Studio Code atualizado',
                'sala' => '41',
                'categoria' => 'Software',
                'dispositivo' => 'Máquina 12',
                'descricao' => 'Solicito atualização do VS Code e extensão PHP para aula prática.',
                'prioridade' => 'Baixa',
                'status' => 'resolvido',
                'triagem' => 'aprovado',
                'visualizado' => true,
                'data' => '2026-09-12 10:05:00',
                'solucao' => 'VS Code atualizado para a última versão estável em todas as estações.',
            ],
            [
                'prof_idx' => 4,
                'ti_idx' => 4,
                'titulo' => 'Monitor piscando intermitentemente',
                'sala' => '52',
                'categoria' => 'Hardware',
                'dispositivo' => 'Monitor 09',
                'descricao' => 'A tela apaga por 2 segundos a cada minuto durante a digitação.',
                'prioridade' => 'Média',
                'status' => 'emProgresso',
                'triagem' => 'aprovado',
                'visualizado' => true,
                'data' => '2026-09-24 15:45:00',
            ],
            [
                'prof_idx' => 5,
                'ti_idx' => null,
                'titulo' => 'Sem acesso ao Wi-Fi institucional',
                'sala' => '108',
                'categoria' => 'Rede',
                'dispositivo' => 'Access Point 03',
                'descricao' => 'Dispositivos conectados na sala 108 perdem conexão a cada 5 minutos.',
                'prioridade' => 'Alta',
                'status' => 'emAnalise',
                'triagem' => 'pendente',
                'visualizado' => false,
                'data' => '2026-10-04 09:15:00',
            ],
            [
                'prof_idx' => 0,
                'ti_idx' => 5,
                'titulo' => 'Teclado com teclas travadas',
                'sala' => '115',
                'categoria' => 'Hardware',
                'dispositivo' => 'Máquina 18',
                'descricao' => 'Teclas Enter e Espaço não respondem ao pressionar.',
                'prioridade' => 'Baixa',
                'status' => 'resolvido',
                'triagem' => 'aprovado',
                'visualizado' => true,
                'data' => '2026-10-16 11:30:00',
                'solucao' => 'Teclado substituído por unidade nova do estoque de TI.',
            ],
            [
                'prof_idx' => 1,
                'ti_idx' => 0,
                'titulo' => 'XAMPP não inicia serviço MySQL',
                'sala' => '204',
                'categoria' => 'Software',
                'dispositivo' => 'Máquina 07',
                'descricao' => 'Erro de porta ocupada ao tentar iniciar o MySQL no painel do XAMPP.',
                'prioridade' => 'Muito alta',
                'status' => 'emProgresso',
                'triagem' => 'aprovado',
                'visualizado' => true,
                'data' => '2026-10-29 16:50:00',
            ],
            [
                'prof_idx' => 2,
                'ti_idx' => null,
                'titulo' => 'Caixa de som sem saída de áudio',
                'sala' => '310',
                'categoria' => 'Hardware',
                'dispositivo' => 'Sistema de Áudio 02',
                'descricao' => 'Mesmo com volume máximo no sistema, não sai som nas caixas.',
                'prioridade' => 'Média',
                'status' => 'emAnalise',
                'triagem' => 'pendente',
                'visualizado' => false,
                'data' => '2026-11-08 13:20:00',
            ],
            [
                'prof_idx' => 4,
                'ti_idx' => 2,
                'titulo' => 'Navegador bloqueando portal acadêmico',
                'sala' => '45',
                'categoria' => 'Software',
                'dispositivo' => 'Máquina 22',
                'descricao' => 'Erro de certificado SSL ao acessar o sistema de notas.',
                'prioridade' => 'Alta',
                'status' => 'resolvido',
                'triagem' => 'aprovado',
                'visualizado' => true,
                'data' => '2026-11-20 18:05:00',
                'solucao' => 'Cache de certificados atualizado e hora do sistema sincronizada via NTP.',
            ],
        ];

        // 4. Criar 2 chamados da Coordenadora Ana Picolini
        $chamadosCoordenadora = [
            [
                'ti_idx' => 1,
                'titulo' => 'Configurar impressora da coordenação',
                'sala' => '10',
                'categoria' => 'Hardware',
                'dispositivo' => 'Impressora Laser Coordenação',
                'descricao' => 'Impressora apresenta fila travada ao imprimir relatórios semanais.',
                'prioridade' => 'Alta',
                'status' => 'emProgresso',
                'triagem' => 'aprovado',
                'visualizado' => true,
                'data' => '2026-11-02 09:40:00',
            ],
            [
                'ti_idx' => null,
                'titulo' => 'Atualizar planilha de horários na rede',
                'sala' => '201',
                'categoria' => 'Rede',
                'dispositivo' => 'Pasta Compartilhada Coordenação',
                'descricao' => 'Permissão de leitura indisponível para novos professores na pasta.',
                'prioridade' => 'Média',
                'status' => 'naoVisualizado',
                'triagem' => 'aprovado',
                'visualizado' => false,
                'data' => '2026-11-22 15:10:00',
            ],
        ];

        DB::transaction(function () use ($chamadosProfessores, $chamadosCoordenadora, $professores, $tecnicos, $ana) {
            $proximoCod = (int) (DB::table('chamados')->lockForUpdate()->max('cod_chamado') ?? 0) + 1;

            $inserirChamado = function (array $item, Usuario $autor) use (&$proximoCod, $tecnicos, $ana) {
                $jaExiste = Chamado::where('titulo', $item['titulo'])
                    ->where('id_usuario', $autor->id_usuario)
                    ->exists();

                if ($jaExiste) {
                    return;
                }

                $tecnico = $item['ti_idx'] !== null ? $tecnicos[$item['ti_idx']] : null;
                $cod = $proximoCod++;

                $chamado = Chamado::create([
                    'cod_chamado' => $cod,
                    'titulo' => $item['titulo'],
                    'descricao' => $item['descricao'],
                    'categoria' => $item['categoria'],
                    'prioridade' => $item['prioridade'],
                    'status' => $item['status'],
                    'data' => $item['data'],
                    'id_usuario' => $autor->id_usuario,
                    'num_equipamento' => null,
                    'sala_chamado' => $item['sala'],
                    'dispositivo' => $item['dispositivo'],
                    'visualizado_em' => $item['visualizado'] ? $item['data'] : null,
                    'visualizado_por' => $item['visualizado'] && $tecnico ? $tecnico->id_usuario : null,
                    'triagem_status' => $item['triagem'],
                    'triagem_por' => $item['triagem'] === 'aprovado' ? $ana->id_usuario : null,
                    'triagem_em' => $item['triagem'] === 'aprovado' ? $item['data'] : null,
                    'id_responsavel_ti' => $tecnico?->id_usuario,
                ]);

                ChamadoHistorico::create([
                    'cod_chamado' => $chamado->cod_chamado,
                    'id_usuario' => $autor->id_usuario,
                    'tipo_evento' => 'abertura',
                    'status_anterior' => null,
                    'status_novo' => 'emAnalise',
                    'descricao_evento' => "Chamado aberto por {$autor->nome}.",
                    'created_at' => $item['data'],
                    'updated_at' => $item['data'],
                ]);

                if ($item['status'] === 'resolvido' && $tecnico && !empty($item['solucao'])) {
                    ChamadoAtendimento::create([
                        'cod_chamado' => $chamado->cod_chamado,
                        'id_tecnico' => $tecnico->id_usuario,
                        'procedimentos' => 'Diagnóstico realizado no local pela equipe de TI.',
                        'materiais' => null,
                        'orientacoes' => 'Equipamento liberado para uso em aula.',
                        'tipo_registro' => 'solucao',
                        'solucao' => $item['solucao'],
                        'pendencia' => null,
                        'created_at' => $item['data'],
                        'updated_at' => $item['data'],
                    ]);
                }
            };

            foreach ($chamadosProfessores as $item) {
                $inserirChamado($item, $professores[$item['prof_idx']]);
            }

            foreach ($chamadosCoordenadora as $item) {
                $inserirChamado($item, $ana);
            }
        });
    }
}
