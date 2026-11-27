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
        Schema::table('usuarios', function (Blueprint $table) {
            $table->string('funcao', 30)->nullable()->change();
            $table->string('email', 100)->change();

            if (!Schema::hasColumn('usuarios', 'perfil')) {
                $table->string('perfil', 20)->default('usuario');
            }
            if (!Schema::hasColumn('usuarios', 'possui_rm')) {
                $table->boolean('possui_rm')->default(true);
            }
            if (!Schema::hasColumn('usuarios', 'is_admin_ti')) {
                $table->boolean('is_admin_ti')->default(false);
            }
            if (!Schema::hasColumn('usuarios', 'ativo')) {
                $table->boolean('ativo')->default(true);
            }
            if (!Schema::hasColumn('usuarios', 'ultimo_acesso_em')) {
                $table->timestamp('ultimo_acesso_em')->nullable();
            }
        });

        // Atualizar perfis e padrões institucionais dos registros existentes sem destruir dados
        $usuarios = DB::table('usuarios')->get();
        foreach ($usuarios as $u) {
            $updates = [];
            $funcaoLower = mb_strtolower((string) ($u->funcao ?? ''), 'UTF-8');

            if ($funcaoLower === 'analista de ti') {
                $updates['perfil'] = 'ti';
            } elseif (in_array($funcaoLower, ['coordenador', 'coordenadora'], true)) {
                $updates['perfil'] = 'coordenador';
            } elseif (empty($u->perfil)) {
                $updates['perfil'] = 'usuario';
            }

            $email = (string) $u->email;
            if (preg_match('/^([^@]+)@fiec\.edu\.br$/i', $email, $m)) {
                $localPart = $m[1];
                if (preg_match('/(\d+)/', $localPart, $numMatch)) {
                    $rmExtraido = (int) $numMatch[1];
                    $rmEmUso = DB::table('usuarios')
                        ->where('iuid_usuario', $rmExtraido)
                        ->where('id_usuario', '!=', $u->id_usuario)
                        ->exists();
                    if (!$rmEmUso) {
                        $updates['iuid_usuario'] = $rmExtraido;
                    }
                    $updates['possui_rm'] = true;
                    if (empty($u->funcao) || $funcaoLower === 'aluno') {
                        $updates['funcao'] = 'Aluno/Estagiário';
                    }
                } elseif (str_contains($localPart, '.')) {
                    if (in_array($funcaoLower, ['professor', 'professora', 'coordenador', 'coordenadora', 'diretor', 'diretora', 'aluno', ''], true)) {
                        $updates['possui_rm'] = false;
                    }
                    if ($funcaoLower === 'aluno') {
                        $updates['funcao'] = 'Professor';
                    }
                }
            }

            if (!empty($updates)) {
                DB::table('usuarios')
                    ->where('id_usuario', $u->id_usuario)
                    ->update($updates);
            }
        }

        // Criar conta inicial da Coordenadora Ana Picolini de forma idempotente
        $ana = DB::table('usuarios')
            ->where('email', 'ana.picolomini@fiec.edu.br')
            ->first();

        if (!$ana) {
            $iuidInterno = 9000000;
            while (DB::table('usuarios')->where('iuid_usuario', $iuidInterno)->exists()) {
                $iuidInterno++;
            }

            $anaId = DB::table('usuarios')->insertGetId([
                'nome' => 'Ana Picolini',
                'iuid_usuario' => $iuidInterno,
                'email' => 'ana.picolomini@fiec.edu.br',
                'senha' => Hash::make('admin1234'),
                'cod_responsavel' => 0,
                'funcao' => 'Coordenadora',
                'perfil' => 'coordenador',
                'possui_rm' => false,
                'is_admin_ti' => false,
                'ativo' => true,
                'created_at' => now(),
                'updated_at' => now(),
            ]);
        } else {
            $anaId = $ana->id_usuario;
            DB::table('usuarios')
                ->where('id_usuario', $anaId)
                ->update([
                    'nome' => 'Ana Picolini',
                    'funcao' => 'Coordenadora',
                    'perfil' => 'coordenador',
                    'possui_rm' => false,
                    'is_admin_ti' => false,
                    'ativo' => true,
                    'updated_at' => now(),
                ]);
        }

        // Vincular cod_responsavel de todos os usuários ao id_usuario de Ana Picolini
        DB::table('usuarios')->update(['cod_responsavel' => $anaId]);
    }

    public function down(): void
    {
        Schema::table('usuarios', function (Blueprint $table) {
            foreach (['ultimo_acesso_em', 'ativo', 'is_admin_ti', 'possui_rm'] as $col) {
                if (Schema::hasColumn('usuarios', $col)) {
                    $table->dropColumn($col);
                }
            }
        });
    }
};
