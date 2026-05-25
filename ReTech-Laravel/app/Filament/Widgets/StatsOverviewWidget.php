<?php

namespace App\Filament\Widgets;

use App\Models\Compra;
use App\Models\Movil;
use App\Models\User;
use Filament\Widgets\StatsOverviewWidget as BaseWidget;
use Filament\Widgets\StatsOverviewWidget\Card;

class StatsOverviewWidget extends BaseWidget
{
    protected static ?int $sort = 1;

    protected function getCards(): array
    {
        $ingresosTotales    = Compra::where('estado', 'pagado')->sum('precio_total');
        $ingresosMes        = Compra::where('estado', 'pagado')
                                    ->whereMonth('created_at', now()->month)
                                    ->whereYear('created_at', now()->year)
                                    ->sum('precio_total');
        $ingresosAnterior   = Compra::where('estado', 'pagado')
                                    ->whereMonth('created_at', now()->subMonth()->month)
                                    ->whereYear('created_at', now()->subMonth()->year)
                                    ->sum('precio_total');

        $tendenciaVentas = $this->calcularTendencia(
            Compra::where('estado', 'pagado')
                  ->whereYear('created_at', now()->year)
                  ->selectRaw('MONTH(created_at) as mes, SUM(precio_total) as total')
                  ->groupBy('mes')
                  ->orderBy('mes')
                  ->pluck('total', 'mes')
                  ->toArray()
        );

        $totalClientes      = User::where('role', 'cliente')->count();
        $clientesMes        = User::where('role', 'cliente')
                                  ->whereMonth('created_at', now()->month)
                                  ->whereYear('created_at', now()->year)
                                  ->count();

        $movilesEnStock     = Movil::where('stock', '>', 0)->count();
        $movilesAgotados    = Movil::where('stock', 0)->count();

        $totalComprasMes    = Compra::whereMonth('created_at', now()->month)
                                    ->whereYear('created_at', now()->year)
                                    ->count();
        $totalComprasAntes  = Compra::whereMonth('created_at', now()->subMonth()->month)
                                    ->whereYear('created_at', now()->subMonth()->year)
                                    ->count();

        $descCompras = $totalComprasAntes > 0
            ? ($totalComprasMes >= $totalComprasAntes
                ? '+' . round((($totalComprasMes - $totalComprasAntes) / $totalComprasAntes) * 100, 1) . '% vs mes anterior'
                : round((($totalComprasMes - $totalComprasAntes) / $totalComprasAntes) * 100, 1) . '% vs mes anterior')
            : 'Sin datos del mes anterior';

        $descIngresos = $ingresosAnterior > 0
            ? ($ingresosMes >= $ingresosAnterior
                ? '+' . number_format((($ingresosMes - $ingresosAnterior) / $ingresosAnterior) * 100, 1) . '% vs mes anterior'
                : number_format((($ingresosMes - $ingresosAnterior) / $ingresosAnterior) * 100, 1) . '% vs mes anterior')
            : 'Sin datos del mes anterior';

        return [
            Card::make('💰 Ingresos Totales', '€ ' . number_format($ingresosTotales, 2, ',', '.'))
                ->description('€ ' . number_format($ingresosMes, 2, ',', '.') . ' este mes · ' . $descIngresos)
                ->descriptionIcon($ingresosMes >= $ingresosAnterior ? 'heroicon-s-trending-up' : 'heroicon-s-trending-down')
                ->color($ingresosMes >= $ingresosAnterior ? 'success' : 'danger')
                ->chart($tendenciaVentas),

            Card::make('🛒 Pedidos este mes', $totalComprasMes)
                ->description($descCompras)
                ->descriptionIcon($totalComprasMes >= $totalComprasAntes ? 'heroicon-s-trending-up' : 'heroicon-s-trending-down')
                ->color($totalComprasMes >= $totalComprasAntes ? 'success' : 'danger'),

            Card::make('👥 Clientes registrados', $totalClientes)
                ->description('+' . $clientesMes . ' nuevos este mes')
                ->descriptionIcon('heroicon-s-user-group')
                ->color('primary'),

            Card::make('📱 Móviles en stock', $movilesEnStock)
                ->description($movilesAgotados . ' sin stock')
                ->descriptionIcon($movilesAgotados > 0 ? 'heroicon-s-exclamation' : 'heroicon-s-check-circle')
                ->color($movilesAgotados > 0 ? 'warning' : 'success'),
        ];
    }

    private function calcularTendencia(array $datos): array
    {
        $resultado = [];
        for ($i = 1; $i <= 12; $i++) {
            $resultado[] = $datos[$i] ?? 0;
        }
        return $resultado;
    }
}
