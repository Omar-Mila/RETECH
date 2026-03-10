<?php

namespace App\Filament\Resources\CompraResource\Pages;

use App\Filament\Resources\CompraResource;
use Filament\Pages\Actions;
use Filament\Resources\Pages\EditRecord;

class EditCompra extends EditRecord
{
    protected static string $resource = CompraResource::class;

    protected function getActions(): array
    {
        return [
            Actions\DeleteAction::make(),
        ];
    }
    protected function afterDelete(): void
    {
        $data = $this->record;
        $movil = Movil::find($data->movil_id);
        
        if ($movil) {
            $movil->increment('stock', $data->cantidad);
        }
    }
}
