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
        try {
            // 1. Verificamos si recibimos el ID
            $id = $request->input('movil_id');
            
            if (!$id) {
                return response()->json(['message' => 'Falta el movil_id'], 422);
            }

            // 2. Intentamos buscar el móvil
            // IMPORTANTE: Asegúrate de tener "use App\Models\Movil;" arriba del todo
            $movil = \App\Models\Movil::find($id);

            if (!$movil) {
                return response()->json(['message' => "El móvil con ID {$id} no existe en la base de datos"], 404);
            }

            // 3. Acceder a la sesión
            $carrito = $request->session()->get('carrito', []);
            
            $carrito[$id] = [
                'movil_id' => $movil->id,
                'cantidad' => ($carrito[$id]['cantidad'] ?? 0) + 1,
                'precio'   => (float) $movil->precio,
            ];

            // 4. Guardar
            $request->session()->put('carrito', $carrito);

            return response()->json([
                'message' => 'Afegit!',
                'total_items' => count($carrito)
            ]);

        } catch (\Throwable $e) {
            // ESTO TE DIRÁ EL ERROR REAL EN LA PESTAÑA "PREVIEW" DE CHROME
            return response()->json([
                'error' => $e->getMessage(),
                'file' => $e->getFile(),
                'line' => $e->getLine()
            ], 500);
        }
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