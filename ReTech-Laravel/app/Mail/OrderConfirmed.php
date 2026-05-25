<?php

namespace App\Mail;

use Illuminate\Bus\Queueable;
use Illuminate\Mail\Mailable;
use Illuminate\Mail\Mailables\Content;
use Illuminate\Mail\Mailables\Envelope;
use Illuminate\Queue\SerializesModels;

class OrderConfirmed extends Mailable
{
    use Queueable, SerializesModels;

    public array $t;

    public function __construct(
        public readonly array $orderData,
        string $lang = 'es',
    ) {
        $this->t = $this->translations($lang);
    }

    public function envelope(): Envelope
    {
        return new Envelope(subject: $this->t['subject']);
    }

    public function content(): Content
    {
        return new Content(view: 'emails.order_confirmed');
    }

    private function translations(string $lang): array
    {
        $id   = $this->orderData['compra_id'];
        $name = $this->orderData['cliente_nombre'];

        return match ($lang) {
            'ca' => [
                'subject'        => "Comanda confirmada #{$id} — ReTech",
                'tagline'        => 'Tecnologia reacondicionada de confiança',
                'header_label'   => 'Comanda confirmada ✓',
                'greeting'       => "Gràcies per la teva compra, {$name}.",
                'intro'          => 'Ens fa molta il·lusió tenir-te com a client. La teva comanda està confirmada i en breu la prepararem per enviar-te.',
                'tracking'       => 'Quan enviem el paquet rebràs un correu amb el número de seguiment. Calculem que rebràs la teva comanda en <strong style="color:#0f172a;">1–3 dies laborables</strong>.',
                'tracking2'      => 'Per seguir la teva comanda connecta\'t al teu compte de ReTech i ves a la secció de <strong style="color:#0f172a;">Les meves comandes</strong>.',
                'cta'            => 'Veure les meves comandes →',
                'summary_title'  => 'Resum de la comanda',
                'date_label'     => 'Comanda realitzada el',
                'num_label'      => 'Número de comanda',
                'shipping_label' => 'Adreça d\'enviament',
                'tel'            => 'Tel:',
                'order_col'      => 'Comanda núm.',
                'sold_by'        => 'Venut per',
                'unit_price'     => 'Preu unit.',
                'qty'            => 'Quantitat',
                'subtotal'       => 'Subtotal',
                'shipping_cost'  => 'Despeses d\'enviament',
                'free'           => 'Gratis',
                'total'          => 'Preu total',
                'eco'            => '<strong>Amb aquesta compra dones una segona vida a la tecnologia.</strong><br>Comprar reacondicionat redueix fins a un 89% les emissions de CO₂ respecte a un dispositiu nou. Gràcies per ajudar el planeta.',
                'return_title'   => 'Si canvies d\'opinió',
                'return_body'    => 'Tens <strong>30 dies</strong> per retornar l\'article o sol·licitar un reemborsament. Per a això:',
                'return_1'       => 'Connecta\'t al teu compte a ReTech.',
                'return_2'       => 'Ves a <strong>Les meves comandes</strong> i fes clic a <strong>"Sol·licitar devolució"</strong>.',
                'return_3'       => 'També pots escriure\'ns a',
                'fraud_title'    => 'Prevenció de fraus',
                'fraud_body'     => 'ReTech i el seu equip <strong>mai et contactarà</strong> per processar o modificar la teva comanda fora de la plataforma, ni et demanarà que paguesis per transferència bancària. Si reps alguna comunicació sospitosa escriu-nos a',
                'signoff'        => 'Ens tornarem a posar en contacte quan la teva comanda estigui en camí. Fins aviat!',
                'team'           => 'L\'equip de ReTech',
                'footer_auto'    => 'Aquest missatge és una confirmació automàtica. Si us plau, no respondis directament a aquest correu.',
            ],
            'en' => [
                'subject'        => "Order confirmed #{$id} — ReTech",
                'tagline'        => 'Trusted refurbished technology',
                'header_label'   => 'Order confirmed ✓',
                'greeting'       => "Thank you for your purchase, {$name}.",
                'intro'          => 'We are thrilled to have you as a customer. Your order is confirmed and we will prepare it for shipping shortly.',
                'tracking'       => 'When we ship your package you will receive an email with the tracking number. We estimate you will receive your order within <strong style="color:#0f172a;">1–3 business days</strong>.',
                'tracking2'      => 'To track your order, log into your ReTech account and go to <strong style="color:#0f172a;">My orders</strong>.',
                'cta'            => 'View my orders →',
                'summary_title'  => 'Order summary',
                'date_label'     => 'Order placed on',
                'num_label'      => 'Order number',
                'shipping_label' => 'Shipping address',
                'tel'            => 'Tel:',
                'order_col'      => 'Order no.',
                'sold_by'        => 'Sold by',
                'unit_price'     => 'Unit price',
                'qty'            => 'Qty',
                'subtotal'       => 'Subtotal',
                'shipping_cost'  => 'Shipping',
                'free'           => 'Free',
                'total'          => 'Total price',
                'eco'            => '<strong>With this purchase you are giving technology a second life.</strong><br>Buying refurbished reduces CO₂ emissions by up to 89% compared to a new device. Thank you for helping the planet.',
                'return_title'   => 'Changed your mind?',
                'return_body'    => 'You have <strong>30 days</strong> to return the item or request a refund. To do so:',
                'return_1'       => 'Log into your ReTech account.',
                'return_2'       => 'Go to <strong>My orders</strong> and click <strong>"Request return"</strong>.',
                'return_3'       => 'You can also contact us at',
                'fraud_title'    => 'Fraud prevention',
                'fraud_body'     => 'ReTech and its team will <strong>never contact you</strong> to process or modify your order outside the platform, nor will they ask you to pay by bank transfer. If you receive any suspicious communication, write to us at',
                'signoff'        => 'We will be in touch when your order is on its way. See you soon!',
                'team'           => 'The ReTech team',
                'footer_auto'    => 'This message is an automatic confirmation. Please do not reply directly to this email.',
            ],
            default => [
                'subject'        => "Pedido confirmado #{$id} — ReTech",
                'tagline'        => 'Tecnología reacondicionada de confianza',
                'header_label'   => 'Pedido confirmado ✓',
                'greeting'       => "Gracias por tu compra, {$name}.",
                'intro'          => 'Nos hace mucha ilusión tenerte como cliente. Tu pedido está confirmado y en breve lo prepararemos para enviarte.',
                'tracking'       => 'Cuando enviemos el paquete recibirás un correo con el número de seguimiento. Calculamos que recibirás tu pedido en <strong style="color:#0f172a;">1–3 días laborables</strong>.',
                'tracking2'      => 'Para seguir tu pedido conéctate a tu cuenta de ReTech y ve a la sección de <strong style="color:#0f172a;">Mis pedidos</strong>.',
                'cta'            => 'Ver mis pedidos →',
                'summary_title'  => 'Resumen del pedido',
                'date_label'     => 'Pedido realizado el',
                'num_label'      => 'Número de pedido',
                'shipping_label' => 'Dirección de envío',
                'tel'            => 'Tel:',
                'order_col'      => 'Pedido nº',
                'sold_by'        => 'Vendido por',
                'unit_price'     => 'Precio unit.',
                'qty'            => 'Cantidad',
                'subtotal'       => 'Subtotal',
                'shipping_cost'  => 'Gastos de envío',
                'free'           => 'Gratis',
                'total'          => 'Precio total',
                'eco'            => '<strong>Con esta compra le das una segunda vida a la tecnología.</strong><br>Comprar reacondicionado reduce hasta un 89% las emisiones de CO₂ respecto a un dispositivo nuevo. Gracias por ayudar al planeta.',
                'return_title'   => 'Si cambias de opinión',
                'return_body'    => 'Tienes <strong>30 días</strong> para devolver el artículo o solicitar un reembolso. Para ello:',
                'return_1'       => 'Conéctate a tu cuenta en ReTech.',
                'return_2'       => 'Ve a <strong>Mis pedidos</strong> y haz clic en <strong>"Solicitar devolución"</strong>.',
                'return_3'       => 'También puedes escribirnos a',
                'fraud_title'    => 'Prevención de fraudes',
                'fraud_body'     => 'ReTech y su equipo <strong>nunca te contactará</strong> para procesar o modificar tu pedido fuera de la plataforma, ni te pedirá que pagues por transferencia bancaria. Si recibes alguna comunicación sospechosa escríbenos a',
                'signoff'        => 'Volveremos a ponernos en contacto cuando tu pedido esté en camino. ¡Hasta pronto!',
                'team'           => 'El equipo de ReTech',
                'footer_auto'    => 'Este mensaje es una confirmación automática. Por favor, no respondas directamente a este correo.',
            ],
        };
    }
}
