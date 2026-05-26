<?php

namespace App\Filament\Widgets;

use App\Models\Compra;
use Filament\Tables;
use Filament\Widgets\TableWidget as BaseWidget;
use Illuminate\Database\Eloquent\Builder;

class UltimasComprasWidget extends BaseWidget
{
    protected static ?int $sort = 5;

    protected static ?string $heading = 'Últimas compras';

    protected int | string | array $columnSpan = 'full';

    protected function getTableQuery(): Builder
    {
        return Compra::query()
            ->with('cliente')
            ->latest()
            ->limit(8);
    }

    protected function getTableColumns(): array
    {
        return [
            Tables\Columns\TextColumn::make('id')
                ->label('#')
                ->sortable(),

            Tables\Columns\TextColumn::make('created_at')
                ->label('Fecha')
                ->dateTime('d/m/Y H:i')
                ->sortable(),

            Tables\Columns\TextColumn::make('cliente.nombre')
                ->label('Cliente')
                ->default('—'),

            Tables\Columns\TextColumn::make('precio_total')
                ->label('Total')
                ->money('eur'),

            Tables\Columns\BadgeColumn::make('metodo_pago')
                ->label('Pago')
                ->colors([
                    'success' => 'Tarjeta',
                    'warning' => 'Transferencia',
                    'primary' => 'stripe',
                ]),

            Tables\Columns\BadgeColumn::make('estado')
                ->label('Estado')
                ->colors([
                    'warning' => 'pendiente',
                    'success' => 'pagado',
                    'danger'  => 'fallido',
                ]),
        ];
    }

    protected function getTableActions(): array
    {
        return [
            Tables\Actions\LinkAction::make('ver')
                ->label('Editar')
                ->url(fn (Compra $record) => route('filament.resources.compras.edit', $record))
                ->icon('heroicon-s-pencil'),
        ];
    }
}
