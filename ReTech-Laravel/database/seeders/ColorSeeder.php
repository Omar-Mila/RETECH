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
        //
        $colores = [
            'Negro',
            'Blanco',
            'Azul',
            'Rojo',
            'Verde',
        ];

        foreach ($colores as $color) {
            Color::firstOrCreate([
                'nombre' => $color,
            ]);
        }
    }
}
