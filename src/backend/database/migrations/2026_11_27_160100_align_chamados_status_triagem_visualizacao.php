<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Str;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('chamados', function (Blueprint $table) {
            if (!Schema::hasColumn('chamados', 'titulo')) {
                $table->string('titulo', 100)->nullable();
            }
            if (!Schema::hasColumn('chamados', 'descricao_detalhada')) {
                $table->text('descricao_detalhada')->nullable();
            }
            if (!Schema::hasColumn('chamados', 'prioridade')) {
                $table->string('prioridade', 20)->default('Média');
            }
            if (!Schema::hasColumn('chamados', 'setor')) {
                $table->string('setor', 100)->nullable();
            }
            if (!Schema::hasColumn('chamados', 'sala_chamado')) {
                $table->string('sala_chamado', 80)->nullable();
            }
            if (!Schema::hasColumn('chamados', 'dispositivo')) {
                $table->string('dispositivo', 100)->nullable();
            }

            $table->string('status', 30)->change();
            $table->string('categoria', 30)->change();
            $table->integer('num_equipamento')->nullable()->change();

            if (!Schema::hasColumn('chamados', 'visualizado_em')) {
                $table->dateTime('visualizado_em')->nullable();
            }
            if (!Schema::hasColumn('chamados', 'visualizado_por')) {
                $table->integer('visualizado_por')->nullable();
            }
            if (!Schema::hasColumn('chamados', 'triagem_status')) {
                $table->string('triagem_status', 20)->default('pendente');
            }
            if (!Schema::hasColumn('chamados', 'triagem_por')) {
                $table->integer('triagem_por')->nullable();
            }
            if (!Schema::hasColumn('chamados', 'triagem_em')) {
                $table->dateTime('triagem_em')->nullable();
            }
            if (!Schema::hasColumn('chamados', 'triagem_observacao')) {
                $table->string('triagem_observacao', 500)->nullable();
            }
            if (!Schema::hasColumn('chamados', 'id_responsavel_ti')) {
                $table->integer('id_responsavel_ti')->nullable();
            }
        });

        Schema::table('chamados', function (Blueprint $table) {
            $table->foreign('visualizado_por', 'fk_chamados_visualizado_por')
                ->references('id_usuario')
                ->on('usuarios');
            $table->foreign('triagem_por', 'fk_chamados_triagem_por')
                ->references('id_usuario')
                ->on('usuarios');
            $table->foreign('id_responsavel_ti', 'fk_chamados_responsavel_ti')
                ->references('id_usuario')
                ->on('usuarios');
        });

        // Converter registros legados de forma segura e determinística
        $chamados = DB::table('chamados')->get();
        foreach ($chamados as $c) {
            $updates = [];
            $statusAtual = (string) $c->status;

            if (in_array($statusAtual, ['Aberto', 'Pendente', 'emAnalise'], true)) {
                $updates['status'] = 'pendente';
            } elseif (in_array($statusAtual, ['Em Andamento', 'emProgresso'], true)) {
                $updates['status'] = 'emAtendimento';
                $updates['triagem_status'] = 'aprovado';
                if ($c->visualizado_em === null) {
                    $updates['visualizado_em'] = $c->data;
                }
            } elseif (in_array($statusAtual, ['Concluído', 'Resolvido'], true)) {
                $updates['status'] = 'resolvido';
                $updates['triagem_status'] = 'aprovado';
                if ($c->visualizado_em === null) {
                    $updates['visualizado_em'] = $c->data;
                }
            }

            if (empty($c->prioridade)) {
                $updates['prioridade'] = 'Média';
            }

            if (empty($c->titulo)) {
                $updates['titulo'] = Str::limit((string) $c->descricao, 60, '');
            }

            if (($c->sala_chamado === null || $c->dispositivo === null) && $c->num_equipamento !== null) {
                $equip = DB::table('equipamentos')
                    ->where('num_equipamentos', $c->num_equipamento)
                    ->first();
                if ($equip) {
                    if ($c->sala_chamado === null) {
                        $updates['sala_chamado'] = (string) $equip->num_sala;
                    }
                    if ($c->dispositivo === null) {
                        $updates['dispositivo'] = $equip->equipamentos_col ?: ('Computador ' . $equip->num_computador);
                    }
                }
            }

            if (!empty($updates)) {
                DB::table('chamados')
                    ->where('cod_chamado', $c->cod_chamado)
                    ->update($updates);
            }
        }
    }

    public function down(): void
    {
        Schema::table('chamados', function (Blueprint $table) {
            $table->dropForeign('fk_chamados_visualizado_por');
            $table->dropForeign('fk_chamados_triagem_por');
            $table->dropForeign('fk_chamados_responsavel_ti');

            foreach ([
                'visualizado_em',
                'visualizado_por',
                'triagem_status',
                'triagem_por',
                'triagem_em',
                'triagem_observacao',
                'id_responsavel_ti',
            ] as $col) {
                if (Schema::hasColumn('chamados', $col)) {
                    $table->dropColumn($col);
                }
            }
        });
    }
};
