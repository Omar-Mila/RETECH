<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;
use App\Models\User;
use App\Models\Cliente;

class ClienteSeeder extends Seeder
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
            'username' => 'omar',
            'email' => 'omar@retech.com',
            'password' => Hash::make('omar'),
        ]);

        Cliente::create([
            'user_id' => $user->id,
            'nombre'    => 'Omar',
            'apellidos' => 'El Fedli Gaibri',
            'nif'       => '12345678A',
            'direccion' => 'Calle Cervantes 8, 1-1',
            'telefono'  => '697295939',
        ]);
    }
}
