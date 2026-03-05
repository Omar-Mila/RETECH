<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Modelo;
use App\Models\Movil;

class ModeloApiController extends Controller
{
    public function index(Request $request)
    {
        $search = trim($request->query('search', ''));

        $models = Modelo::query() //obtenir tots els models
            ->when($search !== '', function ($query) use ($search) {
                $query->where('nombre', 'like', "%{$search}%");
            })
            ->orderBy('nombre')
            ->limit(10)
            ->get([
                'id',
                'nombre',
            ]);

        return response()->json($models);
    }

    public function search(Request $request)
    {
        $q = trim($request->query('q'));

        // evitar peticiones basura
        if (!$q || strlen($q) < 2) {
            return response()->json([]);
        }

        $modelos = \App\Models\Modelo::query()
            ->whereRaw('LOWER(nombre) LIKE ?', ['%' . strtolower($q) . '%'])
            ->orderBy('nombre')
            ->limit(8)
            ->get([
                'id',
                'nombre',
            ]);

        return response()->json($modelos);
    }

    public function show($id)
    {
        return Modelo::find($id);
    }

    

public function options($modelId)
    {
        $moviles = Movil::where('modelo_id', $modelId);

        return response()->json([
            'estados' => $moviles->clone()->select('estado')->distinct()->pluck('estado'),
            
            'almacenamientos' => $moviles->clone()->select('almacenamiento')->distinct()->pluck('almacenamiento'),
            
            'rams' => $moviles->clone()->select('ram')->distinct()->pluck('ram'),

            'colores' => $moviles->clone()
                ->with('color:id,nombre')
                ->get()
                ->pluck('color')
                ->unique('id')
                ->values()
        ]);
    }

 

public function price(Request $request, $modelId)
    {
        $query = Movil::where('modelo_id', $modelId)
            ->where('stock', '>', 0);

        // filtros opcionales
        if ($request->estado) {
            $query->where('estado', $request->estado);
        }

        if ($request->ram) {
            $query->where('ram', $request->ram);
        }

        if ($request->almacenamiento) {
            $query->where('almacenamiento', $request->almacenamiento);
        }

        if ($request->color) {
            $query->where('color_id', $request->color);
        }

        if ($request->bateria_min) {
            $query->where('salud_bateria', '>=', $request->bateria_min);
        }

        // buscamos el más barato
        $movil = $query
            ->orderBy('precio')
            ->first();

        if (!$movil) {
            return response()->json([
                'precio' => null,
                'stock' => 0,
                'movil_id' => null
            ]);
        }

        return response()->json([
            'precio' => $movil->precio,
            'stock' => $movil->stock,
            'movil_id' => $movil->id,
            'estado' => $movil->estado,
            'ram' => $movil->ram,
            'almacenamiento' => $movil->almacenamiento,
            'color_id' => $movil->color_id,
            'salud_bateria' => $movil->salud_bateria,
        ]);
    }
}
