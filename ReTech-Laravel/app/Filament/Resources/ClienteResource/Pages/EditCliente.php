<?php

namespace App\Filament\Resources\ClienteResource\Pages;

use App\Filament\Resources\ClienteResource;
use Filament\Pages\Actions;
use Filament\Resources\Pages\EditRecord;

class EditCliente extends EditRecord
{
    protected static string $resource = ClienteResource::class;

    protected array $clienteData = [];

    protected function getActions(): array
    {
        return [
            Actions\DeleteAction::make()->label('Eliminar cliente'),
        ];
    }

    // Rellenamos el formulario con los datos del cliente relacionado
    protected function mutateFormDataBeforeFill(array $data): array
    {
        $cliente = $this->record->cliente;
        if ($cliente) {
            $data['nif']           = $cliente->nif;
            $data['nombre']        = $cliente->nombre;
            $data['apellidos']     = $cliente->apellidos;
            $data['telefono']      = $cliente->telefono;
            $data['calle']         = $cliente->calle;
            $data['municipio']     = $cliente->municipio;
            $data['provincia']     = $cliente->provincia;
            $data['codigo_postal'] = $cliente->codigo_postal;
            $data['pais']          = $cliente->pais;
        }
        return $data;
    }

    // Antes de guardar, separamos los campos del cliente de los del usuario
    protected function mutateFormDataBeforeSave(array $data): array
    {
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

        return $data;
    }

    protected function afterSave(): void
    {
        $obligatorios = ['nombre', 'apellidos', 'nif', 'telefono'];
        $todoRelleno  = collect($obligatorios)->every(fn ($k) => filled($this->clienteData[$k] ?? null));

        if ($todoRelleno) {
            $this->record->cliente()->updateOrCreate(
                ['user_id' => $this->record->id],
                $this->clienteData
            );
        }
    }
}
