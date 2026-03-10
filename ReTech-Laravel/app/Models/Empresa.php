<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Empresa extends Model
{
    use HasFactory;

    protected $table = 'empresas';
    public $timestamps = false;

    protected $fillable = [
        'nombre_empresa', 
        'cif', 
        'direccion_fiscal', 
        'telefono', 
        'descripcion'
    ];

    public function moviles()
    {
        return $this->hasMany(Movil::class, 'empresa_id');
    }
}