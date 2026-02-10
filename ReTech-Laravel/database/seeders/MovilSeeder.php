<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use App\Models\Movil;
use App\Models\Color;

use App\Models\Modelo;
use App\Models\Marca;
use App\Models\SistemaOperativo;

class MovilSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        //

        Movil::create([
            'modelo_id'       => 1, // Asegúrate de que existe un modelo con ID 1
            'precio'          => 899.00,
            'stock'           => 10,
            'estado'          => 'Como nuevo',
            'salud_bateria'   => 100,
            'almacenamiento'  => 128,
            'ram'             => 8,
            'color_id'        => 1, // Asegúrate de que existe un color con ID 1
        ]);

        Movil::create([
            'modelo_id'       => 2, // Asegúrate de que existe un modelo con ID 2
            'precio'          => 999.00,
            'stock'           => 20,
            'estado'          => 'Buen estado',
            'salud_bateria'   => 90,
            'almacenamiento'  => 256,
            'ram'             => 16,
            'color_id'        => 2, // Asegúrate de que existe un color con ID 2
        ]);

        Movil::create([
            'modelo_id'       => 3, // Asegúrate de que existe un modelo con ID 3
            'precio'          => 1099.00,
            'stock'           => 30,
            'estado'          => 'Funcional',
            'salud_bateria'   => 80,
            'almacenamiento'  => 512,
            'ram'             => 32,
            'color_id'        => 3, // Asegúrate de que existe un color con ID 3
        ]);

        
    }
}
