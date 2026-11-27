<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class EnsureActiveUser
{
    public function handle(Request $request, Closure $next): Response
    {
        $usuario = $request->user();

        if ($usuario && !$usuario->ativo) {
            $usuario->currentAccessToken()?->delete();

            return response()->json([
                'erro' => 'Sua conta está inativa. Entre em contato com o setor de TI.',
                'mensagem' => 'Sua conta está inativa. Entre em contato com o setor de TI.',
            ], 403);
        }

        return $next($request);
    }
}
