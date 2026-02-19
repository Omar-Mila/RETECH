<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use App\Models\Compra;
use App\Models\Movil;

class CompraController extends Controller
{
    //
    public function registrarCompra(Request $request)
    {
        return DB::transaction(function () use ($request) {
            $compra = Compra::create($request->all());
            $movil = Movil::find($request->movil_id);
            if ($movil->stock >= $request->cantidad) {
                $movil->decrement('stock', $request->cantidad);
            } else {
                throw new \Exception("No hay stock suficiente");
            }

            return $compra;
        });
    }
}
