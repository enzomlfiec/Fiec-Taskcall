<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    use WithoutModelEvents;

    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        $this->call([
            SalaSeeder::class,
            ComputadorSeeder::class,
            EquipamentoSeeder::class,
            UsuarioSeeder::class,
            MasterUsersSeeder::class,
            ChamadoSeeder::class,
        ]);
    }
}
