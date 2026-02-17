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
            'user_id' => $user->id,
            'nombre_empresa'    => 'Reco',
            'cif'    => 'B12345678',
            'direccion_fiscal' => 'Polígono Industrial Norte, Nave 12',
            'telefono'       => '931234567',
            'descripcion'  => 'Empresa especializada en reacondicionamiento de dispositivos móviles',
        ]);
    }
}
