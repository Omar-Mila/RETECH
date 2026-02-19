<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

use Laravel\Sanctum\HasApiTokens;

class Cliente extends Model
{
    use HasFactory;
    protected $table = 'clientes';

    protected $primaryKey = 'user_id';
    public $incrementing = false;
    protected $keyType = 'int';

    public $timestamps = false;

    protected $fillable = [
        'user_id', 
        'nombre', 
        'apellidos', 
        'nif', 
        'direccion', 
        'telefono'
    ];

    public function user(){
        return $this->belongsTo(User::class, 'user_id');
    }
    protected static function booted()
    {
        static::creating(function ($cliente) {
            if (empty($cliente->nombre) && $cliente->user) {
                $cliente->nombre = $cliente->user->name;
            }
        });
    }
}
