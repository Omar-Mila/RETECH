<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Movil;
use App\Models\Modelo;
use App\Models\Color;
use Illuminate\Http\Request;


class MovilController extends Controller
{

    //lista de moviles
    public function index()
    {
        $moviles = Movil::with(['modelo.marca', 'color'])
            ->orderBy('created_at', 'desc')
            ->get();

        return view('admin.moviles.index', compact('moviles'));
    }

    //form edicion moviles
    public function editar(Movil $movil)
    {
        return view('admin.moviles.editar', [
            'movil' => $movil,
            'modelos' => Modelo::orderBy('nombre')->get(),
            'colores' => Color::orderBy('nombre')->get(),
        ]);
    }

    //actualizar movil
    public function actualizar(Request $request, Movil $movil)
    {
        $request->validate([
            'precio' => 'required|numeric|min:0',
            'estado' => 'required',
            'salud_bateria' => 'required|integer|min:0|max:100',
            'almacenamiento' => 'required|integer',
            'ram' => 'required|integer',
            'stock' => 'required|integer|min:0',
        ]);

        $movil->update($request->all());

        return redirect()->route('admin.moviles.index')
            ->with('ok', 'Móvil actualizado');
    }

    //eliminar movil
    public function eliminar(Movil $movil)
    {
        $movil->delete();

        return redirect()->route('admin.moviles.index')
            ->with('ok', 'Móvil eliminado');
    }

    //Crear Movil
    public function crear()
    {
        return view('admin.moviles.crear', [
            'modelos' => Modelo::orderBy('nombre')->get(),
            'colores' => Color::orderBy('nombre')->get(),
        ]);
    }

    //Guardar Movil
    public function guardar(Request $r)
    {
        $r->validate([
            'modelo_id' => 'required|exists:modelos,id',
            'color_id' => 'required|exists:colores,id',
            'precio' => 'required|numeric|min:0',
            'estado' => 'required',
            'salud_bateria' => 'required|integer|min:0|max:100',
            'almacenamiento' => 'required|integer',
            'ram' => 'required|integer',
            'stock' => 'required|integer|min:0',
        ]);

        Movil::create($r->all());

        return redirect()->back()->with('ok', 'Móvil creado correctamente');
    }
}
