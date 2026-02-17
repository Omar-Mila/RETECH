<?php

namespace App\Filament\Resources\CompraResource\Pages;

use App\Filament\Resources\CompraResource;
use Filament\Pages\Actions;
use Filament\Resources\Pages\CreateRecord;
use App\Models\Movil;

class CreateCompra extends CreateRecord
{
    protected static string $resource = CompraResource::class;

    protected function afterCreate(): void
    {
        // Obtenemos los datos del registro recién creado
        $data = $this->record;

        // Buscamos el móvil y restamos la cantidad comprada
        $movil = Movil::find($data->movil_id);
        
        if ($movil) {
            $movil->decrement('stock', $data->cantidad);
        }
    }
}
