<?php

namespace App\Filament\Widgets;

use App\Models\Compra;
use Filament\Widgets\DoughnutChartWidget;

class ComprasPorEstadoWidget extends DoughnutChartWidget
{
    protected static ?int $sort = 3;

    protected static ?string $heading = 'Compras por estado';

    protected static ?string $maxHeight = '280px';

    protected int | string | array $columnSpan = 1;

    protected function getData(): array
    {
        $datos = Compra::selectRaw('estado, COUNT(*) as total')
            ->groupBy('estado')
            ->pluck('total', 'estado')
            ->toArray();

        $pagado    = $datos['pagado']    ?? 0;
        $pendiente = $datos['pendiente'] ?? 0;
        $fallido   = $datos['fallido']   ?? 0;

        return [
            'datasets' => [
                [
                    'data'            => [$pagado, $pendiente, $fallido],
                    'backgroundColor' => [
                        'rgba(16, 185, 129, 0.85)',
                        'rgba(245, 158, 11, 0.85)',
                        'rgba(239, 68, 68, 0.85)',
                    ],
                    'borderColor' => [
                        'rgba(16, 185, 129, 1)',
                        'rgba(245, 158, 11, 1)',
                        'rgba(239, 68, 68, 1)',
                    ],
                    'borderWidth' => 2,
                    'hoverOffset' => 6,
                ],
            ],
            'labels' => [
                "Pagado ($pagado)",
                "Pendiente ($pendiente)",
                "Fallido ($fallido)",
            ],
        ];
    }

    protected function getOptions(): array
    {
        return [
            'plugins' => [
                'legend' => [
                    'display'  => true,
                    'position' => 'bottom',
                ],
                'tooltip' => [
                    'callbacks' => [],
                ],
            ],
            'cutout' => '65%',
        ];
    }
}
