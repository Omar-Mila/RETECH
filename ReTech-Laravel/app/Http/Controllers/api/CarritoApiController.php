<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Movil;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class CarritoApiController extends Controller
{
    public function index(Request $request)
    {
        $userId  = auth()->id();
        $rows    = DB::table('carrito_items')->where('user_id', $userId)->get();
        $carrito = [];
        foreach ($rows as $row) {
            $carrito[$row->movil_id] = ['cantidad' => $row->cantidad, 'precio' => 0];
        }
        $items = $this->hydrateItems($carrito);
        return response()->json([
            'items'       => $items,
            'total_items' => array_sum(array_column($items, 'cantidad')),
            'subtotal'    => $this->calcSubtotal($items),
        ]);
    }

    public function store(Request $request)
    {
        $id    = $request->input('movil_id');
        $movil = Movil::find($id);
        if (!$movil) return response()->json(['message' => "Móvil {$id} no existe"], 404);

        $userId   = auth()->id();
        $existing = DB::table('carrito_items')
            ->where('user_id', $userId)
            ->where('movil_id', $id)
            ->first();

        if ($existing) {
            DB::table('carrito_items')
                ->where('user_id', $userId)
                ->where('movil_id', $id)
                ->update(['cantidad' => $existing->cantidad + 1, 'updated_at' => now()]);
        } else {
            DB::table('carrito_items')->insert([
                'user_id'    => $userId,
                'movil_id'   => $id,
                'cantidad'   => 1,
                'created_at' => now(),
                'updated_at' => now(),
            ]);
        }

        return response()->json(['message' => 'Afegit!']);
    }

    public function update(Request $request, int $movilId)
    {
        $request->validate(['cantidad' => 'required|integer|min:1|max:10']);
        $movil = Movil::findOrFail($movilId);

        if ($request->cantidad > $movil->stock) {
            return response()->json(['message' => 'Stock insuficiente'], 422);
        }

        DB::table('carrito_items')
            ->where('user_id', auth()->id())
            ->where('movil_id', $movilId)
            ->update(['cantidad' => $request->cantidad, 'updated_at' => now()]);

        return response()->json(['message' => 'Actualitzat']);
    }

    public function destroy(Request $request, int $movilId)
    {
        DB::table('carrito_items')
            ->where('user_id', auth()->id())
            ->where('movil_id', $movilId)
            ->delete();
        return response()->json(['message' => 'Eliminat']);
    }

    public function clear(Request $request)
    {
        DB::table('carrito_items')->where('user_id', auth()->id())->delete();
        return response()->json(['message' => 'Carrito vaciado']);
    }

    private function hydrateItems(array $carrito): array
    {
        if (empty($carrito)) return [];

        $moviles = Movil::with(['modelo.marca', 'modelo.images', 'color'])
            ->whereIn('id', array_keys($carrito))
            ->get()
            ->keyBy('id');

        $items = [];
        foreach ($carrito as $id => $row) {
            if (!$moviles->has($id)) continue;
            $movil   = $moviles[$id];
            $precio  = (float) $movil->precio;
            $items[] = [
                'movil_id'       => $movil->id,
                'cantidad'       => $row['cantidad'],
                'precio'         => $precio,
                'modelo'         => $movil->modelo->nombre ?? '',
                'marca'          => $movil->modelo->marca->nombre ?? '',
                'color'          => $movil->color->nombre ?? '',
                'color_hex'      => $movil->color->codigo_hex ?? '#888888',
                'almacenamiento' => $movil->almacenamiento,
                'ram'            => $movil->ram,
                'estado'         => $movil->estado,
                'salud_bateria'  => $movil->salud_bateria,
                'stock'          => $movil->stock,
                'subtotal'       => round($precio * $row['cantidad'], 2),
                'imagen_url'     => $movil->modelo?->images
                                        ?->firstWhere('color_id', $movil->color_id)?->path
                                        ?? $movil->modelo?->images?->first()?->path,
            ];
        }
        return $items;
    }

    private function calcSubtotal(array $items): float
    {
        return round(array_sum(array_column($items, 'subtotal')), 2);
    }
}