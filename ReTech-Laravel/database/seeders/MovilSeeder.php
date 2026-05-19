<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Movil;
use App\Models\Modelo;
use App\Models\Empresa;

class MovilSeeder extends Seeder
{
    public function run()
    {
        $empresasIds = Empresa::pluck('id')->toArray();

        if (empty($empresasIds)) {
            $this->command->warn("No hay empresas. Ejecuta EmpresaSeeder primero.");
            return;
        }

        // salud_bateria fija por estado (coincide con los match labels del API: 100, 90, 80)
        $estados = [
            'Como nuevo'  => ['precio_mult' => 1.00, 'bateria' => 100],
            'Buen estado' => ['precio_mult' => 0.83, 'bateria' => 90],
            'Funcional'   => ['precio_mult' => 0.65, 'bateria' => 80],
        ];

        // Catálogo: modelo => [combos [almacenamiento, ram], precio_base, color_ids]
        // Colores: 1=Negro, 2=Blanco, 3=Azul, 4=Rojo, 5=Verde
        $catalog = [

            // ─── APPLE ──────────────────────────────────────────────────────────
            'iPhone X' => [
                'combos'  => [[64, 3], [256, 3]],
                'precio'  => 200,
                'colores' => [1, 2],
            ],
            'iPhone XR' => [
                'combos'  => [[64, 3], [128, 3], [256, 3]],
                'precio'  => 230,
                'colores' => [1, 2, 4],
            ],
            'iPhone XS' => [
                'combos'  => [[64, 4], [256, 4], [512, 4]],
                'precio'  => 260,
                'colores' => [1, 2],
            ],
            'iPhone XS Max' => [
                'combos'  => [[64, 4], [256, 4], [512, 4]],
                'precio'  => 280,
                'colores' => [1, 2],
            ],
            'iPhone 11' => [
                'combos'  => [[64, 4], [128, 4], [256, 4]],
                'precio'  => 295,
                'colores' => [1, 2, 4, 5],
            ],
            'iPhone 11 Pro' => [
                'combos'  => [[64, 6], [256, 6], [512, 6]],
                'precio'  => 360,
                'colores' => [1, 2],
            ],
            'iPhone 11 Pro Max' => [
                'combos'  => [[64, 6], [256, 6], [512, 6]],
                'precio'  => 395,
                'colores' => [1, 2],
            ],
            'iPhone SE (2ª generación)' => [
                'combos'  => [[64, 3], [128, 3], [256, 3]],
                'precio'  => 185,
                'colores' => [1, 2, 4],
            ],
            'iPhone 12 mini' => [
                'combos'  => [[64, 4], [128, 4], [256, 4]],
                'precio'  => 275,
                'colores' => [1, 2, 3, 4, 5],
            ],
            'iPhone 12' => [
                'combos'  => [[64, 4], [128, 4], [256, 4]],
                'precio'  => 325,
                'colores' => [1, 2, 3, 4, 5],
            ],
            'iPhone 12 Pro' => [
                'combos'  => [[128, 6], [256, 6], [512, 6]],
                'precio'  => 405,
                'colores' => [1, 3],
            ],
            'iPhone 12 Pro Max' => [
                'combos'  => [[128, 6], [256, 6], [512, 6]],
                'precio'  => 440,
                'colores' => [1, 3],
            ],
            'iPhone 13 mini' => [
                'combos'  => [[128, 4], [256, 4], [512, 4]],
                'precio'  => 370,
                'colores' => [1, 2, 3, 4, 5],
            ],
            'iPhone 13' => [
                'combos'  => [[128, 4], [256, 4], [512, 4]],
                'precio'  => 430,
                'colores' => [1, 2, 3, 4, 5],
            ],
            'iPhone 13 Pro' => [
                'combos'  => [[128, 6], [256, 6], [512, 6]],
                'precio'  => 510,
                'colores' => [1, 2, 3, 5],
            ],
            'iPhone 13 Pro Max' => [
                'combos'  => [[128, 6], [256, 6], [512, 6]],
                'precio'  => 560,
                'colores' => [1, 2, 3, 5],
            ],
            'iPhone SE (3ª generación)' => [
                'combos'  => [[64, 4], [128, 4], [256, 4]],
                'precio'  => 255,
                'colores' => [1, 2, 4],
            ],
            'iPhone 14' => [
                'combos'  => [[128, 6], [256, 6], [512, 6]],
                'precio'  => 530,
                'colores' => [1, 2, 3, 4],
            ],
            'iPhone 14 Plus' => [
                'combos'  => [[128, 6], [256, 6], [512, 6]],
                'precio'  => 570,
                'colores' => [1, 2, 3, 4],
            ],
            'iPhone 14 Pro' => [
                'combos'  => [[128, 6], [256, 6], [512, 6], [1024, 6]],
                'precio'  => 660,
                'colores' => [1, 2, 5],
            ],
            'iPhone 14 Pro Max' => [
                'combos'  => [[128, 6], [256, 6], [512, 6], [1024, 6]],
                'precio'  => 710,
                'colores' => [1, 2, 5],
            ],
            'iPhone 15' => [
                'combos'  => [[128, 6], [256, 6], [512, 6]],
                'precio'  => 630,
                'colores' => [1, 2, 3, 4, 5],
            ],
            'iPhone 15 Plus' => [
                'combos'  => [[128, 6], [256, 6], [512, 6]],
                'precio'  => 670,
                'colores' => [1, 2, 5],
            ],
            'iPhone 15 Pro' => [
                'combos'  => [[128, 8], [256, 8], [512, 8]],
                'precio'  => 760,
                'colores' => [1, 2, 3],
            ],
            'iPhone 15 Pro Max' => [
                'combos'  => [[256, 8], [512, 8], [1024, 8]],
                'precio'  => 830,
                'colores' => [1, 2, 3],
            ],
            'iPhone 16' => [
                'combos'  => [[128, 8], [256, 8], [512, 8]],
                'precio'  => 740,
                'colores' => [1, 2, 3, 5],
            ],
            'iPhone 16 Plus' => [
                'combos'  => [[128, 8], [256, 8], [512, 8]],
                'precio'  => 790,
                'colores' => [1, 2],
            ],
            'iPhone 16 Pro' => [
                'combos'  => [[128, 8], [256, 8], [512, 8]],
                'precio'  => 895,
                'colores' => [1, 2],
            ],
            'iPhone 16 Pro Max' => [
                'combos'  => [[256, 8], [512, 8], [1024, 8]],
                'precio'  => 960,
                'colores' => [1, 2],
            ],
            'iPhone Air' => [
                'combos'  => [[128, 8], [256, 8]],
                'precio'  => 730,
                'colores' => [1, 2, 3],
            ],
            'iPhone 17' => [
                'combos'  => [[128, 8], [256, 8], [512, 8]],
                'precio'  => 810,
                'colores' => [1, 2],
            ],
            'iPhone 17 Plus' => [
                'combos'  => [[128, 8], [256, 8]],
                'precio'  => 860,
                'colores' => [1, 2],
            ],
            'iPhone 17 Pro' => [
                'combos'  => [[256, 8], [512, 8]],
                'precio'  => 970,
                'colores' => [1, 2],
            ],
            'iPhone 17 Pro Max' => [
                'combos'  => [[256, 8], [512, 8], [1024, 8]],
                'precio'  => 1060,
                'colores' => [1, 2],
            ],

            // ─── SAMSUNG ────────────────────────────────────────────────────────
            'Galaxy S20' => [
                'combos'  => [[128, 8], [128, 12], [256, 12]],
                'precio'  => 305,
                'colores' => [1, 3, 4],
            ],
            'Galaxy S21' => [
                'combos'  => [[128, 8], [256, 8], [128, 12]],
                'precio'  => 360,
                'colores' => [1, 2, 3, 5],
            ],
            'Galaxy S22' => [
                'combos'  => [[128, 8], [256, 8], [128, 12]],
                'precio'  => 430,
                'colores' => [1, 2, 4, 5],
            ],
            'Galaxy S23' => [
                'combos'  => [[128, 8], [256, 8], [512, 8]],
                'precio'  => 510,
                'colores' => [1, 2, 5],
            ],
            'Galaxy S24' => [
                'combos'  => [[128, 12], [256, 12], [512, 12]],
                'precio'  => 610,
                'colores' => [1, 2, 3, 5],
            ],
            'Galaxy S25' => [
                'combos'  => [[128, 12], [256, 12], [512, 12]],
                'precio'  => 710,
                'colores' => [1, 2, 3, 5],
            ],

            // ─── XIAOMI ─────────────────────────────────────────────────────────
            'Redmi Note 10' => [
                'combos'  => [[64, 4], [128, 4], [128, 6]],
                'precio'  => 155,
                'colores' => [1, 3, 5],
            ],
            'Redmi Note 11' => [
                'combos'  => [[64, 4], [128, 4], [128, 6]],
                'precio'  => 175,
                'colores' => [1, 3, 5],
            ],
            'Redmi Note 12' => [
                'combos'  => [[128, 4], [128, 6], [256, 8]],
                'precio'  => 195,
                'colores' => [1, 3, 5],
            ],
            'Redmi Note 13' => [
                'combos'  => [[128, 6], [256, 8], [256, 12]],
                'precio'  => 225,
                'colores' => [1, 3, 5],
            ],
            'Redmi Note 14' => [
                'combos'  => [[128, 8], [256, 8], [256, 12]],
                'precio'  => 255,
                'colores' => [1, 3, 5],
            ],
            'Redmi Note 15' => [
                'combos'  => [[128, 8], [256, 8], [512, 12]],
                'precio'  => 285,
                'colores' => [1, 3, 5],
            ],

            // ─── GOOGLE ─────────────────────────────────────────────────────────
            'Pixel 5' => [
                'combos'  => [[128, 8]],
                'precio'  => 305,
                'colores' => [1, 2, 5],
            ],
            'Pixel 6' => [
                'combos'  => [[128, 8], [256, 8]],
                'precio'  => 355,
                'colores' => [1, 4, 5],
            ],
            'Pixel 7' => [
                'combos'  => [[128, 8], [256, 8]],
                'precio'  => 405,
                'colores' => [1, 2, 5],
            ],
            'Pixel 8' => [
                'combos'  => [[128, 8], [256, 8]],
                'precio'  => 485,
                'colores' => [1, 4, 5],
            ],
            'Pixel 9' => [
                'combos'  => [[128, 12], [256, 12]],
                'precio'  => 585,
                'colores' => [1, 2, 4, 5],
            ],
        ];

        $created = 0;

        foreach ($catalog as $modelName => $config) {
            $modelo = Modelo::where('nombre', $modelName)->first();

            if (!$modelo) {
                $this->command->warn("Modelo no encontrado: {$modelName}");
                continue;
            }

            foreach ($config['combos'] as [$almacenamiento, $ram]) {
                $storageMult = match (true) {
                    $almacenamiento >= 1024 => 1.40,
                    $almacenamiento >= 512  => 1.25,
                    $almacenamiento >= 256  => 1.12,
                    default                 => 1.00,
                };

                foreach ($config['colores'] as $colorId) {
                    foreach ($estados as $estado => $params) {
                        $precio = round($config['precio'] * $params['precio_mult'] * $storageMult, 2);
                        // 'Funcional' puede tener stock 0 para testear ese edge case
                        $stock = $estado === 'Funcional' ? rand(0, 5) : rand(1, 15);

                        Movil::create([
                            'modelo_id'      => $modelo->id,
                            'precio'         => $precio,
                            'stock'          => $stock,
                            'estado'         => $estado,
                            'salud_bateria'  => $params['bateria'],
                            'almacenamiento' => $almacenamiento,
                            'ram'            => $ram,
                            'color_id'       => $colorId,
                            'empresa_id'     => $empresasIds[array_rand($empresasIds)],
                        ]);

                        $created++;
                    }
                }
            }
        }

        $this->command->info("MovilSeeder: {$created} móviles insertados.");
    }
}
