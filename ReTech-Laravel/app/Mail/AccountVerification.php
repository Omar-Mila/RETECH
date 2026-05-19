<?php

namespace App\Mail;

use Illuminate\Bus\Queueable;
use Illuminate\Mail\Mailable;
use Illuminate\Mail\Mailables\Content;
use Illuminate\Mail\Mailables\Envelope;
use Illuminate\Queue\SerializesModels;

class AccountVerification extends Mailable
{
    use Queueable, SerializesModels;

    public array $t;

    public function __construct(
        public readonly string $userName,
        public readonly string $verificationUrl,
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
        return new Content(view: 'emails.account_verification');
    }

    private function translations(string $lang): array
    {
        return match ($lang) {
            'ca' => [
                'subject'  => 'Verifica el teu compte — ReTech',
                'tagline'  => 'Tecnologia reacondicionada de confiança',
                'label'    => 'Confirma el teu compte',
                'greeting' => "Benvingut/da, {$this->userName}.",
                'intro'    => 'Gràcies per registrar-te a ReTech. Només falta un pas: verifica la teva adreça de correu electrònic per activar el teu compte.',
                'validity' => 'L\'enllaç és vàlid durant <strong style="color:#0f172a;">24 hores</strong>. Si no has creat aquest compte, pots ignorar aquest correu.',
                'cta'      => 'Verificar el meu compte →',
                'fallback' => 'Si el botó no funciona, copia i enganxa aquest enllaç al teu navegador:',
                'footer'   => 'ReTech · Tecnologia reacondicionada de confiança',
                'rights'   => 'Tots els drets reservats.',
            ],
            'en' => [
                'subject'  => 'Verify your account — ReTech',
                'tagline'  => 'Trusted refurbished technology',
                'label'    => 'Confirm your account',
                'greeting' => "Welcome, {$this->userName}.",
                'intro'    => 'Thank you for registering at ReTech. Just one more step: verify your email address to activate your account.',
                'validity' => 'The link is valid for <strong style="color:#0f172a;">24 hours</strong>. If you did not create this account, you can ignore this email.',
                'cta'      => 'Verify my account →',
                'fallback' => 'If the button does not work, copy and paste this link into your browser:',
                'footer'   => 'ReTech · Trusted refurbished technology',
                'rights'   => 'All rights reserved.',
            ],
            default => [
                'subject'  => 'Verifica tu cuenta — ReTech',
                'tagline'  => 'Tecnología reacondicionada de confianza',
                'label'    => 'Confirma tu cuenta',
                'greeting' => "Bienvenido/a, {$this->userName}.",
                'intro'    => 'Gracias por registrarte en ReTech. Solo falta un paso: verifica tu dirección de correo electrónico para activar tu cuenta.',
                'validity' => 'El enlace es válido durante <strong style="color:#0f172a;">24 horas</strong>. Si no has creado esta cuenta, puedes ignorar este correo.',
                'cta'      => 'Verificar mi cuenta →',
                'fallback' => 'Si el botón no funciona, copia y pega este enlace en tu navegador:',
                'footer'   => 'ReTech · Tecnología reacondicionada de confianza',
                'rights'   => 'Todos los derechos reservados.',
            ],
        };
    }
}
