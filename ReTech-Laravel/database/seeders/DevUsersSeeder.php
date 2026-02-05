<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use App\Models\User;
use Illuminate\Support\Facades\Hash;

class DevUsersSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        User::updateOrCreate(
            ['email' => 'omar@retech.com'],
            [
                'name' => 'omar.efg',
                'password' => Hash::make('omar'),
                'role' => 'user',
            ]
        );

        User::updateOrCreate(
            ['email' => 'ivan@retech.com'],
            [
                'name' => 'ivan.ps',
                'password' => Hash::make('ivan'),
                'role' => 'user',
            ]
        );

        User::updateOrCreate(
            ['email' => 'admin@retech.com'],
            [
                'name' => 'Administrador',
                'password' => Hash::make('admin'),
                'role' => 'admin',
            ]
        );
    }
}
