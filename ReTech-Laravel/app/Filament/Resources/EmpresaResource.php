<?php

namespace App\Filament\Resources;

use App\Filament\Resources\EmpresaResource\Pages;
use App\Filament\Resources\EmpresaResource\RelationManagers;
use App\Models\Empresa;
use Filament\Forms;
use Filament\Resources\Form;
use Filament\Resources\Resource;
use Filament\Resources\Table;
use Filament\Tables;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\SoftDeletingScope;

class EmpresaResource extends Resource
{
    protected static ?string $model = Empresa::class;

    protected static ?string $navigationIcon = 'heroicon-o-collection';

    public static function form(Form $form): Form
    {
        return $form
        ->schema([
            Forms\Components\Card::make()
                ->schema([
                    Forms\Components\TextInput::make('nombre_empresa')->required(),
                    Forms\Components\TextInput::make('cif')->required(),
                    Forms\Components\TextInput::make('telefono')->required(),
                    Forms\Components\TextInput::make('direccion_fiscal')->required(),
                    Forms\Components\Textarea::make('descripcion')->columnSpanFull(),
                ])->columns(2)
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
                    ->copyable(),

                Tables\Columns\TextColumn::make('telefono')
                    ->label('Teléfono'),

                // Esto usa tu relación moviles() y cuenta los registros automáticamente
                Tables\Columns\TextColumn::make('moviles_count')
                    ->label('Móviles Reacondicionados')
                    ->counts('moviles')
                    ->color('success'),

                Tables\Columns\TextColumn::make('user.name')
                    ->label('Usuario Admin')
                    ->toggleable(isToggledHiddenByDefault: true), // Campo oculto por defecto
            ])
            ->filters([])
            ->actions([
                Tables\Actions\EditAction::make(),
                Tables\Actions\DeleteAction::make(),
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
            'index' => Pages\ListEmpresas::route('/'),
            'create' => Pages\CreateEmpresa::route('/create'),
            'edit' => Pages\EditEmpresa::route('/{record}/edit'),
        ];
    }    
}
