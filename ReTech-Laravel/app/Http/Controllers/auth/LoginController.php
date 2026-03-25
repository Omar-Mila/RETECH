<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use App\Models\User;
use Illuminate\Support\Facades\Hash;

class LoginController extends Controller
{
    public function showLoginForm()
    {
        return view('auth.login');
    }

    public function login(Request $request)
    {
        $request->validate([
            'email' => 'required|email',
            'password' => 'required'
        ]);

        // 1. Intentamos el login
        if (Auth::attempt($request->only('email', 'password'))) {
            // 2. IMPORTANTE: Limpiar cualquier rastro de sesión anterior
            $request->session()->regenerate();
            $user = Auth::user();

            // 3. Devolvemos SOLO JSON. React decidirá a dónde ir.
            return response()->json([
                'authenticated' => true,
                'user' => [
                    'id'    => $user->id,
                    'name'  => $user->name,
                    'email' => $user->email,
                    'role'  => $user->role
                ]
            ]);
        }

        return response()->json(['message' => 'Credenciales incorrectas'], 401);
    }

    public function logout(Request $request)
    {
        Auth::guard('web')->logout();

        $request->session()->invalidate();
        $request->session()->regenerateToken();

        // IMPORTANTE: Devolver JSON para que React sepa que ha terminado
        if ($request->wantsJson() || $request->ajax()) {
            return response()->json(['message' => 'Logged out']);
        }

        return redirect('/login');
    }

}
