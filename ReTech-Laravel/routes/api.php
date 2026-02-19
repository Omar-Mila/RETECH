<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\MarcaApiController;
use App\Http\Controllers\Api\MovilApiController;
use App\Models\Movil;
use Illuminate\Support\Facades\Auth;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
|
| Here is where you can register API routes for your application. These
| routes are loaded by the RouteServiceProvider within a group which
| is assigned the "api" middleware group. Enjoy building your API!
|
*/

Route::post('/login', function (Request $request) {
    $credentials = $request->validate([
        'email' => ['required', 'email'],
        'password' => ['required'],
    ]);

    if (!Auth::attempt($credentials)) {
        return response()->json(['message' => 'Credencials incorrectes'], 401);
    }

    $request->session()->regenerate();

    return response()->json(Auth::user());
})->withoutMiddleware(['throttle:api']);

Route::post('/logout', function (Request $request) {
    Auth::logout();
    $request->session()->invalidate();
    $request->session()->regenerateToken();

    return response()->json(['message' => 'Logout OK']);
});

Route::get('/user', function (Request $request) {
    return response()->json($request->user());
});

Route::get('/marcas', [MarcaApiController::class, 'index']);
Route::get('/moviles', [MovilApiController::class, 'index']);

Route::get('/moviles', function () {
    return Movil::with(['modelo', 'color'])->get();
});
