<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('usuarios', function (Blueprint $table) {
            if (!Schema::hasColumn('usuarios', 'senha')) {
                $table->string('senha')->nullable();
            }

            if (!Schema::hasColumn('usuarios', 'perfil')) {
                $table->string('perfil', 20)->default('usuario');
            }
        });
    }

    public function down(): void
    {
        Schema::table('usuarios', function (Blueprint $table) {
            if (Schema::hasColumn('usuarios', 'perfil')) {
                $table->dropColumn('perfil');
            }

            if (Schema::hasColumn('usuarios', 'senha')) {
                $table->dropColumn('senha');
            }
        });
    }
};