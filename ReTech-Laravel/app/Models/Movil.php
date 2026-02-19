<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use App\Models\Empresa;

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
        'empresa_id',
    ];

    public $timestamps = false;

    public function modelo()
    {
        return $this->belongsTo(Modelo::class, 'modelo_id');
    }

    public function empresa() {
        return $this->belongsTo(Empresa::class, 'empresa_id');
    }

    public function color()
    {
        return $this->belongsTo(Color::class, 'color_id');
    }
    
    public function getFullDescriptionAttribute()
    {
        return "{$this->modelo->nombre} - {$this->almacenamiento}GB ({$this->color->nombre})";
    }
}
