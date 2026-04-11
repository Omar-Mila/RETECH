<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use App\Models\Compra;
use App\Models\Movil;
use Illuminate\Support\Facades\Auth;

class CompraController extends Controller
{
    
    public function registrarCompra(Request $request)
    {
        return DB::transaction(function () use ($request) {
            $items = $request->input('items');
            if (empty($items)) {
                throw new \Exception("El carrito está vacío");
            }

            $precioTotalAcumulado = 0;

            foreach ($items as $item) {
                $movil = Movil::findOrFail($item['movil_id']);
                
                if ($movil->stock < $item['cantidad']) {
                    throw new \Exception("Stock insuficiente para el modelo: {$movil->modelo->nombre}");
                }

                $movil->decrement('stock', $item['cantidad']);

                $precioTotalAcumulado += ($movil->precio * $item['cantidad']);
            }

            $compra = Compra::create([
                'cliente_user_id' => Auth::id(),
                'items'           => $items,
                'precio_total'    => $precioTotalAcumulado,
                'metodo_pago'     => $request->metodo_pago,
            ]);

            return response()->json([
                'message' => 'Compra realizada con éxito',
                'compra'  => $compra
            ], 201);
        });
    }

    public function index(Request $request) {
        try {
            $user = $request->user();
            if (!$user) {
                return response()->json(['message' => 'Usuario no encontrado'], 401);
            }
            $compras = Compra::where('cliente_user_id', $user->id)
                        ->orderBy('created_at', 'desc')
                        ->get();

            return response()->json($compras);
        } catch (\Exception $e) {
            return response()->json(['error' => $e->getMessage()], 500);
        }
    }
}