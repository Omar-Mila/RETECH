<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Empresa extends Model
{
    use HasFactory;
    protected $table = 'empresas';

    protected $primaryKey = 'user_id';
    public $incrementing = false;
    protected $keyType = 'int';

    public $timestamps = false;
    
    protected $fillable = [
        'user_id', 
        'nombre_empresa', 
        'cif', 
        'direccion_fiscal', 
        'telefono', 
        'descripcion'
    ];

    public function user(){
        return $this->belongsTo(User::class, 'user_id');
    }

    public function moviles(){
        return $this->hasMany(Movil::class, 'empresa_user_id');
    }
}
