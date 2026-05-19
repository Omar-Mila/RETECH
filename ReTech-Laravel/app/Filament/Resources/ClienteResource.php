<?php

namespace App\Filament\Resources;

use App\Filament\Resources\ClienteResource\Pages;
use App\Models\User;
use Filament\Forms;
use Filament\Resources\Form;
use Filament\Resources\Resource;
use Filament\Resources\Table;
use Filament\Tables;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Support\Facades\Hash;

class ClienteResource extends Resource
{
    protected static ?string $model = User::class;

    protected static ?string $navigationIcon = 'heroicon-o-identification';
    protected static ?string $navigationLabel = 'Clientes';
    protected static ?string $pluralModelLabel = 'Clientes';
    protected static ?string $slug = 'clientes';

    public static function getEloquentQuery(): Builder
    {
        return User::query()->where('role', 'cliente')->with('cliente');
    }

    public static function form(Form $form): Form
    {
        return $form->schema([
            Forms\Components\Section::make('Cuenta de usuario')
                ->schema([
                    Forms\Components\TextInput::make('name')
                        ->label('Nombre de usuario')
                        ->required()
                        ->maxLength(30),

                    Forms\Components\TextInput::make('email')
                        ->email()
                        ->required()
                        ->unique(User::class, 'email', ignoreRecord: true),

                    Forms\Components\TextInput::make('password')
                        ->password()
                        ->label('Contraseña')
                        ->dehydrateStateUsing(fn ($state) => filled($state) ? Hash::make($state) : null)
                        ->dehydrated(fn ($state) => filled($state))
                        ->required(fn (string $context) => $context === 'create')
                        ->helperText('Déjalo vacío para no cambiar'),
                ])->columns(2),

            Forms\Components\Section::make('Datos del cliente')
                ->description('Si el cliente se registró con Google y aún no completó su perfil, estos campos estarán vacíos.')
                ->schema([
                    Forms\Components\TextInput::make('nif')
                        ->label('NIF / DNI')
                        ->unique('clientes', 'nif', ignorable: fn ($record) => $record?->cliente)
                        ->maxLength(9),

                    Forms\Components\TextInput::make('nombre')
                        ->label('Nombre')
                        ->maxLength(30),

                    Forms\Components\TextInput::make('apellidos')
                        ->maxLength(50),

                    Forms\Components\TextInput::make('telefono')
                        ->label('Teléfono')
                        ->tel()
                        ->maxLength(15),

                    Forms\Components\TextInput::make('direccion')
                        ->label('Dirección')
                        ->maxLength(100)
                        ->columnSpanFull(),
                ])->columns(2),
        ]);
    }

    public static function table(Table $table): Table
    {
        return $table
            ->columns([
                Tables\Columns\TextColumn::make('name')
                    ->label('Usuario')
                    ->sortable()
                    ->searchable(),

                Tables\Columns\IconColumn::make('google_id')
                    ->label('Google')
                    ->boolean()
                    ->trueIcon('heroicon-s-check-circle')
                    ->falseIcon('heroicon-s-minus-circle')
                    ->trueColor('primary')
                    ->falseColor('secondary'),

                Tables\Columns\TextColumn::make('cliente.nif')
                    ->label('NIF')
                    ->searchable()
                    ->default('—'),

                Tables\Columns\TextColumn::make('full_name')
                    ->label('Nombre Completo')
                    ->getStateUsing(fn ($record) => $record->cliente
                        ? trim("{$record->cliente->nombre} {$record->cliente->apellidos}")
                        : '—'),

                Tables\Columns\TextColumn::make('cliente.telefono')
                    ->label('Teléfono')
                    ->default('—'),

                Tables\Columns\TextColumn::make('email')
                    ->label('Email')
                    ->icon('heroicon-s-mail')
                    ->copyable(),

                Tables\Columns\IconColumn::make('email_verified_at')
                    ->label('Verificado')
                    ->boolean()
                    ->trueIcon('heroicon-s-badge-check')
                    ->falseIcon('heroicon-s-x-circle')
                    ->trueColor('success')
                    ->falseColor('danger'),
            ])
            ->filters([])
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
        return [];
    }

    public static function getPages(): array
    {
        return [
            'index'  => Pages\ListClientes::route('/'),
            'create' => Pages\CreateCliente::route('/create'),
            'edit'   => Pages\EditCliente::route('/{record}/edit'),
        ];
    }
}
