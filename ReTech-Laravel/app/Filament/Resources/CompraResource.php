<?php

namespace App\Filament\Resources;

use App\Filament\Resources\CompraResource\Pages;
use App\Filament\Resources\CompraResource\RelationManagers;
use App\Models\Compra;
use Filament\Forms;
use Filament\Resources\Form;
use Filament\Resources\Resource;
use Filament\Resources\Table;
use Filament\Tables;

class CompraResource extends Resource
{
    protected static ?string $model = Compra::class;

    protected static ?string $navigationIcon = 'heroicon-o-collection';

    public static function form(Form $form): Form
    {
        return $form
            ->schema([
                Forms\Components\Section::make('Cabecera del Pedido')
                    ->schema([
                        Forms\Components\Select::make('cliente_user_id')
                            ->relationship('cliente', 'nombre')
                            ->searchable()
                            ->required(),

                        Forms\Components\Select::make('metodo_pago')
                            ->options([
                                'Tarjeta'        => 'Tarjeta',
                                'Transferencia'  => 'Transferencia',
                            ])->required(),

                        // ── NUEVO: estado del pago ──────────────────────────
                        Forms\Components\Select::make('estado')
                            ->options([
                                'pendiente' => 'Pendiente',
                                'pagado'    => 'Pagado',
                                'fallido'   => 'Fallido',
                            ])
                            ->default('pendiente')
                            ->required(),

                        Forms\Components\TextInput::make('precio_total')
                            ->label('Total del Carrito')
                            ->numeric()
                            ->prefix('€')
                            ->disabled()
                            ->dehydrated()
                            ->placeholder(function (callable $get, callable $set) {
                                $items = $get('items') ?? [];
                                $total = 0;
                                foreach ($items as $item) {
                                    $total += (float)($item['precio_unitario'] ?? 0) * (int)($item['cantidad'] ?? 1);
                                }
                                $set('precio_total', $total);
                                return $total;
                            }),

                        // ── NUEVO: intent de Stripe (solo lectura) ──────────
                        Forms\Components\TextInput::make('stripe_intent')
                            ->label('Stripe Intent ID')
                            ->disabled()
                            ->dehydrated()
                            ->placeholder('Generado automáticamente por Stripe')
                            ->columnSpan(2),

                    ])->columns(3),

                Forms\Components\Section::make('Carrito / Ítems')
                    ->schema([
                        Forms\Components\Repeater::make('items')
                            ->label('Productos en el carrito')
                            ->reactive()
                            ->schema([
                                Forms\Components\Select::make('movil_id')
                                    ->label('Móvil')
                                    ->options(\App\Models\Movil::all()->pluck('full_description', 'id'))
                                    ->required()
                                    ->reactive()
                                    ->afterStateUpdated(function ($state, callable $set) {
                                        $movil = \App\Models\Movil::find($state);
                                        if ($movil) {
                                            $set('precio_unitario', $movil->precio);
                                        }
                                    })
                                    ->columnSpan(3),

                                Forms\Components\TextInput::make('cantidad')
                                    ->numeric()
                                    ->default(1)
                                    ->required()
                                    ->reactive()
                                    ->columnSpan(1),

                                Forms\Components\TextInput::make('precio_unitario')
                                    ->label('Precio/u')
                                    ->numeric()
                                    ->prefix('€')
                                    ->required()
                                    ->reactive()
                                    ->columnSpan(2),
                            ])
                            ->columns(6)
                            ->createItemButtonLabel('Añadir producto')
                            ->defaultItems(1),
                    ]),
            ]);
    }

    public static function table(Table $table): Table
    {
        return $table
            ->columns([
                Tables\Columns\TextColumn::make('created_at')
                    ->label('Fecha')
                    ->dateTime()
                    ->sortable(),

                Tables\Columns\TextColumn::make('cliente.nombre')
                    ->label('Cliente'),

                Tables\Columns\TextColumn::make('precio_total')
                    ->label('Total')
                    ->money('eur')
                    ->sortable(),

                Tables\Columns\BadgeColumn::make('metodo_pago')
                    ->colors(['primary' => 'stripe', 'success' => 'Tarjeta', 'warning' => 'Transferencia', 'secondary' => 'Efectivo']),

                // ── NUEVO: badge de estado ──────────────────────────────────
                Tables\Columns\BadgeColumn::make('estado')
                    ->colors([
                        'warning' => 'pendiente',
                        'success' => 'pagado',
                        'danger'  => 'fallido',
                    ]),

                Tables\Columns\TextColumn::make('stripe_intent')
                    ->label('Stripe ID')
                    ->limit(24)
                    ->tooltip(fn ($record) => $record->stripe_intent),
            ])
            ->filters([
                Tables\Filters\SelectFilter::make('metodo_pago'),

                // ── NUEVO: filtro por estado ────────────────────────────────
                Tables\Filters\SelectFilter::make('estado')
                    ->options([
                        'pendiente' => 'Pendiente',
                        'pagado'    => 'Pagado',
                        'fallido'   => 'Fallido',
                    ]),
            ]);
    }

    public static function getRelations(): array
    {
        return [];
    }

    public static function getPages(): array
    {
        return [
            'index'  => Pages\ListCompras::route('/'),
            'create' => Pages\CreateCompra::route('/create'),
            'edit'   => Pages\EditCompra::route('/{record}/edit'),
        ];
    }
}