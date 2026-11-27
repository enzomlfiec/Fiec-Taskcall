<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Laravel\Sanctum\HasApiTokens;

class Usuario extends Authenticatable
{
    use HasApiTokens, Notifiable;

    protected $table = 'usuarios';

    protected $primaryKey = 'id_usuario';

    public $incrementing = true;

    protected $keyType = 'int';

    protected $fillable = [
        'iuid_usuario',
        'nome',
        'email',
        'foto_perfil',
        'senha',
        'cod_responsavel',
        'funcao',
        'perfil',
        'possui_rm',
        'is_admin_ti',
        'ativo',
        'ultimo_acesso_em',
    ];

    protected $hidden = [
        'senha',
    ];

    protected $casts = [
        'possui_rm' => 'boolean',
        'is_admin_ti' => 'boolean',
        'ativo' => 'boolean',
        'ultimo_acesso_em' => 'datetime',
    ];

    protected $appends = [
        'rm',
        'foto_perfil_url',
    ];

    public function getAuthPasswordName(): string
    {
        return 'senha';
    }

    /**
     * Expõe o RM apenas quando o usuário possui RM real (nunca expõe identificador interno de professor).
     */
    public function getRmAttribute(): ?string
    {
        if (!$this->possui_rm) {
            return null;
        }

        return $this->iuid_usuario !== null ? (string) $this->iuid_usuario : null;
    }

    public function getFotoPerfilUrlAttribute(): ?string
    {
        if (empty($this->foto_perfil)) {
            return null;
        }

        return url('/api/fotos-perfil/' . basename($this->foto_perfil));
    }

    public function chamados(): HasMany
    {
        return $this->hasMany(Chamado::class, 'id_usuario', 'id_usuario');
    }

    public function notificacoes(): HasMany
    {
        return $this->hasMany(Notificacao::class, 'id_usuario_destino', 'id_usuario');
    }
}
