<?php

namespace App\Http\Controllers;

use App\Models\Notificacao;
use Illuminate\Http\Request;

class NotificacaoController extends Controller
{
    public function index(Request $request)
    {
        $notificacoes = Notificacao::where('id_usuario_destino', $request->user()->id_usuario)
            ->orderBy('created_at', 'desc')
            ->limit(40)
            ->get();

        $naoLidas = Notificacao::where('id_usuario_destino', $request->user()->id_usuario)
            ->whereNull('lida_em')
            ->count();

        return response()->json([
            'nao_lidas' => $naoLidas,
            'notificacoes' => $notificacoes,
        ]);
    }

    public function marcarLida(Request $request, $id)
    {
        $notificacao = Notificacao::where('id_usuario_destino', $request->user()->id_usuario)
            ->findOrFail($id);

        if ($notificacao->lida_em === null) {
            $notificacao->update(['lida_em' => now()]);
        }

        return response()->json($notificacao);
    }

    public function marcarTodasLidas(Request $request)
    {
        Notificacao::where('id_usuario_destino', $request->user()->id_usuario)
            ->whereNull('lida_em')
            ->update(['lida_em' => now()]);

        return response()->json([
            'mensagem' => 'Todas as notificações foram marcadas como lidas.',
        ]);
    }
}
