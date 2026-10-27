<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Usuario;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\Rule;

class AuthController extends Controller
{
    public function register(Request $request): JsonResponse
    {
        $request->merge([
            'nome' => trim((string) $request->input('nome', '')),
            'email' => mb_strtolower(trim((string) $request->input('email', ''))),
            'rm' => trim((string) $request->input('rm', '')),
        ]);

        $dados = $request->validate([
            'nome' => ['required', 'string', 'max:100'],
            'rm' => ['required', 'integer', 'min:1', 'max:2147483647', Rule::unique('usuarios', 'cod_responsavel')],
            'email' => ['required', 'email', 'max:50', Rule::unique('usuarios', 'email')],
            'senha' => ['required', 'string', 'min:8', 'max:72'],
        ]);

        $usuario = DB::transaction(function () use ($dados): Usuario {
            $id = ((int) Usuario::query()->max('id_usuario')) + 1;
            do {
                $iuid = random_int(100000, 2000000000);
            } while (Usuario::where('iuid_usuario', $iuid)->exists());

            return Usuario::create([
                'id_usuario' => $id,
                'nome' => $dados['nome'],
                'email' => $dados['email'],
                // O cast "hashed" do modelo Usuario aplica Hash::make antes de gravar.
                'senha' => $dados['senha'],
                'cod_responsavel' => (int) $dados['rm'],
                'funcao' => 'Aluno',
                'iuid_usuario' => $iuid,
            ]);
        });

        return response()->json([
            'message' => 'Usuário cadastrado com sucesso.',
            'data' => $this->dadosPublicos($usuario),
        ], 201);
    }

    public function login(Request $request): JsonResponse
    {
        $dados = $request->validate([
            'login' => ['required', 'string', 'max:100'],
            'senha' => ['required', 'string', 'max:72'],
        ]);

        $identificador = mb_strtolower(trim($dados['login']));
        $usuario = Usuario::query()
            ->whereRaw('LOWER(email) = ?', [$identificador])
            ->when(ctype_digit($identificador), fn ($query) => $query->orWhere('cod_responsavel', (int) $identificador))
            ->first();

        if (!$usuario || !$usuario->senha || !Hash::check($dados['senha'], $usuario->senha)) {
            return response()->json(['message' => 'E-mail/RM ou senha inválidos.'], 401);
        }

        // O token bruto é exibido apenas nesta resposta; no banco fica somente seu SHA-256.
        $token = hash('sha256', random_bytes(32));
        $expiraEm = now()->addDays(30);
        DB::table('api_tokens')->insert([
            'id_usuario' => $usuario->id_usuario,
            'token_hash' => hash('sha256', $token),
            'expires_at' => $expiraEm,
            'created_at' => now(),
            'updated_at' => now(),
        ]);

        return response()->json([
            'message' => 'Login realizado com sucesso.',
            'data' => $this->dadosPublicos($usuario),
            'token' => $token,
            'token_expires_at' => $expiraEm->toIso8601String(),
            'token_type' => 'Bearer',
        ]);
    }

    public function logout(Request $request): JsonResponse
    {
        $token = $request->bearerToken();
        if ($token) {
            DB::table('api_tokens')
                ->where('token_hash', hash('sha256', $token))
                ->delete();
        }

        return response()->json(['message' => 'Sessão encerrada.']);
    }

    private function dadosPublicos(Usuario $usuario): array
    {
        return [
            'id' => (int) $usuario->id_usuario,
            'uid' => (string) $usuario->iuid_usuario,
            'nome' => $usuario->nome,
            'email' => $usuario->email,
            'rm' => (string) $usuario->cod_responsavel,
            'cargo' => $usuario->funcao,
        ];
    }
}
