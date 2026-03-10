<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use App\Models\Movil;
use App\Models\Color;

use App\Models\Modelo;
use App\Models\Marca;
use App\Models\SistemaOperativo;
use App\Models\Empresa;

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
        $empresasIds = Empresa::pluck('id')->toArray();

        if (empty($empresasIds)) {
            $this->command->warn("No hay empresas creadas. Asegúrate de ejecutar EmpresaSeeder primero.");
            return;
        }

        Movil::create([
            'modelo_id'       => 1,
            'precio'          => 899.00,
            'stock'           => 10,
            'estado'          => 'Como nuevo',
            'salud_bateria'   => 100,
            'almacenamiento'  => 128,
            'ram'             => 8,
            'color_id'        => 1,
            'empresa_id'      => $empresasIds[array_rand($empresasIds)], // Campo corregido
        ]);

        Movil::create([
            'modelo_id'       => 2,
            'precio'          => 999.00,
            'stock'           => 20,
            'estado'          => 'Buen estado',
            'salud_bateria'   => 90,
            'almacenamiento'  => 256,
            'ram'             => 16,
            'color_id'        => 2,
            'empresa_id'      => $empresasIds[array_rand($empresasIds)], // Campo corregido
        ]);

        Movil::create([
            'modelo_id'       => 3,
            'precio'          => 1099.00,
            'stock'           => 30,
            'estado'          => 'Funcional',
            'salud_bateria'   => 80,
            'almacenamiento'  => 512,
            'ram'             => 32,
            'color_id'        => 3,
            'empresa_id'      => $empresasIds[array_rand($empresasIds)], // Campo corregido
        ]);

    }
}
