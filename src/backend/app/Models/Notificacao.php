<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Notificacao extends Model
{
    protected $table = 'notificacoes';

    protected $fillable = [
        'id_usuario_destino',
        'cod_chamado',
        'tipo',
        'titulo',
        'mensagem',
        'lida_em',
        'status_entrega',
        'erro_entrega',
    ];

    protected $casts = [
        'lida_em' => 'datetime',
    ];

    public function destinatario(): BelongsTo
    {
        return $this->belongsTo(Usuario::class, 'id_usuario_destino', 'id_usuario');
    }

    public function chamado(): BelongsTo
    {
        return $this->belongsTo(Chamado::class, 'cod_chamado', 'cod_chamado');
    }
}
