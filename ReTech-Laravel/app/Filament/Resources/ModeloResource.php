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
                Forms\Components\Card::make()
                    ->schema([
                        Forms\Components\TextInput::make('nombre')
                            ->label('Nombre del Modelo')
                            ->required()
                            ->placeholder('Ej: Galaxy S24 Ultra')
                            ->maxLength(255),

                        // Relación: Usamos 'marca' que es el nombre del método en el Modelo
                        Forms\Components\Select::make('marca_id')
                            ->relationship('marca', 'nombre') // Cambiado a marca
                            ->label('Marca')
                            ->searchable()
                            ->preload()
                            ->required(),

                        Forms\Components\Textarea::make('descripcion')
                            ->label('Descripción del modelo')
                            ->rows(2)
                            ->columnSpanFull(),
                    ])
                    ->columns(2),
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
