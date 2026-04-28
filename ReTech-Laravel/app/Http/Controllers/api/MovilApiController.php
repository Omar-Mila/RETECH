<?php
    
namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Movil;
use App\Models\Compra;
use Illuminate\Http\Request;

class MovilApiController extends Controller
{
    public function index(Request $request)
    {
        $q = Movil::query()
            ->with(['modelo.marca', 'color']);

        if ($request->filled('marca')) {
            $q->whereHas('modelo.marca', function ($sub) use ($request) {
                $sub->where('id', $request->marca);
            });
        }

        if ($request->filled('estado')) {
            $q->where('estado', $request->estado);
        }

        return $q->get();
    }

    public function search(Request $request)
    {
        $q = trim($request->query('q'));

        // evitar peticiones basura
        if (!$q || strlen($q) < 2) {
            return response()->json([]);
        }

        $moviles = Movil::query()
            ->with('modelo') // cargar relación
            ->whereHas('modelo', function ($query) use ($q) {
                $query->whereRaw('LOWER(nombre) LIKE ?', ['%' . strtolower($q) . '%']);
            })
            ->orderBy('precio') // opcional pero UX mejor
            ->limit(6)
            ->get()
            ->map(function ($movil) {
                return [
                    'id' => $movil->id,
                    'name' => $movil->modelo->nombre,
                    'price' => number_format($movil->precio, 2),
                ];
            });

        return response()->json($moviles);
    }

    public function bestSellers()
    {
        $counts = [];
        Compra::all()->each(function ($compra) use (&$counts) {
            foreach ($compra->items as $item) {
                $id = $item['movil_id'];
                $counts[$id] = ($counts[$id] ?? 0) + $item['cantidad'];
            }
        });

        arsort($counts);
        $topIds = array_slice(array_keys($counts), 0, 4);

        if (empty($topIds)) {
            $moviles = Movil::with(['modelo.marca', 'color'])->where('stock', '>', 0)->latest()->limit(4)->get();
        } else {
            $moviles = Movil::with(['modelo.marca', 'color'])
                ->whereIn('id', $topIds)
                ->get()
                ->sortBy(fn($m) => array_search($m->id, $topIds))
                ->values();
        }

        return response()->json($moviles->map(function ($movil) {
            return [
                'id'             => $movil->id,
                'modelo_id'      => $movil->modelo_id,
                'modelo'         => $movil->modelo?->nombre,
                'precio'         => $movil->precio,
                'estado'         => $movil->estado,
                'almacenamiento' => $movil->almacenamiento,
                'ram'            => $movil->ram,
                'color'          => $movil->color?->nombre,
                'stock'          => $movil->stock,
            ];
        })->values());
    }

    public function show($id)
    {
        $movil = Movil::with(['modelo.marca', 'color', 'empresa'])
            ->findOrFail($id);

        return response()->json([
            'id' => $movil->id,
            'marca' => $movil->modelo->marca->nombre ?? null,
            'modelo' => $movil->modelo->nombre,
            'precio' => $movil->precio,
            'estado' => $movil->estado,
            'bateria' => $movil->salud_bateria,
            'almacenamiento' => $movil->almacenamiento,
            'ram' => $movil->ram,
            'color' => $movil->color->nombre ?? null,
            'stock' => $movil->stock,
            'empresa' => $movil->empresa->nombre_empresa ?? null,
        ]);
    }
}
