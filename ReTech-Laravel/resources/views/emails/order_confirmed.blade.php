<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>{{ $t['subject'] }}</title>
</head>
<body style="margin:0;padding:0;background:#f1f5f9;font-family:Arial,Helvetica,sans-serif;color:#1e293b;">

  <table width="100%" cellpadding="0" cellspacing="0" style="background:#f1f5f9;padding:32px 16px;">
    <tr>
      <td align="center">
        <table width="600" cellpadding="0" cellspacing="0" style="max-width:600px;width:100%;">

          <!-- HEADER LOGO -->
          <tr>
            <td align="center" style="padding-bottom:20px;">
              <span style="font-size:28px;font-weight:900;letter-spacing:-1px;color:#0f172a;">Re<span style="color:#6366f1;">Tech</span></span>
              <br>
              <span style="font-size:11px;color:#94a3b8;letter-spacing:.5px;">{{ $t['tagline'] }}</span>
            </td>
          </tr>

          <!-- MAIN CARD -->
          <tr>
            <td style="background:#fff;border-radius:16px;overflow:hidden;box-shadow:0 4px 24px rgba(15,23,42,.08);">

              <!-- TOP STRIPE -->
              <table width="100%" cellpadding="0" cellspacing="0">
                <tr>
                  <td style="background:linear-gradient(135deg,#6366f1,#4f46e5);padding:32px 40px 28px;">
                    <p style="margin:0 0 6px;font-size:13px;color:rgba(255,255,255,.7);font-weight:600;letter-spacing:.5px;text-transform:uppercase;">{{ $t['header_label'] }}</p>
                    <h1 style="margin:0 0 10px;font-size:26px;font-weight:900;color:#fff;letter-spacing:-.5px;">{{ $t['greeting'] }}</h1>
                    <p style="margin:0;font-size:14px;color:rgba(255,255,255,.8);line-height:1.6;">
                      {{ $t['intro'] }}
                    </p>
                  </td>
                </tr>
              </table>

              <!-- BODY -->
              <table width="100%" cellpadding="0" cellspacing="0" style="padding:32px 40px;">
                <tr>
                  <td>

                    <!-- TRACKING INFO -->
                    <p style="margin:0 0 24px;font-size:14px;color:#475569;line-height:1.7;">
                      {!! $t['tracking'] !!}<br><br>
                      {!! $t['tracking2'] !!}
                    </p>

                    <!-- CTA BUTTON -->
                    <table cellpadding="0" cellspacing="0" style="margin-bottom:32px;">
                      <tr>
                        <td style="background:linear-gradient(135deg,#6366f1,#4f46e5);border-radius:10px;">
                          <a href="{{ config('app.frontend_url', 'http://localhost:5173') }}/mis-pedidos"
                             style="display:inline-block;padding:13px 28px;color:#fff;text-decoration:none;font-size:14px;font-weight:700;letter-spacing:-.2px;">
                            {{ $t['cta'] }}
                          </a>
                        </td>
                      </tr>
                    </table>

                    <!-- DIVIDER -->
                    <hr style="border:none;border-top:2px solid #f1f5f9;margin:0 0 28px;">

                    <!-- ORDER SUMMARY TITLE -->
                    <p style="margin:0 0 20px;font-size:18px;font-weight:800;color:#0f172a;letter-spacing:-.3px;">{{ $t['summary_title'] }}</p>

                    <!-- ORDER META ROW -->
                    <table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom:24px;">
                      <tr>
                        <td width="50%" style="vertical-align:top;">
                          <p style="margin:0 0 3px;font-size:10px;font-weight:800;text-transform:uppercase;letter-spacing:.8px;color:#94a3b8;">{{ $t['date_label'] }}</p>
                          <p style="margin:0;font-size:14px;font-weight:700;color:#0f172a;">{{ $orderData['fecha'] }}</p>
                        </td>
                        <td width="50%" style="vertical-align:top;">
                          <p style="margin:0 0 3px;font-size:10px;font-weight:800;text-transform:uppercase;letter-spacing:.8px;color:#94a3b8;">{{ $t['num_label'] }}</p>
                          <p style="margin:0;font-size:14px;font-weight:700;color:#0f172a;">#{{ $orderData['compra_id'] }}</p>
                        </td>
                      </tr>
                    </table>

                    @if($orderData['cliente_direccion'])
                    <!-- ADDRESS -->
                    <table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom:28px;">
                      <tr>
                        <td style="background:#f8fafc;border:1px solid #e2e8f0;border-radius:10px;padding:16px 18px;">
                          <p style="margin:0 0 6px;font-size:10px;font-weight:800;text-transform:uppercase;letter-spacing:.8px;color:#94a3b8;">{{ $t['shipping_label'] }}</p>
                          <p style="margin:0;font-size:13.5px;color:#1e293b;line-height:1.7;">
                            <strong>{{ $orderData['cliente_nombre'] }}</strong><br>
                            {{ $orderData['cliente_direccion'] }}
                            @if($orderData['cliente_telefono'])
                              <br>{{ $t['tel'] }} {{ $orderData['cliente_telefono'] }}
                            @endif
                          </p>
                        </td>
                      </tr>
                    </table>
                    @endif

                    <!-- DIVIDER -->
                    <hr style="border:none;border-top:1px solid #f1f5f9;margin:0 0 24px;">

                    <!-- ITEMS -->
                    @foreach($orderData['items'] as $item)
                    <table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom:20px;padding-bottom:20px;border-bottom:1px solid #f1f5f9;">
                      <tr>
                        <td width="72" style="vertical-align:top;padding-right:16px;">
                          @if(!empty($item['imagen_url']))
                            <img src="{{ $item['imagen_url'] }}"
                                 alt="{{ $item['modelo'] }}"
                                 width="64" height="64"
                                 style="width:64px;height:64px;object-fit:contain;border-radius:12px;background:#f8fafc;border:1px solid #e2e8f0;display:block;">
                          @else
                            <table cellpadding="0" cellspacing="0">
                              <tr>
                                <td width="64" height="64" style="width:64px;height:64px;background:#ede9fe;border-radius:12px;text-align:center;vertical-align:middle;font-size:28px;line-height:64px;">
                                  📱
                                </td>
                              </tr>
                            </table>
                          @endif
                        </td>
                        <td style="vertical-align:top;">
                          <p style="margin:0 0 2px;font-size:15px;font-weight:800;color:#0f172a;">{{ $item['modelo'] }}</p>
                          <p style="margin:0 0 10px;font-size:12.5px;color:#64748b;">
                            {{ $item['almacenamiento'] }} GB · {{ $item['ram'] }} GB RAM · {{ $item['color'] }} · {{ $item['estado'] }}
                          </p>
                          <table width="100%" cellpadding="0" cellspacing="0">
                            <tr>
                              <td style="font-size:12px;color:#64748b;">{{ $t['order_col'] }}</td>
                              <td style="font-size:12px;color:#64748b;">{{ $t['sold_by'] }}</td>
                              <td style="font-size:12px;color:#64748b;">{{ $t['unit_price'] }}</td>
                              <td style="font-size:12px;color:#64748b;">{{ $t['qty'] }}</td>
                            </tr>
                            <tr>
                              <td style="font-size:13px;font-weight:700;color:#0f172a;padding-top:3px;">#{{ $orderData['compra_id'] }}</td>
                              <td style="font-size:13px;font-weight:700;color:#0f172a;padding-top:3px;">ReTech SL</td>
                              <td style="font-size:13px;font-weight:700;color:#0f172a;padding-top:3px;">{{ number_format($item['precio'], 2, ',', '.') }} €</td>
                              <td style="font-size:13px;font-weight:700;color:#0f172a;padding-top:3px;">{{ $item['cantidad'] }}</td>
                            </tr>
                          </table>
                        </td>
                      </tr>
                    </table>
                    @endforeach

                    <!-- PRICE BREAKDOWN -->
                    <table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom:28px;">
                      <tr>
                        <td style="font-size:13px;color:#64748b;padding:6px 0;">{{ $t['subtotal'] }}</td>
                        <td style="font-size:13px;color:#0f172a;font-weight:600;text-align:right;padding:6px 0;">{{ number_format($orderData['total'], 2, ',', '.') }} €</td>
                      </tr>
                      <tr>
                        <td style="font-size:13px;color:#64748b;padding:6px 0;">{{ $t['shipping_cost'] }}</td>
                        <td style="font-size:13px;color:#16a34a;font-weight:700;text-align:right;padding:6px 0;">{{ $t['free'] }}</td>
                      </tr>
                      <tr>
                        <td colspan="2" style="border-top:2px solid #0f172a;padding-top:12px;"></td>
                      </tr>
                      <tr>
                        <td style="font-size:16px;font-weight:800;color:#0f172a;padding-top:4px;">{{ $t['total'] }}</td>
                        <td style="font-size:20px;font-weight:900;color:#4f46e5;text-align:right;padding-top:4px;">{{ number_format($orderData['total'], 2, ',', '.') }} €</td>
                      </tr>
                    </table>

                    <!-- ECO MESSAGE -->
                    <table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom:28px;">
                      <tr>
                        <td style="background:#f0fdf4;border:1px solid #bbf7d0;border-radius:10px;padding:16px 18px;">
                          <p style="margin:0;font-size:13.5px;color:#166534;line-height:1.6;">
                            {!! $t['eco'] !!}
                          </p>
                        </td>
                      </tr>
                    </table>

                    <!-- DIVIDER -->
                    <hr style="border:none;border-top:2px solid #f1f5f9;margin:0 0 24px;">

                    <!-- RETURN POLICY -->
                    <p style="margin:0 0 6px;font-size:14px;font-weight:800;color:#0f172a;">{{ $t['return_title'] }}</p>
                    <p style="margin:0 0 20px;font-size:13.5px;color:#475569;line-height:1.7;">
                      {!! $t['return_body'] !!}
                    </p>
                    <table cellpadding="0" cellspacing="0" style="margin-bottom:28px;">
                      <tr>
                        <td style="background:#f8fafc;border-radius:8px;border:1px solid #e2e8f0;padding:10px 16px;font-size:13px;color:#475569;line-height:1.7;">
                          <strong style="color:#0f172a;">1.</strong> {{ $t['return_1'] }}<br>
                          <strong style="color:#0f172a;">2.</strong> {!! $t['return_2'] !!}<br>
                          <strong style="color:#0f172a;">3.</strong> {{ $t['return_3'] }} <a href="mailto:info@retech.cat" style="color:#6366f1;text-decoration:none;">info@retech.cat</a>.
                        </td>
                      </tr>
                    </table>

                    <!-- DIVIDER -->
                    <hr style="border:none;border-top:2px solid #f1f5f9;margin:0 0 24px;">

                    <!-- PHISHING WARNING -->
                    <p style="margin:0 0 6px;font-size:13px;font-weight:800;color:#0f172a;">{{ $t['fraud_title'] }}</p>
                    <p style="margin:0 0 28px;font-size:12.5px;color:#64748b;line-height:1.7;">
                      {!! $t['fraud_body'] !!} <a href="mailto:info@retech.cat" style="color:#6366f1;text-decoration:none;">info@retech.cat</a>.
                    </p>

                    <!-- SIGN-OFF -->
                    <p style="margin:0;font-size:14px;color:#475569;line-height:1.7;">
                      {{ $t['signoff'] }}<br><br>
                      <strong style="color:#0f172a;">{{ $t['team'] }}</strong>
                    </p>

                  </td>
                </tr>
              </table>

            </td>
          </tr>

          <!-- FOOTER -->
          <tr>
            <td style="padding:24px 0 8px;text-align:center;">
              <p style="margin:0 0 6px;font-size:12px;color:#94a3b8;">
                <strong style="color:#64748b;">ReTech SL</strong> · CIF B-08700123<br>
                Carrer de la Tecnologia, 12 · 08700 Igualada, Barcelona<br>
                <a href="mailto:info@retech.cat" style="color:#6366f1;text-decoration:none;">info@retech.cat</a> · Tel: +34 938 00 12 34
              </p>
              <p style="margin:8px 0 0;font-size:11px;color:#cbd5e1;">
                {{ $t['footer_auto'] }}
              </p>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>

</body>
</html>
