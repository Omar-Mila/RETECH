<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

use App\Models\Cliente;
use App\Models\Movil;
use App\Models\Compra;

class CompraSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        //
        $cliente = Cliente::first();
        $movil = Movil::where('stock', '>', 0)->first();

        if ($cliente && $movil) {
            
            Compra::create([
                'cliente_user_id' => $cliente->user_id,
                'movil_id'        => $movil->id,
                'precio_venta'    => $movil->precio,
                'cantidad'        => 1,
                'metodo_pago'     => 'Tarjeta',
                'created_at'      => now(),
            ]);

            $movil->decrement('stock', 1);

            $this->command->info("Compra manual creada con éxito para el cliente: {$cliente->nombre}");
        } else {
            $this->command->error("No se pudo crear la compra: falta un cliente o un móvil con stock.");
        }
    
    }
}
