<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        if (!Schema::hasColumn('usuarios', 'senha')) {
            Schema::table('usuarios', function (Blueprint $table): void {
                $table->string('senha', 255)->nullable();
            });
        } else {
            Schema::table('usuarios', function (Blueprint $table): void {
                $table->string('senha', 255)->nullable()->change();
            });
        }

        // Preserva hashes já criados pela versão anterior da integração.
        if (Schema::hasColumn('usuarios', 'password')) {
            DB::table('usuarios')
                ->whereNull('senha')
                ->whereNotNull('password')
                ->orderBy('id_usuario')
                ->chunkById(100, function ($usuarios): void {
                    foreach ($usuarios as $usuario) {
                        DB::table('usuarios')
                            ->where('id_usuario', $usuario->id_usuario)
                            ->update(['senha' => $usuario->password]);
                    }
                }, 'id_usuario');
        }

        // Migra quaisquer senhas antigas em texto puro para hashes antes de habilitar login.
        DB::table('usuarios')
            ->whereNotNull('senha')
            ->orderBy('id_usuario')
            ->chunkById(100, function ($usuarios): void {
                foreach ($usuarios as $usuario) {
                    $senha = (string) $usuario->senha;
                    $informacoes = password_get_info($senha);

                    if (($informacoes['algoName'] ?? 'unknown') !== 'unknown') {
                        continue;
                    }

                    DB::table('usuarios')
                        ->where('id_usuario', $usuario->id_usuario)
                        ->update(['senha' => Hash::make($senha)]);
                }
            }, 'id_usuario');
    }

    public function down(): void
    {
        // Não reduzir o tamanho nem desfazer hashes, pois isso perderia credenciais e/ou dados.
    }
};
