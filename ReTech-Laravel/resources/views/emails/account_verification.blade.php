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
                    <p style="margin:0 0 6px;font-size:13px;color:rgba(255,255,255,.7);font-weight:600;letter-spacing:.5px;text-transform:uppercase;">{{ $t['label'] }}</p>
                    <h1 style="margin:0 0 10px;font-size:26px;font-weight:900;color:#fff;letter-spacing:-.5px;">{{ $t['greeting'] }}</h1>
                    <p style="margin:0;font-size:14px;color:rgba(255,255,255,.8);line-height:1.6;">
                      {{ $t['intro'] }}
                    </p>
                  </td>
                </tr>
              </table>

              <!-- BODY -->
              <table width="100%" cellpadding="0" cellspacing="0" style="padding:36px 40px;">
                <tr>
                  <td>

                    <p style="margin:0 0 28px;font-size:14px;color:#475569;line-height:1.7;">
                      {!! $t['validity'] !!}
                    </p>

                    <!-- CTA BUTTON -->
                    <table cellpadding="0" cellspacing="0" style="margin-bottom:36px;">
                      <tr>
                        <td style="background:linear-gradient(135deg,#6366f1,#4f46e5);border-radius:10px;">
                          <a href="{{ $verificationUrl }}"
                             style="display:inline-block;padding:14px 32px;color:#fff;text-decoration:none;font-size:15px;font-weight:700;letter-spacing:-.2px;">
                            {{ $t['cta'] }}
                          </a>
                        </td>
                      </tr>
                    </table>

                    <!-- DIVIDER -->
                    <table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom:24px;">
                      <tr><td style="border-top:1px solid #f1f5f9;"></td></tr>
                    </table>

                    <p style="margin:0 0 8px;font-size:12px;color:#94a3b8;line-height:1.6;">
                      {{ $t['fallback'] }}
                    </p>
                    <p style="margin:0;font-size:12px;color:#6366f1;word-break:break-all;">
                      {{ $verificationUrl }}
                    </p>

                  </td>
                </tr>
              </table>

            </td>
          </tr>

          <!-- FOOTER -->
          <tr>
            <td align="center" style="padding:24px 0 8px;">
              <p style="margin:0;font-size:11px;color:#94a3b8;line-height:1.7;">
                {{ $t['footer'] }}<br>
                © {{ date('Y') }} ReTech. {{ $t['rights'] }}
              </p>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>

</body>
</html>
