<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use App\Models\SistemaOperativo;

class SistemaOperativoSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        //
        $sistemas = [
            'iOS',
            'Android',
        ];

        foreach ($sistemas as $nombre) {
            SistemaOperativo::firstOrCreate([
                'nombre' => $nombre,
            ]);
        }

    }
}
