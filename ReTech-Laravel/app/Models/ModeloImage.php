<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class ModeloImage extends Model
{
    use HasFactory;

    protected $table = 'modelo_images';

    protected $fillable = [
        'modelo_id',
        'color_id',
        'path'
    ];


    public function modelo()
    {
        return $this->belongsTo(Modelo::class, 'modelo_id');
    }

    public function color()
    {
        return $this->belongsTo(Color::class, 'color_id');
    }
}
