<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Str;

class GoogleAuthController extends Controller
{
    public function handleGoogle(Request $request)
    {
        $request->validate(['credential' => 'required|string']);

        $response = Http::get('https://oauth2.googleapis.com/tokeninfo', [
            'id_token' => $request->credential,
        ]);

        if (!$response->successful()) {
            return response()->json(['message' => 'Token de Google invàlid'], 401);
        }

        $googleUser = $response->json();

        if (($googleUser['aud'] ?? '') !== config('services.google.client_id')) {
            return response()->json(['message' => 'Token no vàlid per aquesta aplicació'], 401);
        }

        $user = User::firstOrCreate(
            ['email' => $googleUser['email']],
            [
                'name'      => $googleUser['name'] ?? $googleUser['email'],
                'google_id' => $googleUser['sub'],
                'password'  => bcrypt(Str::random(32)),
                'role'      => 'cliente',
            ]
        );

        if (!$user->google_id) {
            $user->update(['google_id' => $googleUser['sub']]);
        }

        Auth::login($user);
        $request->session()->regenerate();

        return response()->json($user->load('cliente'));
    }
}
