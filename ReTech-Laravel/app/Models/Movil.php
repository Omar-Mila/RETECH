<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Movil extends Model
{
    use HasFactory;
    protected $table = 'moviles';
    
    protected $fillable = [
        'modelo_id',
        'color_id',
        'precio',
        'estado',
        'salud_bateria',
        'almacenamiento',
        'ram',
        'stock',
    ];

    public $timestamps = false;

    public function modelo()
    {
        return $this->belongsTo(Modelo::class, 'modelo_id');
    }

    public function empresa()
    {
        return $this->belongsTo(Empresa::class, 'empresa_user_id', 'user_id');
    }

    public function color()
    {
        return $this->belongsTo(Color::class, 'color_id');
    }
}
