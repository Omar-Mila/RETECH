<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Compra extends Model
{
    use HasFactory;
    protected $table = 'compras';
    protected $fillable = ['cliente_user_id', 'movil_id', 'precio_venta', 'cantidad', 'metodo_pago'];

    public function cliente()
    {
        return $this->belongsTo(Cliente::class, 'cliente_user_id', 'user_id');
    }

    public function movil()
    {
        return $this->belongsTo(Movil::class, 'movil_id');
    }
}
