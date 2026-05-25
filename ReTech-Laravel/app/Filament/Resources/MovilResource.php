<?php

namespace App\Filament\Resources;

use App\Filament\Resources\MovilResource\Pages;
use App\Models\Movil;
use Filament\Forms;
use Filament\Resources\Form;
use Filament\Resources\Resource;
use Filament\Resources\Table;
use Filament\Tables;

class MovilResource extends Resource
{
    protected static ?string $model = Movil::class;

    protected static ?string $navigationIcon   = 'heroicon-o-device-mobile';
    protected static ?string $navigationLabel  = 'Móviles';
    protected static ?string $modelLabel       = 'Móvil';
    protected static ?string $pluralModelLabel = 'Móviles';
    protected static ?int    $navigationSort   = 3;

    public static function form(Form $form): Form
    {
        return $form
            ->schema([
                Forms\Components\Section::make('Especificaciones')
                    ->schema([
                        Forms\Components\Select::make('modelo_id')
                            ->label('Modelo')
                            ->relationship('modelo', 'nombre')
                            ->required()
                            ->searchable(),

                        Forms\Components\Select::make('color_id')
                            ->label('Color')
                            ->relationship('color', 'nombre')
                            ->required(),

                        Forms\Components\TextInput::make('precio')
                            ->label('Precio (€)')
                            ->numeric()
                            ->prefix('€')
                            ->required(),

                        Forms\Components\TextInput::make('stock')
                            ->label('Stock')
                            ->numeric()
                            ->required(),

                        Forms\Components\Select::make('estado')
                            ->label('Estado del dispositivo')
                            ->options([
                                'Como nuevo'  => 'Como nuevo',
                                'Buen estado' => 'Buen estado',
                                'Funcional'   => 'Funcional',
                            ])->required(),

                        Forms\Components\Select::make('salud_bateria')
                            ->label('Salud de la Batería')
                            ->options([
                                100 => 'Nueva (100%)',
                                90  => 'Excelente (90-95%)',
                                80  => 'Buen estado (80-90%)',
                            ])
                            ->required(),

                        Forms\Components\Select::make('almacenamiento')
                            ->label('Almacenamiento interno')
                            ->options([
                                64   => '64 GB',
                                128  => '128 GB',
                                256  => '256 GB',
                                512  => '512 GB',
                                1024 => '1 TB',
                            ])->required(),

                        Forms\Components\Select::make('ram')
                            ->label('Memoria RAM')
                            ->options([
                                4  => '4 GB',
                                8  => '8 GB',
                                16 => '16 GB',
                                32 => '32 GB',
                            ])->required(),

                        Forms\Components\Select::make('empresa_id')
                            ->label('Empresa vendedora')
                            ->relationship('empresa', 'nombre_empresa')
                            ->required(),
                    ])->columns(2),
            ]);
    }

