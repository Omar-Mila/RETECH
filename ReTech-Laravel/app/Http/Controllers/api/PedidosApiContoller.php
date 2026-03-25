<?php

namespace App\Http\Controllers\Api;

use Illuminate\Http\Request;
use App\Models\Compra;
use Illuminate\Support\Facades\Auth;

class PedidosApiController extends Controller
{
    public function index(Request $request) {
        try {
            // Forzamos la obtención del usuario
            $user = auth('sanctum')->user(); 
            
            if (!$user) {
                return response()->json(['mensaje' => 'No hay sesión activa'], 401);
            }

            return Compra::where('cliente_user_id', $user->id)->get();

        } catch (\Exception $e) {
            return response()->json([
                'error_real' => $e->getMessage(),
                'linea' => $e->getLine(),
                'archivo' => $e->getFile()
            ], 500);
        }
    }
}