<?php

namespace App\Filament\Resources;

use App\Filament\Resources\ColorResource\Pages;
use App\Models\Color;
use Filament\Forms;
use Filament\Resources\Form;
use Filament\Resources\Resource;
use Filament\Resources\Table;
use Filament\Tables;

class ColorResource extends Resource
{
    protected static ?string $model = Color::class;

    protected static ?string $navigationIcon   = 'heroicon-o-color-swatch';
    protected static ?string $navigationLabel  = 'Colores';
    protected static ?string $modelLabel       = 'Color';
    protected static ?string $pluralModelLabel = 'Colores';
    protected static ?int    $navigationSort   = 6;

    public static function form(Form $form): Form
    {
        return $form
            ->schema([
                Forms\Components\Card::make()
                    ->schema([
                        Forms\Components\TextInput::make('nombre')
                            ->label('Nombre del Color')
                            ->required()
                            ->unique(ignoreRecord: true)
                            ->placeholder('Ej: Azul Medianoche')
                            ->maxLength(30),

                        Forms\Components\ColorPicker::make('codigo_hex')
                            ->label('Color Visual')
                            ->placeholder('#000000')
                            ->required(),
                    ])
                    ->columns(2),
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

                Tables\Columns\TextColumn::make('codigo_hex')
                    ->label('Código HEX')
                    ->fontFamily('mono')
                    ->searchable(),

                // Muestra visual del color
                Tables\Columns\TextColumn::make('muestra')
                    ->label('Muestra')
                    ->formatStateUsing(fn ($state) => ' ')
                    ->extraAttributes(fn ($record) => [
                        'style' => "background-color: {$record->codigo_hex};
                                    width: 40px;
                                    height: 22px;
                                    border-radius: 4px;
                                    border: 1px solid #ccc;
                                    display: inline-block;",
                    ]),
            ])
            ->defaultSort('nombre')
            ->filters([
                // Sin filtros específicos para colores
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
            'index'  => Pages\ListColors::route('/'),
            'create' => Pages\CreateColor::route('/create'),
            'edit'   => Pages\EditColor::route('/{record}/edit'),
        ];
    }
}
