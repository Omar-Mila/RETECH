<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use App\Models\User;
use App\Models\Cliente;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\DB;

class RegisterController extends Controller
{
    public function store(Request $request) 
    {
        $request->validate([
            'name'     => 'required|string|max:255',
            'email'    => 'required|string|email|max:255|unique:users',
            'password' => 'required|string',
        ]);

        try {
            return DB::transaction(function () use ($request) {
                
                // 1. Crear Usuario
                $user = User::create([
                    'name'     => $request->name,
                    'email'    => $request->email,
                    'password' => Hash::make($request->password),
                    'role'     => 'cliente', 
                ]);


                return response()->json([
                    'status'  => 'success',
                    'message' => 'Compte creat correctament'
                ], 201);
            });

        } catch (\Exception $e) {
            // MUY IMPORTANTE: Devolvemos el error real para que React lo pinte
            return response()->json([
                'status'  => 'error',
                'message' => 'Error al registrar: ' . $e->getMessage()
            ], 500);
        }
    }
}