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
            Forms\Components\Card::make()
                ->schema([
                    Forms\Components\Grid::make(2)->schema([
                        Forms\Components\Select::make('modelo_id')
                            ->relationship('modelo', 'nombre')
                            ->searchable()
                            ->preload()
                            ->required(),

                        Forms\Components\Select::make('color_id')
                            ->relationship('color', 'nombre')
                            ->required(),

                        Forms\Components\TextInput::make('precio')
                            ->numeric()
                            ->prefix('€')
                            ->required(),

                        Forms\Components\TextInput::make('stock')
                            ->numeric()
                            ->default(0)
                            ->required(),

                        Forms\Components\Select::make('estado')
                            ->options([
                                'Como nuevo' => 'Como nuevo',
                                'Buen estado' => 'Buen estado',
                                'Funcional' => 'Funcional',
                            ])->required(),

                        Forms\Components\TextInput::make('salud_bateria')
                            ->numeric()
                            ->suffix('%')
                            ->minValue(0)
                            ->maxValue(100)
                            ->required(),

                        Forms\Components\TextInput::make('almacenamiento')
                            ->numeric()
                            ->suffix('GB')
                            ->required(),

                        Forms\Components\TextInput::make('ram')
                            ->numeric()
                            ->suffix('GB')
                            ->required(),
                    ]),
                ])
        ]);
}

    public static function table(Table $table): Table
{
    return $table
        ->columns([
            Tables\Columns\TextColumn::make('modelo.nombre')
                ->label('Modelo')
                ->searchable()
                ->sortable(),

            Tables\Columns\TextColumn::make('color.nombre')
                ->label('Color'),

            Tables\Columns\TextColumn::make('precio')
                ->money('eur')
                ->sortable(),

            Tables\Columns\BadgeColumn::make('stock')
                ->color(static function ($state): string {
                    if ($state <= 2) return 'danger';
                    if ($state <= 5) return 'warning';
                    return 'success';
                })->sortable(),

            Tables\Columns\BadgeColumn::make('estado')
                ->colors([
                    'success' => 'Como nuevo',
                    'warning' => 'Buen estado',
                    'danger' => 'Funcional',
                ]),

            Tables\Columns\TextColumn::make('almacenamiento')
                ->suffix(' GB')
                ->sortable(),

            Tables\Columns\TextColumn::make('salud_bateria')
                ->label('Batería')
                ->suffix('%'),
        ])
        ->filters([
            Tables\Filters\SelectFilter::make('estado'),
            Tables\Filters\SelectFilter::make('modelo_id')
                ->relationship('modelo', 'nombre')
                ->label('Filtrar por Modelo'),
        ])
        ->actions([
            Tables\Actions\EditAction::make(),
        ])
        ->bulkActions([
            Tables\Actions\DeleteBulkAction::make(),
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
