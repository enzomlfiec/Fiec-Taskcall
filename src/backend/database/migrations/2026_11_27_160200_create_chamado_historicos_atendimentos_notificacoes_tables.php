<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        if (!Schema::hasTable('chamado_historicos')) {
            Schema::create('chamado_historicos', function (Blueprint $table) {
                $table->id();
                $table->integer('cod_chamado');
                $table->integer('id_usuario')->nullable();
                $table->string('tipo_evento', 40);
                $table->string('status_anterior', 30)->nullable();
                $table->string('status_novo', 30)->nullable();
                $table->text('descricao_evento');
                $table->json('detalhes_json')->nullable();
                $table->timestamps();

                $table->index('cod_chamado', 'idx_hist_chamado');
                $table->index('id_usuario', 'idx_hist_usuario');

                $table->foreign('cod_chamado', 'fk_hist_chamado')
                    ->references('cod_chamado')
                    ->on('chamados')
                    ->onDelete('cascade');
                $table->foreign('id_usuario', 'fk_hist_usuario')
                    ->references('id_usuario')
                    ->on('usuarios');
            });
        }

        if (!Schema::hasTable('chamado_atendimentos')) {
            Schema::create('chamado_atendimentos', function (Blueprint $table) {
                $table->id();
                $table->integer('cod_chamado');
                $table->integer('id_tecnico');
                $table->text('procedimentos');
                $table->string('materiais', 500)->nullable();
                $table->text('orientacoes')->nullable();
                $table->string('tipo_registro', 20);
                $table->text('solucao')->nullable();
                $table->text('pendencia')->nullable();
                $table->timestamps();

                $table->index('cod_chamado', 'idx_atend_chamado');
                $table->index('id_tecnico', 'idx_atend_tecnico');

                $table->foreign('cod_chamado', 'fk_atend_chamado')
                    ->references('cod_chamado')
                    ->on('chamados')
                    ->onDelete('cascade');
                $table->foreign('id_tecnico', 'fk_atend_tecnico')
                    ->references('id_usuario')
                    ->on('usuarios');
            });
        }

        if (!Schema::hasTable('notificacoes')) {
            Schema::create('notificacoes', function (Blueprint $table) {
                $table->id();
                $table->integer('id_usuario_destino');
                $table->integer('cod_chamado')->nullable();
                $table->string('tipo', 40);
                $table->string('titulo', 150);
                $table->text('mensagem');
                $table->dateTime('lida_em')->nullable();
                $table->string('status_entrega', 20)->default('entregue');
                $table->string('erro_entrega', 255)->nullable();
                $table->timestamps();

                $table->index('id_usuario_destino', 'idx_notif_destino');
                $table->index('cod_chamado', 'idx_notif_chamado');

                $table->foreign('id_usuario_destino', 'fk_notif_usuario')
                    ->references('id_usuario')
                    ->on('usuarios')
                    ->onDelete('cascade');
                $table->foreign('cod_chamado', 'fk_notif_chamado')
                    ->references('cod_chamado')
                    ->on('chamados')
                    ->onDelete('cascade');
            });
        }

        // Backfill idempotente para histórico inicial dos chamados existentes
        $chamados = DB::table('chamados')->get();
        foreach ($chamados as $c) {
            $jaTemHistorico = DB::table('chamado_historicos')
                ->where('cod_chamado', $c->cod_chamado)
                ->exists();

            if (!$jaTemHistorico) {
                DB::table('chamado_historicos')->insert([
                    'cod_chamado' => $c->cod_chamado,
                    'id_usuario' => $c->id_usuario,
                    'tipo_evento' => 'abertura',
                    'status_anterior' => null,
                    'status_novo' => $c->status,
                    'descricao_evento' => 'Chamado registrado no sistema.',
                    'detalhes_json' => json_encode([
                        'prioridade' => $c->prioridade,
                        'sala' => $c->sala_chamado,
                        'dispositivo' => $c->dispositivo,
                    ]),
                    'created_at' => $c->data ?? now(),
                    'updated_at' => $c->data ?? now(),
                ]);
            }

            if ($c->status === 'resolvido') {
                $jaTemAtendimento = DB::table('chamado_atendimentos')
                    ->where('cod_chamado', $c->cod_chamado)
                    ->exists();
                $tecnicoId = DB::table('usuarios')
                    ->where('perfil', 'ti')
                    ->value('id_usuario');

                if (!$jaTemAtendimento && $tecnicoId) {
                    DB::table('chamado_atendimentos')->insert([
                        'cod_chamado' => $c->cod_chamado,
                        'id_tecnico' => $tecnicoId,
                        'procedimentos' => 'Atendimento técnico realizado e software configurado conforme solicitação.',
                        'materiais' => null,
                        'orientacoes' => 'Validar funcionamento antes da próxima aula.',
                        'tipo_registro' => 'solucao',
                        'solucao' => 'Chamado solucionado pela equipe de TI.',
                        'pendencia' => null,
                        'created_at' => $c->updated_at ?? $c->data ?? now(),
                        'updated_at' => $c->updated_at ?? $c->data ?? now(),
                    ]);
                }
            }
        }
    }

    public function down(): void
    {
        Schema::dropIfExists('notificacoes');
        Schema::dropIfExists('chamado_atendimentos');
        Schema::dropIfExists('chamado_historicos');
    }
};
