<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Compra extends Model{
    protected $table = 'compras';

    protected $fillable = [
        'cliente_user_id', 
        'items', 
        'precio_total', 
        'metodo_pago',
        'stripe_intent',
        'estado'
    ];

    protected $casts = [
        'items' => 'array', 
    ];

    public function cliente()
    {
        return $this->belongsTo(Cliente::class, 'cliente_user_id', 'user_id');
    }
    protected static function booted()
    {
        static::created(function ($compra) {
            foreach ($compra->items as $item) {
                $movil = \App\Models\Movil::find($item['movil_id']);
                if ($movil) {
                    $movil->decrement('stock', $item['cantidad']);
                }
            }
        });
    }
}