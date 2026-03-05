<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Compra;
use App\Models\Movil;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Stripe\Stripe;
use Stripe\PaymentIntent;
use Stripe\Exception\ApiErrorException;

/**
 * Funciona en los dos entornos automáticamente:
 *
 * LOCAL  → STRIPE_WEBHOOK_SECRET vacío en .env
 *          /confirm verifica el pago y crea la Compra con estado='pagado'
 *
 * PROD   → STRIPE_WEBHOOK_SECRET relleno en .env
 *          /confirm crea la Compra con estado='pendiente'
 *          El webhook la confirma cuando Stripe lo notifica
 */
class CheckoutApiController extends Controller
{
    private bool $hasWebhook;

    public function __construct()
    {
        Stripe::setApiKey(config('services.stripe.secret'));
        $this->hasWebhook = !empty(config('services.stripe.webhook_secret'));
    }

    // ── POST /api/checkout/intent ─────────────────────────────────────────────
    public function createIntent(Request $request)
    {
        $carrito = $request->session()->get('carrito', []);

        if (empty($carrito)) {
            return response()->json(['message' => 'El carrito está vacío'], 422);
        }

        $total = $this->calcularTotal($carrito);

        if ($total <= 0) {
            return response()->json(['message' => 'Total inválido'], 422);
        }

        try {
            $intent = PaymentIntent::create([
                'amount'   => (int) round($total * 100), // en céntimos
                'currency' => 'eur',
                'metadata' => [
                    'user_id' => Auth::id() ?? 'guest',
                ],
                'automatic_payment_methods' => ['enabled' => true],
            ]);

            // Guardamos el intent en sesión para verificarlo en /confirm
            $request->session()->put('stripe_intent_id', $intent->id);

            return response()->json([
                'client_secret' => $intent->client_secret,
                'amount'        => $total,
            ]);
        } catch (ApiErrorException $e) {
            return response()->json(['message' => 'Error Stripe: ' . $e->getMessage()], 500);
        }
    }

    // ── POST /api/checkout/confirm ────────────────────────────────────────────
    public function confirm(Request $request)
    {
        $request->validate([
            'payment_intent_id' => 'required|string',
        ]);

        // Verificar que el intent pertenece a esta sesión
        if ($request->session()->get('stripe_intent_id') !== $request->payment_intent_id) {
            return response()->json(['message' => 'PaymentIntent no válido'], 403);
        }

        try {
            $intent = PaymentIntent::retrieve($request->payment_intent_id);
        } catch (ApiErrorException $e) {
            return response()->json(['message' => 'Error al verificar el pago'], 500);
        }

        if ($intent->status !== 'succeeded') {
            return response()->json([
                'message' => 'El pago no se ha completado',
                'status'  => $intent->status,
            ], 422);
        }

        $carrito = $request->session()->get('carrito', []);

        if (empty($carrito)) {
            return response()->json(['message' => 'Carrito vacío'], 422);
        }

        // Verificar stock antes de registrar
        foreach ($carrito as $id => $row) {
            $movil = Movil::find($id);
            if (!$movil || $movil->stock < $row['cantidad']) {
                return response()->json([
                    'message' => "Stock insuficiente para el móvil ID {$id}",
                ], 422);
            }
        }

        $total = $this->calcularTotal($carrito);

        $items = array_values(array_map(fn($row) => [
            'movil_id' => $row['movil_id'],
            'cantidad' => $row['cantidad'],
            'precio'   => $row['precio'],
        ], $carrito));

        // LOCAL → 'pagado' directamente | PROD → 'pendiente' hasta que llegue el webhook
        $estado = $this->hasWebhook ? 'pendiente' : 'pagado';

        $compra = Compra::create([
            'cliente_user_id' => Auth::id(),
            'items'           => $items,
            'precio_total'    => $total,
            'metodo_pago'     => 'stripe',
            'stripe_intent'   => $intent->id,
            'estado'          => $estado,
        ]);

        $request->session()->forget(['carrito', 'stripe_intent_id']);

        return response()->json([
            'message'   => '¡Pago completado!',
            'compra_id' => $compra->id,
            'estado'    => $estado,
        ], 201);
    }

    // ── POST /stripe/webhook ──────────────────────────────────────────────────
    // Solo activo en producción (cuando STRIPE_WEBHOOK_SECRET está en .env)
    public function webhook(Request $request)
    {
        $secret = config('services.stripe.webhook_secret');

        if (empty($secret)) {
            return response()->json(['received' => true]);
        }

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
            $intent = $event->data->object;

            Compra::where('stripe_intent', $intent->id)
                ->where('estado', 'pendiente')
                ->update(['estado' => 'pagado']);
        }

        if ($event->type === 'payment_intent.payment_failed') {
            $intent = $event->data->object;

            Compra::where('stripe_intent', $intent->id)
                ->where('estado', 'pendiente')
                ->update(['estado' => 'fallido']);
        }

        return response()->json(['received' => true]);
    }

    // ── Helper ────────────────────────────────────────────────────────────────
    private function calcularTotal(array $carrito): float
    {
        $ids     = array_keys($carrito);
        $moviles = Movil::whereIn('id', $ids)->get()->keyBy('id');
        $total   = 0;

        foreach ($carrito as $id => $row) {
            if ($moviles->has($id)) {
                $total += $moviles[$id]->precio * $row['cantidad'];
            }
        }

        return round($total * 1.21, 2); // subtotal + IVA 21%
    }
}