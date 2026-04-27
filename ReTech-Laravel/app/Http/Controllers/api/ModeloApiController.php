<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Modelo;
use App\Models\Movil;
use App\Models\ModeloImage;
use CloudinaryLabs\CloudinaryLaravel\Facades\Cloudinary;

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
        $modelo = Modelo::findOrFail($id);
        return response()->json($modelo);
    }

    

    public function options(Request $request, $modelId)
    {
        $base = Movil::where('modelo_id', $modelId);

        // Estats: sempre tots, sense filtres (és el primer pas)
        $estados = (clone $base)
            ->select('estado')
            ->distinct()
            ->pluck('estado');

        // Emmagatzematge: filtrat per estat si s'ha triat
        $qAlm = (clone $base);
        if ($request->estado) $qAlm->where('estado', $request->estado);
        $almacenamientos = $qAlm
            ->select('almacenamiento')
            ->distinct()
            ->orderBy('almacenamiento')
            ->pluck('almacenamiento');

        // Colors: filtrats per estat + emmagatzematge si s'han triat
        $qCol = (clone $base);
        if ($request->estado)        $qCol->where('estado', $request->estado);
        if ($request->almacenamiento) $qCol->where('almacenamiento', $request->almacenamiento);
        $colores = $qCol
            ->with('color:id,nombre')
            ->get()
            ->pluck('color')
            ->unique('id')
            ->values();

        // Bateries: filtrades per estat + emmagatzematge + color si s'han triat
        $qBat = (clone $base);
        if ($request->estado)        $qBat->where('estado', $request->estado);
        if ($request->almacenamiento) $qBat->where('almacenamiento', $request->almacenamiento);
        if ($request->color)         $qBat->where('color_id', $request->color);
        $baterias = $qBat
            ->select('salud_bateria')
            ->distinct()
            ->orderBy('salud_bateria')
            ->pluck('salud_bateria')
            ->map(fn($b) => [
                'valor' => $b,
                'label' => match((int)$b) {
                    100 => 'Nueva (100%)',
                    90  => 'Excelente Estado (90-95%)',
                    80  => 'Buen Estado (80-90%)',
                    default => "{$b}%"
                }
            ])->values();

        return response()->json([
            'estados'         => $estados,
            'almacenamientos' => $almacenamientos,
            'colores'         => $colores,
            'baterias'        => $baterias,
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
                'movil_id' => null,
                'modelo_id' => null
            ]);
        }

        return response()->json([
            'precio' => $movil->precio,
            'stock' => $movil->stock,
            'movil_id' => $movil->id,
            'modelo_id' => $movil->modelo_id,
            'estado' => $movil->estado,
            'ram' => $movil->ram,
            'almacenamiento' => $movil->almacenamiento,
            'color_id' => $movil->color_id,
            'salud_bateria' => $movil->salud_bateria,
        ]);
    }

    public function uploadImage(Request $request)
    {
        $request->validate([
            'image' => 'required|image',
            'modelo_id' => 'required|exists:modelos,id',
            'color_id' => 'nullable|exists:colores,id'
        ]);

        // subir a Cloudinary
        $uploaded = Cloudinary::upload(
            $request->file('image')->getRealPath(),
            [
                'folder' => 'modelos'
            ]
        );

        $url = $uploaded->getSecurePath();

        // guardar en DB
        $image = ModeloImage::create([
            'modelo_id' => $request->modelo_id,
            'color_id' => $request->color_id,
            'path' => $url
        ]);

        return response()->json($image);
    }

    public function images($modelId)
    {
        $images = ModeloImage::where('modelo_id', $modelId)
            ->get()
            ->map(function ($img) {
                return [
                    'color_id' => $img->color_id,
                    'url' => $img->path // ya es URL completa
                ];
            });

        return response()->json($images);
    }
}
