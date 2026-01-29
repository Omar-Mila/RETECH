<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class SistemaOperativo extends Model
{
    use HasFactory;
    protected $table = 'sistemas_operativos';

    public $timestamps = false;

    public function modelos()
    {
        return $this->hasMany(Modelo::class, 'sistema_operativo_id');
    }
}
