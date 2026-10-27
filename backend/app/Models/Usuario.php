<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Usuario extends Model
{
    protected $table = 'usuarios';

    protected $primaryKey = 'id_usuario';

    public $incrementing = false;

    public $timestamps = false;

    protected $fillable = [
        'id_usuario',
        'iuid_usuario',
        'nome',
        'email',
        'senha',
        'cod_responsavel',
        'funcao',
    ];

    protected $hidden = ['senha'];

    protected function casts(): array
    {
        return [
            'senha' => 'hashed',
        ];
    }
}
