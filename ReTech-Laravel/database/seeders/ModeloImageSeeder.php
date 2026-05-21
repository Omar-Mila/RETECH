<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Modelo;
use App\Models\Color;
use App\Models\ModeloImage;
use Cloudinary\Api\Admin\AdminApi;

class ModeloImageSeeder extends Seeder
{
    public function run()
    {
        /*
         * Este seeder lee las imágenes subidas a Cloudinary y las vincula con:
         * - modelos.nombre
         * - colores.nombre
         *
         * Espera nombres tipo:
         * galaxy-a16-black-01_iez71n
         * iphone-16-blue-02_yxkn9q
         *
         * Cloudinary añade a veces un sufijo aleatorio tipo "_iez71n".
         * El seeder lo limpia automáticamente.
         */

        $modeloSlugs = [
            'iphone-15' => 'iPhone 15',
            'iphone-16' => 'iPhone 16',
            'iphone-16-pro' => 'iPhone 16 Pro',
            'iphone-17' => 'iPhone 17',
            'iphone-17-pro' => 'iPhone 17 Pro',
            'iphone-air' => 'iPhone Air',

            'galaxy-a16' => 'Galaxy A16',
            'galaxy-a56' => 'Galaxy A56',
            'galaxy-s25' => 'Galaxy S25',
            'galaxy-z-flip' => 'Galaxy Z Flip',

            'google-pixel-7-pro' => 'Google Pixel 7 Pro',
            'google-pixel-8-pro' => 'Google Pixel 8 Pro',
            'google-pixel-9-pro' => 'Google Pixel 9 Pro',
            'google-pixel-10-pro' => 'Google Pixel 10 Pro',
            'pixel-7-pro' => 'Google Pixel 7 Pro',
            'pixel-8-pro' => 'Google Pixel 8 Pro',
            'pixel-9-pro' => 'Google Pixel 9 Pro',
            'pixel-10-pro' => 'Google Pixel 10 Pro',

            'redmi-a5' => 'Redmi A5',
            'redmi-note-13' => 'Redmi Note 13',
            'redmi-note-14' => 'Redmi Note 14',
            'redmi-note-15' => 'Redmi Note 15',
            'xiaomi-redmi-a5' => 'Redmi A5',
            'xiaomi-redmi-note-13' => 'Redmi Note 13',
            'xiaomi-redmi-note-14' => 'Redmi Note 14',
            'xiaomi-redmi-note-15' => 'Redmi Note 15',
        ];

        $colorSlugs = [
            'beige' => 'Beige',
            'black' => 'Negro',
            'blue' => 'Azul',
            'dark-blue' => 'Azul oscuro',
            'gold' => 'Oro',
            'gray' => 'Gris',
            'green' => 'Verde',
            'lavanda' => 'Lavanda',
            'mist-blue' => 'Azul niebla',
            'orange' => 'Naranja',
            'pink' => 'Rosa',
            'purple' => 'Morado',
            'sage' => 'Verde salvia',
            'silver' => 'Plata',
            'verde' => 'Verde',
            'white' => 'Blanco',
            'yellow' => 'Amarillo',
        ];

        $modelos = Modelo::all()->keyBy('nombre');
        $colores = Color::all()->keyBy('nombre');

        $api = new AdminApi();

        $nextCursor = null;
        $created = 0;
        $skipped = 0;
        $processed = 0;

        do {
            $params = [
                'resource_type' => 'image',
                'max_results' => 500,
            ];

            if ($nextCursor) {
                $params['next_cursor'] = $nextCursor;
            }

            $result = $api->assets($params);

            $resources = $result['resources'] ?? [];
            $nextCursor = $result['next_cursor'] ?? null;

            foreach ($resources as $asset) {
                $processed++;

                $publicId = $asset['public_id'] ?? null;
                $secureUrl = $asset['secure_url'] ?? null;

                if (!$publicId || !$secureUrl) {
                    $skipped++;
                    continue;
                }

                $baseName = basename($publicId);

                // Quita sufijo aleatorio de Cloudinary: galaxy-a16-black-01_iez71n -> galaxy-a16-black-01
                $cleanName = preg_replace('/_[A-Za-z0-9]+$/', '', $baseName);

                // Tiene que acabar en -01, -02, -03...
                if (!preg_match('/-(\d{2})$/', $cleanName)) {
                    $skipped++;
                    continue;
                }

                // Quitamos el número final: galaxy-a16-black-01 -> galaxy-a16-black
                $withoutNumber = preg_replace('/-\d{2}$/', '', $cleanName);

                $matchedModelSlug = null;
                $matchedColorSlug = null;

                foreach ($modeloSlugs as $modelSlug => $modelName) {
                    foreach ($colorSlugs as $colorSlug => $colorName) {
                        $expected = $modelSlug . '-' . $colorSlug;

                        if ($withoutNumber === $expected) {
                            $matchedModelSlug = $modelSlug;
                            $matchedColorSlug = $colorSlug;
                            break 2;
                        }
                    }
                }

                if (!$matchedModelSlug || !$matchedColorSlug) {
                    $this->command->warn("No se pudo detectar modelo/color: {$publicId}");
                    $skipped++;
                    continue;
                }

                $modeloNombre = $modeloSlugs[$matchedModelSlug];
                $colorNombre = $colorSlugs[$matchedColorSlug];

                $modelo = $modelos[$modeloNombre] ?? null;
                $color = $colores[$colorNombre] ?? null;

                if (!$modelo) {
                    $this->command->warn("Modelo no encontrado en BD: {$modeloNombre} ({$publicId})");
                    $skipped++;
                    continue;
                }

                if (!$color) {
                    $this->command->warn("Color no encontrado en BD: {$colorNombre} ({$publicId})");
                    $skipped++;
                    continue;
                }

                $image = ModeloImage::firstOrCreate(
                    [
                        'path' => $secureUrl,
                    ],
                    [
                        'modelo_id' => $modelo->id,
                        'color_id' => $color->id,
                    ]
                );

                if ($image->wasRecentlyCreated) {
                    $created++;
                }
            }

        } while ($nextCursor);

        $this->command->info("ModeloImageSeeder finalizado.");
        $this->command->info("Procesadas: {$processed}");
        $this->command->info("Insertadas: {$created}");
        $this->command->info("Saltadas: {$skipped}");
    }
}
