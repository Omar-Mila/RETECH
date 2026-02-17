<?php

namespace App\Filament\Resources;

use App\Filament\Resources\ClienteResource\Pages;
use App\Filament\Resources\ClienteResource\RelationManagers;
use App\Models\Cliente;
use Filament\Forms;
use Filament\Resources\Form;
use Filament\Resources\Resource;
use Filament\Resources\Table;
use Filament\Tables;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\SoftDeletingScope;

class ClienteResource extends Resource
{
    protected static ?string $model = Cliente::class;

    protected static ?string $navigationIcon = 'heroicon-o-identification';
    protected static ?string $navigationLabel = 'Clientes';
    protected static ?string $pluralModelLabel = 'Clientes';
    protected static ?string $slug = 'clientes';

    public static function form(Form $form): Form
    {
        return $form
            ->schema([
                Forms\Components\Section::make('Información del Cliente')
                    ->description('Datos personales y vinculación de cuenta')
                    ->schema([
                        Forms\Components\Select::make('user_id')
                            ->relationship('user', 'name')
                            ->label('Usuario asociado')
                            ->searchable()
                            ->required()
                            ->unique(ignorable: fn ($record) => $record)
                            ->helperText('Selecciona la cuenta de usuario que corresponde a este cliente'),

                        Forms\Components\TextInput::make('nif')
                            ->label('NIF / DNI')
                            ->required()
                            ->unique(ignorable: fn ($record) => $record)
                            ->maxLength(9),

                        Forms\Components\TextInput::make('nombre')
                            ->required()
                            ->maxLength(30),

                        Forms\Components\TextInput::make('apellidos')
                            ->required()
                            ->maxLength(50),

                        Forms\Components\TextInput::make('telefono')
                            ->label('Teléfono de contacto')
                            ->tel()
                            ->required()
                            ->maxLength(15),

                        Forms\Components\TextInput::make('direccion')
                            ->label('Dirección de envío/facturación')
                            ->required()
                            ->maxLength(100)
                            ->columnSpanFull(),
                    ])->columns(2),
            ]);
    }

    public static function table(Table $table): Table
    {
        return $table
            ->columns([
                Tables\Columns\TextColumn::make('user.name')
                    ->label('Usuario')
                    ->sortable()
                    ->searchable(),

                Tables\Columns\TextColumn::make('nif')
                    ->label('NIF')
                    ->searchable(),

                Tables\Columns\TextColumn::make('full_name')
                    ->label('Nombre Completo')
                    ->getStateUsing(fn ($record) => "{$record->nombre} {$record->apellidos}")
                    ->searchable(['nombre', 'apellidos']),

                Tables\Columns\TextColumn::make('telefono')
                    ->label('Teléfono'),

                Tables\Columns\TextColumn::make('user.email')
                    ->label('Email')
                    ->icon('heroicon-s-mail')
                    ->copyable(),
            ])
            ->filters([
                // Filtros si los necesitas más adelante
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
            'index' => Pages\ListClientes::route('/'),
            'create' => Pages\CreateCliente::route('/create'),
            'edit' => Pages\EditCliente::route('/{record}/edit'),
        ];
    }    
}
