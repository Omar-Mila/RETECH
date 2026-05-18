<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use App\Mail\AccountVerification;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Mail;
use Illuminate\Support\Str;

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
                $token = Str::random(64);

                $user = User::create([
                    'name'               => $request->name,
                    'email'              => $request->email,
                    'password'           => Hash::make($request->password),
                    'role'               => 'cliente',
                    'verification_token' => $token,
                ]);

                $verificationUrl = config('app.url') . '/api/verify-email/' . $token;
                $lang = in_array($request->lang, ['ca', 'es', 'en']) ? $request->lang : 'es';

                try {
                    Mail::to($user->email)->send(new AccountVerification($user->name, $verificationUrl, $lang));
                } catch (\Exception $mailEx) {
                    \Log::warning('Email de verificació fallat: ' . $mailEx->getMessage());
                }

                return response()->json([
                    'status'  => 'success',
                    'message' => 'Compte creat correctament'
                ], 201);
            });

        } catch (\Exception $e) {
            return response()->json([
                'status'  => 'error',
                'message' => 'Error al registrar: ' . $e->getMessage()
            ], 500);
        }
    }
}
