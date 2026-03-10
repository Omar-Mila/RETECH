<?php

namespace App\Filament\Resources;

use App\Filament\Resources\ColorResource\Pages;
use App\Filament\Resources\ColorResource\RelationManagers;
use App\Models\Color;
use Filament\Forms;
use Filament\Resources\Form;
use Filament\Resources\Resource;
use Filament\Resources\Table;
use Filament\Tables;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\SoftDeletingScope;
use Illuminate\Support\Facades\Auth;

class ColorResource extends Resource
{
    protected static ?string $model = Color::class;

    protected static ?string $navigationIcon = 'heroicon-o-collection';

    public static function form(Form $form): Form
    {
        return $form
            ->schema([
                // Usamos una Card para que el formulario no ocupe toda la pantalla y se vea centrado
                Forms\Components\Card::make()
                    ->schema([
                        Forms\Components\TextInput::make('nombre')
                            ->label('Nombre del Color')
                            ->required()
                            ->unique(ignoreRecord: true) // Evita duplicar nombres (Negro, Rojo, etc.)
                            ->placeholder('Ej: Azul Medianoche')
                            ->maxLength(30),

                        // El ColorPicker permite al admin elegir el color en una paleta visual
                        Forms\Components\ColorPicker::make('codigo_hex')
                            ->label('Selector de Color Visual')
                            ->placeholder('#000000')
                            ->required(),
                    ])
                    ->columns(2), // Ponemos los dos campos uno al lado del otro
            ]);
    }

    public static function table(Table $table): Table
    {
        return $table
            ->columns([
                Tables\Columns\TextColumn::make('nombre')
                    ->label('Nombre')
                    ->sortable()
                    ->searchable(),

                // Mostramos el código Hexadecimal
                Tables\Columns\TextColumn::make('codigo_hex')
                    ->label('Código HEX')
                    ->fontFamily('mono'),

                // En Filament v2, para ver el color usamos un truco con 'copyable' o estilos
                // Si tu versión soporta ColorColumn úsala, si no, TextColumn cumple:
                Tables\Columns\TextColumn::make('Muestra')
                    ->label('Muestra')
                    ->formatStateUsing(fn ($state) => ' ') // Vaciamos el texto
                    ->extraAttributes(fn ($record) => [
                        'style' => "background-color: {$record->codigo_hex}; 
                                    width: 40px; 
                                    height: 20px; 
                                    border-radius: 4px;
                                    border: 1px solid #ccc;",
                    ]),
            ])
            ->filters([
                //
            ])
            ->actions([
                Tables\Actions\EditAction::make(),
                Tables\Actions\DeleteAction::make(),
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
            'index' => Pages\ListColors::route('/'),
            'create' => Pages\CreateColor::route('/create'),
            'edit' => Pages\EditColor::route('/{record}/edit'),
        ];
    }    
}
