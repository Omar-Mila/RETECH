<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;
use App\Models\User;
use App\Models\Empresa;

class EmpresaSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        //
        $user = User::create([
            'name' => 'reco',
            'email' => 'reco@retech.com',
            'password' => Hash::make('reco'),
            'role' => 'user',
        ]);

        Empresa::create([
            'nombre_empresa'   => 'Retech Solutions',
            'cif'              => 'B87654321',
            'direccion_fiscal' => 'Calle Falsa 123, Barcelona',
            'telefono'         => '935556677',
            'descripcion'      => 'Proveedor oficial de componentes y terminales',
        ]);
    }
}
