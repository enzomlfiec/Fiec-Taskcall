<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('usuarios', function (Blueprint $table) {
            // Chave primária auto-incremento (id_usuario)
            $table->integer('id_usuario')->autoIncrement();
            
            // Outras colunas com os tipos e tamanhos exatos do seu MySQL
            $table->integer('iuid_usuario');
            $table->string('email', 50);
            $table->string('senha', 15);
            $table->integer('cod_responsavel');
            $table->string('funcao', 30);
            
            // Define explicitamente a chave primária
            $table->primary('id_usuario');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('usuarios');
    }
};
