<?php

namespace App\Filament\Resources;

use App\Filament\Resources\CompraResource\Pages;
use App\Models\Compra;
use Filament\Forms;
use Filament\Resources\Form;
use Filament\Resources\Resource;
use Filament\Resources\Table;
use Filament\Tables;

class CompraResource extends Resource
{
    protected static ?string $model = Compra::class;

    protected static ?string $navigationIcon   = 'heroicon-o-shopping-bag';
    protected static ?string $navigationLabel  = 'Compras';
    protected static ?string $modelLabel       = 'Compra';
    protected static ?string $pluralModelLabel = 'Compras';
    protected static ?int    $navigationSort   = 2;

    public static function form(Form $form): Form
    {
        return $form
            ->schema([
                Forms\Components\Section::make('Cabecera del Pedido')
                    ->schema([
                        Forms\Components\Select::make('cliente_user_id')
                            ->label('Cliente')
                            ->relationship('cliente', 'nombre')
                            ->searchable()
                            ->required(),

                        Forms\Components\Select::make('metodo_pago')
                            ->label('Método de pago')
                            ->options([
                                'Tarjeta'       => 'Tarjeta',
                                'Transferencia' => 'Transferencia',
                            ])->required(),

                        Forms\Components\Select::make('estado')
                            ->label('Estado del pago')
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
                            ->default(0),

                        Forms\Components\TextInput::make('stripe_intent')
                            ->label('Stripe Intent ID')
                            ->disabled()
                            ->dehydrated()
                            ->placeholder('Generado automáticamente por Stripe')
                            ->columnSpan(2),
                    ])->columns(3),

                Forms\Components\Section::make('Productos del Pedido')
                    ->schema([
                        Forms\Components\Repeater::make('items')
                            ->label('Artículos')
                            ->reactive()
                            ->afterStateUpdated(function (callable $get, callable $set) {
                                $items = $get('items') ?? [];
                                $total = 0;
                                foreach ($items as $item) {
                                    $total += (float) ($item['precio'] ?? 0) * (int) ($item['cantidad'] ?? 1);
                                }
                                $set('precio_total', $total);
                            })
                            ->afterStateHydrated(function ($component, $state) {
                                if (is_string($state)) {
                                    $decoded = json_decode($state, true) ?? [];
                                    $component->state(array_map(function ($item) {
                                        $item['precio']   = (float) ($item['precio'] ?? 0);
                                        $item['cantidad'] = (int) ($item['cantidad'] ?? 1);
                                        return $item;
                                    }, $decoded));
                                }
                            })
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
                                    ->label('Cantidad')
                                    ->numeric()
                                    ->default(1)
                                    ->required()
                                    ->reactive()
                                    ->columnSpan(1),

                                Forms\Components\TextInput::make('precio')
                                    ->label('Precio/u')
                                    ->numeric()
                                    ->prefix('€')
                                    ->required()
                                    ->reactive()
                                    ->dehydrated()
                                    ->afterStateHydrated(function ($component, $state) {
                                        $component->state((float) $state);
                                    })
                                    ->columnSpan(2),
                            ])
                            ->columns(6)
                            ->createItemButtonLabel('+ Añadir producto')
                            ->defaultItems(1),
                    ]),
            ]);
    }

    public static function table(Table $table): Table
    {
        return $table
            ->columns([
                Tables\Columns\TextColumn::make('id')
                    ->label('#')
                    ->sortable(),

                Tables\Columns\TextColumn::make('created_at')
                    ->label('Fecha')
                    ->dateTime('d/m/Y H:i')
                    ->sortable(),

                Tables\Columns\TextColumn::make('cliente.nombre')
                    ->label('Cliente')
                    ->searchable()
                    ->sortable(),

                Tables\Columns\TextColumn::make('precio_total')
                    ->label('Total')
                    ->money('eur')
                    ->sortable(),

                Tables\Columns\BadgeColumn::make('metodo_pago')
                    ->label('Método de pago')
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

                Tables\Columns\TextColumn::make('stripe_intent')
                    ->label('Stripe ID')
                    ->limit(24)
                    ->tooltip(fn ($record) => $record->stripe_intent)
                    ->toggleable(isToggledHiddenByDefault: true),
            ])
            ->defaultSort('created_at', 'desc')
            ->filters([
                // La clave interna 'pago' es distinta del campo real 'metodo_pago'
                // para evitar que Filament auto-pueble el select con valores de la BD
                Tables\Filters\Filter::make('filtro_pago')
                    ->label('Método de pago')
                    ->form([
                        \Filament\Forms\Components\Select::make('pago')
                            ->label('Método de pago')
                            ->placeholder('Todos')
                            ->options([
                                'Tarjeta'       => 'Tarjeta',
                                'Transferencia' => 'Transferencia',
                                'stripe'        => 'Stripe',
                            ]),
                    ])
                    ->query(fn ($query, array $data) =>
                        filled($data['pago'])
                            ? $query->where('metodo_pago', $data['pago'])
                            : $query
                    )
                    ->indicateUsing(fn (array $data) =>
                        filled($data['pago']) ? 'Pago: ' . $data['pago'] : null
                    ),

                Tables\Filters\Filter::make('estado')
                    ->label('Estado del pago')
                    ->form([
                        \Filament\Forms\Components\Select::make('estado')
                            ->label('Estado')
                            ->placeholder('Todos')
                            ->options([
                                'pendiente' => 'Pendiente',
                                'pagado'    => 'Pagado',
                                'fallido'   => 'Fallido',
                            ]),
                    ])
                    ->query(fn ($query, array $data) =>
                        filled($data['estado'])
                            ? $query->where('estado', $data['estado'])
                            : $query
                    )
                    ->indicateUsing(fn (array $data) =>
                        filled($data['estado']) ? 'Estado: ' . ucfirst($data['estado']) : null
                    ),

                Tables\Filters\Filter::make('hoy')
                    ->label('Solo hoy')
                    ->query(fn ($query) => $query->whereDate('created_at', today())),

                Tables\Filters\Filter::make('este_mes')
                    ->label('Este mes')
                    ->query(fn ($query) => $query->whereMonth('created_at', now()->month)
                                                  ->whereYear('created_at', now()->year)),
            ])
            ->actions([
                Tables\Actions\EditAction::make()->label('Editar'),
                Tables\Actions\DeleteAction::make()->label('Eliminar'),
            ])
            ->bulkActions([
                Tables\Actions\DeleteBulkAction::make()->label('Eliminar seleccionadas'),
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
