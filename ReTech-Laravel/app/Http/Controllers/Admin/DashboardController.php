<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Movil;
use App\Models\Empresa;
use App\Models\Modelo;
use Illuminate\Http\Request;

class DashboardController extends Controller
{
    public function index()
    {
        return view('admin.dashboard', [
            'totalMoviles' => Movil::count(),
            'totalEmpresas' => Empresa::count(),
            'totalModelos' => Modelo::count(),
        ]);
    }
}
