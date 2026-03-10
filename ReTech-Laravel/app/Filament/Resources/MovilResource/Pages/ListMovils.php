<?php

namespace App\Filament\Resources\MovilResource\Pages;

use App\Filament\Resources\MovilResource;
use Filament\Pages\Actions;
use Filament\Resources\Pages\ListRecords;

class ListMovils extends ListRecords
{
    protected static string $resource = MovilResource::class;

    protected function getActions(): array
    {
        return [
            Actions\CreateAction::make(),
        ];
    }
}
