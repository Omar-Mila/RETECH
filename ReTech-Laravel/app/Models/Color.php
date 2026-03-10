<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Color extends Model
{
    use HasFactory;
    protected $table = 'colores';

    public $timestamps = false;
    
    protected $fillable = [
        'nombre', 
        'codigo_hex'
    ];
    public function moviles()
    {
        return $this->hasMany(Movil::class, 'color_id');
    }
}
