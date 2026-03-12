<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Movil;
use Illuminate\Http\Request;

/**
 * Gestiona el carrito en sesión Laravel.
 *
 * Estructura en sesión:
 * carrito = [
 *   movil_id => ['movil_id' => int, 'cantidad' => int, 'precio' => float],
 *   ...
 * ]
 */
class CarritoApiController extends Controller
{
    // ── GET /api/carrito ──────────────────────────────────────────────────────
    public function index(Request $request)
    {
        $carrito = $request->session()->get('carrito', []);
        $items   = $this->hydrateItems($carrito);

        return response()->json([
            'items'       => $items,
            'total_items' => array_sum(array_column($items, 'cantidad')),
            'subtotal'    => $this->calcSubtotal($items),
        ]);
    }

    // ── POST /api/carrito ─────────────────────────────────────────────────────
    public function store(Request $request)
    {
        $request->validate([
            'movil_id' => 'required|exists:moviles,id',
            'cantidad' => 'integer|min:1|max:10',
        ]);

        $movil    = Movil::findOrFail($request->movil_id);
        $cantidad = $request->input('cantidad', 1);

        if ($movil->stock < $cantidad) {
            return response()->json(['message' => 'Stock insuficiente'], 422);
        }

        $carrito = $request->session()->get('carrito', []);
        $key     = $movil->id;

        if (isset($carrito[$key])) {
            $nueva = $carrito[$key]['cantidad'] + $cantidad;
            if ($nueva > $movil->stock) {
                return response()->json(['message' => 'Stock insuficiente'], 422);
            }
            $carrito[$key]['cantidad'] = $nueva;
        } else {
            $carrito[$key] = [
                'movil_id' => $movil->id,
                'cantidad' => $cantidad,
                'precio'   => (float) $movil->precio,
            ];
        }

        $request->session()->put('carrito', $carrito);

        return response()->json([
            'message' => 'Añadido al carrito',
            'carrito' => $this->hydrateItems($carrito),
        ], 201);
    }

    // ── PATCH /api/carrito/{movil_id} ─────────────────────────────────────────
    public function update(Request $request, int $movilId)
    {
        $request->validate(['cantidad' => 'required|integer|min:1|max:10']);

        $movil   = Movil::findOrFail($movilId);
        $carrito = $request->session()->get('carrito', []);

        if (!isset($carrito[$movilId])) {
            return response()->json(['message' => 'Ítem no encontrado en el carrito'], 404);
        }

        if ($request->cantidad > $movil->stock) {
            return response()->json(['message' => 'Stock insuficiente'], 422);
        }

        $carrito[$movilId]['cantidad'] = $request->cantidad;
        $request->session()->put('carrito', $carrito);

        return response()->json(['carrito' => $this->hydrateItems($carrito)]);
    }

    // ── DELETE /api/carrito/{movil_id} ────────────────────────────────────────
    public function destroy(Request $request, int $movilId)
    {
        $carrito = $request->session()->get('carrito', []);
        unset($carrito[$movilId]);
        $request->session()->put('carrito', $carrito);

        return response()->json(['carrito' => $this->hydrateItems($carrito)]);
    }

    // ── DELETE /api/carrito ───────────────────────────────────────────────────
    public function clear(Request $request)
    {
        $request->session()->forget('carrito');
        return response()->json(['message' => 'Carrito vaciado']);
    }

    // ── Helpers ───────────────────────────────────────────────────────────────

    private function hydrateItems(array $carrito): array
    {
        if (empty($carrito)) return [];

        $moviles = Movil::with(['modelo.marca', 'color'])
            ->whereIn('id', array_keys($carrito))
            ->get()
            ->keyBy('id');

        $items = [];
        foreach ($carrito as $id => $row) {
            if (!$moviles->has($id)) continue;
            $movil   = $moviles[$id];
            $items[] = [
                'movil_id'       => $movil->id,
                'cantidad'       => $row['cantidad'],
                'precio'         => $row['precio'],
                'modelo'         => $movil->modelo->nombre ?? '',
                'marca'          => $movil->modelo->marca->nombre ?? '',
                'color'          => $movil->color->nombre ?? '',
                'color_hex'      => $movil->color->codigo_hex ?? '#888888',
                'almacenamiento' => $movil->almacenamiento,
                'ram'            => $movil->ram,
                'estado'         => $movil->estado,
                'salud_bateria'  => $movil->salud_bateria,
                'stock'          => $movil->stock,
                'subtotal'       => round($row['precio'] * $row['cantidad'], 2),
            ];
        }

        return $items;
    }

    private function calcSubtotal(array $items): float
    {
        return round(array_sum(array_column($items, 'subtotal')), 2);
    }
}