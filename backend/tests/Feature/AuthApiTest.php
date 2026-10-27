<?php

namespace Tests\Feature;

use App\Models\Usuario;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Schema;
use Tests\TestCase;

class AuthApiTest extends TestCase
{
    use RefreshDatabase;

    public function test_cadastra_usuario_salvando_o_hash_da_senha(): void
    {
        $resposta = $this->postJson('/api/auth/register', [
            'nome' => 'Pessoa de Teste',
            'rm' => '987654',
            'email' => 'TESTE@example.com',
            'senha' => 'SenhaSegura123',
        ]);

        $resposta->assertCreated()
            ->assertJsonPath('data.nome', 'Pessoa de Teste')
            ->assertJsonPath('data.email', 'teste@example.com')
            ->assertJsonMissingPath('data.password')
            ->assertJsonMissingPath('data.senha');

        $this->assertDatabaseHas('usuarios', [
            'nome' => 'Pessoa de Teste',
            'email' => 'teste@example.com',
            'cod_responsavel' => 987654,
        ]);

        $usuario = Usuario::where('email', 'teste@example.com')->firstOrFail();
        $this->assertNotSame('SenhaSegura123', $usuario->senha);
        $this->assertTrue(Hash::check('SenhaSegura123', $usuario->senha));
    }

    public function test_login_aceita_email_ou_rm_e_rejeita_senha_incorreta(): void
    {
        $this->postJson('/api/auth/register', [
            'nome' => 'Pessoa de Teste',
            'rm' => '987654',
            'email' => 'teste@example.com',
            'senha' => 'SenhaSegura123',
        ])->assertCreated();

        $this->postJson('/api/auth/login', [
            'login' => 'TESTE@example.com',
            'senha' => 'SenhaSegura123',
        ])->assertOk()->assertJsonPath('data.email', 'teste@example.com');

        $this->postJson('/api/auth/login', [
            'login' => '987654',
            'senha' => 'SenhaSegura123',
        ])->assertOk()->assertJsonPath('data.rm', '987654');

        $this->postJson('/api/auth/login', [
            'login' => 'teste@example.com',
            'senha' => 'senha-errada',
        ])->assertUnauthorized();
    }

    public function test_nao_permite_email_ou_rm_duplicado(): void
    {
        $dados = [
            'nome' => 'Pessoa de Teste',
            'rm' => '987654',
            'email' => 'teste@example.com',
            'senha' => 'SenhaSegura123',
        ];

        $this->postJson('/api/auth/register', $dados)->assertCreated();
        $dados['nome'] = 'Outra Pessoa';
        $dados['email'] = 'outro@example.com';

        $this->postJson('/api/auth/register', $dados)
            ->assertUnprocessable()
            ->assertJsonValidationErrors(['rm']);
    }

    public function test_migra_senhas_legadas_e_preserva_hashes_da_coluna_antiga(): void
    {
        Schema::table('usuarios', function (Blueprint $table): void {
            $table->string('password')->nullable();
        });

        DB::table('usuarios')->insert([
            [
                'id_usuario' => 91,
                'iuid_usuario' => 5091,
                'nome' => 'Conta Antiga',
                'email' => 'antiga@example.com',
                'senha' => 'SenhaLegada123',
                'password' => null,
                'cod_responsavel' => 111111,
                'funcao' => 'Aluno',
            ],
            [
                'id_usuario' => 92,
                'iuid_usuario' => 5092,
                'nome' => 'Conta Integrada',
                'email' => 'integrada@example.com',
                'senha' => null,
                'password' => Hash::make('SenhaIntegrada123'),
                'cod_responsavel' => 222222,
                'funcao' => 'Aluno',
            ],
        ]);

        $migration = require database_path('migrations/2026_10_07_000002_expand_senha_for_hashes.php');
        $migration->up();

        $this->assertTrue(Hash::check('SenhaLegada123', DB::table('usuarios')->where('id_usuario', 91)->value('senha')));
        $this->assertTrue(Hash::check('SenhaIntegrada123', DB::table('usuarios')->where('id_usuario', 92)->value('senha')));
    }
}