    public static function table(Table $table): Table
    {
        return $table
            ->columns([
                Tables\Columns\TextColumn::make('modelo.nombre')
                    ->label('Modelo')
                    ->sortable()
                    ->searchable(),

                Tables\Columns\TextColumn::make('modelo.marca.nombre')
                    ->label('Marca')
                    ->sortable(),

                Tables\Columns\TextColumn::make('color.nombre')
                    ->label('Color'),

                Tables\Columns\BadgeColumn::make('estado')
                    ->label('Estado')
                    ->colors([
                        'success' => 'Como nuevo',
                        'primary' => 'Buen estado',
                        'warning' => 'Funcional',
                    ]),

                Tables\Columns\BadgeColumn::make('salud_bateria')
                    ->label('Batería')
                    ->formatStateUsing(fn ($state) => match ((int) $state) {
                        100 => 'Nueva (100%)',
                        90  => 'Excelente (90%)',
                        80  => 'Buen estado (80%)',
                        default => $state . '%',
                    })
                    ->color(fn ($state) => match ((int) $state) {
                        100 => 'success',
                        90  => 'primary',
                        80  => 'warning',
                        default => 'secondary',
                    }),

                Tables\Columns\TextColumn::make('almacenamiento')
                    ->label('Almacen.')
                    ->formatStateUsing(fn ($state) => $state >= 1024 ? '1 TB' : $state . ' GB')
                    ->sortable(),

                Tables\Columns\TextColumn::make('precio')
                    ->label('Precio')
                    ->money('eur')
                    ->sortable(),

                Tables\Columns\BadgeColumn::make('stock')
                    ->label('Stock')
                    ->sortable()
                    ->color(fn ($state) => (int) $state > 0 ? 'success' : 'danger'),

                Tables\Columns\TextColumn::make('empresa.nombre_empresa')
                    ->label('Empresa')
                    ->toggleable(isToggledHiddenByDefault: true),
            ])
            ->defaultSort('precio')
            ->filters([
                Tables\Filters\Filter::make('marca')
                    ->label('Marca')
                    ->form([
                        \Filament\Forms\Components\Select::make('marca_id')
                            ->label('Marca')
                            ->placeholder('Todas las marcas')
                            ->options(\App\Models\Marca::orderBy('nombre')->pluck('nombre', 'id')),
                    ])
                    ->query(fn ($query, array $data) =>
                        filled($data['marca_id'])
                            ? $query->whereHas('modelo', fn ($q) => $q->where('marca_id', $data['marca_id']))
                            : $query
                    )
                    ->indicateUsing(fn (array $data) =>
                        filled($data['marca_id'])
                            ? 'Marca: ' . (\App\Models\Marca::find($data['marca_id'])?->nombre ?? '')
                            : null
                    ),

                Tables\Filters\SelectFilter::make('color_id')
                    ->label('Color')
                    ->relationship('color', 'nombre')
                    ->placeholder('Todos los colores'),

                Tables\Filters\SelectFilter::make('salud_bateria')
                    ->label('Salud de la batería')
                    ->options([
                        100 => 'Nueva (100%)',
                        90  => 'Excelente (90-95%)',
                        80  => 'Buen estado (80-90%)',
                    ])
                    ->placeholder('Cualquier estado'),

                Tables\Filters\Filter::make('precio')
                    ->label('Rango de precio')
                    ->form([
                        \Filament\Forms\Components\TextInput::make('precio_min')
                            ->label('Precio mínimo (€)')
                            ->numeric()
                            ->placeholder('0'),
                        \Filament\Forms\Components\TextInput::make('precio_max')
                            ->label('Precio máximo (€)')
                            ->numeric()
                            ->placeholder('sin límite'),
                    ])
                    ->query(fn ($query, array $data) => $query
                        ->when(filled($data['precio_min']), fn ($q) => $q->where('precio', '>=', $data['precio_min']))
                        ->when(filled($data['precio_max']), fn ($q) => $q->where('precio', '<=', $data['precio_max']))
                    )
                    ->indicateUsing(function (array $data) {
                        $parts = [];
                        if (filled($data['precio_min'])) $parts[] = 'Desde ' . $data['precio_min'] . '€';
                        if (filled($data['precio_max'])) $parts[] = 'Hasta ' . $data['precio_max'] . '€';
                        return $parts ? implode(' · ', $parts) : null;
                    }),

                Tables\Filters\SelectFilter::make('almacenamiento')
                    ->label('Almacenamiento')
                    ->options([
                        64   => '64 GB',
                        128  => '128 GB',
                        256  => '256 GB',
                        512  => '512 GB',
                        1024 => '1 TB',
                    ])
                    ->placeholder('Cualquier capacidad'),
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
        return [];
    }

    public static function getPages(): array
    {
        return [
            'index'  => Pages\ListMovils::route('/'),
            'create' => Pages\CreateMovil::route('/create'),
            'edit'   => Pages\EditMovil::route('/{record}/edit'),
        ];
    }
}
