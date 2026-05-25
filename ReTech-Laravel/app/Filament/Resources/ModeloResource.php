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

class ModeloResource extends Resource
{
    protected static ?string $model = Modelo::class;

    protected static ?string $navigationIcon   = 'heroicon-o-chip';
    protected static ?string $navigationLabel  = 'Modelos';
    protected static ?string $modelLabel       = 'Modelo';
    protected static ?string $pluralModelLabel = 'Modelos';
    protected static ?int    $navigationSort   = 4;

    public static function form(Form $form): Form
    {
        return $form
            ->schema([
                Forms\Components\Section::make('Información Básica')
                    ->schema([
                        Forms\Components\TextInput::make('nombre')
                            ->label('Nombre del Modelo')
                            ->required()
                            ->maxLength(50),

                        Forms\Components\Select::make('marca_id')
                            ->label('Marca')
                            ->relationship('marca', 'nombre')
                            ->required()
                            ->searchable(),

                        Forms\Components\Select::make('sistema_operativo_id')
                            ->label('Sistema Operativo')
                            ->relationship('sistemaOperativo', 'nombre')
                            ->required(),
                    ])->columns(3),

                Forms\Components\Section::make('Especificaciones Técnicas')
                    ->schema([
                        Forms\Components\TextInput::make('procesador')
                            ->label('Procesador')
                            ->required()
                            ->maxLength(50),

                        Forms\Components\Select::make('conector')
                            ->label('Conector de carga')
                            ->options([
                                'Type-C'    => 'Type-C',
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
                            ->label('Tipo de SIM')
                            ->options([
                                'SIM'        => 'SIM',
                                'eSIM'       => 'eSIM',
                                'Dual SIM'   => 'Dual SIM',
                                'SIM + eSIM' => 'SIM + eSIM',
                            ])->required(),
                    ])->columns(5),

                Forms\Components\Section::make('Hardware y Pantalla')
                    ->schema([
                        Forms\Components\Select::make('bateria_mah')
                            ->label('Batería (mAh)')
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

                        Forms\Components\Select::make('pantalla_pulgadas')
                            ->label('Tamaño de Pantalla')
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

                        Forms\Components\Select::make('hz_pantalla')
                            ->label('Tasa de Refresco')
                            ->options([
                                60  => '60 Hz (Básico)',
                                90  => '90 Hz (Fluido)',
                                120 => '120 Hz (Alta gama)',
                                144 => '144 Hz (Gaming)',
                            ])
                            ->required(),

                        Forms\Components\Select::make('camara_principal_mp')
                            ->label('Cámara Principal')
                            ->options([
                                12  => '12 MP',
                                48  => '48 MP',
                                50  => '50 MP',
                                64  => '64 MP',
                                108 => '108 MP',
                                200 => '200 MP',
                            ])
                            ->required()
                            ->searchable(),

                        Forms\Components\Select::make('camara_frontal_mp')
                            ->label('Cámara Selfie')
                            ->options([
                                8  => '8 MP',
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

                Tables\Columns\TextColumn::make('marca.nombre')
                    ->label('Marca')
                    ->sortable()
                    ->searchable()
                    ->color('primary'),

                Tables\Columns\TextColumn::make('sistemaOperativo.nombre')
                    ->label('Sistema Operativo')
                    ->sortable(),

                Tables\Columns\TextColumn::make('procesador')
                    ->label('Procesador')
                    ->searchable()
                    ->toggleable(isToggledHiddenByDefault: true),

                Tables\Columns\IconColumn::make('cinco_g')
                    ->label('5G')
                    ->boolean()
                    ->trueColor('success')
                    ->falseColor('secondary'),

                Tables\Columns\IconColumn::make('nfc')
                    ->label('NFC')
                    ->boolean()
                    ->trueColor('success')
                    ->falseColor('secondary'),

                Tables\Columns\TextColumn::make('conector')
                    ->label('Conector')
                    ->toggleable(isToggledHiddenByDefault: true),

                Tables\Columns\TextColumn::make('bateria_mah')
                    ->label('Batería')
                    ->formatStateUsing(fn ($state) => $state . ' mAh')
                    ->toggleable(isToggledHiddenByDefault: true),

                Tables\Columns\TextColumn::make('pantalla_pulgadas')
                    ->label('Pantalla')
                    ->formatStateUsing(fn ($state) => $state . '"')
                    ->toggleable(isToggledHiddenByDefault: true),
            ])
            ->defaultSort('marca.nombre')
            ->filters([
                // Filtro por Marca
                Tables\Filters\SelectFilter::make('marca_id')
                    ->label('Marca')
                    ->relationship('marca', 'nombre')
                    ->searchable()
                    ->placeholder('Todas las marcas'),

                // Filtro por Sistema Operativo
                Tables\Filters\SelectFilter::make('sistema_operativo_id')
                    ->label('Sistema Operativo')
                    ->relationship('sistemaOperativo', 'nombre')
                    ->placeholder('Todos los sistemas'),
            ])
            ->actions([
                Tables\Actions\EditAction::make()->label('Editar'),
                Tables\Actions\DeleteAction::make()->label('Eliminar'),
            ])
            ->bulkActions([
                Tables\Actions\DeleteBulkAction::make()->label('Eliminar seleccionados'),
            ]);
    }

    public static function getRelations(): array
    {
        return [
            RelationManagers\ImagesRelationManager::class,
        ];
    }

    public static function getPages(): array
    {
        return [
            'index'  => Pages\ListModelos::route('/'),
            'create' => Pages\CreateModelo::route('/create'),
            'edit'   => Pages\EditModelo::route('/{record}/edit'),
        ];
    }
}
