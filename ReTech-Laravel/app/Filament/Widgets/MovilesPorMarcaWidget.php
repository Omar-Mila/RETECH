<?php

namespace App\Filament\Widgets;

use App\Models\Movil;
use App\Models\Marca;
use Filament\Widgets\BarChartWidget;

class MovilesPorMarcaWidget extends BarChartWidget
{
    protected static ?int $sort = 4;

    protected static ?string $heading = 'Móviles por marca';

    protected static ?string $maxHeight = '280px';

    protected int | string | array $columnSpan = 1;

    protected function getData(): array
    {
        $datos = Movil::join('modelos', 'moviles.modelo_id', '=', 'modelos.id')
            ->join('marcas', 'modelos.marca_id', '=', 'marcas.id')
            ->selectRaw('marcas.nombre as marca, COUNT(*) as total, SUM(moviles.stock) as stock_total')
            ->groupBy('marcas.nombre')
            ->orderByDesc('total')
            ->get();

        $colores = [
            'rgba(59, 130, 246, 0.8)',
            'rgba(16, 185, 129, 0.8)',
            'rgba(245, 158, 11, 0.8)',
            'rgba(239, 68, 68, 0.8)',
            'rgba(139, 92, 246, 0.8)',
            'rgba(236, 72, 153, 0.8)',
            'rgba(20, 184, 166, 0.8)',
            'rgba(251, 191, 36, 0.8)',
        ];

        $labels    = $datos->pluck('marca')->toArray();
        $totales   = $datos->pluck('total')->toArray();
        $stocks    = $datos->pluck('stock_total')->toArray();
        $bgColors  = array_slice(array_merge($colores, $colores), 0, count($labels));

        return [
            'datasets' => [
                [
                    'label'           => 'Listados',
                    'data'            => $totales,
                    'backgroundColor' => $bgColors,
                    'borderRadius'    => 6,
                ],
                [
                    'label'           => 'Stock disponible',
                    'data'            => $stocks,
                    'backgroundColor' => array_map(fn ($c) => str_replace('0.8', '0.4', $c), $bgColors),
                    'borderRadius'    => 6,
                ],
            ],
            'labels' => $labels,
        ];
    }

    protected function getOptions(): array
    {
        return [
            'plugins' => [
                'legend' => ['display' => true, 'position' => 'top'],
            ],
            'scales' => [
                'x' => ['grid' => ['display' => false]],
                'y' => ['beginAtZero' => true, 'ticks' => ['precision' => 0]],
            ],
        ];
    }
}
