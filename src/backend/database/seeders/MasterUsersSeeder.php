<?php

namespace Database\Seeders;

use App\Models\Usuario;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class MasterUsersSeeder extends Seeder
{
    public function run(): void
    {
        // 1. Conta inicial da Coordenadora Ana Picolini (idempotente, sem sobrescrever senha existente)
        $ana = Usuario::where('email', 'ana.picolomini@fiec.edu.br')->first();

        if (!$ana) {
            $iuidInterno = 9000000;
            while (Usuario::where('iuid_usuario', $iuidInterno)->exists()) {
                $iuidInterno++;
            }

            $ana = Usuario::create([
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
            ]);
        } else {
            $ana->update([
                'nome' => 'Ana Picolini',
                'funcao' => 'Coordenadora',
                'perfil' => 'coordenador',
                'possui_rm' => false,
                'is_admin_ti' => false,
                'ativo' => true,
            ]);
        }

        $anaId = $ana->id_usuario;

        // 2. Conta de Administrador de TI (para RF08/C09)
        $adminTi = Usuario::where('email', 'setorti@fiec.edu.br')->first();
        if (!$adminTi) {
            Usuario::create([
                'nome' => 'Setor de TI (Admin)',
                'iuid_usuario' => 900002,
                'email' => 'setorti@fiec.edu.br',
                'senha' => Hash::make('setorti123'),
                'cod_responsavel' => $anaId,
                'funcao' => 'Analista de TI',
                'perfil' => 'ti',
                'possui_rm' => true,
                'is_admin_ti' => true,
                'ativo' => true,
            ]);
        } else {
            $adminTi->update([
                'cod_responsavel' => $anaId,
                'perfil' => 'ti',
                'funcao' => 'Analista de TI',
                'possui_rm' => true,
                'is_admin_ti' => true,
                'ativo' => true,
            ]);
        }

        // 3. Técnico de TI comum (sem permissão administrativa RF08)
        $anaCosta = Usuario::where('email', 'ana.costa@fiec.edu.br')->first();
        if ($anaCosta) {
            $updates = [
                'cod_responsavel' => $anaId,
                'perfil' => 'ti',
                'funcao' => 'Analista de TI',
                'possui_rm' => true,
                'is_admin_ti' => false,
                'ativo' => true,
            ];
            if (empty($anaCosta->senha)) {
                $updates['senha'] = Hash::make('ti123456');
            }
            $anaCosta->update($updates);
        }

        // 4. Professor institucional (sem RM exposto, login por e-mail)
        $joao = Usuario::where('email', 'joao.silva@fiec.edu.br')->first();
        if ($joao) {
            $updates = [
                'cod_responsavel' => $anaId,
                'perfil' => 'usuario',
                'funcao' => 'Professor',
                'possui_rm' => false,
                'is_admin_ti' => false,
                'ativo' => true,
            ];
            if (empty($joao->senha)) {
                $updates['senha'] = Hash::make('prof1234');
            }
            $joao->update($updates);
        }

        // 5. Garantir cod_responsavel = id_usuario da Ana Picolini para todos os usuários
        Usuario::query()->update(['cod_responsavel' => $anaId]);
    }
}
