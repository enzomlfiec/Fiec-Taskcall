<?php

namespace App\Http\Controllers;

use App\Models\Usuario;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Storage;
use Illuminate\Validation\ValidationException;

class AuthController extends Controller
{
    public static function resolverResponsavelId(): int
    {
        $anaId = Usuario::where('email', 'ana.picolomini@fiec.edu.br')->value('id_usuario');
        if ($anaId) {
            return (int) $anaId;
        }

        return (int) (Usuario::where('perfil', 'coordenador')->value('id_usuario') ?? 0);
    }

    public static function gerarIdentificadorInternoUnico(): int
    {
        $candidato = max(9000001, (int) (Usuario::max('iuid_usuario') ?? 9000000) + 1);
        while (Usuario::where('iuid_usuario', $candidato)->exists()) {
            $candidato++;
        }

        return $candidato;
    }

    /**
     * Cadastro público institucional (@fiec.edu.br) — sempre perfil "usuario".
     */
    public function register(Request $request)
    {
        $dados = $request->validate([
            'nome' => 'required|string|min:2|max:100',
            'email' => [
                'required',
                'email',
                'max:100',
                'unique:usuarios,email',
                'regex:/@fiec\.edu\.br$/i',
            ],
            'senha' => 'required|string|min:8',
            'rm' => 'nullable|string|max:20',
            'iuid_usuario' => 'nullable|integer',
        ], [
            'email.regex' => 'Utilize um e-mail institucional do domínio @fiec.edu.br.',
            'email.unique' => 'Este e-mail já está cadastrado.',
            'senha.min' => 'A senha deve possuir no mínimo 8 caracteres.',
        ]);

        $email = mb_strtolower(trim($dados['email']), 'UTF-8');
        $localPart = explode('@', $email)[0] ?? '';
        $rmInformado = trim((string) ($dados['rm'] ?? $dados['iuid_usuario'] ?? ''));

        $possuiRm = false;
        $iuidUsuario = null;
        $funcao = null;

        // Regra 1: Alunos/estagiários possuem números (RM) antes de @fiec.edu.br
        if (preg_match('/(\d+)/', $localPart, $match)) {
            $rmDoEmail = $match[1];
            if ($rmInformado === '' || !ctype_digit($rmInformado)) {
                throw ValidationException::withMessages([
                    'rm' => ['O RM é obrigatório para contas de alunos/estagiários e deve conter apenas números.'],
                ]);
            }
            if ($rmInformado !== $rmDoEmail && (int) $rmInformado !== (int) $rmDoEmail) {
                throw ValidationException::withMessages([
                    'rm' => ['O RM informado deve corresponder aos números presentes no e-mail institucional.'],
                ]);
            }

            $rmInt = (int) $rmDoEmail;
            if (Usuario::where('iuid_usuario', $rmInt)->exists()) {
                throw ValidationException::withMessages([
                    'rm' => ['Este RM já está cadastrado no sistema.'],
                ]);
            }

            $possuiRm = true;
            $iuidUsuario = $rmInt;
            $funcao = 'Aluno/Estagiário';
        } elseif (str_contains($localPart, '.')) {
            // Regra 2: Professores (nome.sobrenome@fiec.edu.br) — RM não obrigatório
            if ($rmInformado !== '') {
                if (!ctype_digit($rmInformado)) {
                    throw ValidationException::withMessages([
                        'rm' => ['O Nº de Identificação (RM) deve conter apenas dígitos.'],
                    ]);
                }
                $rmInt = (int) $rmInformado;
                if (Usuario::where('iuid_usuario', $rmInt)->exists()) {
                    throw ValidationException::withMessages([
                        'rm' => ['Este Nº de Identificação (RM) já está cadastrado.'],
                    ]);
                }
                $possuiRm = true;
                $iuidUsuario = $rmInt;
            } else {
                $possuiRm = false;
                $iuidUsuario = self::gerarIdentificadorInternoUnico();
            }

            $funcao = 'Professor';
        } else {
            // Regra 3: Funcionários administrativos sem padrão identificável — não inventar cargo
            if ($rmInformado !== '') {
                if (!ctype_digit($rmInformado)) {
                    throw ValidationException::withMessages([
                        'rm' => ['O Nº de Identificação (RM) deve conter apenas dígitos.'],
                    ]);
                }
                $rmInt = (int) $rmInformado;
                if (Usuario::where('iuid_usuario', $rmInt)->exists()) {
                    throw ValidationException::withMessages([
                        'rm' => ['Este Nº de Identificação (RM) já está cadastrado.'],
                    ]);
                }
                $possuiRm = true;
                $iuidUsuario = $rmInt;
            } else {
                $possuiRm = false;
                $iuidUsuario = self::gerarIdentificadorInternoUnico();
            }

            $funcao = null;
        }

        $usuario = Usuario::create([
            'nome' => trim($dados['nome']),
            'email' => $email,
            'iuid_usuario' => $iuidUsuario,
            'senha' => Hash::make($dados['senha']),
            'cod_responsavel' => self::resolverResponsavelId(),
            'funcao' => $funcao,
            'perfil' => 'usuario',
            'possui_rm' => $possuiRm,
            'is_admin_ti' => false,
            'ativo' => true,
        ]);

        return response()->json([
            'mensagem' => 'Cadastro realizado com sucesso.',
            'usuario' => $usuario,
        ], 201);
    }

