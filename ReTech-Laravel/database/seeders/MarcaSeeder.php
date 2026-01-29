<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use App\Models\Marca;

class MarcaSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        //
        $marcas = [
            'Apple',
            'Samsung',
            'Xiaomi',
            'Google',
        ];

        foreach ($marcas as $nombre) {
            Marca::firstOrCreate([
                'nombre' => $nombre,
            ]);
        }
    }
}
