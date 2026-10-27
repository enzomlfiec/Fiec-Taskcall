<?php

use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\Api\ChamadoController;
use App\Http\Middleware\AuthenticateApiToken;
use Illuminate\Support\Facades\Route;

Route::post('/auth/register', [AuthController::class, 'register'])->middleware('throttle:5,1');
Route::post('/auth/login', [AuthController::class, 'login'])->middleware('throttle:5,1');

Route::middleware(AuthenticateApiToken::class)->group(function (): void {
    Route::post('/auth/logout', [AuthController::class, 'logout']);

    Route::get('/chamados', [ChamadoController::class, 'index']);
    Route::post('/chamados', [ChamadoController::class, 'store']);
    Route::delete('/chamados/{id}', [ChamadoController::class, 'destroy'])->whereNumber('id');
});
