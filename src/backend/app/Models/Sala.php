<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Sala extends Model
{
    protected $table = 'sala';

    protected $primaryKey = 'num_sala';

    public $incrementing = false;

    protected $keyType = 'int';

    protected $fillable = [
        'num_sala',
        'predio',
    ];

    public function equipamentos(): HasMany
    {
        return $this->hasMany(Equipamento::class, 'num_sala', 'num_sala');
    }
}
