<?php

namespace App\Filament\Widgets;

use App\Models\Compra;
use Filament\Widgets\LineChartWidget;

class VentasMensualesWidget extends LineChartWidget
{
    protected static ?int $sort = 2;

    protected static ?string $heading = 'Ingresos mensuales (año en curso)';

    protected static ?string $maxHeight = '300px';

    protected int | string | array $columnSpan = 'full';

    protected function getData(): array
    {
        $meses = [
            1 => 'Ene', 2 => 'Feb', 3 => 'Mar', 4 => 'Abr',
            5 => 'May', 6 => 'Jun', 7 => 'Jul', 8 => 'Ago',
            9 => 'Sep', 10 => 'Oct', 11 => 'Nov', 12 => 'Dic',
        ];

        $anioActual = now()->year;

        // Ingresos pagados
        $ingresosPagados = Compra::where('estado', 'pagado')
            ->whereYear('created_at', $anioActual)
            ->selectRaw('MONTH(created_at) as mes, SUM(precio_total) as total')
            ->groupBy('mes')
            ->pluck('total', 'mes')
            ->toArray();

        // Total de pedidos (todos los estados)
        $totalPedidos = Compra::whereYear('created_at', $anioActual)
            ->selectRaw('MONTH(created_at) as mes, COUNT(*) as total')
            ->groupBy('mes')
            ->pluck('total', 'mes')
            ->toArray();

        $labels   = [];
        $ingresos = [];
        $pedidos  = [];

        for ($i = 1; $i <= 12; $i++) {
            $labels[]   = $meses[$i];
            $ingresos[] = round($ingresosPagados[$i] ?? 0, 2);
            $pedidos[]  = $totalPedidos[$i] ?? 0;
        }

        return [
            'datasets' => [
                [
                    'label'                => 'Ingresos (€)',
                    'data'                 => $ingresos,
                    'fill'                 => true,
                    'backgroundColor'      => 'rgba(16, 185, 129, 0.1)',
                    'borderColor'          => 'rgba(16, 185, 129, 1)',
                    'pointBackgroundColor' => 'rgba(16, 185, 129, 1)',
                    'tension'              => 0.4,
                ],
                [
                    'label'                => 'Nº Pedidos',
                    'data'                 => $pedidos,
                    'fill'                 => false,
                    'borderColor'          => 'rgba(59, 130, 246, 1)',
                    'pointBackgroundColor' => 'rgba(59, 130, 246, 1)',
                    'tension'              => 0.4,
                    'yAxisID'             => 'y1',
                ],
            ],
            'labels' => $labels,
        ];
    }

    protected function getOptions(): array
    {
        return [
            'scales' => [
                'y'  => [
                    'type'     => 'linear',
                    'display'  => true,
                    'position' => 'left',
                    'title'    => ['display' => true, 'text' => 'Ingresos (€)'],
                ],
                'y1' => [
                    'type'     => 'linear',
                    'display'  => true,
                    'position' => 'right',
                    'title'    => ['display' => true, 'text' => 'Pedidos'],
                    'grid'     => ['drawOnChartArea' => false],
                ],
            ],
            'plugins' => [
                'legend' => ['display' => true, 'position' => 'top'],
                'tooltip' => ['mode' => 'index', 'intersect' => false],
            ],
        ];
    }
}
