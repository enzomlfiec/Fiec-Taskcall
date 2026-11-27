<?php

use App\Http\Controllers\AuthController;
use App\Http\Controllers\ChamadoController;
use App\Http\Controllers\NotificacaoController;
use App\Http\Controllers\UsuarioAdminController;
use Illuminate\Support\Facades\Route;

// Healthcheck da API
Route::get('/health', function () {
    return response()->json(['status' => 'ok']);
});

// Fotos de perfil armazenadas localmente
Route::get('/fotos-perfil/{arquivo}', [AuthController::class, 'exibirFoto'])
    ->where('arquivo', '[A-Za-z0-9._-]+');

// Autenticação pública (aliases /register e /registro mantidos para compatibilidade)
Route::post('/register', [AuthController::class, 'register']);
Route::post('/registro', [AuthController::class, 'register']);
Route::post('/login', [AuthController::class, 'login']);

// Rotas protegidas por Sanctum + usuário ativo
Route::middleware(['auth:sanctum', 'active.user'])->group(function () {
    Route::post('/logout', [AuthController::class, 'logout']);
    Route::get('/me', [AuthController::class, 'me']);
    Route::post('/me/foto', [AuthController::class, 'atualizarFoto']);

    // Chamados e indicadores
    Route::get('/chamados', [ChamadoController::class, 'index']);
    Route::get('/chamados/indicadores', [ChamadoController::class, 'indicadores']);
    Route::get('/chamados/{id}', [ChamadoController::class, 'show'])->whereNumber('id');
    Route::post('/chamados', [ChamadoController::class, 'store']);

    // Triagem pela Coordenadora (não altera status técnico)
    Route::patch('/chamados/{id}/triagem', [ChamadoController::class, 'triagem'])
        ->middleware('role:coordenador')
        ->whereNumber('id');

    // Atualização de status oficial e registro de atendimento (exclusivo TI)
    Route::patch('/chamados/{id}/status', [ChamadoController::class, 'atualizarStatus'])
        ->middleware('role:ti')
        ->whereNumber('id');
    Route::post('/chamados/{id}/atendimentos', [ChamadoController::class, 'registrarAtendimento'])
        ->middleware('role:ti')
        ->whereNumber('id');

    // Prioridade (TI ou Coordenador)
    Route::patch('/chamados/{id}/prioridade', [ChamadoController::class, 'atualizarPrioridade'])
        ->middleware('role:ti,coordenador')
        ->whereNumber('id');

    // Reabertura (TI ou solicitante dono)
    Route::post('/chamados/{id}/reabrir', [ChamadoController::class, 'reabrir'])
        ->whereNumber('id');

    // Notificações internas (C12)
    Route::get('/notificacoes', [NotificacaoController::class, 'index']);
    Route::patch('/notificacoes/{id}/lida', [NotificacaoController::class, 'marcarLida'])->whereNumber('id');
    Route::post('/notificacoes/marcar-todas-lidas', [NotificacaoController::class, 'marcarTodasLidas']);

    // Administração de usuários e perfis (RF08 / C09 — exclusivo TI com is_admin_ti)
    Route::middleware('admin.ti')->group(function () {
        Route::get('/usuarios', [UsuarioAdminController::class, 'index']);
        Route::post('/usuarios', [UsuarioAdminController::class, 'store']);
        Route::put('/usuarios/{id}', [UsuarioAdminController::class, 'update'])->whereNumber('id');
        Route::patch('/usuarios/{id}/inativar', [UsuarioAdminController::class, 'inativar'])->whereNumber('id');
        Route::delete('/usuarios/{id}', [UsuarioAdminController::class, 'destroy'])->whereNumber('id');
    });
});
