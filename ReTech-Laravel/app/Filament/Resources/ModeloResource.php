<?php

namespace App\Filament\Resources;

use App\Filament\Resources\ModeloResource\Pages;
use App\Filament\Resources\ModeloResource\RelationManagers;
use App\Models\Modelo;
use Filament\Forms;
use Filament\Resources\Form;
use Filament\Resources\Resource;
use Filament\Resources\Table;
use Filament\Tables;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\SoftDeletingScope;

class ModeloResource extends Resource
{
    protected static ?string $model = Modelo::class;

    protected static ?string $navigationIcon = 'heroicon-o-collection';

    public static function form(Form $form): Form
{
    return $form
        ->schema([
            Forms\Components\Section::make('Información Básica')
                ->schema([
                    Forms\Components\TextInput::make('nombre')
                        ->required()
                        ->maxLength(50),
                    Forms\Components\Select::make('marca_id')
                        ->relationship('marca', 'nombre')
                        ->required()
                        ->searchable(),
                    Forms\Components\Select::make('sistema_operativo_id')
                        ->relationship('sistemaOperativo', 'nombre')
                        ->required(),
                ])->columns(3),

            Forms\Components\Section::make('Especificaciones Técnicas')
                ->schema([
                    Forms\Components\TextInput::make('procesador')
                        ->required()
                        ->maxLength(50),
                    Forms\Components\Select::make('conector')
                        ->options([
                            'Type-C' => 'Type-C',
                            'Lightning' => 'Lightning',
                            'Micro-USB' => 'Micro-USB',
                        ])->required(),
                    Forms\Components\Toggle::make('cinco_g')
                        ->label('¿Tiene 5G?')
                        ->inline(false),
                    Forms\Components\Toggle::make('nfc')
                        ->label('¿Tiene NFC?')
                        ->inline(false),
                    Forms\Components\Select::make('tipo_sim')
                        ->options([
                            'SIM' => 'SIM',
                            'eSIM' => 'eSIM',
                            'Dual SIM' => 'Dual SIM',
                            'SIM + eSIM' => 'SIM + eSIM',
                        ])->required(),
                ])->columns(5),

            Forms\Components\Section::make('Hardware y Pantalla')
            ->schema([
                // Batería con valores estándar de fábrica
                Forms\Components\Select::make('bateria_mah')
                    ->label('Capacidad Batería')
                    ->options([
                        3000 => '3000 mAh (Compactos)',
                        3500 => '3500 mAh',
                        4000 => '4000 mAh (Estándar)',
                        4500 => '4500 mAh',
                        5000 => '5000 mAh (Gran autonomía)',
                        6000 => '6000 mAh (Extra)',
                    ])
                    ->required()
                    ->searchable(),

                // Pantalla con tamaños comunes
                Forms\Components\Select::make('pantalla_pulgadas')
                    ->label('Tamaño Pantalla')
                    ->options([
                        '5.8' => '5.8"',
                        '6.1' => '6.1" (Estándar)',
                        '6.3' => '6.3"',
                        '6.5' => '6.5"',
                        '6.7' => '6.7" (Max/Plus)',
                        '6.8' => '6.8"',
                        '6.9' => '6.9"',
                    ])
                    ->required(),

                // Tasa de refresco fija
                Forms\Components\Select::make('hz_pantalla')
                    ->label('Tasa de Refresco')
                    ->options([
                        60 => '60 Hz (Básico)',
                        90 => '90 Hz (Fluido)',
                        120 => '120 Hz (Alta gama)',
                        144 => '144 Hz (Gaming)',
                    ])
                    ->required(),

                // Megapíxeles comunes para cámara principal
                Forms\Components\Select::make('camara_principal_mp')
                    ->label('Cámara Principal')
                    ->options([
                        12 => '12 MP',
                        48 => '48 MP',
                        50 => '50 MP',
                        64 => '64 MP',
                        108 => '108 MP',
                        200 => '200 MP',
                    ])
                    ->required()
                    ->searchable(),

                // Megapíxeles comunes para cámara frontal
                Forms\Components\Select::make('camara_frontal_mp')
                    ->label('Cámara Selfie')
                    ->options([
                        8 => '8 MP',
                        12 => '12 MP',
                        16 => '16 MP',
                        32 => '32 MP',
                        48 => '48 MP',
                    ])
                    ->required(),
            ])->columns(5),
        ]);
}
    
    public static function table(Table $table): Table
    {
        return $table
            ->columns([
                Tables\Columns\TextColumn::make('nombre')
                    ->label('Modelo')
                    ->searchable()
                    ->sortable(),

                // Accedemos al nombre de la marca a través de la relación
                Tables\Columns\TextColumn::make('marca.nombre')
                    ->label('Marca')
                    ->sortable()
                    ->color('primary'), // Esto cambia el color de la letra, no el fondo
            ])
            ->filters([
                // Filtro desplegable para ver modelos de una marca concreta
                Tables\Filters\SelectFilter::make('marca')
                    ->relationship('marca', 'nombre'),
            ])
            ->actions([
                Tables\Actions\EditAction::make(),
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
            'index' => Pages\ListModelos::route('/'),
            'create' => Pages\CreateModelo::route('/create'),
            'edit' => Pages\EditModelo::route('/{record}/edit'),
        ];
    }    
}
