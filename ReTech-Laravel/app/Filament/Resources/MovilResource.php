<?php

namespace App\Filament\Resources;

use App\Filament\Resources\MovilResource\Pages;
use App\Filament\Resources\MovilResource\RelationManagers;
use App\Models\Movil;
use Filament\Forms;
use Filament\Resources\Form;
use Filament\Resources\Resource;
use Filament\Resources\Table;
use Filament\Tables;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\SoftDeletingScope;
use Illuminate\Support\Facades\Auth;


class MovilResource extends Resource
{
    protected static ?string $model = Movil::class;

    protected static ?string $navigationIcon = 'heroicon-o-collection';

    public static function form(Form $form): Form
    {
        return $form
            ->schema([
                Forms\Components\Section::make('Especificaciones')
                    ->schema([
                        Forms\Components\Select::make('modelo_id')
                            ->relationship('modelo', 'nombre')
                            ->required()
                            ->searchable(),

                        Forms\Components\Select::make('color_id')
                            ->relationship('color', 'nombre')
                            ->required(),

                        Forms\Components\TextInput::make('precio')
                            ->numeric()
                            ->prefix('€')
                            ->required(),

                        Forms\Components\TextInput::make('stock')
                            ->numeric()
                            ->required(),

                        Forms\Components\Select::make('estado')
                            ->options([
                                'Como nuevo' => 'Como nuevo',
                                'Buen estado' => 'Buen estado',
                                'Funcional' => 'Funcional',
                            ])->required(),

                        // Configuración de batería exacta
                        Forms\Components\Select::make('salud_bateria')
                            ->label('Salud de Batería')
                            ->options([
                                100 => 'Nueva (100%)',
                                90  => 'Excelente Estado (90-95%)',
                                80  => 'Buen Estado (80-90%)',
                            ])
                            ->required(),

                        Forms\Components\Select::make('almacenamiento')
                            ->options([
                                64 => '64 GB',
                                128 => '128 GB',
                                256 => '256 GB',
                                512 => '512 GB',
                                1024 => '1 TB',
                            ])->required(),

                        Forms\Components\Select::make('ram')
                            ->options([
                                4 => '4 GB',
                                8 => '8 GB',
                                16 => '16 GB',
                                32 => '32 GB',
                            ])->required(),

                        Forms\Components\Select::make('empresa_id')
                            ->relationship('empresa', 'nombre_empresa') // Verifica que esta columna existe en 'empresas'
                            ->required(),
                    ])->columns(2)
            ]);
    }

    public static function table(Table $table): Table
    {
        return $table
            ->columns([
                Tables\Columns\TextColumn::make('modelo.nombre')->label('Modelo')->sortable(),
                
                // Formato visual para la batería en la tabla
                Tables\Columns\BadgeColumn::make('salud_bateria')
                    ->label('Batería')
                    ->formatStateUsing(fn ($state) => match ((int)$state) {
                        100 => 'Nueva',
                        90  => 'Excelente Estado',
                        80  => 'Buen Estado',
                        default => $state . '%',
                    })
                    ->color(fn ($state) => match ((int)$state) {
                        100 => 'success',
                        97  => 'primary',
                        90  => 'warning',
                        default => 'secondary',
                    }),

                Tables\Columns\TextColumn::make('precio')->money('eur'),
                Tables\Columns\TextColumn::make('stock')->sortable(),
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
            'index' => Pages\ListMovils::route('/'),
            'create' => Pages\CreateMovil::route('/create'),
            'edit' => Pages\EditMovil::route('/{record}/edit'),
        ];
    }    
}
