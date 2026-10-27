<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Symfony\Component\HttpFoundation\Response;

class AuthenticateApiToken
{
    public function handle(Request $request, Closure $next): Response
    {
        $token = $request->bearerToken();
        $registro = $token
            ? DB::table('api_tokens')
                ->where('token_hash', hash('sha256', $token))
                ->where('expires_at', '>', now())
                ->first()
            : null;

        if (!$registro) {
            return response()->json(['message' => 'Token inválido ou expirado. Faça login novamente.'], 401);
        }

        $request->attributes->set('api_user_id', (int) $registro->id_usuario);

        return $next($request);
    }
}
