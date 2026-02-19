<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

use App\Models\Color;

class ColorSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        $colores = [
            ['nombre' => 'Negro', 'codigo_hex' => '#000000'],
            ['nombre' => 'Blanco', 'codigo_hex' => '#FFFFFF'],
            ['nombre' => 'Azul',   'codigo_hex' => '#0000FF'],
            ['nombre' => 'Rojo',   'codigo_hex' => '#FF0000'],
            ['nombre' => 'Verde',  'codigo_hex' => '#00FF00'],
        ];

        foreach ($colores as $color) {
            Color::firstOrCreate(
                ['nombre' => $color['nombre']], // Busca por nombre
                ['codigo_hex' => $color['codigo_hex']] // Si no existe, crea con este hex
            );
        }
    }
}
