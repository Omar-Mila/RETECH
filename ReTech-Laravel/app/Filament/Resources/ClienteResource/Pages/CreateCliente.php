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
        // Extraemos los campos que pertenecen a la tabla 'clientes'
        $this->clienteData = [
            'nif'           => $data['nif']           ?? null,
            'nombre'        => $data['nombre']        ?? null,
            'apellidos'     => $data['apellidos']     ?? null,
            'telefono'      => $data['telefono']      ?? null,
            'calle'         => $data['calle']         ?? null,
            'municipio'     => $data['municipio']     ?? null,
            'provincia'     => $data['provincia']     ?? null,
            'codigo_postal' => $data['codigo_postal'] ?? null,
            'pais'          => $data['pais']          ?? null,
        ];

        unset(
            $data['nif'], $data['nombre'], $data['apellidos'], $data['telefono'],
            $data['calle'], $data['municipio'], $data['provincia'],
            $data['codigo_postal'], $data['pais']
        );

        $data['role'] = 'cliente';

        return $data;
    }

    protected function afterCreate(): void
    {
        // Solo creamos el perfil si los campos obligatorios están rellenos
        $obligatorios = ['nombre', 'apellidos', 'nif', 'telefono'];
        $todoRelleno  = collect($obligatorios)->every(fn ($k) => filled($this->clienteData[$k] ?? null));

        if ($todoRelleno) {
            $this->record->cliente()->create($this->clienteData);
        }
    }
}
