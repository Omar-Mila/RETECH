<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use App\Models\Modelo;
use App\Models\Marca;
use App\Models\SistemaOperativo;

class ModeloSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        //
        $ios = SistemaOperativo::where('nombre', 'iOS')->first();
        $android = SistemaOperativo::where('nombre', 'Android')->first();

        //apple
        $apple = Marca::where('nombre', 'Apple')->first();

        $iphone = [
            'iPhone X',
            'iPhone XR',
            'iPhone XS',
            'iPhone XS Max',

            'iPhone 11',
            'iPhone 11 Pro',
            'iPhone 11 Pro Max',

            'iPhone SE (2ª generación)',

            'iPhone 12 mini',
            'iPhone 12',
            'iPhone 12 Pro',
            'iPhone 12 Pro Max',

            'iPhone 13 mini',
            'iPhone 13',
            'iPhone 13 Pro',
            'iPhone 13 Pro Max',

            'iPhone SE (3ª generación)',

            'iPhone 14',
            'iPhone 14 Plus',
            'iPhone 14 Pro',
            'iPhone 14 Pro Max',

            'iPhone 15',
            'iPhone 15 Plus',
            'iPhone 15 Pro',
            'iPhone 15 Pro Max',

            'iPhone 16',
            'iPhone 16 Plus',
            'iPhone 16 Pro',
            'iPhone 16 Pro Max',

            'iPhone Air',

            'iPhone 17',
            'iPhone 17 Plus',
            'iPhone 17 Pro',
            'iPhone 17 Pro Max'
        ];

        foreach ($iphone as $n) {
            Modelo::firstOrCreate(
                [
                    'nombre' => $n,
                    'marca_id' => $apple->id,
                ],
                [
                    'sistema_operativo_id' => $ios->id,
                    'conector' => 'Lightning',
                    'procesador' => 'Apple Silicon',
                    'cinco_g' => true,
                    'camara_principal_mp' => 48,
                    'camara_frontal_mp' => 12,
                    'bateria_mah' => 3200,
                    'pantalla_pulgadas' => 6.1,
                    'hz_pantalla' => 60,
                    'nfc' => true,
                    'tipo_sim' => 'SIM + eSIM',
                ]
            );
        }

        //galaxy
        $samsung = Marca::where('nombre', 'Samsung')->first();

        $galaxy = [
            'Galaxy S20',
            'Galaxy S21',
            'Galaxy S22',
            'Galaxy S23',
            'Galaxy S24',
            'Galaxy S25',
        ];

        foreach ($galaxy as $nombre) {
            Modelo::firstOrCreate(
                [
                    'nombre' => $nombre,
                    'marca_id' => $samsung->id,
                ],
                [
                    'sistema_operativo_id' => $android->id,
                    'conector' => 'Type-C',
                    'procesador' => 'Exynos / Snapdragon',
                    'cinco_g' => true,
                    'camara_principal_mp' => 50,
                    'camara_frontal_mp' => 12,
                    'bateria_mah' => 4500,
                    'pantalla_pulgadas' => 6.5,
                    'hz_pantalla' => 120,
                    'nfc' => true,
                    'tipo_sim' => 'Dual SIM',
                ]
            );
        }

        //Xiaomi
        $xiaomi = Marca::where('nombre', 'Xiaomi')->first();

        $redmi = [
            'Redmi Note 10',
            'Redmi Note 11',
            'Redmi Note 12',
            'Redmi Note 13',
            'Redmi Note 14',
            'Redmi Note 15',
        ];

        foreach ($redmi as $nombre) {
            Modelo::firstOrCreate(
                [
                    'nombre' => $nombre,
                    'marca_id' => $xiaomi->id,
                ],
                [
                    'sistema_operativo_id' => $android->id,
                    'conector' => 'Type-C',
                    'procesador' => 'Snapdragon',
                    'cinco_g' => true,
                    'camara_principal_mp' => 48,
                    'camara_frontal_mp' => 13,
                    'bateria_mah' => 5000,
                    'pantalla_pulgadas' => 6.6,
                    'hz_pantalla' => 120,
                    'nfc' => true,
                    'tipo_sim' => 'Dual SIM',
                ]
            );
        }

        //Google
        $google = Marca::where('nombre', 'Google')->first();

        $pixels = [
            'Pixel 5',
            'Pixel 6',
            'Pixel 7',
            'Pixel 8',
            'Pixel 9',
        ];

        foreach ($pixels as $nombre) {
            Modelo::firstOrCreate(
                [
                    'nombre' => $nombre,
                    'marca_id' => $google->id,
                ],
                [
                    'sistema_operativo_id' => $android->id,
                    'conector' => 'Type-C',
                    'procesador' => 'Google Tensor',
                    'cinco_g' => true,
                    'camara_principal_mp' => 50,
                    'camara_frontal_mp' => 10,
                    'bateria_mah' => 4400,
                    'pantalla_pulgadas' => 6.3,
                    'hz_pantalla' => 90,
                    'nfc' => true,
                    'tipo_sim' => 'eSIM',
                ]
            );
        }
    }
}