    /**
     * Login por E-mail institucional ou RM (somente para quem possui RM real).
     */
    public function login(Request $request)
    {
        $dados = $request->validate([
            'login' => 'nullable|string|max:100',
            'email' => 'nullable|string|max:100',
            'senha' => 'required|string',
        ]);

        $identificador = trim((string) ($dados['login'] ?? $dados['email'] ?? ''));

        if ($identificador === '') {
            throw ValidationException::withMessages([
                'login' => ['Informe seu RM ou e-mail institucional.'],
            ]);
        }

        if (str_contains($identificador, '@')) {
            $usuario = Usuario::where('email', mb_strtolower($identificador, 'UTF-8'))->first();
        } elseif (ctype_digit($identificador)) {
            $usuario = Usuario::where('iuid_usuario', (int) $identificador)
                ->where('possui_rm', true)
                ->first();
        } else {
            throw ValidationException::withMessages([
                'login' => ['Informe um e-mail institucional ou um RM numérico válido.'],
            ]);
        }

        if (!$usuario || empty($usuario->senha) || !Hash::check($dados['senha'], $usuario->senha)) {
            throw ValidationException::withMessages([
                'login' => ['RM/E-mail ou senha incorretos.'],
            ]);
        }

        if (!$usuario->ativo) {
            return response()->json([
                'erro' => 'Sua conta está inativa. Entre em contato com o setor de TI.',
                'mensagem' => 'Sua conta está inativa. Entre em contato com o setor de TI.',
            ], 403);
        }

        $usuario->update([
            'ultimo_acesso_em' => now(),
        ]);

        $token = $usuario->createToken('taskcall')->plainTextToken;

        return response()->json([
            'mensagem' => 'Login realizado com sucesso.',
            'token' => $token,
            'usuario' => $usuario->fresh(),
        ]);
    }

    public function logout(Request $request)
    {
        $request->user()->currentAccessToken()?->delete();

        return response()->json([
            'mensagem' => 'Logout realizado com sucesso.',
        ]);
    }

    public function me(Request $request)
    {
        return response()->json($request->user());
    }

    public function atualizarFoto(Request $request)
    {
        $request->validate([
            'foto' => 'required|file|image|mimes:jpeg,jpg,png,webp,gif|max:4096',
        ], [
            'foto.required' => 'Selecione uma imagem para enviar.',
            'foto.image' => 'O arquivo selecionado deve ser uma imagem válida.',
            'foto.mimes' => 'Formatos aceitos: JPG, PNG, WEBP ou GIF.',
            'foto.max' => 'A imagem deve ter no máximo 4 MB.',
        ]);

        $usuario = $request->user();
        $arquivo = $request->file('foto');
        $ext = strtolower($arquivo->getClientOriginalExtension() ?: $arquivo->extension() ?: 'png');
        $nomeArquivo = 'usuario_' . $usuario->id_usuario . '_' . time() . '_' . bin2hex(random_bytes(4)) . '.' . $ext;

        $arquivo->storeAs('perfis', $nomeArquivo, 'public');

        if (!empty($usuario->foto_perfil)) {
            Storage::disk('public')->delete('perfis/' . basename($usuario->foto_perfil));
        }

        $usuario->update([
            'foto_perfil' => $nomeArquivo,
        ]);

        return response()->json([
            'mensagem' => 'Foto de perfil atualizada com sucesso.',
            'usuario' => $usuario->fresh(),
        ]);
    }

    public function exibirFoto(string $arquivo)
    {
        $seguro = basename($arquivo);
        $caminho = Storage::disk('public')->path('perfis/' . $seguro);

        if (!is_file($caminho)) {
            abort(404);
        }

        return response()->file($caminho, [
            'Cache-Control' => 'public, max-age=86400',
        ]);
    }
}
