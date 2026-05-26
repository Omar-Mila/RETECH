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
        $colores  = Color::pluck('id', 'nombre');

        /*
         * Solo combinaciones modelo+color que tienen imágenes en Cloudinary.
         * Cada par modelo+color cubre los 3 estados: Como nuevo / Buen estado / Funcional,
         * con variantes de almacenamiento para más opciones de compra.
         */
        $moviles = [

            // ──────────── APPLE ────────────

            // iPhone 15 → Amarillo, Azul, Negro, Verde
            ['modelo' => 'iPhone 15', 'color' => 'Negro',    'estado' => 'Como nuevo',  'bateria' => 100, 'almacenamiento' => 128, 'ram' => 6, 'precio' => 569.95, 'stock' => 4],
            ['modelo' => 'iPhone 15', 'color' => 'Negro',    'estado' => 'Como nuevo',  'bateria' => 100, 'almacenamiento' => 256, 'ram' => 6, 'precio' => 609.95, 'stock' => 2],
            ['modelo' => 'iPhone 15', 'color' => 'Negro',    'estado' => 'Buen estado', 'bateria' => 90,  'almacenamiento' => 128, 'ram' => 6, 'precio' => 499.95, 'stock' => 6],
            ['modelo' => 'iPhone 15', 'color' => 'Negro',    'estado' => 'Buen estado', 'bateria' => 90,  'almacenamiento' => 256, 'ram' => 6, 'precio' => 529.95, 'stock' => 3],
            ['modelo' => 'iPhone 15', 'color' => 'Negro',    'estado' => 'Funcional',   'bateria' => 80,  'almacenamiento' => 128, 'ram' => 6, 'precio' => 409.95, 'stock' => 3],
            ['modelo' => 'iPhone 15', 'color' => 'Negro',    'estado' => 'Funcional',   'bateria' => 80,  'almacenamiento' => 256, 'ram' => 6, 'precio' => 429.95, 'stock' => 2],

            ['modelo' => 'iPhone 15', 'color' => 'Azul',     'estado' => 'Como nuevo',  'bateria' => 100, 'almacenamiento' => 128, 'ram' => 6, 'precio' => 549.95, 'stock' => 5],
            ['modelo' => 'iPhone 15', 'color' => 'Azul',     'estado' => 'Como nuevo',  'bateria' => 100, 'almacenamiento' => 256, 'ram' => 6, 'precio' => 589.95, 'stock' => 2],
            ['modelo' => 'iPhone 15', 'color' => 'Azul',     'estado' => 'Buen estado', 'bateria' => 90,  'almacenamiento' => 128, 'ram' => 6, 'precio' => 479.95, 'stock' => 4],
            ['modelo' => 'iPhone 15', 'color' => 'Azul',     'estado' => 'Buen estado', 'bateria' => 90,  'almacenamiento' => 256, 'ram' => 6, 'precio' => 519.95, 'stock' => 3],
            ['modelo' => 'iPhone 15', 'color' => 'Azul',     'estado' => 'Funcional',   'bateria' => 80,  'almacenamiento' => 128, 'ram' => 6, 'precio' => 399.95, 'stock' => 2],

            ['modelo' => 'iPhone 15', 'color' => 'Verde',    'estado' => 'Como nuevo',  'bateria' => 100, 'almacenamiento' => 128, 'ram' => 6, 'precio' => 539.95, 'stock' => 3],
            ['modelo' => 'iPhone 15', 'color' => 'Verde',    'estado' => 'Como nuevo',  'bateria' => 100, 'almacenamiento' => 256, 'ram' => 6, 'precio' => 559.95, 'stock' => 2],
            ['modelo' => 'iPhone 15', 'color' => 'Verde',    'estado' => 'Buen estado', 'bateria' => 90,  'almacenamiento' => 128, 'ram' => 6, 'precio' => 469.95, 'stock' => 5],
            ['modelo' => 'iPhone 15', 'color' => 'Verde',    'estado' => 'Buen estado', 'bateria' => 90,  'almacenamiento' => 256, 'ram' => 6, 'precio' => 489.95, 'stock' => 3],
            ['modelo' => 'iPhone 15', 'color' => 'Verde',    'estado' => 'Funcional',   'bateria' => 80,  'almacenamiento' => 128, 'ram' => 6, 'precio' => 379.95, 'stock' => 2],

            ['modelo' => 'iPhone 15', 'color' => 'Amarillo', 'estado' => 'Como nuevo',  'bateria' => 100, 'almacenamiento' => 128, 'ram' => 6, 'precio' => 549.95, 'stock' => 3],
            ['modelo' => 'iPhone 15', 'color' => 'Amarillo', 'estado' => 'Como nuevo',  'bateria' => 100, 'almacenamiento' => 256, 'ram' => 6, 'precio' => 579.95, 'stock' => 2],
            ['modelo' => 'iPhone 15', 'color' => 'Amarillo', 'estado' => 'Buen estado', 'bateria' => 90,  'almacenamiento' => 128, 'ram' => 6, 'precio' => 479.95, 'stock' => 4],
            ['modelo' => 'iPhone 15', 'color' => 'Amarillo', 'estado' => 'Funcional',   'bateria' => 80,  'almacenamiento' => 128, 'ram' => 6, 'precio' => 389.95, 'stock' => 2],

            // iPhone 16 → Azul, Blanco, Negro, Rosa, Verde
            ['modelo' => 'iPhone 16', 'color' => 'Negro',  'estado' => 'Como nuevo',  'bateria' => 100, 'almacenamiento' => 128, 'ram' => 8, 'precio' => 719.95, 'stock' => 3],
            ['modelo' => 'iPhone 16', 'color' => 'Negro',  'estado' => 'Como nuevo',  'bateria' => 100, 'almacenamiento' => 256, 'ram' => 8, 'precio' => 769.95, 'stock' => 2],
            ['modelo' => 'iPhone 16', 'color' => 'Negro',  'estado' => 'Buen estado', 'bateria' => 90,  'almacenamiento' => 128, 'ram' => 8, 'precio' => 649.95, 'stock' => 4],
            ['modelo' => 'iPhone 16', 'color' => 'Negro',  'estado' => 'Buen estado', 'bateria' => 90,  'almacenamiento' => 256, 'ram' => 8, 'precio' => 679.95, 'stock' => 3],
            ['modelo' => 'iPhone 16', 'color' => 'Negro',  'estado' => 'Funcional',   'bateria' => 80,  'almacenamiento' => 128, 'ram' => 8, 'precio' => 549.95, 'stock' => 2],

            ['modelo' => 'iPhone 16', 'color' => 'Blanco', 'estado' => 'Como nuevo',  'bateria' => 100, 'almacenamiento' => 128, 'ram' => 8, 'precio' => 729.95, 'stock' => 3],
            ['modelo' => 'iPhone 16', 'color' => 'Blanco', 'estado' => 'Como nuevo',  'bateria' => 100, 'almacenamiento' => 256, 'ram' => 8, 'precio' => 749.95, 'stock' => 2],
            ['modelo' => 'iPhone 16', 'color' => 'Blanco', 'estado' => 'Buen estado', 'bateria' => 90,  'almacenamiento' => 128, 'ram' => 8, 'precio' => 659.95, 'stock' => 5],
            ['modelo' => 'iPhone 16', 'color' => 'Blanco', 'estado' => 'Buen estado', 'bateria' => 90,  'almacenamiento' => 256, 'ram' => 8, 'precio' => 689.95, 'stock' => 3],
            ['modelo' => 'iPhone 16', 'color' => 'Blanco', 'estado' => 'Funcional',   'bateria' => 80,  'almacenamiento' => 128, 'ram' => 8, 'precio' => 549.95, 'stock' => 2],

            ['modelo' => 'iPhone 16', 'color' => 'Azul',   'estado' => 'Como nuevo',  'bateria' => 100, 'almacenamiento' => 128, 'ram' => 8, 'precio' => 709.95, 'stock' => 4],
            ['modelo' => 'iPhone 16', 'color' => 'Azul',   'estado' => 'Como nuevo',  'bateria' => 100, 'almacenamiento' => 256, 'ram' => 8, 'precio' => 759.95, 'stock' => 2],
            ['modelo' => 'iPhone 16', 'color' => 'Azul',   'estado' => 'Buen estado', 'bateria' => 90,  'almacenamiento' => 128, 'ram' => 8, 'precio' => 639.95, 'stock' => 4],
            ['modelo' => 'iPhone 16', 'color' => 'Azul',   'estado' => 'Buen estado', 'bateria' => 90,  'almacenamiento' => 256, 'ram' => 8, 'precio' => 689.95, 'stock' => 2],
            ['modelo' => 'iPhone 16', 'color' => 'Azul',   'estado' => 'Funcional',   'bateria' => 80,  'almacenamiento' => 128, 'ram' => 8, 'precio' => 559.95, 'stock' => 2],

            ['modelo' => 'iPhone 16', 'color' => 'Rosa',   'estado' => 'Como nuevo',  'bateria' => 100, 'almacenamiento' => 128, 'ram' => 8, 'precio' => 699.95, 'stock' => 4],
            ['modelo' => 'iPhone 16', 'color' => 'Rosa',   'estado' => 'Como nuevo',  'bateria' => 100, 'almacenamiento' => 256, 'ram' => 8, 'precio' => 739.95, 'stock' => 2],
            ['modelo' => 'iPhone 16', 'color' => 'Rosa',   'estado' => 'Buen estado', 'bateria' => 90,  'almacenamiento' => 128, 'ram' => 8, 'precio' => 629.95, 'stock' => 3],
            ['modelo' => 'iPhone 16', 'color' => 'Rosa',   'estado' => 'Funcional',   'bateria' => 80,  'almacenamiento' => 128, 'ram' => 8, 'precio' => 539.95, 'stock' => 2],

            ['modelo' => 'iPhone 16', 'color' => 'Verde',  'estado' => 'Como nuevo',  'bateria' => 100, 'almacenamiento' => 128, 'ram' => 8, 'precio' => 719.95, 'stock' => 3],
            ['modelo' => 'iPhone 16', 'color' => 'Verde',  'estado' => 'Como nuevo',  'bateria' => 100, 'almacenamiento' => 256, 'ram' => 8, 'precio' => 739.95, 'stock' => 2],
            ['modelo' => 'iPhone 16', 'color' => 'Verde',  'estado' => 'Buen estado', 'bateria' => 90,  'almacenamiento' => 128, 'ram' => 8, 'precio' => 649.95, 'stock' => 4],
            ['modelo' => 'iPhone 16', 'color' => 'Verde',  'estado' => 'Funcional',   'bateria' => 80,  'almacenamiento' => 128, 'ram' => 8, 'precio' => 549.95, 'stock' => 2],

            // iPhone 16 Pro → Blanco, Gris, Negro, Oro
            ['modelo' => 'iPhone 16 Pro', 'color' => 'Negro',  'estado' => 'Como nuevo',  'bateria' => 100, 'almacenamiento' => 256, 'ram' => 8, 'precio' => 949.95,  'stock' => 2],
            ['modelo' => 'iPhone 16 Pro', 'color' => 'Negro',  'estado' => 'Como nuevo',  'bateria' => 100, 'almacenamiento' => 512, 'ram' => 8, 'precio' => 1049.95, 'stock' => 1],
            ['modelo' => 'iPhone 16 Pro', 'color' => 'Negro',  'estado' => 'Buen estado', 'bateria' => 90,  'almacenamiento' => 256, 'ram' => 8, 'precio' => 869.95,  'stock' => 3],
            ['modelo' => 'iPhone 16 Pro', 'color' => 'Negro',  'estado' => 'Buen estado', 'bateria' => 90,  'almacenamiento' => 512, 'ram' => 8, 'precio' => 949.95,  'stock' => 2],
            ['modelo' => 'iPhone 16 Pro', 'color' => 'Negro',  'estado' => 'Funcional',   'bateria' => 80,  'almacenamiento' => 256, 'ram' => 8, 'precio' => 769.95,  'stock' => 1],
            ['modelo' => 'iPhone 16 Pro', 'color' => 'Negro',  'estado' => 'Funcional',   'bateria' => 80,  'almacenamiento' => 512, 'ram' => 8, 'precio' => 829.95,  'stock' => 1],

            ['modelo' => 'iPhone 16 Pro', 'color' => 'Blanco', 'estado' => 'Como nuevo',  'bateria' => 100, 'almacenamiento' => 256, 'ram' => 8, 'precio' => 969.95,  'stock' => 2],
            ['modelo' => 'iPhone 16 Pro', 'color' => 'Blanco', 'estado' => 'Como nuevo',  'bateria' => 100, 'almacenamiento' => 512, 'ram' => 8, 'precio' => 1049.95, 'stock' => 1],
            ['modelo' => 'iPhone 16 Pro', 'color' => 'Blanco', 'estado' => 'Buen estado', 'bateria' => 90,  'almacenamiento' => 256, 'ram' => 8, 'precio' => 879.95,  'stock' => 3],
            ['modelo' => 'iPhone 16 Pro', 'color' => 'Blanco', 'estado' => 'Funcional',   'bateria' => 80,  'almacenamiento' => 256, 'ram' => 8, 'precio' => 779.95,  'stock' => 1],

            ['modelo' => 'iPhone 16 Pro', 'color' => 'Gris',   'estado' => 'Como nuevo',  'bateria' => 100, 'almacenamiento' => 256, 'ram' => 8, 'precio' => 959.95,  'stock' => 2],
            ['modelo' => 'iPhone 16 Pro', 'color' => 'Gris',   'estado' => 'Como nuevo',  'bateria' => 100, 'almacenamiento' => 512, 'ram' => 8, 'precio' => 1039.95, 'stock' => 1],
            ['modelo' => 'iPhone 16 Pro', 'color' => 'Gris',   'estado' => 'Buen estado', 'bateria' => 90,  'almacenamiento' => 256, 'ram' => 8, 'precio' => 869.95,  'stock' => 2],
            ['modelo' => 'iPhone 16 Pro', 'color' => 'Gris',   'estado' => 'Funcional',   'bateria' => 80,  'almacenamiento' => 256, 'ram' => 8, 'precio' => 769.95,  'stock' => 1],

            ['modelo' => 'iPhone 16 Pro', 'color' => 'Oro',    'estado' => 'Como nuevo',  'bateria' => 100, 'almacenamiento' => 256, 'ram' => 8, 'precio' => 969.95,  'stock' => 2],
            ['modelo' => 'iPhone 16 Pro', 'color' => 'Oro',    'estado' => 'Como nuevo',  'bateria' => 100, 'almacenamiento' => 512, 'ram' => 8, 'precio' => 1059.95, 'stock' => 1],
            ['modelo' => 'iPhone 16 Pro', 'color' => 'Oro',    'estado' => 'Buen estado', 'bateria' => 90,  'almacenamiento' => 256, 'ram' => 8, 'precio' => 889.95,  'stock' => 2],
            ['modelo' => 'iPhone 16 Pro', 'color' => 'Oro',    'estado' => 'Buen estado', 'bateria' => 90,  'almacenamiento' => 512, 'ram' => 8, 'precio' => 929.95,  'stock' => 1],
            ['modelo' => 'iPhone 16 Pro', 'color' => 'Oro',    'estado' => 'Funcional',   'bateria' => 80,  'almacenamiento' => 256, 'ram' => 8, 'precio' => 789.95,  'stock' => 1],

            // iPhone 17 → Azul niebla, Blanco, Negro, Verde salvia
            ['modelo' => 'iPhone 17', 'color' => 'Negro',       'estado' => 'Como nuevo',  'bateria' => 100, 'almacenamiento' => 128, 'ram' => 8, 'precio' => 899.95, 'stock' => 3],
            ['modelo' => 'iPhone 17', 'color' => 'Negro',       'estado' => 'Como nuevo',  'bateria' => 100, 'almacenamiento' => 256, 'ram' => 8, 'precio' => 949.95, 'stock' => 2],
            ['modelo' => 'iPhone 17', 'color' => 'Negro',       'estado' => 'Buen estado', 'bateria' => 90,  'almacenamiento' => 128, 'ram' => 8, 'precio' => 819.95, 'stock' => 4],
            ['modelo' => 'iPhone 17', 'color' => 'Negro',       'estado' => 'Buen estado', 'bateria' => 90,  'almacenamiento' => 256, 'ram' => 8, 'precio' => 849.95, 'stock' => 2],
            ['modelo' => 'iPhone 17', 'color' => 'Negro',       'estado' => 'Funcional',   'bateria' => 80,  'almacenamiento' => 128, 'ram' => 8, 'precio' => 699.95, 'stock' => 2],

            ['modelo' => 'iPhone 17', 'color' => 'Blanco',      'estado' => 'Como nuevo',  'bateria' => 100, 'almacenamiento' => 128, 'ram' => 8, 'precio' => 909.95, 'stock' => 3],
            ['modelo' => 'iPhone 17', 'color' => 'Blanco',      'estado' => 'Como nuevo',  'bateria' => 100, 'almacenamiento' => 256, 'ram' => 8, 'precio' => 929.95, 'stock' => 2],
            ['modelo' => 'iPhone 17', 'color' => 'Blanco',      'estado' => 'Buen estado', 'bateria' => 90,  'almacenamiento' => 128, 'ram' => 8, 'precio' => 829.95, 'stock' => 4],
            ['modelo' => 'iPhone 17', 'color' => 'Blanco',      'estado' => 'Funcional',   'bateria' => 80,  'almacenamiento' => 128, 'ram' => 8, 'precio' => 699.95, 'stock' => 2],

            ['modelo' => 'iPhone 17', 'color' => 'Azul niebla', 'estado' => 'Como nuevo',  'bateria' => 100, 'almacenamiento' => 128, 'ram' => 8, 'precio' => 899.95, 'stock' => 2],
            ['modelo' => 'iPhone 17', 'color' => 'Azul niebla', 'estado' => 'Como nuevo',  'bateria' => 100, 'almacenamiento' => 256, 'ram' => 8, 'precio' => 919.95, 'stock' => 2],
            ['modelo' => 'iPhone 17', 'color' => 'Azul niebla', 'estado' => 'Buen estado', 'bateria' => 90,  'almacenamiento' => 128, 'ram' => 8, 'precio' => 819.95, 'stock' => 3],
            ['modelo' => 'iPhone 17', 'color' => 'Azul niebla', 'estado' => 'Buen estado', 'bateria' => 90,  'almacenamiento' => 256, 'ram' => 8, 'precio' => 839.95, 'stock' => 2],
            ['modelo' => 'iPhone 17', 'color' => 'Azul niebla', 'estado' => 'Funcional',   'bateria' => 80,  'almacenamiento' => 128, 'ram' => 8, 'precio' => 699.95, 'stock' => 1],

            ['modelo' => 'iPhone 17', 'color' => 'Verde salvia','estado' => 'Como nuevo',  'bateria' => 100, 'almacenamiento' => 128, 'ram' => 8, 'precio' => 889.95, 'stock' => 2],
            ['modelo' => 'iPhone 17', 'color' => 'Verde salvia','estado' => 'Como nuevo',  'bateria' => 100, 'almacenamiento' => 256, 'ram' => 8, 'precio' => 909.95, 'stock' => 2],
            ['modelo' => 'iPhone 17', 'color' => 'Verde salvia','estado' => 'Buen estado', 'bateria' => 90,  'almacenamiento' => 128, 'ram' => 8, 'precio' => 809.95, 'stock' => 3],
            ['modelo' => 'iPhone 17', 'color' => 'Verde salvia','estado' => 'Buen estado', 'bateria' => 90,  'almacenamiento' => 256, 'ram' => 8, 'precio' => 869.95, 'stock' => 2],
            ['modelo' => 'iPhone 17', 'color' => 'Verde salvia','estado' => 'Funcional',   'bateria' => 80,  'almacenamiento' => 128, 'ram' => 8, 'precio' => 719.95, 'stock' => 2],

            // iPhone 17 Pro → Azul oscuro, Naranja, Plata
            ['modelo' => 'iPhone 17 Pro', 'color' => 'Plata',      'estado' => 'Como nuevo',  'bateria' => 100, 'almacenamiento' => 256, 'ram' => 8, 'precio' => 1099.95, 'stock' => 2],
            ['modelo' => 'iPhone 17 Pro', 'color' => 'Plata',      'estado' => 'Como nuevo',  'bateria' => 100, 'almacenamiento' => 512, 'ram' => 8, 'precio' => 1199.95, 'stock' => 1],
            ['modelo' => 'iPhone 17 Pro', 'color' => 'Plata',      'estado' => 'Buen estado', 'bateria' => 90,  'almacenamiento' => 256, 'ram' => 8, 'precio' => 999.95,  'stock' => 2],
            ['modelo' => 'iPhone 17 Pro', 'color' => 'Plata',      'estado' => 'Buen estado', 'bateria' => 90,  'almacenamiento' => 512, 'ram' => 8, 'precio' => 1049.95, 'stock' => 2],
            ['modelo' => 'iPhone 17 Pro', 'color' => 'Plata',      'estado' => 'Funcional',   'bateria' => 80,  'almacenamiento' => 256, 'ram' => 8, 'precio' => 899.95,  'stock' => 1],

            ['modelo' => 'iPhone 17 Pro', 'color' => 'Naranja',    'estado' => 'Como nuevo',  'bateria' => 100, 'almacenamiento' => 256, 'ram' => 8, 'precio' => 1099.95, 'stock' => 2],
            ['modelo' => 'iPhone 17 Pro', 'color' => 'Naranja',    'estado' => 'Como nuevo',  'bateria' => 100, 'almacenamiento' => 512, 'ram' => 8, 'precio' => 1149.95, 'stock' => 1],
            ['modelo' => 'iPhone 17 Pro', 'color' => 'Naranja',    'estado' => 'Buen estado', 'bateria' => 90,  'almacenamiento' => 256, 'ram' => 8, 'precio' => 1009.95, 'stock' => 2],
            ['modelo' => 'iPhone 17 Pro', 'color' => 'Naranja',    'estado' => 'Buen estado', 'bateria' => 90,  'almacenamiento' => 512, 'ram' => 8, 'precio' => 1049.95, 'stock' => 1],
            ['modelo' => 'iPhone 17 Pro', 'color' => 'Naranja',    'estado' => 'Funcional',   'bateria' => 80,  'almacenamiento' => 256, 'ram' => 8, 'precio' => 879.95,  'stock' => 1],

            ['modelo' => 'iPhone 17 Pro', 'color' => 'Azul oscuro','estado' => 'Como nuevo',  'bateria' => 100, 'almacenamiento' => 256, 'ram' => 8, 'precio' => 1079.95, 'stock' => 2],
            ['modelo' => 'iPhone 17 Pro', 'color' => 'Azul oscuro','estado' => 'Como nuevo',  'bateria' => 100, 'almacenamiento' => 512, 'ram' => 8, 'precio' => 1179.95, 'stock' => 1],
            ['modelo' => 'iPhone 17 Pro', 'color' => 'Azul oscuro','estado' => 'Buen estado', 'bateria' => 90,  'almacenamiento' => 256, 'ram' => 8, 'precio' => 999.95,  'stock' => 3],
            ['modelo' => 'iPhone 17 Pro', 'color' => 'Azul oscuro','estado' => 'Buen estado', 'bateria' => 90,  'almacenamiento' => 512, 'ram' => 8, 'precio' => 1039.95, 'stock' => 2],
            ['modelo' => 'iPhone 17 Pro', 'color' => 'Azul oscuro','estado' => 'Funcional',   'bateria' => 80,  'almacenamiento' => 256, 'ram' => 8, 'precio' => 879.95,  'stock' => 1],
            ['modelo' => 'iPhone 17 Pro', 'color' => 'Azul oscuro','estado' => 'Funcional',   'bateria' => 80,  'almacenamiento' => 512, 'ram' => 8, 'precio' => 919.95,  'stock' => 1],

            // iPhone Air → solo Blanco tiene imagen
            ['modelo' => 'iPhone Air', 'color' => 'Blanco', 'estado' => 'Como nuevo',  'bateria' => 100, 'almacenamiento' => 128, 'ram' => 8, 'precio' => 779.95, 'stock' => 2],
            ['modelo' => 'iPhone Air', 'color' => 'Blanco', 'estado' => 'Como nuevo',  'bateria' => 100, 'almacenamiento' => 256, 'ram' => 8, 'precio' => 799.95, 'stock' => 2],
            ['modelo' => 'iPhone Air', 'color' => 'Blanco', 'estado' => 'Buen estado', 'bateria' => 90,  'almacenamiento' => 128, 'ram' => 8, 'precio' => 699.95, 'stock' => 3],
            ['modelo' => 'iPhone Air', 'color' => 'Blanco', 'estado' => 'Buen estado', 'bateria' => 90,  'almacenamiento' => 256, 'ram' => 8, 'precio' => 729.95, 'stock' => 2],
            ['modelo' => 'iPhone Air', 'color' => 'Blanco', 'estado' => 'Funcional',   'bateria' => 80,  'almacenamiento' => 128, 'ram' => 8, 'precio' => 609.95, 'stock' => 1],
            ['modelo' => 'iPhone Air', 'color' => 'Blanco', 'estado' => 'Funcional',   'bateria' => 80,  'almacenamiento' => 256, 'ram' => 8, 'precio' => 639.95, 'stock' => 1],

            // ──────────── SAMSUNG ────────────

            // Galaxy A16 → Gris, Negro, Verde
            ['modelo' => 'Galaxy A16', 'color' => 'Negro', 'estado' => 'Como nuevo',  'bateria' => 100, 'almacenamiento' => 128, 'ram' => 4, 'precio' => 189.95, 'stock' => 8],
            ['modelo' => 'Galaxy A16', 'color' => 'Negro', 'estado' => 'Buen estado', 'bateria' => 90,  'almacenamiento' => 128, 'ram' => 4, 'precio' => 159.95, 'stock' => 10],
            ['modelo' => 'Galaxy A16', 'color' => 'Negro', 'estado' => 'Funcional',   'bateria' => 80,  'almacenamiento' => 64,  'ram' => 4, 'precio' => 119.95, 'stock' => 5],
            ['modelo' => 'Galaxy A16', 'color' => 'Negro', 'estado' => 'Funcional',   'bateria' => 80,  'almacenamiento' => 128, 'ram' => 4, 'precio' => 134.95, 'stock' => 4],

            ['modelo' => 'Galaxy A16', 'color' => 'Gris',  'estado' => 'Como nuevo',  'bateria' => 100, 'almacenamiento' => 128, 'ram' => 4, 'precio' => 184.95, 'stock' => 7],
            ['modelo' => 'Galaxy A16', 'color' => 'Gris',  'estado' => 'Buen estado', 'bateria' => 90,  'almacenamiento' => 64,  'ram' => 4, 'precio' => 144.95, 'stock' => 9],
            ['modelo' => 'Galaxy A16', 'color' => 'Gris',  'estado' => 'Buen estado', 'bateria' => 90,  'almacenamiento' => 128, 'ram' => 4, 'precio' => 154.95, 'stock' => 6],
            ['modelo' => 'Galaxy A16', 'color' => 'Gris',  'estado' => 'Funcional',   'bateria' => 80,  'almacenamiento' => 64,  'ram' => 4, 'precio' => 114.95, 'stock' => 4],

            ['modelo' => 'Galaxy A16', 'color' => 'Verde', 'estado' => 'Como nuevo',  'bateria' => 100, 'almacenamiento' => 128, 'ram' => 4, 'precio' => 179.95, 'stock' => 6],
            ['modelo' => 'Galaxy A16', 'color' => 'Verde', 'estado' => 'Buen estado', 'bateria' => 90,  'almacenamiento' => 128, 'ram' => 4, 'precio' => 154.95, 'stock' => 7],
            ['modelo' => 'Galaxy A16', 'color' => 'Verde', 'estado' => 'Funcional',   'bateria' => 80,  'almacenamiento' => 64,  'ram' => 4, 'precio' => 109.95, 'stock' => 4],

            // Galaxy A56 → Gris, Negro, Verde
            ['modelo' => 'Galaxy A56', 'color' => 'Negro', 'estado' => 'Como nuevo',  'bateria' => 100, 'almacenamiento' => 128, 'ram' => 8, 'precio' => 369.95, 'stock' => 5],
            ['modelo' => 'Galaxy A56', 'color' => 'Negro', 'estado' => 'Como nuevo',  'bateria' => 100, 'almacenamiento' => 256, 'ram' => 8, 'precio' => 389.95, 'stock' => 3],
            ['modelo' => 'Galaxy A56', 'color' => 'Negro', 'estado' => 'Buen estado', 'bateria' => 90,  'almacenamiento' => 128, 'ram' => 8, 'precio' => 319.95, 'stock' => 6],
            ['modelo' => 'Galaxy A56', 'color' => 'Negro', 'estado' => 'Buen estado', 'bateria' => 90,  'almacenamiento' => 256, 'ram' => 8, 'precio' => 329.95, 'stock' => 4],
            ['modelo' => 'Galaxy A56', 'color' => 'Negro', 'estado' => 'Funcional',   'bateria' => 80,  'almacenamiento' => 128, 'ram' => 8, 'precio' => 259.95, 'stock' => 2],

            ['modelo' => 'Galaxy A56', 'color' => 'Gris',  'estado' => 'Como nuevo',  'bateria' => 100, 'almacenamiento' => 128, 'ram' => 8, 'precio' => 359.95, 'stock' => 4],
            ['modelo' => 'Galaxy A56', 'color' => 'Gris',  'estado' => 'Como nuevo',  'bateria' => 100, 'almacenamiento' => 256, 'ram' => 8, 'precio' => 379.95, 'stock' => 3],
            ['modelo' => 'Galaxy A56', 'color' => 'Gris',  'estado' => 'Buen estado', 'bateria' => 90,  'almacenamiento' => 128, 'ram' => 8, 'precio' => 309.95, 'stock' => 5],
            ['modelo' => 'Galaxy A56', 'color' => 'Gris',  'estado' => 'Buen estado', 'bateria' => 90,  'almacenamiento' => 256, 'ram' => 8, 'precio' => 349.95, 'stock' => 4],
            ['modelo' => 'Galaxy A56', 'color' => 'Gris',  'estado' => 'Funcional',   'bateria' => 80,  'almacenamiento' => 128, 'ram' => 8, 'precio' => 259.95, 'stock' => 2],

            ['modelo' => 'Galaxy A56', 'color' => 'Verde', 'estado' => 'Como nuevo',  'bateria' => 100, 'almacenamiento' => 128, 'ram' => 8, 'precio' => 349.95, 'stock' => 4],
            ['modelo' => 'Galaxy A56', 'color' => 'Verde', 'estado' => 'Como nuevo',  'bateria' => 100, 'almacenamiento' => 256, 'ram' => 8, 'precio' => 369.95, 'stock' => 3],
            ['modelo' => 'Galaxy A56', 'color' => 'Verde', 'estado' => 'Buen estado', 'bateria' => 90,  'almacenamiento' => 128, 'ram' => 8, 'precio' => 299.95, 'stock' => 6],
            ['modelo' => 'Galaxy A56', 'color' => 'Verde', 'estado' => 'Buen estado', 'bateria' => 90,  'almacenamiento' => 256, 'ram' => 8, 'precio' => 339.95, 'stock' => 4],
            ['modelo' => 'Galaxy A56', 'color' => 'Verde', 'estado' => 'Funcional',   'bateria' => 80,  'almacenamiento' => 128, 'ram' => 8, 'precio' => 249.95, 'stock' => 2],

            // Galaxy S25 → Azul, Gris, Negro
            ['modelo' => 'Galaxy S25', 'color' => 'Negro', 'estado' => 'Como nuevo',  'bateria' => 100, 'almacenamiento' => 128, 'ram' => 12, 'precio' => 739.95, 'stock' => 3],
            ['modelo' => 'Galaxy S25', 'color' => 'Negro', 'estado' => 'Como nuevo',  'bateria' => 100, 'almacenamiento' => 256, 'ram' => 12, 'precio' => 759.95, 'stock' => 2],
            ['modelo' => 'Galaxy S25', 'color' => 'Negro', 'estado' => 'Buen estado', 'bateria' => 90,  'almacenamiento' => 128, 'ram' => 12, 'precio' => 659.95, 'stock' => 4],
            ['modelo' => 'Galaxy S25', 'color' => 'Negro', 'estado' => 'Buen estado', 'bateria' => 90,  'almacenamiento' => 256, 'ram' => 12, 'precio' => 699.95, 'stock' => 3],
            ['modelo' => 'Galaxy S25', 'color' => 'Negro', 'estado' => 'Funcional',   'bateria' => 80,  'almacenamiento' => 128, 'ram' => 12, 'precio' => 579.95, 'stock' => 1],

            ['modelo' => 'Galaxy S25', 'color' => 'Azul',  'estado' => 'Como nuevo',  'bateria' => 100, 'almacenamiento' => 128, 'ram' => 12, 'precio' => 729.95, 'stock' => 3],
            ['modelo' => 'Galaxy S25', 'color' => 'Azul',  'estado' => 'Como nuevo',  'bateria' => 100, 'almacenamiento' => 256, 'ram' => 12, 'precio' => 749.95, 'stock' => 2],
            ['modelo' => 'Galaxy S25', 'color' => 'Azul',  'estado' => 'Buen estado', 'bateria' => 90,  'almacenamiento' => 128, 'ram' => 12, 'precio' => 649.95, 'stock' => 4],
            ['modelo' => 'Galaxy S25', 'color' => 'Azul',  'estado' => 'Buen estado', 'bateria' => 90,  'almacenamiento' => 256, 'ram' => 12, 'precio' => 669.95, 'stock' => 3],
            ['modelo' => 'Galaxy S25', 'color' => 'Azul',  'estado' => 'Funcional',   'bateria' => 80,  'almacenamiento' => 128, 'ram' => 12, 'precio' => 569.95, 'stock' => 1],

            ['modelo' => 'Galaxy S25', 'color' => 'Gris',  'estado' => 'Como nuevo',  'bateria' => 100, 'almacenamiento' => 128, 'ram' => 12, 'precio' => 719.95, 'stock' => 2],
            ['modelo' => 'Galaxy S25', 'color' => 'Gris',  'estado' => 'Como nuevo',  'bateria' => 100, 'almacenamiento' => 256, 'ram' => 12, 'precio' => 739.95, 'stock' => 2],
            ['modelo' => 'Galaxy S25', 'color' => 'Gris',  'estado' => 'Buen estado', 'bateria' => 90,  'almacenamiento' => 128, 'ram' => 12, 'precio' => 639.95, 'stock' => 3],
            ['modelo' => 'Galaxy S25', 'color' => 'Gris',  'estado' => 'Buen estado', 'bateria' => 90,  'almacenamiento' => 256, 'ram' => 12, 'precio' => 659.95, 'stock' => 2],
            ['modelo' => 'Galaxy S25', 'color' => 'Gris',  'estado' => 'Funcional',   'bateria' => 80,  'almacenamiento' => 128, 'ram' => 12, 'precio' => 559.95, 'stock' => 1],

            // Galaxy Z Flip → Blanco, Negro
            ['modelo' => 'Galaxy Z Flip', 'color' => 'Negro',  'estado' => 'Como nuevo',  'bateria' => 100, 'almacenamiento' => 256, 'ram' => 12, 'precio' => 849.95, 'stock' => 2],
            ['modelo' => 'Galaxy Z Flip', 'color' => 'Negro',  'estado' => 'Buen estado', 'bateria' => 90,  'almacenamiento' => 256, 'ram' => 12, 'precio' => 779.95, 'stock' => 3],
            ['modelo' => 'Galaxy Z Flip', 'color' => 'Negro',  'estado' => 'Funcional',   'bateria' => 80,  'almacenamiento' => 128, 'ram' => 8,  'precio' => 629.95, 'stock' => 1],
            ['modelo' => 'Galaxy Z Flip', 'color' => 'Negro',  'estado' => 'Funcional',   'bateria' => 80,  'almacenamiento' => 256, 'ram' => 12, 'precio' => 649.95, 'stock' => 1],

            ['modelo' => 'Galaxy Z Flip', 'color' => 'Blanco', 'estado' => 'Como nuevo',  'bateria' => 100, 'almacenamiento' => 256, 'ram' => 12, 'precio' => 859.95, 'stock' => 2],
            ['modelo' => 'Galaxy Z Flip', 'color' => 'Blanco', 'estado' => 'Buen estado', 'bateria' => 90,  'almacenamiento' => 256, 'ram' => 12, 'precio' => 789.95, 'stock' => 3],
            ['modelo' => 'Galaxy Z Flip', 'color' => 'Blanco', 'estado' => 'Funcional',   'bateria' => 80,  'almacenamiento' => 128, 'ram' => 8,  'precio' => 639.95, 'stock' => 1],

            // ──────────── GOOGLE ────────────

            // Google Pixel 7 Pro → Blanco, Gris, Negro
            ['modelo' => 'Google Pixel 7 Pro', 'color' => 'Negro',  'estado' => 'Como nuevo',  'bateria' => 100, 'almacenamiento' => 128, 'ram' => 12, 'precio' => 399.95, 'stock' => 4],
            ['modelo' => 'Google Pixel 7 Pro', 'color' => 'Negro',  'estado' => 'Como nuevo',  'bateria' => 100, 'almacenamiento' => 256, 'ram' => 12, 'precio' => 429.95, 'stock' => 2],
            ['modelo' => 'Google Pixel 7 Pro', 'color' => 'Negro',  'estado' => 'Buen estado', 'bateria' => 90,  'almacenamiento' => 128, 'ram' => 12, 'precio' => 349.95, 'stock' => 3],
            ['modelo' => 'Google Pixel 7 Pro', 'color' => 'Negro',  'estado' => 'Buen estado', 'bateria' => 90,  'almacenamiento' => 256, 'ram' => 12, 'precio' => 369.95, 'stock' => 2],
            ['modelo' => 'Google Pixel 7 Pro', 'color' => 'Negro',  'estado' => 'Funcional',   'bateria' => 80,  'almacenamiento' => 128, 'ram' => 12, 'precio' => 279.95, 'stock' => 2],

            ['modelo' => 'Google Pixel 7 Pro', 'color' => 'Gris',   'estado' => 'Como nuevo',  'bateria' => 100, 'almacenamiento' => 128, 'ram' => 12, 'precio' => 389.95, 'stock' => 3],
            ['modelo' => 'Google Pixel 7 Pro', 'color' => 'Gris',   'estado' => 'Como nuevo',  'bateria' => 100, 'almacenamiento' => 256, 'ram' => 12, 'precio' => 409.95, 'stock' => 2],
            ['modelo' => 'Google Pixel 7 Pro', 'color' => 'Gris',   'estado' => 'Buen estado', 'bateria' => 90,  'almacenamiento' => 128, 'ram' => 12, 'precio' => 339.95, 'stock' => 4],
            ['modelo' => 'Google Pixel 7 Pro', 'color' => 'Gris',   'estado' => 'Buen estado', 'bateria' => 90,  'almacenamiento' => 256, 'ram' => 12, 'precio' => 359.95, 'stock' => 3],
            ['modelo' => 'Google Pixel 7 Pro', 'color' => 'Gris',   'estado' => 'Funcional',   'bateria' => 80,  'almacenamiento' => 128, 'ram' => 12, 'precio' => 269.95, 'stock' => 2],

            ['modelo' => 'Google Pixel 7 Pro', 'color' => 'Blanco', 'estado' => 'Como nuevo',  'bateria' => 100, 'almacenamiento' => 128, 'ram' => 12, 'precio' => 394.95, 'stock' => 3],
            ['modelo' => 'Google Pixel 7 Pro', 'color' => 'Blanco', 'estado' => 'Buen estado', 'bateria' => 90,  'almacenamiento' => 128, 'ram' => 12, 'precio' => 349.95, 'stock' => 3],
            ['modelo' => 'Google Pixel 7 Pro', 'color' => 'Blanco', 'estado' => 'Buen estado', 'bateria' => 90,  'almacenamiento' => 256, 'ram' => 12, 'precio' => 369.95, 'stock' => 2],
            ['modelo' => 'Google Pixel 7 Pro', 'color' => 'Blanco', 'estado' => 'Funcional',   'bateria' => 80,  'almacenamiento' => 128, 'ram' => 12, 'precio' => 269.95, 'stock' => 2],

            // Google Pixel 8 Pro → Azul, Blanco, Negro
            ['modelo' => 'Google Pixel 8 Pro', 'color' => 'Negro',  'estado' => 'Como nuevo',  'bateria' => 100, 'almacenamiento' => 128, 'ram' => 12, 'precio' => 529.95, 'stock' => 3],
            ['modelo' => 'Google Pixel 8 Pro', 'color' => 'Negro',  'estado' => 'Como nuevo',  'bateria' => 100, 'almacenamiento' => 256, 'ram' => 12, 'precio' => 569.95, 'stock' => 2],
            ['modelo' => 'Google Pixel 8 Pro', 'color' => 'Negro',  'estado' => 'Buen estado', 'bateria' => 90,  'almacenamiento' => 128, 'ram' => 12, 'precio' => 469.95, 'stock' => 4],
            ['modelo' => 'Google Pixel 8 Pro', 'color' => 'Negro',  'estado' => 'Buen estado', 'bateria' => 90,  'almacenamiento' => 256, 'ram' => 12, 'precio' => 489.95, 'stock' => 3],
            ['modelo' => 'Google Pixel 8 Pro', 'color' => 'Negro',  'estado' => 'Funcional',   'bateria' => 80,  'almacenamiento' => 128, 'ram' => 12, 'precio' => 379.95, 'stock' => 2],

            ['modelo' => 'Google Pixel 8 Pro', 'color' => 'Azul',   'estado' => 'Como nuevo',  'bateria' => 100, 'almacenamiento' => 128, 'ram' => 12, 'precio' => 519.95, 'stock' => 3],
            ['modelo' => 'Google Pixel 8 Pro', 'color' => 'Azul',   'estado' => 'Como nuevo',  'bateria' => 100, 'almacenamiento' => 256, 'ram' => 12, 'precio' => 549.95, 'stock' => 2],
            ['modelo' => 'Google Pixel 8 Pro', 'color' => 'Azul',   'estado' => 'Buen estado', 'bateria' => 90,  'almacenamiento' => 128, 'ram' => 12, 'precio' => 459.95, 'stock' => 4],
            ['modelo' => 'Google Pixel 8 Pro', 'color' => 'Azul',   'estado' => 'Buen estado', 'bateria' => 90,  'almacenamiento' => 256, 'ram' => 12, 'precio' => 479.95, 'stock' => 3],
            ['modelo' => 'Google Pixel 8 Pro', 'color' => 'Azul',   'estado' => 'Funcional',   'bateria' => 80,  'almacenamiento' => 128, 'ram' => 12, 'precio' => 369.95, 'stock' => 2],

            ['modelo' => 'Google Pixel 8 Pro', 'color' => 'Blanco', 'estado' => 'Como nuevo',  'bateria' => 100, 'almacenamiento' => 128, 'ram' => 12, 'precio' => 519.95, 'stock' => 3],
            ['modelo' => 'Google Pixel 8 Pro', 'color' => 'Blanco', 'estado' => 'Como nuevo',  'bateria' => 100, 'almacenamiento' => 256, 'ram' => 12, 'precio' => 549.95, 'stock' => 2],
            ['modelo' => 'Google Pixel 8 Pro', 'color' => 'Blanco', 'estado' => 'Buen estado', 'bateria' => 90,  'almacenamiento' => 128, 'ram' => 12, 'precio' => 459.95, 'stock' => 3],
            ['modelo' => 'Google Pixel 8 Pro', 'color' => 'Blanco', 'estado' => 'Buen estado', 'bateria' => 90,  'almacenamiento' => 256, 'ram' => 12, 'precio' => 499.95, 'stock' => 2],
            ['modelo' => 'Google Pixel 8 Pro', 'color' => 'Blanco', 'estado' => 'Funcional',   'bateria' => 80,  'almacenamiento' => 128, 'ram' => 12, 'precio' => 369.95, 'stock' => 2],

            // Google Pixel 9 Pro → Beige, Negro
            ['modelo' => 'Google Pixel 9 Pro', 'color' => 'Negro', 'estado' => 'Como nuevo',  'bateria' => 100, 'almacenamiento' => 128, 'ram' => 16, 'precio' => 699.95, 'stock' => 2],
            ['modelo' => 'Google Pixel 9 Pro', 'color' => 'Negro', 'estado' => 'Como nuevo',  'bateria' => 100, 'almacenamiento' => 256, 'ram' => 16, 'precio' => 719.95, 'stock' => 2],
            ['modelo' => 'Google Pixel 9 Pro', 'color' => 'Negro', 'estado' => 'Buen estado', 'bateria' => 90,  'almacenamiento' => 128, 'ram' => 16, 'precio' => 619.95, 'stock' => 3],
            ['modelo' => 'Google Pixel 9 Pro', 'color' => 'Negro', 'estado' => 'Buen estado', 'bateria' => 90,  'almacenamiento' => 256, 'ram' => 16, 'precio' => 649.95, 'stock' => 2],
            ['modelo' => 'Google Pixel 9 Pro', 'color' => 'Negro', 'estado' => 'Funcional',   'bateria' => 80,  'almacenamiento' => 128, 'ram' => 16, 'precio' => 529.95, 'stock' => 1],

            ['modelo' => 'Google Pixel 9 Pro', 'color' => 'Beige', 'estado' => 'Como nuevo',  'bateria' => 100, 'almacenamiento' => 128, 'ram' => 16, 'precio' => 709.95, 'stock' => 2],
            ['modelo' => 'Google Pixel 9 Pro', 'color' => 'Beige', 'estado' => 'Como nuevo',  'bateria' => 100, 'almacenamiento' => 256, 'ram' => 16, 'precio' => 729.95, 'stock' => 1],
            ['modelo' => 'Google Pixel 9 Pro', 'color' => 'Beige', 'estado' => 'Buen estado', 'bateria' => 90,  'almacenamiento' => 128, 'ram' => 16, 'precio' => 629.95, 'stock' => 3],
            ['modelo' => 'Google Pixel 9 Pro', 'color' => 'Beige', 'estado' => 'Buen estado', 'bateria' => 90,  'almacenamiento' => 256, 'ram' => 16, 'precio' => 659.95, 'stock' => 2],
            ['modelo' => 'Google Pixel 9 Pro', 'color' => 'Beige', 'estado' => 'Funcional',   'bateria' => 80,  'almacenamiento' => 128, 'ram' => 16, 'precio' => 539.95, 'stock' => 1],

            // Google Pixel 10 Pro → Blanco, Gris, Negro, Verde
            ['modelo' => 'Google Pixel 10 Pro', 'color' => 'Negro',  'estado' => 'Como nuevo',  'bateria' => 100, 'almacenamiento' => 128, 'ram' => 16, 'precio' => 879.95, 'stock' => 2],
            ['modelo' => 'Google Pixel 10 Pro', 'color' => 'Negro',  'estado' => 'Como nuevo',  'bateria' => 100, 'almacenamiento' => 256, 'ram' => 16, 'precio' => 899.95, 'stock' => 2],
            ['modelo' => 'Google Pixel 10 Pro', 'color' => 'Negro',  'estado' => 'Buen estado', 'bateria' => 90,  'almacenamiento' => 128, 'ram' => 16, 'precio' => 779.95, 'stock' => 3],
            ['modelo' => 'Google Pixel 10 Pro', 'color' => 'Negro',  'estado' => 'Buen estado', 'bateria' => 90,  'almacenamiento' => 256, 'ram' => 16, 'precio' => 799.95, 'stock' => 2],
            ['modelo' => 'Google Pixel 10 Pro', 'color' => 'Negro',  'estado' => 'Funcional',   'bateria' => 80,  'almacenamiento' => 128, 'ram' => 16, 'precio' => 679.95, 'stock' => 1],

            ['modelo' => 'Google Pixel 10 Pro', 'color' => 'Blanco', 'estado' => 'Como nuevo',  'bateria' => 100, 'almacenamiento' => 128, 'ram' => 16, 'precio' => 869.95, 'stock' => 2],
            ['modelo' => 'Google Pixel 10 Pro', 'color' => 'Blanco', 'estado' => 'Como nuevo',  'bateria' => 100, 'almacenamiento' => 256, 'ram' => 16, 'precio' => 879.95, 'stock' => 2],
            ['modelo' => 'Google Pixel 10 Pro', 'color' => 'Blanco', 'estado' => 'Buen estado', 'bateria' => 90,  'almacenamiento' => 128, 'ram' => 16, 'precio' => 769.95, 'stock' => 3],
            ['modelo' => 'Google Pixel 10 Pro', 'color' => 'Blanco', 'estado' => 'Buen estado', 'bateria' => 90,  'almacenamiento' => 256, 'ram' => 16, 'precio' => 849.95, 'stock' => 2],
            ['modelo' => 'Google Pixel 10 Pro', 'color' => 'Blanco', 'estado' => 'Funcional',   'bateria' => 80,  'almacenamiento' => 128, 'ram' => 16, 'precio' => 669.95, 'stock' => 1],

            ['modelo' => 'Google Pixel 10 Pro', 'color' => 'Gris',   'estado' => 'Como nuevo',  'bateria' => 100, 'almacenamiento' => 128, 'ram' => 16, 'precio' => 869.95, 'stock' => 2],
            ['modelo' => 'Google Pixel 10 Pro', 'color' => 'Gris',   'estado' => 'Como nuevo',  'bateria' => 100, 'almacenamiento' => 256, 'ram' => 16, 'precio' => 889.95, 'stock' => 2],
            ['modelo' => 'Google Pixel 10 Pro', 'color' => 'Gris',   'estado' => 'Buen estado', 'bateria' => 90,  'almacenamiento' => 128, 'ram' => 16, 'precio' => 769.95, 'stock' => 2],
            ['modelo' => 'Google Pixel 10 Pro', 'color' => 'Gris',   'estado' => 'Buen estado', 'bateria' => 90,  'almacenamiento' => 256, 'ram' => 16, 'precio' => 839.95, 'stock' => 2],
            ['modelo' => 'Google Pixel 10 Pro', 'color' => 'Gris',   'estado' => 'Funcional',   'bateria' => 80,  'almacenamiento' => 128, 'ram' => 16, 'precio' => 659.95, 'stock' => 1],

            ['modelo' => 'Google Pixel 10 Pro', 'color' => 'Verde',  'estado' => 'Como nuevo',  'bateria' => 100, 'almacenamiento' => 128, 'ram' => 16, 'precio' => 879.95, 'stock' => 2],
            ['modelo' => 'Google Pixel 10 Pro', 'color' => 'Verde',  'estado' => 'Como nuevo',  'bateria' => 100, 'almacenamiento' => 256, 'ram' => 16, 'precio' => 909.95, 'stock' => 2],
            ['modelo' => 'Google Pixel 10 Pro', 'color' => 'Verde',  'estado' => 'Buen estado', 'bateria' => 90,  'almacenamiento' => 128, 'ram' => 16, 'precio' => 779.95, 'stock' => 3],
            ['modelo' => 'Google Pixel 10 Pro', 'color' => 'Verde',  'estado' => 'Buen estado', 'bateria' => 90,  'almacenamiento' => 256, 'ram' => 16, 'precio' => 819.95, 'stock' => 2],
            ['modelo' => 'Google Pixel 10 Pro', 'color' => 'Verde',  'estado' => 'Funcional',   'bateria' => 80,  'almacenamiento' => 128, 'ram' => 16, 'precio' => 669.95, 'stock' => 1],

            // ──────────── XIAOMI / REDMI ────────────

            // Redmi A5 → Amarillo, Azul, Negro, Verde
            ['modelo' => 'Redmi A5', 'color' => 'Negro',    'estado' => 'Como nuevo',  'bateria' => 100, 'almacenamiento' => 64,  'ram' => 4, 'precio' => 99.95,  'stock' => 10],
            ['modelo' => 'Redmi A5', 'color' => 'Negro',    'estado' => 'Como nuevo',  'bateria' => 100, 'almacenamiento' => 128, 'ram' => 4, 'precio' => 109.95, 'stock' => 7],
            ['modelo' => 'Redmi A5', 'color' => 'Negro',    'estado' => 'Buen estado', 'bateria' => 90,  'almacenamiento' => 64,  'ram' => 4, 'precio' => 79.95,  'stock' => 12],
            ['modelo' => 'Redmi A5', 'color' => 'Negro',    'estado' => 'Buen estado', 'bateria' => 90,  'almacenamiento' => 128, 'ram' => 4, 'precio' => 89.95,  'stock' => 8],
            ['modelo' => 'Redmi A5', 'color' => 'Negro',    'estado' => 'Funcional',   'bateria' => 80,  'almacenamiento' => 64,  'ram' => 4, 'precio' => 59.95,  'stock' => 5],

            ['modelo' => 'Redmi A5', 'color' => 'Azul',     'estado' => 'Como nuevo',  'bateria' => 100, 'almacenamiento' => 64,  'ram' => 4, 'precio' => 99.95,  'stock' => 8],
            ['modelo' => 'Redmi A5', 'color' => 'Azul',     'estado' => 'Como nuevo',  'bateria' => 100, 'almacenamiento' => 128, 'ram' => 4, 'precio' => 129.95, 'stock' => 5],
            ['modelo' => 'Redmi A5', 'color' => 'Azul',     'estado' => 'Buen estado', 'bateria' => 90,  'almacenamiento' => 64,  'ram' => 4, 'precio' => 79.95,  'stock' => 10],
            ['modelo' => 'Redmi A5', 'color' => 'Azul',     'estado' => 'Buen estado', 'bateria' => 90,  'almacenamiento' => 128, 'ram' => 4, 'precio' => 84.95,  'stock' => 7],
            ['modelo' => 'Redmi A5', 'color' => 'Azul',     'estado' => 'Funcional',   'bateria' => 80,  'almacenamiento' => 64,  'ram' => 4, 'precio' => 59.95,  'stock' => 5],

            ['modelo' => 'Redmi A5', 'color' => 'Verde',    'estado' => 'Como nuevo',  'bateria' => 100, 'almacenamiento' => 64,  'ram' => 4, 'precio' => 94.95,  'stock' => 7],
            ['modelo' => 'Redmi A5', 'color' => 'Verde',    'estado' => 'Como nuevo',  'bateria' => 100, 'almacenamiento' => 128, 'ram' => 4, 'precio' => 104.95, 'stock' => 5],
            ['modelo' => 'Redmi A5', 'color' => 'Verde',    'estado' => 'Buen estado', 'bateria' => 90,  'almacenamiento' => 64,  'ram' => 4, 'precio' => 74.95,  'stock' => 8],
            ['modelo' => 'Redmi A5', 'color' => 'Verde',    'estado' => 'Buen estado', 'bateria' => 90,  'almacenamiento' => 128, 'ram' => 4, 'precio' => 84.95,  'stock' => 6],
            ['modelo' => 'Redmi A5', 'color' => 'Verde',    'estado' => 'Funcional',   'bateria' => 80,  'almacenamiento' => 64,  'ram' => 4, 'precio' => 54.95,  'stock' => 4],

            ['modelo' => 'Redmi A5', 'color' => 'Amarillo', 'estado' => 'Como nuevo',  'bateria' => 100, 'almacenamiento' => 64,  'ram' => 4, 'precio' => 99.95,  'stock' => 6],
            ['modelo' => 'Redmi A5', 'color' => 'Amarillo', 'estado' => 'Como nuevo',  'bateria' => 100, 'almacenamiento' => 128, 'ram' => 4, 'precio' => 109.95, 'stock' => 5],
            ['modelo' => 'Redmi A5', 'color' => 'Amarillo', 'estado' => 'Buen estado', 'bateria' => 90,  'almacenamiento' => 64,  'ram' => 4, 'precio' => 79.95,  'stock' => 8],
            ['modelo' => 'Redmi A5', 'color' => 'Amarillo', 'estado' => 'Buen estado', 'bateria' => 90,  'almacenamiento' => 128, 'ram' => 4, 'precio' => 89.95,  'stock' => 6],
            ['modelo' => 'Redmi A5', 'color' => 'Amarillo', 'estado' => 'Funcional',   'bateria' => 80,  'almacenamiento' => 64,  'ram' => 4, 'precio' => 59.95,  'stock' => 4],

            // Redmi Note 13 → Azul, Negro
            ['modelo' => 'Redmi Note 13', 'color' => 'Negro', 'estado' => 'Como nuevo',  'bateria' => 100, 'almacenamiento' => 128, 'ram' => 8, 'precio' => 209.95, 'stock' => 6],
            ['modelo' => 'Redmi Note 13', 'color' => 'Negro', 'estado' => 'Como nuevo',  'bateria' => 100, 'almacenamiento' => 256, 'ram' => 8, 'precio' => 219.95, 'stock' => 4],
            ['modelo' => 'Redmi Note 13', 'color' => 'Negro', 'estado' => 'Buen estado', 'bateria' => 90,  'almacenamiento' => 128, 'ram' => 8, 'precio' => 169.95, 'stock' => 8],
            ['modelo' => 'Redmi Note 13', 'color' => 'Negro', 'estado' => 'Buen estado', 'bateria' => 90,  'almacenamiento' => 256, 'ram' => 8, 'precio' => 179.95, 'stock' => 5],
            ['modelo' => 'Redmi Note 13', 'color' => 'Negro', 'estado' => 'Funcional',   'bateria' => 80,  'almacenamiento' => 128, 'ram' => 8, 'precio' => 129.95, 'stock' => 3],

            ['modelo' => 'Redmi Note 13', 'color' => 'Azul',  'estado' => 'Como nuevo',  'bateria' => 100, 'almacenamiento' => 128, 'ram' => 8, 'precio' => 214.95, 'stock' => 5],
            ['modelo' => 'Redmi Note 13', 'color' => 'Azul',  'estado' => 'Como nuevo',  'bateria' => 100, 'almacenamiento' => 256, 'ram' => 8, 'precio' => 224.95, 'stock' => 3],
            ['modelo' => 'Redmi Note 13', 'color' => 'Azul',  'estado' => 'Buen estado', 'bateria' => 90,  'almacenamiento' => 128, 'ram' => 8, 'precio' => 174.95, 'stock' => 7],
            ['modelo' => 'Redmi Note 13', 'color' => 'Azul',  'estado' => 'Buen estado', 'bateria' => 90,  'almacenamiento' => 256, 'ram' => 8, 'precio' => 184.95, 'stock' => 5],
            ['modelo' => 'Redmi Note 13', 'color' => 'Azul',  'estado' => 'Funcional',   'bateria' => 80,  'almacenamiento' => 128, 'ram' => 8, 'precio' => 134.95, 'stock' => 2],

            // Redmi Note 14 → Azul, Morado, Negro, Verde
            ['modelo' => 'Redmi Note 14', 'color' => 'Negro',  'estado' => 'Como nuevo',  'bateria' => 100, 'almacenamiento' => 128, 'ram' => 8, 'precio' => 249.95, 'stock' => 5],
            ['modelo' => 'Redmi Note 14', 'color' => 'Negro',  'estado' => 'Como nuevo',  'bateria' => 100, 'almacenamiento' => 256, 'ram' => 8, 'precio' => 259.95, 'stock' => 3],
            ['modelo' => 'Redmi Note 14', 'color' => 'Negro',  'estado' => 'Buen estado', 'bateria' => 90,  'almacenamiento' => 128, 'ram' => 8, 'precio' => 209.95, 'stock' => 6],
            ['modelo' => 'Redmi Note 14', 'color' => 'Negro',  'estado' => 'Buen estado', 'bateria' => 90,  'almacenamiento' => 256, 'ram' => 8, 'precio' => 219.95, 'stock' => 4],
            ['modelo' => 'Redmi Note 14', 'color' => 'Negro',  'estado' => 'Funcional',   'bateria' => 80,  'almacenamiento' => 128, 'ram' => 8, 'precio' => 159.95, 'stock' => 2],

            ['modelo' => 'Redmi Note 14', 'color' => 'Azul',   'estado' => 'Como nuevo',  'bateria' => 100, 'almacenamiento' => 128, 'ram' => 8, 'precio' => 254.95, 'stock' => 4],
            ['modelo' => 'Redmi Note 14', 'color' => 'Azul',   'estado' => 'Como nuevo',  'bateria' => 100, 'almacenamiento' => 256, 'ram' => 8, 'precio' => 264.95, 'stock' => 3],
            ['modelo' => 'Redmi Note 14', 'color' => 'Azul',   'estado' => 'Buen estado', 'bateria' => 90,  'almacenamiento' => 128, 'ram' => 8, 'precio' => 214.95, 'stock' => 5],
            ['modelo' => 'Redmi Note 14', 'color' => 'Azul',   'estado' => 'Buen estado', 'bateria' => 90,  'almacenamiento' => 256, 'ram' => 8, 'precio' => 239.95, 'stock' => 4],
            ['modelo' => 'Redmi Note 14', 'color' => 'Azul',   'estado' => 'Funcional',   'bateria' => 80,  'almacenamiento' => 128, 'ram' => 8, 'precio' => 164.95, 'stock' => 2],

            ['modelo' => 'Redmi Note 14', 'color' => 'Morado', 'estado' => 'Como nuevo',  'bateria' => 100, 'almacenamiento' => 128, 'ram' => 8, 'precio' => 249.95, 'stock' => 4],
            ['modelo' => 'Redmi Note 14', 'color' => 'Morado', 'estado' => 'Como nuevo',  'bateria' => 100, 'almacenamiento' => 256, 'ram' => 8, 'precio' => 264.95, 'stock' => 2],
            ['modelo' => 'Redmi Note 14', 'color' => 'Morado', 'estado' => 'Buen estado', 'bateria' => 90,  'almacenamiento' => 128, 'ram' => 8, 'precio' => 209.95, 'stock' => 5],
            ['modelo' => 'Redmi Note 14', 'color' => 'Morado', 'estado' => 'Buen estado', 'bateria' => 90,  'almacenamiento' => 256, 'ram' => 8, 'precio' => 234.95, 'stock' => 3],
            ['modelo' => 'Redmi Note 14', 'color' => 'Morado', 'estado' => 'Funcional',   'bateria' => 80,  'almacenamiento' => 128, 'ram' => 8, 'precio' => 159.95, 'stock' => 2],

            ['modelo' => 'Redmi Note 14', 'color' => 'Verde',  'estado' => 'Como nuevo',  'bateria' => 100, 'almacenamiento' => 128, 'ram' => 8, 'precio' => 244.95, 'stock' => 3],
            ['modelo' => 'Redmi Note 14', 'color' => 'Verde',  'estado' => 'Como nuevo',  'bateria' => 100, 'almacenamiento' => 256, 'ram' => 8, 'precio' => 254.95, 'stock' => 2],
            ['modelo' => 'Redmi Note 14', 'color' => 'Verde',  'estado' => 'Buen estado', 'bateria' => 90,  'almacenamiento' => 128, 'ram' => 8, 'precio' => 204.95, 'stock' => 4],
            ['modelo' => 'Redmi Note 14', 'color' => 'Verde',  'estado' => 'Buen estado', 'bateria' => 90,  'almacenamiento' => 256, 'ram' => 8, 'precio' => 219.95, 'stock' => 3],
            ['modelo' => 'Redmi Note 14', 'color' => 'Verde',  'estado' => 'Funcional',   'bateria' => 80,  'almacenamiento' => 128, 'ram' => 8, 'precio' => 154.95, 'stock' => 2],

            // Redmi Note 15 → Azul, Negro, Verde
            ['modelo' => 'Redmi Note 15', 'color' => 'Negro', 'estado' => 'Como nuevo',  'bateria' => 100, 'almacenamiento' => 128, 'ram' => 8, 'precio' => 279.95, 'stock' => 4],
            ['modelo' => 'Redmi Note 15', 'color' => 'Negro', 'estado' => 'Como nuevo',  'bateria' => 100, 'almacenamiento' => 256, 'ram' => 8, 'precio' => 299.95, 'stock' => 3],
            ['modelo' => 'Redmi Note 15', 'color' => 'Negro', 'estado' => 'Buen estado', 'bateria' => 90,  'almacenamiento' => 128, 'ram' => 8, 'precio' => 239.95, 'stock' => 5],
            ['modelo' => 'Redmi Note 15', 'color' => 'Negro', 'estado' => 'Buen estado', 'bateria' => 90,  'almacenamiento' => 256, 'ram' => 8, 'precio' => 259.95, 'stock' => 3],
            ['modelo' => 'Redmi Note 15', 'color' => 'Negro', 'estado' => 'Funcional',   'bateria' => 80,  'almacenamiento' => 128, 'ram' => 8, 'precio' => 189.95, 'stock' => 2],

            ['modelo' => 'Redmi Note 15', 'color' => 'Azul',  'estado' => 'Como nuevo',  'bateria' => 100, 'almacenamiento' => 128, 'ram' => 8, 'precio' => 289.95, 'stock' => 3],
            ['modelo' => 'Redmi Note 15', 'color' => 'Azul',  'estado' => 'Como nuevo',  'bateria' => 100, 'almacenamiento' => 256, 'ram' => 8, 'precio' => 309.95, 'stock' => 2],
            ['modelo' => 'Redmi Note 15', 'color' => 'Azul',  'estado' => 'Buen estado', 'bateria' => 90,  'almacenamiento' => 128, 'ram' => 8, 'precio' => 244.95, 'stock' => 6],
            ['modelo' => 'Redmi Note 15', 'color' => 'Azul',  'estado' => 'Buen estado', 'bateria' => 90,  'almacenamiento' => 256, 'ram' => 8, 'precio' => 254.95, 'stock' => 4],
            ['modelo' => 'Redmi Note 15', 'color' => 'Azul',  'estado' => 'Funcional',   'bateria' => 80,  'almacenamiento' => 128, 'ram' => 8, 'precio' => 194.95, 'stock' => 2],

            ['modelo' => 'Redmi Note 15', 'color' => 'Verde', 'estado' => 'Como nuevo',  'bateria' => 100, 'almacenamiento' => 128, 'ram' => 8, 'precio' => 284.95, 'stock' => 3],
            ['modelo' => 'Redmi Note 15', 'color' => 'Verde', 'estado' => 'Como nuevo',  'bateria' => 100, 'almacenamiento' => 256, 'ram' => 8, 'precio' => 304.95, 'stock' => 2],
            ['modelo' => 'Redmi Note 15', 'color' => 'Verde', 'estado' => 'Buen estado', 'bateria' => 90,  'almacenamiento' => 128, 'ram' => 8, 'precio' => 239.95, 'stock' => 5],
            ['modelo' => 'Redmi Note 15', 'color' => 'Verde', 'estado' => 'Buen estado', 'bateria' => 90,  'almacenamiento' => 256, 'ram' => 8, 'precio' => 249.95, 'stock' => 3],
            ['modelo' => 'Redmi Note 15', 'color' => 'Verde', 'estado' => 'Funcional',   'bateria' => 80,  'almacenamiento' => 128, 'ram' => 8, 'precio' => 179.95, 'stock' => 2],
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
