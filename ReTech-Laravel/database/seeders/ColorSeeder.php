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
            ['nombre' => 'Beige',         'codigo_hex' => '#D6C7B0'],
            ['nombre' => 'Negro',         'codigo_hex' => '#000000'],
            ['nombre' => 'Azul',          'codigo_hex' => '#2563EB'],
            ['nombre' => 'Azul oscuro',   'codigo_hex' => '#1E3A5F'],
            ['nombre' => 'Oro',           'codigo_hex' => '#D4AF37'],
            ['nombre' => 'Gris',          'codigo_hex' => '#808080'],
            ['nombre' => 'Verde',         'codigo_hex' => '#22C55E'],
            ['nombre' => 'Lavanda',       'codigo_hex' => '#B57EDC'],
            ['nombre' => 'Azul niebla',   'codigo_hex' => '#A9C7D8'],
            ['nombre' => 'Naranja',       'codigo_hex' => '#F97316'],
            ['nombre' => 'Rosa',          'codigo_hex' => '#EC4899'],
            ['nombre' => 'Morado',        'codigo_hex' => '#7C3AED'],
            ['nombre' => 'Verde salvia',  'codigo_hex' => '#9CAF88'],
            ['nombre' => 'Plata',         'codigo_hex' => '#C0C0C0'],
            ['nombre' => 'Blanco',        'codigo_hex' => '#FFFFFF'],
            ['nombre' => 'Amarillo',      'codigo_hex' => '#FACC15'],
        ];

        foreach ($colores as $color) {
            Color::firstOrCreate(
                ['nombre' => $color['nombre']], // Busca por nombre
                ['codigo_hex' => $color['codigo_hex']] // Si no existe, crea con este hex
            );
        }
    }
}
