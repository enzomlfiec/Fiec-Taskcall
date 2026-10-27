<?php

namespace Tests\Feature;

use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class ChamadoApiTest extends TestCase
{
    use RefreshDatabase;

    public function test_cria_chamado_e_persiste_os_dados_enviados(): void
    {
        $resposta = $this->postJson('/api/chamados', [
            'sala' => 'Sala 39',
            'dispositivo' => 'Máquina 25',
            'categoria' => 'Hardware',
            'descricao' => 'O computador não liga.',
        ]);

        $resposta
            ->assertCreated()
            ->assertJsonPath('data.sala', 'Sala 39')
            ->assertJsonPath('data.dispositivo', 'Máquina 25')
            ->assertJsonPath('data.categoria', 'Hardware')
            ->assertJsonPath('data.descricao', 'O computador não liga.');

        $this->assertDatabaseHas('chamados', [
            'cod_chamado' => $resposta->json('data.id'),
            'sala_chamado' => 'Sala 39',
            'dispositivo' => 'Máquina 25',
            'categoria' => 'Hardware',
            'descricao' => 'O computador não liga.',
        ]);
    }

    public function test_lista_chamados_persistidos(): void
    {
        $this->postJson('/api/chamados', [
            'sala' => 'Sala 40',
            'dispositivo' => 'Projetor 2',
            'categoria' => 'Software',
            'descricao' => 'Preciso atualizar o aplicativo.',
        ])->assertCreated();

        $this->getJson('/api/chamados')
            ->assertOk()
            ->assertJsonCount(1, 'data')
            ->assertJsonPath('data.0.sala', 'Sala 40')
            ->assertJsonPath('data.0.descricao', 'Preciso atualizar o aplicativo.');
    }

    public function test_exclui_chamado_do_banco_e_da_listagem(): void
    {
        $criado = $this->postJson('/api/chamados', [
            'sala' => 'Sala 41',
            'dispositivo' => 'Notebook 3',
            'categoria' => 'Hardware',
            'descricao' => 'Excluir este registro de teste.',
        ])->assertCreated();

        $id = $criado->json('data.id');

        $this->deleteJson("/api/chamados/{$id}")->assertOk();

        $this->assertDatabaseMissing('chamados', ['cod_chamado' => $id]);
        $this->getJson('/api/chamados')->assertOk()->assertJsonCount(0, 'data');
    }

    public function test_rejeita_dados_invalidos(): void
    {
        $this->postJson('/api/chamados', [
            'sala' => '',
            'dispositivo' => 'Máquina 25',
            'categoria' => 'Outra',
            'descricao' => str_repeat('x', 151),
        ])->assertUnprocessable()
            ->assertJsonValidationErrors(['sala', 'categoria', 'descricao']);
    }
}
