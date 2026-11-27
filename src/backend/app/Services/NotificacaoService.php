<?php

namespace App\Services;

use App\Models\Notificacao;
use App\Models\Usuario;
use Illuminate\Support\Facades\Log;

class NotificacaoService
{
    /**
     * Registra uma notificação interna sem interromper a operação principal em caso de falha.
     */
    public function notificar(
        int $idUsuarioDestino,
        ?int $codChamado,
        string $tipo,
        string $titulo,
        string $mensagem
    ): void {
        try {
            Notificacao::create([
                'id_usuario_destino' => $idUsuarioDestino,
                'cod_chamado' => $codChamado,
                'tipo' => $tipo,
                'titulo' => $titulo,
                'mensagem' => $mensagem,
                'status_entrega' => 'entregue',
                'erro_entrega' => null,
            ]);
        } catch (\Throwable $e) {
            Log::error('Falha ao registrar notificação interna do TaskCall.', [
                'id_usuario_destino' => $idUsuarioDestino,
                'cod_chamado' => $codChamado,
                'tipo' => $tipo,
                'erro' => $e->getMessage(),
            ]);
        }
    }

    public function notificarPerfil(
        string $perfil,
        ?int $codChamado,
        string $tipo,
        string $titulo,
        string $mensagem,
        ?int $excluirUsuarioId = null
    ): void {
        try {
            $destinatarios = Usuario::where('perfil', $perfil)
                ->where('ativo', true)
                ->when($excluirUsuarioId !== null, fn ($q) => $q->where('id_usuario', '!=', $excluirUsuarioId))
                ->pluck('id_usuario');

            foreach ($destinatarios as $destinoId) {
                $this->notificar((int) $destinoId, $codChamado, $tipo, $titulo, $mensagem);
            }
        } catch (\Throwable $e) {
            Log::error('Falha ao notificar perfil.', [
                'perfil' => $perfil,
                'cod_chamado' => $codChamado,
                'erro' => $e->getMessage(),
            ]);
        }
    }
}
