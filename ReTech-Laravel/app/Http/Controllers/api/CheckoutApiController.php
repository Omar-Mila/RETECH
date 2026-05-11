<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Compra;
use App\Models\Movil;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
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