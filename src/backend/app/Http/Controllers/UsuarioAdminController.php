<?php

namespace App\Http\Controllers;

use App\Models\ChamadoAtendimento;
use App\Models\ChamadoHistorico;
use App\Models\Usuario;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\Rule;
use Illuminate\Validation\ValidationException;

class UsuarioAdminController extends Controller
{
    public function index(Request $request)
    {
        $query = Usuario::query()
            ->withCount('chamados')
            ->orderBy('id_usuario', 'asc');

        if ($perfil = $request->query('perfil')) {
            $query->where('perfil', $perfil);
        }

        if ($request->has('ativo') && $request->query('ativo') !== '') {
            $query->where('ativo', $request->boolean('ativo'));
        }

        if ($busca = trim((string) $request->query('busca', ''))) {
            $query->where(function ($q) use ($busca) {
                $q->where('nome', 'like', "%{$busca}%")
                    ->orWhere('email', 'like', "%{$busca}%")
                    ->orWhere('funcao', 'like', "%{$busca}%")
                    ->orWhere('iuid_usuario', 'like', "%{$busca}%");
            });
        }

        return response()->json($query->get());
    }

    public function store(Request $request)
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
            'funcao' => 'nullable|string|max:30',
            'perfil' => 'required|in:usuario,coordenador,ti',
            'is_admin_ti' => 'nullable|boolean',
            'ativo' => 'nullable|boolean',
        ], [
            'email.regex' => 'Utilize um e-mail institucional do domínio @fiec.edu.br.',
        ]);

        $email = mb_strtolower(trim($dados['email']), 'UTF-8');
        $localPart = explode('@', $email)[0] ?? '';
        $rmInformado = trim((string) ($dados['rm'] ?? ''));

        $possuiRm = false;
        $iuidUsuario = null;

        if ($dados['perfil'] === 'ti') {
            if ($rmInformado === '' || !ctype_digit($rmInformado)) {
                throw ValidationException::withMessages([
                    'rm' => ['O RM numérico é obrigatório para contas da equipe de TI.'],
                ]);
            }
            $rmInt = (int) $rmInformado;
            if (Usuario::where('iuid_usuario', $rmInt)->exists()) {
                throw ValidationException::withMessages([
                    'rm' => ['Este RM já está cadastrado.'],
                ]);
            }
            $possuiRm = true;
            $iuidUsuario = $rmInt;
        } elseif (preg_match('/(\d+)/', $localPart, $m)) {
            $rmDoEmail = $m[1];
            if ($rmInformado === '' || !ctype_digit($rmInformado) || (int) $rmInformado !== (int) $rmDoEmail) {
                throw ValidationException::withMessages([
                    'rm' => ['Para contas com número no e-mail, o RM deve corresponder aos dígitos do e-mail.'],
                ]);
            }
            $rmInt = (int) $rmDoEmail;
            if (Usuario::where('iuid_usuario', $rmInt)->exists()) {
                throw ValidationException::withMessages([
                    'rm' => ['Este RM já está cadastrado.'],
                ]);
            }
            $possuiRm = true;
            $iuidUsuario = $rmInt;
        } elseif ($rmInformado !== '') {
            if (!ctype_digit($rmInformado)) {
                throw ValidationException::withMessages([
                    'rm' => ['O RM deve conter apenas números.'],
                ]);
            }
            $rmInt = (int) $rmInformado;
            if (Usuario::where('iuid_usuario', $rmInt)->exists()) {
                throw ValidationException::withMessages([
                    'rm' => ['Este RM já está cadastrado.'],
                ]);
            }
            $possuiRm = true;
            $iuidUsuario = $rmInt;
        } else {
            $possuiRm = false;
            $iuidUsuario = AuthController::gerarIdentificadorInternoUnico();
        }

        $isAdminTi = $dados['perfil'] === 'ti' ? (bool) ($dados['is_admin_ti'] ?? false) : false;

        $usuario = Usuario::create([
            'nome' => trim($dados['nome']),
            'email' => $email,
            'iuid_usuario' => $iuidUsuario,
            'senha' => Hash::make($dados['senha']),
            'cod_responsavel' => AuthController::resolverResponsavelId(),
            'funcao' => !empty($dados['funcao']) ? trim($dados['funcao']) : null,
            'perfil' => $dados['perfil'],
            'possui_rm' => $possuiRm,
            'is_admin_ti' => $isAdminTi,
            'ativo' => $dados['ativo'] ?? true,
        ]);

        return response()->json([
            'mensagem' => 'Usuário criado com sucesso.',
            'usuario' => $usuario->loadCount('chamados'),
        ], 201);
    }

    public function update(Request $request, $id)
    {
        $usuarioAlvo = Usuario::findOrFail($id);
        $adminAtual = $request->user();

        $dados = $request->validate([
            'nome' => 'sometimes|required|string|min:2|max:100',
            'email' => [
                'sometimes',
                'required',
                'email',
                'max:100',
                Rule::unique('usuarios', 'email')->ignore($usuarioAlvo->id_usuario, 'id_usuario'),
                'regex:/@fiec\.edu\.br$/i',
            ],
            'senha' => 'nullable|string|min:8',
            'rm' => 'nullable|string|max:20',
            'funcao' => 'nullable|string|max:30',
            'perfil' => 'sometimes|required|in:usuario,coordenador,ti',
            'is_admin_ti' => 'nullable|boolean',
            'ativo' => 'nullable|boolean',
        ], [
            'email.regex' => 'Utilize um e-mail institucional do domínio @fiec.edu.br.',
        ]);

        $novoPerfil = $dados['perfil'] ?? $usuarioAlvo->perfil;
        $novoAtivo = array_key_exists('ativo', $dados) ? (bool) $dados['ativo'] : $usuarioAlvo->ativo;
        $novoAdminTi = $novoPerfil === 'ti'
            ? (array_key_exists('is_admin_ti', $dados) ? (bool) $dados['is_admin_ti'] : $usuarioAlvo->is_admin_ti)
            : false;

        if ((int) $usuarioAlvo->id_usuario === (int) $adminAtual->id_usuario) {
            if (!$novoAtivo) {
                return response()->json([
                    'erro' => 'Você não pode inativar sua própria conta enquanto está autenticado.',
                ], 422);
            }
            if ($novoPerfil !== 'ti' || !$novoAdminTi) {
                return response()->json([
                    'erro' => 'Você não pode remover sua própria permissão administrativa de TI.',
                ], 422);
            }
        }

        $updates = [
            'perfil' => $novoPerfil,
            'is_admin_ti' => $novoAdminTi,
            'ativo' => $novoAtivo,
        ];

        if (isset($dados['nome'])) {
            $updates['nome'] = trim($dados['nome']);
        }
        if (isset($dados['email'])) {
            $updates['email'] = mb_strtolower(trim($dados['email']), 'UTF-8');
        }
        if (array_key_exists('funcao', $dados)) {
            $updates['funcao'] = !empty($dados['funcao']) ? trim($dados['funcao']) : null;
        }
        if (!empty($dados['senha'])) {
            $updates['senha'] = Hash::make($dados['senha']);
        }

        if (array_key_exists('rm', $dados)) {
            $rmInformado = trim((string) ($dados['rm'] ?? ''));
            if ($rmInformado !== '') {
                if (!ctype_digit($rmInformado)) {
                    throw ValidationException::withMessages([
                        'rm' => ['O RM deve conter apenas números.'],
                    ]);
                }
                $rmInt = (int) $rmInformado;
                $rmEmUso = Usuario::where('iuid_usuario', $rmInt)
                    ->where('id_usuario', '!=', $usuarioAlvo->id_usuario)
                    ->exists();
                if ($rmEmUso) {
                    throw ValidationException::withMessages([
                        'rm' => ['Este RM já pertence a outro usuário.'],
                    ]);
                }
                $updates['iuid_usuario'] = $rmInt;
                $updates['possui_rm'] = true;
            } elseif ($novoPerfil === 'ti' && !$usuarioAlvo->possui_rm) {
                throw ValidationException::withMessages([
                    'rm' => ['O RM é obrigatório para contas da equipe de TI.'],
                ]);
            }
        } elseif ($novoPerfil === 'ti' && !$usuarioAlvo->possui_rm) {
            throw ValidationException::withMessages([
                'rm' => ['Informe o RM numérico antes de atribuir o perfil de TI a este usuário.'],
            ]);
        }

        $usuarioAlvo->update($updates);

        if (!$novoAtivo) {
            $usuarioAlvo->tokens()->delete();
        }

        return response()->json([
            'mensagem' => 'Usuário atualizado com sucesso.',
            'usuario' => $usuarioAlvo->fresh()->loadCount('chamados'),
        ]);
    }

    public function inativar(Request $request, $id)
    {
        $usuarioAlvo = Usuario::findOrFail($id);

        if ((int) $usuarioAlvo->id_usuario === (int) $request->user()->id_usuario) {
            return response()->json([
                'erro' => 'Você não pode alterar o status da sua própria conta.',
            ], 422);
        }

        $novoEstado = $request->has('ativo')
            ? $request->boolean('ativo')
            : !$usuarioAlvo->ativo;

        $usuarioAlvo->update(['ativo' => $novoEstado]);

        if (!$novoEstado) {
            $usuarioAlvo->tokens()->delete();
        }

        return response()->json([
            'mensagem' => $novoEstado ? 'Usuário reativado com sucesso.' : 'Usuário inativado com sucesso.',
            'usuario' => $usuarioAlvo->fresh()->loadCount('chamados'),
        ]);
    }

    /**
     * C09 [FS002]: Impede exclusão definitiva quando houver chamados ou registros vinculados.
     */
    public function destroy(Request $request, $id)
    {
        $usuarioAlvo = Usuario::findOrFail($id);

        if ((int) $usuarioAlvo->id_usuario === (int) $request->user()->id_usuario) {
            return response()->json([
                'erro' => 'Você não pode excluir sua própria conta.',
            ], 422);
        }

        $temVinculos = $usuarioAlvo->chamados()->exists()
            || ChamadoAtendimento::where('id_tecnico', $usuarioAlvo->id_usuario)->exists()
            || ChamadoHistorico::where('id_usuario', $usuarioAlvo->id_usuario)->exists();

        if ($temVinculos) {
            return response()->json([
                'erro' => 'Este usuário possui chamados ou registros vinculados e não pode ser excluído definitivamente. Utilize a inativação.',
            ], 422);
        }

        $usuarioAlvo->tokens()->delete();
        $usuarioAlvo->delete();

        return response()->json([
            'mensagem' => 'Usuário removido com sucesso.',
        ]);
    }
}
