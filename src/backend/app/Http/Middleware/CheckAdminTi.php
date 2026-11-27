<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class CheckAdminTi
{
    public function handle(Request $request, Closure $next): Response
    {
        $usuario = $request->user();

        if (!$usuario || !$usuario->ativo || $usuario->perfil !== 'ti' || !$usuario->is_admin_ti) {
            return response()->json([
                'erro' => 'Acesso restrito a administradores do setor de TI.',
                'mensagem' => 'Acesso restrito a administradores do setor de TI.',
            ], 403);
        }

        return $next($request);
    }
}
