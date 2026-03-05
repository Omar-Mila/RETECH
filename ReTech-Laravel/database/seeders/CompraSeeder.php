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
        $cliente = Cliente::first();
        $movil   = Movil::where('stock', '>', 0)->first();

        if ($cliente && $movil) {

            Compra::create([
                'cliente_user_id' => $cliente->user_id,
                'items'           => [
                    [
                        'movil_id' => $movil->id,
                        'cantidad' => 1,
                        'precio'   => $movil->precio,
                    ]
                ],
                'precio_total'    => $movil->precio * 1.21,
                'metodo_pago'     => 'Tarjeta',
                'estado'          => 'pagado',
                'stripe_intent'   => null,
            ]);

            $this->command->info("Compra creada para: {$cliente->nombre}");
        } else {
            $this->command->error("No se pudo crear la compra: falta un cliente o un móvil con stock.");
        }
    }
}
