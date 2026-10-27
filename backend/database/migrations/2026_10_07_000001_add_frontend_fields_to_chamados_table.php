<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        $adicionarSala = !Schema::hasColumn('chamados', 'sala_chamado');
        $adicionarDispositivo = !Schema::hasColumn('chamados', 'dispositivo');
        $adicionarCriadoEm = !Schema::hasColumn('chamados', 'created_at');
        $adicionarAtualizadoEm = !Schema::hasColumn('chamados', 'updated_at');

        Schema::table('chamados', function (Blueprint $table) use (
            $adicionarSala,
            $adicionarDispositivo,
            $adicionarCriadoEm,
            $adicionarAtualizadoEm
        ): void {
            if ($adicionarSala) {
                $table->string('sala_chamado', 80)->nullable();
            }
            if ($adicionarDispositivo) {
                $table->string('dispositivo', 100)->nullable();
            }
            if ($adicionarCriadoEm) {
                $table->timestamp('created_at')->nullable();
            }
            if ($adicionarAtualizadoEm) {
                $table->timestamp('updated_at')->nullable();
            }

            $table->integer('id_usuario')->nullable()->change();
            $table->integer('num_equipamento')->nullable()->change();
        });
    }

    public function down(): void
    {
        // Campos preenchidos pelo formulário são preservados mesmo durante rollback.
    }
};
