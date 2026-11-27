<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class ChamadoAtendimento extends Model
{
    protected $table = 'chamado_atendimentos';

    protected $fillable = [
        'cod_chamado',
        'id_tecnico',
        'procedimentos',
        'materiais',
        'orientacoes',
        'tipo_registro',
        'solucao',
        'pendencia',
    ];

    public function chamado(): BelongsTo
    {
        return $this->belongsTo(Chamado::class, 'cod_chamado', 'cod_chamado');
    }

    public function tecnico(): BelongsTo
    {
        return $this->belongsTo(Usuario::class, 'id_tecnico', 'id_usuario');
    }
}
