<?php
    
namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Movil;
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
}
