<?php

namespace App\Filament\Resources\MovilResource\Pages;

use App\Filament\Resources\MovilResource;
use Filament\Pages\Actions;
use Filament\Resources\Pages\EditRecord;

class EditMovil extends EditRecord
{
    protected static string $resource = MovilResource::class;

    protected function getActions(): array
    {
        return [
            Actions\DeleteAction::make(),
        ];
    }
}
