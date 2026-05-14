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

    public function __construct(
        public readonly array $orderData,
    ) {}

    public function envelope(): Envelope
    {
        return new Envelope(
            subject: 'Pedido confirmado #' . $this->orderData['compra_id'] . ' — ReTech',
        );
    }

    public function content(): Content
    {
        return new Content(
            view: 'emails.order_confirmed',
        );
    }
}
