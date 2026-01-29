<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Modelo extends Model
{
    use HasFactory;
    protected $table = 'modelos';

    public $timestamps = false;

    public function marca()
    {
        return $this->belongsTo(Marca::class, 'marca_id');
    }

    public function sistemaOperativo()
    {
        return $this->belongsTo(SistemaOperativo::class, 'sistema_operativo_id');
    }

    public function moviles()
    {
        return $this->hasMany(Movil::class, 'modelo_id');
    }
}
