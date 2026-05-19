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
            Actions\DeleteAction::make(),
        ];
    }

    protected function mutateFormDataBeforeFill(array $data): array
    {
        $cliente = $this->record->cliente;
        if ($cliente) {
            $data['nif']       = $cliente->nif;
            $data['nombre']    = $cliente->nombre;
            $data['apellidos'] = $cliente->apellidos;
            $data['telefono']  = $cliente->telefono;
            $data['direccion'] = $cliente->direccion;
        }
        return $data;
    }

    protected function mutateFormDataBeforeSave(array $data): array
    {
        $this->clienteData = [
            'nif'       => $data['nif'] ?? null,
            'nombre'    => $data['nombre'] ?? null,
            'apellidos' => $data['apellidos'] ?? null,
            'telefono'  => $data['telefono'] ?? null,
            'direccion' => $data['direccion'] ?? null,
        ];

        unset($data['nif'], $data['nombre'], $data['apellidos'], $data['telefono'], $data['direccion']);

        return $data;
    }

    protected function afterSave(): void
    {
        $required = ['nombre', 'apellidos', 'nif', 'direccion', 'telefono'];
        $allFilled = collect($required)->every(fn ($k) => filled($this->clienteData[$k] ?? null));

        if ($allFilled) {
            $this->record->cliente()->updateOrCreate(
                ['user_id' => $this->record->id],
                $this->clienteData
            );
        }
    }
}
