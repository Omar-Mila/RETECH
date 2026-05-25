<?php

namespace App\Filament\Resources;

use App\Filament\Resources\EmpresaResource\Pages;
use App\Models\Empresa;
use Filament\Forms;
use Filament\Resources\Form;
use Filament\Resources\Resource;
use Filament\Resources\Table;
use Filament\Tables;

class EmpresaResource extends Resource
{
    protected static ?string $model = Empresa::class;

    protected static ?string $navigationIcon   = 'heroicon-o-office-building';
    protected static ?string $navigationLabel  = 'Empresas';
    protected static ?string $modelLabel       = 'Empresa';
    protected static ?string $pluralModelLabel = 'Empresas';
    protected static ?int    $navigationSort   = 5;

    public static function form(Form $form): Form
    {
        return $form
            ->schema([
                Forms\Components\Card::make()
                    ->schema([
                        Forms\Components\TextInput::make('nombre_empresa')
                            ->label('Nombre de la empresa')
                            ->required()
                            ->maxLength(100),

                        Forms\Components\TextInput::make('cif')
                            ->label('CIF')
                            ->required()
                            ->unique(ignoreRecord: true)
                            ->maxLength(20),

                        Forms\Components\TextInput::make('telefono')
                            ->label('Teléfono')
                            ->tel()
                            ->required()
                            ->maxLength(20),

                        Forms\Components\TextInput::make('direccion_fiscal')
                            ->label('Dirección fiscal')
                            ->required()
                            ->maxLength(150),

                        Forms\Components\Textarea::make('descripcion')
                            ->label('Descripción')
                            ->rows(3)
                            ->columnSpanFull(),
                    ])->columns(2),
            ]);
    }

    public static function table(Table $table): Table
    {
        return $table
            ->columns([
                Tables\Columns\TextColumn::make('nombre_empresa')
                    ->label('Empresa')
                    ->searchable()
                    ->sortable(),

                Tables\Columns\TextColumn::make('cif')
                    ->label('CIF')
                    ->searchable()
                    ->copyable(),

                Tables\Columns\TextColumn::make('telefono')
                    ->label('Teléfono')
                    ->searchable(),

                Tables\Columns\TextColumn::make('direccion_fiscal')
                    ->label('Dirección fiscal')
                    ->limit(40)
                    ->toggleable(isToggledHiddenByDefault: true),

                Tables\Columns\TextColumn::make('moviles_count')
                    ->label('Móviles')
                    ->counts('moviles')
                    ->sortable()
                    ->color('success'),

                Tables\Columns\TextColumn::make('descripcion')
                    ->label('Descripción')
                    ->limit(50)
                    ->toggleable(isToggledHiddenByDefault: true),
            ])
            ->defaultSort('nombre_empresa')
            ->filters([
                Tables\Filters\Filter::make('con_moviles')
                    ->label('Con móviles')
                    ->query(fn ($query) => $query->has('moviles')),

                Tables\Filters\Filter::make('sin_moviles')
                    ->label('Sin móviles')
                    ->query(fn ($query) => $query->doesntHave('moviles')),
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
            'index'  => Pages\ListEmpresas::route('/'),
            'create' => Pages\CreateEmpresa::route('/create'),
            'edit'   => Pages\EditEmpresa::route('/{record}/edit'),
        ];
    }
}
