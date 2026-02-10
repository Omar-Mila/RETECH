<?php

namespace App\Filament\Resources\ColorResource\Pages;

use App\Filament\Resources\ColorResource;
use Filament\Pages\Actions;
use Filament\Resources\Pages\EditRecord;

class EditColor extends EditRecord
{
    protected static string $resource = ColorResource::class;

    protected function getActions(): array
    {
        return [
            Actions\DeleteAction::make(),
        ];
    }
}
