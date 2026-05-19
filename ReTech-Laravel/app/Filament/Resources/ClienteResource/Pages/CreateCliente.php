<?php

namespace App\Filament\Resources\ClienteResource\Pages;

use App\Filament\Resources\ClienteResource;
use Filament\Resources\Pages\CreateRecord;

class CreateCliente extends CreateRecord
{
    protected static string $resource = ClienteResource::class;

    protected array $clienteData = [];

    protected function mutateFormDataBeforeCreate(array $data): array
    {
        $this->clienteData = [
            'nif'       => $data['nif'] ?? null,
            'nombre'    => $data['nombre'] ?? null,
            'apellidos' => $data['apellidos'] ?? null,
            'telefono'  => $data['telefono'] ?? null,
            'direccion' => $data['direccion'] ?? null,
        ];

        unset($data['nif'], $data['nombre'], $data['apellidos'], $data['telefono'], $data['direccion']);
        $data['role'] = 'cliente';

        return $data;
    }

    protected function afterCreate(): void
    {
        $required = ['nombre', 'apellidos', 'nif', 'direccion', 'telefono'];
        $allFilled = collect($required)->every(fn ($k) => filled($this->clienteData[$k] ?? null));

        if ($allFilled) {
            $this->record->cliente()->create($this->clienteData);
        }
    }
}
