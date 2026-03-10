<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Movil;
use App\Models\Marca;
use App\Models\Modelo;
use App\Models\SistemaOperativo;

class ProductosController extends Controller
{
    //
    public function __construct() {
        $this->middleware('auth')->except(['search']);
    }
    public function index()
    {
        return view('productos.index');
    }
    public function search(Request $request){
        $query = $request->query('q', '');

        $moviles = Movil::with(['modelo.marca', 'modelo.sistemaOperativo', 'color'])
            ->whereHas('modelo', function ($q) use ($query) {
                $q->where('nombre', 'LIKE', "%{$query}%")
                  ->orWhereHas('marca', function ($q2) use ($query) {
                      $q2->where('nombre', 'LIKE', "%{$query}%");
                  });
            })
            ->where('stock', '>', 0)
            ->get()
            ->map(function ($movil) {
                return [
                    'id'               => $movil->id,
                    'modelo'           => $movil->modelo->nombre,
                    'marca'            => $movil->modelo->marca->nombre,
                    'color'            => $movil->color->nombre,
                    'precio'           => $movil->precio,
                    'estado'           => $movil->estado,
                    'salud_bateria'    => $movil->salud_bateria,
                    'almacenamiento'   => $movil->almacenamiento,
                    'ram'              => $movil->ram,
                    'sistema_operativo'=> $movil->modelo->sistemaOperativo->nombre,
                    'image_url'        => asset("images/modelos/{$movil->modelo_id}.jpg"),
                ];
            });

        return response()->json($moviles);
    }
}
