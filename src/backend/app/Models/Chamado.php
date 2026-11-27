<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Chamado extends Model
{
    public const STATUS_OFICIAIS = [
        'emAnalise',
        'naoVisualizado',
        'emProgresso',
        'resolvido',
    ];

    public const PRIORIDADES = [
        'Muito alta',
        'Alta',
        'Média',
        'Baixa',
    ];

    public const TRIAGEM_STATUS = [
        'pendente',
        'aprovado',
        'recusado',
    ];

    protected $table = 'chamados';

    protected $primaryKey = 'cod_chamado';

    public $incrementing = false;

    protected $keyType = 'int';

    protected $fillable = [
        'cod_chamado',
        'titulo',
        'descricao',
        'descricao_detalhada',
        'categoria',
        'prioridade',
        'status',
        'data',
        'id_usuario',
        'num_equipamento',
        'setor',
        'sala_chamado',
        'dispositivo',
        'visualizado_em',
        'visualizado_por',
        'triagem_status',
        'triagem_por',
        'triagem_em',
        'triagem_observacao',
        'id_responsavel_ti',
    ];

    protected $casts = [
        'data' => 'datetime',
        'visualizado_em' => 'datetime',
        'triagem_em' => 'datetime',
    ];

    public function usuario(): BelongsTo
    {
        return $this->belongsTo(Usuario::class, 'id_usuario', 'id_usuario');
    }

    public function equipamento(): BelongsTo
    {
        return $this->belongsTo(Equipamento::class, 'num_equipamento', 'num_equipamentos');
    }

    public function responsavelTi(): BelongsTo
    {
        return $this->belongsTo(Usuario::class, 'id_responsavel_ti', 'id_usuario');
    }

    public function triadoPor(): BelongsTo
    {
        return $this->belongsTo(Usuario::class, 'triagem_por', 'id_usuario');
    }

    public function visualizadoPor(): BelongsTo
    {
        return $this->belongsTo(Usuario::class, 'visualizado_por', 'id_usuario');
    }

    public function historicos(): HasMany
    {
        return $this->hasMany(ChamadoHistorico::class, 'cod_chamado', 'cod_chamado')
            ->orderBy('created_at', 'desc')
            ->orderBy('id', 'desc');
    }

    public function atendimentos(): HasMany
    {
        return $this->hasMany(ChamadoAtendimento::class, 'cod_chamado', 'cod_chamado')
            ->orderBy('created_at', 'desc')
            ->orderBy('id', 'desc');
    }
}
