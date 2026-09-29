<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;


class UsuarioSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        DB::table('usuarios')->insert([
            ['id_usuario' => 1, 'iuid_usuario' => 5001, 'nome' => 'Tathiana',  'email' => 'tathiana@fiec.edu.br',  'senha' => '1234', 'cod_responsavel' => 10, 'funcao' => 'Professor'],
            ['id_usuario' => 2, 'iuid_usuario' => 5002, 'nome' => 'Ana Maria', 'email' => 'ana.souza@fiec.edu.br', 'senha' => '1234', 'cod_responsavel' => 10, 'funcao' => 'Coordenador'],
            ['id_usuario' => 3, 'iuid_usuario' => 5003, 'nome' => 'Adileine', 'email' => 'adleine.lima@fiec.edu.br', 'senha' => '1234', 'cod_responsavel' => 11, 'funcao' => 'Diretor'],
            ['id_usuario' => 4, 'iuid_usuario' => 5004, 'nome' => 'Gustavo',   'email' => 'gustavo@fiec.edu.br',   'senha' => '1234', 'cod_responsavel' => 12, 'funcao' => 'Analista de TI'],
            ['id_usuario' => 5, 'iuid_usuario' => 5005, 'nome' => 'Pedro', 'email' => 'pedro.nunes@fiec.edu.br', 'senha' => '1234', 'cod_responsavel' => 10, 'funcao' => 'Professor'],
        ]);
    }
}
