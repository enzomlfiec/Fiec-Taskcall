<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class CheckRole
{
    public function handle(Request $request, Closure $next, string ...$roles): Response
    {
        $usuario = $request->user();

        if (!$usuario || !in_array($usuario->perfil, $roles)) {
            return response()->json([
                'mensagem' => 'Você não tem permissão para acessar este recurso.'
            ], 403);
        }

        return $next($request);
    }
}