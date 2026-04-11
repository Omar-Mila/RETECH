<?php

namespace App\Filament\Resources\ModeloResource\RelationManagers;

use Filament\Forms;
use Filament\Resources\Form;
use Filament\Resources\RelationManagers\RelationManager;
use Filament\Resources\Table;
use Filament\Tables;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\SoftDeletingScope;
use CloudinaryLabs\CloudinaryLaravel\Facades\Cloudinary;
use App\Models\ModeloImage;

class ImagesRelationManager extends RelationManager
{
    protected static string $relationship = 'images';

    protected static ?string $recordTitleAttribute = 'path';

    public static function form(Form $form): Form
    {
        return $form->schema([

            Forms\Components\Select::make('color_id')
                ->relationship('color', 'nombre')
                ->required(),

            Forms\Components\FileUpload::make('temp_image')
                ->label('Imatge')
                ->acceptedFileTypes(['image/jpeg', 'image/png', 'image/webp'])
                ->directory('temp')
                ->required(),

        ]);
    }

    public static function table(Table $table): Table
    {
        return $table
            ->columns([
                Tables\Columns\TextColumn::make('path'),
            ])
            ->filters([
                //
            ])
            ->headerActions([
                Tables\Actions\CreateAction::make()
                    ->mutateFormDataUsing(function (array $data): array { 

                        if (!empty($data['temp_image'])) {

                            $filePath = storage_path('app/public/' . $data['temp_image']);

                            $uploaded = \CloudinaryLabs\CloudinaryLaravel\Facades\Cloudinary::upload(
                                $filePath,
                                ['folder' => 'modelos']
                            );

                            $data['path'] = $uploaded->getSecurePath();
                        }

                        unset($data['temp_image']);

                        return $data;
                    }),
            ])
            ->actions([
                Tables\Actions\EditAction::make(),
                Tables\Actions\DeleteAction::make(),
            ])
            ->bulkActions([
                Tables\Actions\DeleteBulkAction::make(),
            ]);
    } 

    // public static function mutateFormDataBeforeCreate(array $data): array
    // {
    //     if (!empty($data['temp_image'])) {

    //         $filePath = storage_path('app/public/' . $data['temp_image']);

    //         $uploaded = Cloudinary::upload($filePath, [
    //             'folder' => 'modelos'
    //         ]);

    //         $data['path'] = $uploaded->getSecurePath();
    //     }

    //     unset($data['temp_image']);

    //     return $data;
    // } 

    protected function beforeCreate(): void
    {
        $data = $this->form->getState();

        if (!empty($data['temp_image'])) {

            $filePath = storage_path('app/' . $data['temp_image']);

            $uploaded = \CloudinaryLabs\CloudinaryLaravel\Facades\Cloudinary::upload(
                $filePath,
                ['folder' => 'modelos']
            );

            $this->data['path'] = $uploaded->getSecurePath();
        }

        unset($this->data['temp_image']);
    }
}
