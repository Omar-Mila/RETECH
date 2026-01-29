<?php

namespace App\Http\Controllers;

use App\Models\Movil;
use App\Models\Marca;
use Illuminate\Http\Request;

class MovilPublicController extends Controller
{
    public function index(Request $request)
    {
        $query = Movil::with(['modelo.marca', 'color'])
            ->where('stock', '>', 0);

        //filtro por marca
        if ($request->filled('marca')) {
            $query->whereHas('modelo.marca', function ($q) use ($request) {
                $q->where('id', $request->marca);
            });
        }

        //filtro por estado
        if ($request->filled('estado')) {
            $query->where('estado', $request->estado);
        }

        $moviles = $query->orderBy('precio')->get();
        $marcas = Marca::orderBy('nombre')->get();

        return view('moviles.index', compact('moviles', 'marcas'));
    }
}

