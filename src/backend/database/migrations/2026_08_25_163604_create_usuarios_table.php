<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    /**
     * Run the migrations.
     */
    public function up(): void {
        Schema::create('usuarios', function (Blueprint $table) {
            $table->integer('id_usuario')->autoIncrement();
            $table->integer('iuid_usuario');
            $table->string('email', 100)->unique(); // Aumentado o tamanho e adicionado unique
            $table->string('senha', 255);          // Aumentado para suportar senhas criptografadas
            $table->integer('cod_responsavel');
            $table->string('funcao', 30);
            $table->timestamps();                 
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void {
        Schema::dropIfExists('usuarios');
    }
};
