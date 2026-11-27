<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Computador extends Model
{
    protected $table = 'computador';

    protected $primaryKey = 'num_computador';

    public $incrementing = false;

    protected $keyType = 'int';

    protected $fillable = [
        'num_computador',
        'status',
    ];

    public function equipamentos(): HasMany
    {
        return $this->hasMany(Equipamento::class, 'num_computador', 'num_computador');
    }
}
