<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Modelo extends Model
{
    use HasFactory;
    protected $table = 'modelos';

    public $timestamps = true;
    
    protected $fillable = [
            'nombre',
            'marca_id',
            'sistema_operativo_id',
            'conector',
            'procesador',
            'cinco_g',
            'camara_principal_mp',
            'camara_frontal_mp',
            'bateria_mah',
            'pantalla_pulgadas',
            'hz_pantalla',
            'nfc',
            'tipo_sim',
    ];

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
