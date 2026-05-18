<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Mail\OrderConfirmed;
use App\Models\Compra;
use App\Models\ModeloImage;
use App\Models\Movil;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Mail;
use Stripe\Stripe;
use Stripe\PaymentIntent;
use Stripe\Exception\ApiErrorException;

class CheckoutApiController extends Controller
{
    private bool $hasWebhook;

    public function __construct()
    {
        Stripe::setApiKey(config('services.stripe.secret'));
        $this->hasWebhook = !empty(config('services.stripe.webhook_secret'));
    }

    public function createIntent(Request $request)
    {
        $rows = DB::table('carrito_items')->where('user_id', Auth::id())->get();

        if ($rows->isEmpty()) {
            return response()->json(['message' => 'El carrito está vacío'], 422);
        }

        $total = $this->calcularTotal($rows);

        if ($total <= 0) {
            return response()->json(['message' => 'Total inválido'], 422);
        }

        try {
            $intent = PaymentIntent::create([
                'amount'   => (int) round($total * 100),
                'currency' => 'eur',
                'metadata' => ['user_id' => Auth::id()],
                'automatic_payment_methods' => ['enabled' => true],
            ]);

            $request->session()->put('stripe_intent_id', $intent->id);

            return response()->json([
                'client_secret' => $intent->client_secret,
                'amount'        => $total,
            ]);
        } catch (ApiErrorException $e) {
            return response()->json(['message' => 'Error Stripe: ' . $e->getMessage()], 500);
        }
    }

    public function confirm(Request $request)
    {
        $request->validate(['payment_intent_id' => 'required|string']);

        if ($request->session()->get('stripe_intent_id') !== $request->payment_intent_id) {
            return response()->json(['message' => 'PaymentIntent no válido'], 403);
        }

        try {
            $intent = PaymentIntent::retrieve($request->payment_intent_id);
        } catch (ApiErrorException $e) {
            return response()->json(['message' => 'Error al verificar el pago'], 500);
        }

        if ($intent->status !== 'succeeded') {
            return response()->json(['message' => 'El pago no se ha completado', 'status' => $intent->status], 422);
        }

        $rows = DB::table('carrito_items')->where('user_id', Auth::id())->get();

        if ($rows->isEmpty()) {
            return response()->json(['message' => 'El carrito está vacío'], 422);
        }

        // Verificar stock
        foreach ($rows as $row) {
            $movil = Movil::find($row->movil_id);
            if (!$movil || $movil->stock < $row->cantidad) {
                return response()->json(['message' => "Stock insuficiente para móvil ID {$row->movil_id}"], 422);
            }
        }

        $moviles = Movil::whereIn('id', $rows->pluck('movil_id'))->get()->keyBy('id');
        $total   = $this->calcularTotal($rows);

        $items = $rows->map(fn($row) => [
            'movil_id' => $row->movil_id,
            'cantidad' => $row->cantidad,
            'precio'   => (float) $moviles[$row->movil_id]->precio,
        ])->values()->toArray();

        $estado = $this->hasWebhook ? 'pendiente' : 'pagado';

        $compra = Compra::create([
            'cliente_user_id' => Auth::id(),
            'items'           => $items,
            'precio_total'    => $total,
            'metodo_pago'     => 'stripe',
            'stripe_intent'   => $intent->id,
            'estado'          => $estado,
        ]);

        DB::table('carrito_items')->where('user_id', Auth::id())->delete();
        $request->session()->forget('stripe_intent_id');

        // Enviar email de confirmación
        try {
            $user    = Auth::user()->load('cliente');
            $cliente = $user->cliente;

            $clienteNombre = ($cliente?->nombre && $cliente?->apellidos)
                ? $cliente->nombre . ' ' . $cliente->apellidos
                : $user->name;

            // Cargar imágenes de Cloudinary de todos los modelos de esta compra
            $modeloIds = collect($moviles)->pluck('modelo_id')->unique()->values();
            $imagenes  = ModeloImage::whereIn('modelo_id', $modeloIds)->get();

            $itemsDetalle = collect($items)->map(function ($item) use ($moviles, $imagenes) {
                $movil = $moviles[$item['movil_id']] ?? null;
                if (!$movil) return null;
                $movil->load(['modelo', 'color']);

                // Buscar imagen: primero por color exacto, luego cualquier imagen del modelo
                $imagen = $imagenes->where('modelo_id', $movil->modelo_id)
                                   ->where('color_id', $movil->color_id)
                                   ->first()
                       ?? $imagenes->where('modelo_id', $movil->modelo_id)->first();

                return [
                    'modelo'        => $movil->modelo?->nombre ?? 'Producto',
                    'almacenamiento'=> $movil->almacenamiento,
                    'ram'           => $movil->ram,
                    'color'         => $movil->color?->nombre ?? '—',
                    'estado'        => $movil->estado,
                    'cantidad'      => $item['cantidad'],
                    'precio'        => $item['precio'],
                    'subtotal'      => round($item['precio'] * $item['cantidad'], 2),
                    'imagen_url'    => $imagen?->path,
                ];
            })->filter()->values()->toArray();

            $orderData = [
                'compra_id'          => $compra->id,
                'fecha'              => now()->format('d/m/Y'),
                'total'              => $total,
                'items'              => $itemsDetalle,
                'cliente_nombre'     => $clienteNombre,
                'cliente_email'      => $user->email,
                'cliente_nif'        => $cliente?->nif,
                'cliente_direccion'  => $cliente?->direccion,
                'cliente_telefono'   => $cliente?->telefono,
            ];

            $lang = in_array($request->lang, ['ca', 'es', 'en']) ? $request->lang : 'es';
            Mail::to($user->email)->send(new OrderConfirmed($orderData, $lang));
        } catch (\Exception $e) {
            // El email falla silenciosamente — la compra ya está registrada
            \Log::warning('Email de confirmación fallido: ' . $e->getMessage());
        }

        return response()->json([
            'message'   => '¡Pagament completado!',
            'compra_id' => $compra->id,
            'estado'    => $estado,
        ], 201);
    }

    public function webhook(Request $request)
    {
        $secret = config('services.stripe.webhook_secret');
        if (empty($secret)) return response()->json(['received' => true]);

        try {
            $event = \Stripe\Webhook::constructEvent(
                $request->getContent(),
                $request->header('Stripe-Signature'),
                $secret
            );
        } catch (\Exception $e) {
            return response()->json(['message' => 'Webhook inválido'], 400);
        }

        if ($event->type === 'payment_intent.succeeded') {
            Compra::where('stripe_intent', $event->data->object->id)
                ->where('estado', 'pendiente')
                ->update(['estado' => 'pagado']);
        }

        if ($event->type === 'payment_intent.payment_failed') {
            Compra::where('stripe_intent', $event->data->object->id)
                ->where('estado', 'pendiente')
                ->update(['estado' => 'fallido']);
        }

        return response()->json(['received' => true]);
    }

    private function calcularTotal($rows): float
    {
        $moviles = Movil::whereIn('id', $rows->pluck('movil_id'))->get()->keyBy('id');
        $total   = 0;
        foreach ($rows as $row) {
            if ($moviles->has($row->movil_id)) {
                $total += ($moviles[$row->movil_id]->precio) * $row->cantidad;
            }
        }
        return round($total, 2);
    }
}