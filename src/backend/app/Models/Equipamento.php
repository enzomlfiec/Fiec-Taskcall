<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Equipamento extends Model
{
    protected $table = 'equipamentos';

    protected $primaryKey = 'num_equipamentos';

    public $incrementing = true;

    public $timestamps = false;

    protected $fillable = [
        'num_sala',
        'num_computador',
        'status',
        'data',
        'equipamentos_col',
    ];

    protected $casts = [
        'data' => 'datetime',
    ];

    public function sala(): BelongsTo
    {
        return $this->belongsTo(Sala::class, 'num_sala', 'num_sala');
    }

    public function computador(): BelongsTo
    {
        return $this->belongsTo(Computador::class, 'num_computador', 'num_computador');
    }

    public function chamados(): HasMany
    {
        return $this->hasMany(Chamado::class, 'num_equipamento', 'num_equipamentos');
    }
}
