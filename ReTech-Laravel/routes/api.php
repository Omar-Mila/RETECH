<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use Illuminate\Validation\Rule;
use App\Http\Controllers\Api\MarcaApiController;
use App\Http\Controllers\Api\MovilApiController;
use App\Http\Controllers\ProductosController;
use App\Http\Controllers\Api\ModeloApiController;
use App\Http\Controllers\Api\CarritoApiController;
use App\Http\Controllers\CompraController;
use App\Http\Controllers\Api\PedidosApiController;
use App\Http\Controllers\Api\CheckoutApiController;
use App\Http\Controllers\ClienteController;
use App\Http\Controllers\Auth\RegisterController;
use App\Http\Controllers\Auth\LoginController;
use App\Http\Controllers\Auth\GoogleAuthController;

use App\Models\Marca;
use App\Models\Modelo;
use App\Models\Producto;
use App\Models\Compra;
use App\Models\Pedido;
use App\Models\Cliente;
use App\Models\SistemaOperativo;
use App\Models\Movil;
use Illuminate\Database\Eloquent\Model;
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

Route::middleware(['web'])->group(function () {
    Route::post('/login', function (Request $request) {
        $credentials = $request->validate([
            'email' => ['required', 'email'],
            'password' => ['required'],
        ]);

        if (Auth::attempt($credentials)) {
            $request->session()->regenerate();
            return response()->json(Auth::user()->load('cliente'));
        }

        return response()->json(['message' => 'Credencials incorrectes'], 401);
    });

    Route::post('/logout', function (Request $request) {
        Auth::guard('web')->logout();
        $request->session()->invalidate();
        $request->session()->regenerateToken();
        return response()->json(['message' => 'Logout OK']);
    });
});

Route::middleware('auth:sanctum')->get('/user', function (Request $request) {
    return $request->user()->load('cliente');
});

Route::middleware(['web', 'auth:sanctum'])->post('/resend-verification', function (Request $request) {
    $user = $request->user();

    if ($user->email_verified_at) {
        return response()->json(['message' => 'already_verified'], 200);
    }

    $token = \Illuminate\Support\Str::random(64);
    $user->update(['verification_token' => $token]);

    $verificationUrl = config('app.url') . '/api/verify-email/' . $token;
    $lang = in_array($request->lang, ['ca', 'es', 'en']) ? $request->lang : 'es';

    try {
        \Illuminate\Support\Facades\Mail::to($user->email)
            ->send(new \App\Mail\AccountVerification($user->name, $verificationUrl, $lang));
        return response()->json(['message' => 'sent'], 200);
    } catch (\Exception $e) {
        \Log::warning('Resend verification failed: ' . $e->getMessage());
        return response()->json(['message' => 'error'], 500);
    }
});

Route::middleware('auth:sanctum')->put('/user/cliente', function (Request $request) {
    $user = $request->user();
    $data = $request->validate([
        'nombre'    => 'nullable|string|max:100',
        'apellidos' => 'nullable|string|max:100',
        'nif'       => ['nullable', 'string', 'max:9', Rule::unique('clientes', 'nif')->ignore($user->id, 'user_id')],
        'direccion' => 'nullable|string|max:255',
        'telefono'  => 'nullable|string|max:20',
    ]);

    $user->cliente()->updateOrCreate(
        ['user_id' => $user->id],
        $data
    );

    return $user->load('cliente');
});

Route::post('/register', [RegisterController::class, 'store']);
Route::middleware(['web'])->post('/auth/google', [GoogleAuthController::class, 'handleGoogle']);

Route::middleware(['web'])->get('/verify-email/{token}', function (string $token, Request $request) {
    $user = \App\Models\User::where('verification_token', $token)->first();

    $frontendUrl = config('app.frontend_url', 'http://localhost:5173');

    if (!$user) {
        return redirect($frontendUrl . '/perfil?verified=invalid');
    }

    $user->update([
        'email_verified_at'  => now(),
        'verification_token' => null,
    ]);

    Auth::login($user);
    $request->session()->regenerate();

    return redirect($frontendUrl . '/perfil?verified=1');
});

Route::get('/products/search', [ProductosController::class, 'search']);
Route::get('/marcas', [MarcaApiController::class, 'index']);
Route::get('/moviles', [MovilApiController::class, 'index']);

Route::get('/moviles/best-sellers', [MovilApiController::class, 'bestSellers']);
Route::get('/products/{id}', [MovilApiController::class, 'show']);

//cerca de models
Route::get('/models', [ModeloApiController::class, 'index']);
Route::get('/models/search', [ModeloApiController::class, 'search']);
Route::get('/models/{id}', [ModeloApiController::class, 'show']);
Route::get('/models/{model}/options', [ModeloApiController::class, 'options']);
Route::get('/models/{model}/price', [ModeloApiController::class, 'price']);
Route::get('/models/{model}/images', [ModeloApiController::class, 'images']);
Route::get('/models/{model}/units', [ModeloApiController::class, 'units']);


Route::middleware(['auth:sanctum'])->group(function () {
    Route::get('/carrito', [CarritoApiController::class, 'index']);
    Route::post('/carrito', [CarritoApiController::class, 'store']);
    Route::patch('/carrito/{movil_id}', [CarritoApiController::class, 'update']);
    Route::delete('/carrito/{movil_id}', [CarritoApiController::class, 'destroy']);
    Route::delete('/carrito/vaciar', [CarritoApiController::class, 'clear']);
});

Route::prefix('checkout')->middleware(['web', 'auth:sanctum'])->group(function () {
    Route::post('/intent',  [CheckoutApiController::class, 'createIntent']);
    Route::post('/confirm', [CheckoutApiController::class, 'confirm']);
});

Route::middleware('auth:sanctum')->group(function () {
    Route::get('/compras', [CompraController::class, 'index']);
    Route::get('/compras/{id}', [CompraController::class, 'show']);
});
