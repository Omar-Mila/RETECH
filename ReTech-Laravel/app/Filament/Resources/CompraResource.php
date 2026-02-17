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
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\SoftDeletingScope;

class CompraResource extends Resource
{
    protected static ?string $model = Compra::class;

    protected static ?string $navigationIcon = 'heroicon-o-collection';

    public static function form(Form $form): Form
    {
        return $form
            ->schema([
                Forms\Components\Select::make('cliente_user_id')
                    ->relationship('cliente', 'nombre')
                    ->searchable()
                    ->required(),

                Forms\Components\Select::make('movil_id')
                    ->relationship('movil', 'id')
                    ->getOptionLabelFromRecordUsing(fn ($record) => "{$record->full_description}")
                    ->label('Móvil a vender')
                    ->searchable()
                    ->preload()
                    ->required()
                    ->reactive()
                    ->afterStateUpdated(function ($state, callable $set) {
                        $movil = \App\Models\Movil::find($state);
                        if ($movil) {
                            $set('precio_venta', $movil->precio);
                        }
                    }),

                Forms\Components\TextInput::make('precio_venta')
                    ->numeric()
                    ->prefix('€')
                    ->label('Precio de Venta')
                    ->required(),

                Forms\Components\TextInput::make('cantidad')
                    ->numeric()
                    ->default(1)
                    ->required()
                    ->rules([
                        static function (callable $get) {
                            return static function (string $attribute, $value, $fail) use ($get) {
                                $movilId = $get('movil_id');
                                if (!$movilId) return;

                                $movil = \App\Models\Movil::find($movilId);
                                if ($movil && $value > $movil->stock) {
                                    $fail("Stock insuficiente. Solo quedan {$movil->stock} unidades.");
                                }
                            };
                        },
                    ]),

                Forms\Components\Select::make('metodo_pago')
                    ->options([
                        'Tarjeta' => 'Tarjeta',
                        'Transferencia' => 'Transferencia',
                        'Efectivo' => 'Efectivo',
                    ])->required(),
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
                Tables\Columns\TextColumn::make('movil.modelo.nombre')
                    ->label('Móvil comprado'),
                Tables\Columns\TextColumn::make('precio_venta')
                    ->money('eur'),
                Tables\Columns\BadgeColumn::make('cantidad')
                    ->color('primary')
                    ->label('Cantidad'),
                Tables\Columns\BadgeColumn::make('metodo_pago')
                    ->color('primary'),
            ])
            ->filters([
                Tables\Filters\SelectFilter::make('metodo_pago'),
            ]);
    }
    
    public static function getRelations(): array
    {
        return [
            //
        ];
    }
    
    public static function getPages(): array
    {
        return [
            'index' => Pages\ListCompras::route('/'),
            'create' => Pages\CreateCompra::route('/create'),
            'edit' => Pages\EditCompra::route('/{record}/edit'),
        ];
    }    
}
