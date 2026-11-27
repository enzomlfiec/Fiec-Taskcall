<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('usuarios', function (Blueprint $table) {
            if (!Schema::hasColumn('usuarios', 'foto_perfil')) {
                $table->string('foto_perfil', 255)->nullable()->after('email');
            }
        });

        // Migrar registros existentes com segurança para o fluxo oficial de 4 estados:
        // emAnalise -> naoVisualizado -> emProgresso -> resolvido
        DB::table('chamados')
            ->where('status', 'pendente')
            ->where('triagem_status', 'aprovado')
            ->update(['status' => 'naoVisualizado']);

        DB::table('chamados')
            ->where('status', 'pendente')
            ->where(function ($query) {
                $query->whereNull('triagem_status')
                    ->orWhere('triagem_status', '!=', 'aprovado');
            })
            ->update(['status' => 'emAnalise']);

        DB::table('chamados')
            ->whereIn('status', ['supervisionando', 'supervisionado', 'emAtendimento'])
            ->update(['status' => 'emProgresso']);
    }

    public function down(): void
    {
        Schema::table('usuarios', function (Blueprint $table) {
            if (Schema::hasColumn('usuarios', 'foto_perfil')) {
                $table->dropColumn('foto_perfil');
            }
        });
    }
};
