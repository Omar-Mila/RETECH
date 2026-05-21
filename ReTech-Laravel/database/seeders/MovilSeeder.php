<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Movil;
use App\Models\Modelo;
use App\Models\Empresa;
use App\Models\Color;

class MovilSeeder extends Seeder
{
    public function run()
    {
        $empresaIds = Empresa::pluck('id')->toArray();

        if (empty($empresaIds)) {
            $this->command->warn('No hay empresas. Ejecuta EmpresaSeeder primero.');
            return;
        }

        $modelos = Modelo::pluck('id', 'nombre');
        $colores = Color::pluck('id', 'nombre');

        $moviles = [
            // APPLE
            ['modelo' => 'iPhone 15',     'color' => 'Negro',        'estado' => 'Como nuevo',  'bateria' => 100, 'almacenamiento' => 128, 'ram' => 6,  'precio' => 569.95,  'stock' => 4],
            ['modelo' => 'iPhone 15',     'color' => 'Azul',         'estado' => 'Buen estado', 'bateria' => 90,  'almacenamiento' => 128, 'ram' => 6,  'precio' => 499.95,  'stock' => 6],
            ['modelo' => 'iPhone 15',     'color' => 'Rosa',         'estado' => 'Funcional',   'bateria' => 80,  'almacenamiento' => 256, 'ram' => 6,  'precio' => 459.95,  'stock' => 2],

            ['modelo' => 'iPhone 16',     'color' => 'Negro',        'estado' => 'Como nuevo',  'bateria' => 100, 'almacenamiento' => 128, 'ram' => 8,  'precio' => 719.95,  'stock' => 3],
            ['modelo' => 'iPhone 16',     'color' => 'Blanco',       'estado' => 'Buen estado', 'bateria' => 90,  'almacenamiento' => 256, 'ram' => 8,  'precio' => 679.95,  'stock' => 4],
            ['modelo' => 'iPhone 16',     'color' => 'Verde',        'estado' => 'Funcional',   'bateria' => 80,  'almacenamiento' => 128, 'ram' => 8,  'precio' => 579.95,  'stock' => 2],

            ['modelo' => 'iPhone 16 Pro', 'color' => 'Negro',        'estado' => 'Como nuevo',  'bateria' => 100, 'almacenamiento' => 256, 'ram' => 8,  'precio' => 949.95,  'stock' => 2],
            ['modelo' => 'iPhone 16 Pro', 'color' => 'Plata',        'estado' => 'Buen estado', 'bateria' => 90,  'almacenamiento' => 256, 'ram' => 8,  'precio' => 869.95,  'stock' => 3],
            ['modelo' => 'iPhone 16 Pro', 'color' => 'Oro',          'estado' => 'Funcional',   'bateria' => 80,  'almacenamiento' => 512, 'ram' => 8,  'precio' => 799.95,  'stock' => 1],

            ['modelo' => 'iPhone 17',     'color' => 'Negro',        'estado' => 'Como nuevo',  'bateria' => 100, 'almacenamiento' => 128, 'ram' => 8,  'precio' => 899.95,  'stock' => 3],
            ['modelo' => 'iPhone 17',     'color' => 'Blanco',       'estado' => 'Buen estado', 'bateria' => 90,  'almacenamiento' => 256, 'ram' => 8,  'precio' => 849.95,  'stock' => 4],
            ['modelo' => 'iPhone 17',     'color' => 'Azul',         'estado' => 'Funcional',   'bateria' => 80,  'almacenamiento' => 128, 'ram' => 8,  'precio' => 729.95,  'stock' => 2],

            ['modelo' => 'iPhone 17 Pro', 'color' => 'Plata',        'estado' => 'Como nuevo',  'bateria' => 100, 'almacenamiento' => 256, 'ram' => 8,  'precio' => 1099.95, 'stock' => 2],
            ['modelo' => 'iPhone 17 Pro', 'color' => 'Naranja',      'estado' => 'Buen estado', 'bateria' => 90,  'almacenamiento' => 512, 'ram' => 8,  'precio' => 1049.95, 'stock' => 2],
            ['modelo' => 'iPhone 17 Pro', 'color' => 'Azul oscuro',  'estado' => 'Funcional',   'bateria' => 80,  'almacenamiento' => 256, 'ram' => 8,  'precio' => 899.95,  'stock' => 1],

            ['modelo' => 'iPhone Air',    'color' => 'Blanco',       'estado' => 'Como nuevo',  'bateria' => 100, 'almacenamiento' => 256, 'ram' => 8,  'precio' => 799.95,  'stock' => 2],
            ['modelo' => 'iPhone Air',    'color' => 'Azul niebla',  'estado' => 'Buen estado', 'bateria' => 90,  'almacenamiento' => 256, 'ram' => 8,  'precio' => 729.95,  'stock' => 3],
            ['modelo' => 'iPhone Air',    'color' => 'Negro',        'estado' => 'Funcional',   'bateria' => 80,  'almacenamiento' => 128, 'ram' => 8,  'precio' => 629.95,  'stock' => 1],

            // SAMSUNG
            ['modelo' => 'Galaxy A16',    'color' => 'Negro',        'estado' => 'Como nuevo',  'bateria' => 100, 'almacenamiento' => 128, 'ram' => 4,  'precio' => 189.95,  'stock' => 8],
            ['modelo' => 'Galaxy A16',    'color' => 'Gris',         'estado' => 'Buen estado', 'bateria' => 90,  'almacenamiento' => 128, 'ram' => 4,  'precio' => 159.95,  'stock' => 10],
            ['modelo' => 'Galaxy A16',    'color' => 'Verde',        'estado' => 'Funcional',   'bateria' => 80,  'almacenamiento' => 64,  'ram' => 4,  'precio' => 119.95,  'stock' => 5],

            ['modelo' => 'Galaxy A56',    'color' => 'Negro',        'estado' => 'Como nuevo',  'bateria' => 100, 'almacenamiento' => 256, 'ram' => 8,  'precio' => 389.95,  'stock' => 5],
            ['modelo' => 'Galaxy A56',    'color' => 'Gris',         'estado' => 'Buen estado', 'bateria' => 90,  'almacenamiento' => 128, 'ram' => 8,  'precio' => 329.95,  'stock' => 6],
            ['modelo' => 'Galaxy A56',    'color' => 'Rosa',         'estado' => 'Funcional',   'bateria' => 80,  'almacenamiento' => 128, 'ram' => 8,  'precio' => 269.95,  'stock' => 2],

            ['modelo' => 'Galaxy S25',    'color' => 'Negro',        'estado' => 'Como nuevo',  'bateria' => 100, 'almacenamiento' => 256, 'ram' => 12, 'precio' => 759.95,  'stock' => 3],
            ['modelo' => 'Galaxy S25',    'color' => 'Azul',         'estado' => 'Buen estado', 'bateria' => 90,  'almacenamiento' => 256, 'ram' => 12, 'precio' => 699.95,  'stock' => 4],
            ['modelo' => 'Galaxy S25',    'color' => 'Plata',        'estado' => 'Funcional',   'bateria' => 80,  'almacenamiento' => 128, 'ram' => 12, 'precio' => 599.95,  'stock' => 1],

            ['modelo' => 'Galaxy Z Flip', 'color' => 'Negro',        'estado' => 'Como nuevo',  'bateria' => 100, 'almacenamiento' => 256, 'ram' => 12, 'precio' => 849.95,  'stock' => 2],
            ['modelo' => 'Galaxy Z Flip', 'color' => 'Morado',       'estado' => 'Buen estado', 'bateria' => 90,  'almacenamiento' => 256, 'ram' => 12, 'precio' => 779.95,  'stock' => 3],
            ['modelo' => 'Galaxy Z Flip', 'color' => 'Verde salvia', 'estado' => 'Funcional',   'bateria' => 80,  'almacenamiento' => 128, 'ram' => 8,  'precio' => 649.95,  'stock' => 1],

            // GOOGLE
            ['modelo' => 'Google Pixel 7 Pro',  'color' => 'Negro',       'estado' => 'Como nuevo',  'bateria' => 100, 'almacenamiento' => 128, 'ram' => 12, 'precio' => 399.95, 'stock' => 4],
            ['modelo' => 'Google Pixel 7 Pro',  'color' => 'Verde salvia','estado' => 'Buen estado', 'bateria' => 90,  'almacenamiento' => 256, 'ram' => 12, 'precio' => 369.95, 'stock' => 3],
            ['modelo' => 'Google Pixel 7 Pro',  'color' => 'Blanco',      'estado' => 'Funcional',   'bateria' => 80,  'almacenamiento' => 128, 'ram' => 12, 'precio' => 299.95, 'stock' => 2],

            ['modelo' => 'Google Pixel 8 Pro',  'color' => 'Negro',       'estado' => 'Como nuevo',  'bateria' => 100, 'almacenamiento' => 128, 'ram' => 12, 'precio' => 529.95, 'stock' => 3],
            ['modelo' => 'Google Pixel 8 Pro',  'color' => 'Azul',        'estado' => 'Buen estado', 'bateria' => 90,  'almacenamiento' => 256, 'ram' => 12, 'precio' => 489.95, 'stock' => 4],
            ['modelo' => 'Google Pixel 8 Pro',  'color' => 'Beige',       'estado' => 'Funcional',   'bateria' => 80,  'almacenamiento' => 128, 'ram' => 12, 'precio' => 399.95, 'stock' => 2],

            ['modelo' => 'Google Pixel 9 Pro',  'color' => 'Negro',       'estado' => 'Como nuevo',  'bateria' => 100, 'almacenamiento' => 256, 'ram' => 16, 'precio' => 719.95, 'stock' => 2],
            ['modelo' => 'Google Pixel 9 Pro',  'color' => 'Rosa',        'estado' => 'Buen estado', 'bateria' => 90,  'almacenamiento' => 128, 'ram' => 16, 'precio' => 649.95, 'stock' => 3],
            ['modelo' => 'Google Pixel 9 Pro',  'color' => 'Verde',       'estado' => 'Funcional',   'bateria' => 80,  'almacenamiento' => 128, 'ram' => 16, 'precio' => 549.95, 'stock' => 1],

            ['modelo' => 'Google Pixel 10 Pro', 'color' => 'Negro',       'estado' => 'Como nuevo',  'bateria' => 100, 'almacenamiento' => 256, 'ram' => 16, 'precio' => 899.95, 'stock' => 2],
            ['modelo' => 'Google Pixel 10 Pro', 'color' => 'Blanco',      'estado' => 'Buen estado', 'bateria' => 90,  'almacenamiento' => 128, 'ram' => 16, 'precio' => 799.95, 'stock' => 3],
            ['modelo' => 'Google Pixel 10 Pro', 'color' => 'Azul niebla', 'estado' => 'Funcional',   'bateria' => 80,  'almacenamiento' => 128, 'ram' => 16, 'precio' => 699.95, 'stock' => 1],

            // XIAOMI / REDMI
            ['modelo' => 'Redmi A5',       'color' => 'Negro',       'estado' => 'Como nuevo',  'bateria' => 100, 'almacenamiento' => 64,  'ram' => 4,  'precio' => 109.95, 'stock' => 10],
            ['modelo' => 'Redmi A5',       'color' => 'Azul',        'estado' => 'Buen estado', 'bateria' => 90,  'almacenamiento' => 64,  'ram' => 4,  'precio' => 89.95,  'stock' => 12],
            ['modelo' => 'Redmi A5',       'color' => 'Verde',       'estado' => 'Funcional',   'bateria' => 80,  'almacenamiento' => 64,  'ram' => 3,  'precio' => 69.95,  'stock' => 5],

            ['modelo' => 'Redmi Note 13',  'color' => 'Negro',       'estado' => 'Como nuevo',  'bateria' => 100, 'almacenamiento' => 256, 'ram' => 8,  'precio' => 219.95, 'stock' => 6],
            ['modelo' => 'Redmi Note 13',  'color' => 'Azul',        'estado' => 'Buen estado', 'bateria' => 90,  'almacenamiento' => 128, 'ram' => 6,  'precio' => 179.95, 'stock' => 8],
            ['modelo' => 'Redmi Note 13',  'color' => 'Verde',       'estado' => 'Funcional',   'bateria' => 80,  'almacenamiento' => 128, 'ram' => 6,  'precio' => 139.95, 'stock' => 3],

            ['modelo' => 'Redmi Note 14',  'color' => 'Negro',       'estado' => 'Como nuevo',  'bateria' => 100, 'almacenamiento' => 256, 'ram' => 8,  'precio' => 259.95, 'stock' => 5],
            ['modelo' => 'Redmi Note 14',  'color' => 'Morado',      'estado' => 'Buen estado', 'bateria' => 90,  'almacenamiento' => 128, 'ram' => 8,  'precio' => 219.95, 'stock' => 6],
            ['modelo' => 'Redmi Note 14',  'color' => 'Verde salvia','estado' => 'Funcional',   'bateria' => 80,  'almacenamiento' => 128, 'ram' => 6,  'precio' => 169.95, 'stock' => 2],

            ['modelo' => 'Redmi Note 15',  'color' => 'Negro',       'estado' => 'Como nuevo',  'bateria' => 100, 'almacenamiento' => 256, 'ram' => 8,  'precio' => 299.95, 'stock' => 4],
            ['modelo' => 'Redmi Note 15',  'color' => 'Blanco',      'estado' => 'Buen estado', 'bateria' => 90,  'almacenamiento' => 256, 'ram' => 8,  'precio' => 259.95, 'stock' => 5],
            ['modelo' => 'Redmi Note 15',  'color' => 'Azul oscuro', 'estado' => 'Funcional',   'bateria' => 80,  'almacenamiento' => 128, 'ram' => 6,  'precio' => 199.95, 'stock' => 2],
        ];

        $created = 0;

        foreach ($moviles as $item) {
            if (!isset($modelos[$item['modelo']])) {
                $this->command->warn('Modelo no encontrado: ' . $item['modelo']);
                continue;
            }

            if (!isset($colores[$item['color']])) {
                $this->command->warn('Color no encontrado: ' . $item['color']);
                continue;
            }

            Movil::create([
                'modelo_id'      => $modelos[$item['modelo']],
                'color_id'       => $colores[$item['color']],
                'empresa_id'     => $empresaIds[array_rand($empresaIds)],
                'precio'         => $item['precio'],
                'estado'         => $item['estado'],
                'salud_bateria'  => $item['bateria'],
                'almacenamiento' => $item['almacenamiento'],
                'ram'            => $item['ram'],
                'stock'          => $item['stock'],
            ]);

            $created++;
        }

        $this->command->info("MovilSeeder: {$created} móviles insertados.");
    }
}
