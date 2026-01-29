<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use App\Models\User;
use App\Models\Empresa;
use App\Models\Cliente;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Validator;

class RegisterController extends Controller
{
    public function showRegistrationForm()
    {
        return view('auth.register');
    }

    public function store(Request $request) 
    {
        $request->validate([
            'username' => 'required|string|max:255|unique:users',
            'email' => 'required|string|email|max:255|unique:users',
            'password' => 'required|string',
            'role' => 'required|in:cliente,empresa',
            
            'nombre' => 'required_if:role,cliente',
            'apellidos' => 'required_if:role,cliente',
            'nif' => 'required_if:role,cliente|unique:clientes,nif',
            'direccion' => 'required_if:role,cliente',
            'telefono_cliente' => 'required_if:role,cliente',

            'nombre_empresa' => 'required_if:role,empresa',
            'cif' => 'required_if:role,empresa|unique:empresas,cif',
            'direccion_fiscal' => 'required_if:role,empresa',
            'telefono_empresa' => 'required_if:role,empresa',
            'descripcion' => 'required_if:role,empresa',
        ]);

        try {
            $user = User::create([
                'username' => $request->username,
                'email' => $request->email,
                'password' => Hash::make($request->password),
            ]);


            if ($request->role === 'empresa') {
                Empresa::create([
                    'user_id' => $user->id,
                    'nombre_empresa' => $request->nombre_empresa,
                    'cif' => $request->cif,
                    'direccion_fiscal' => $request->direccion_fiscal,
                    'telefono' => $request->telefono_empresa,
                    'descripcion' => $request->descripcion,
                ]);
            } else {
                Cliente::create([
                    'user_id' => $user->id,
                    'nombre' => $request->nombre,
                    'apellidos' => $request->apellidos,
                    'nif' => $request->nif,
                    'direccion' => $request->direccion,
                    'telefono' => $request->telefono_cliente, 
                ]);
            }
            return redirect()->route('login')->with('success', 'Cuenta creada. Por favor, inicia sesión.');

        } catch (\Exception $e) {
            return back()->withInput()->withErrors(['error' => 'Hubo un problema al crear la cuenta.']);
        }
    }
}