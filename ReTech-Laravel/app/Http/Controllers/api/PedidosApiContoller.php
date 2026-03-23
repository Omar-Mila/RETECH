<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Compra;

class PedidosApiController extends Controller
{
    public function index(Request $request)
    {
        $user = $request->user();

        if (!$user) {
            return response()->json(['message' => 'No autenticado'], 401);
        }

        $pedidos = Compra::where('cliente_user_id', $user->id)
            ->orderBy('created_at', 'desc')
            ->get();

        return response()->json($pedidos);
    }
}