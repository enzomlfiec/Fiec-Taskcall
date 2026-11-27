<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class ChamadoHistorico extends Model
{
    protected $table = 'chamado_historicos';

    protected $fillable = [
        'cod_chamado',
        'id_usuario',
        'tipo_evento',
        'status_anterior',
        'status_novo',
        'descricao_evento',
        'detalhes_json',
    ];

    protected $casts = [
        'detalhes_json' => 'array',
    ];

    public function chamado(): BelongsTo
    {
        return $this->belongsTo(Chamado::class, 'cod_chamado', 'cod_chamado');
    }

    public function usuario(): BelongsTo
    {
        return $this->belongsTo(Usuario::class, 'id_usuario', 'id_usuario');
    }
}
