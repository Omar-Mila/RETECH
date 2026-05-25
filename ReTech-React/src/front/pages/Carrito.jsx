import { useState, useEffect, useCallback } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useAutenticacion } from "../../auth/AuthContext";
import { obtenerCarritoInvitado, guardarCarritoInvitado, limpiarCarritoInvitado } from "../../services/guestCart";
import { loadStripe } from "@stripe/stripe-js";
import {
  Elements,
  PaymentElement,
  useStripe,
  useElements,
} from "@stripe/react-stripe-js";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { useIdioma } from "../context/LanguageContext";

const promesaStripe = loadStripe("pk_test_51SehVv68Ge0SylH5spiVqLpHaRCt8s3RsIiwyPi2VINaXKBYxbhDyzF6YThlNyVb0WHAp16SnJ5plSMoMxswIy8S00lVuCfPjV");
const API = "http://localhost:8000";

const llamarApi = async (ruta, opciones = {}) => {
    if (opciones.method && opciones.method !== 'GET') {
        await fetch(`${API}/sanctum/csrf-cookie`, { credentials: "include" });
    }
    const tokenXsrf = document.cookie
      .split("; ")
      .find(r => r.startsWith("XSRF-TOKEN="))
      ?.split("=")[1];
    const respuesta = await fetch(`${API}/api${ruta}`, {
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
        "Accept": "application/json",
        "X-Requested-With": "XMLHttpRequest",
        ...(tokenXsrf ? { "X-XSRF-TOKEN": decodeURIComponent(tokenXsrf) } : {}),
      },
      ...opciones,
    });

    if (!respuesta.ok) {
      const datosError = await respuesta.json().catch(() => ({}));
      throw new Error(datosError.message || `Error ${respuesta.status}`);
    }

    return respuesta.json();
};

const fmtPrecio = (n) =>
  new Intl.NumberFormat("es-ES", { style: "currency", currency: "EUR" }).format(n);

const ESTADO_CLASE = {
  Excelente:   "cr-est-excelente",
  "Muy Bueno": "cr-est-mbueno",
  Bueno:       "cr-est-bueno",
  Aceptable:   "cr-est-aceptable",
};

function IconoMovil({ hex }) {
  return (
    <div
      className="cr-phone-icon"
      style={{
        background: `${hex}22`,
        border: `2px solid ${hex}55`,
      }}
    >
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
        <rect x="6" y="2" width="12" height="20" rx="3" stroke={hex} strokeWidth="1.8"/>
        <circle cx="12" cy="18.5" r="1" fill={hex}/>
        <rect x="9" y="5" width="6" height="1.5" rx="0.75" fill={hex} opacity="0.5"/>
      </svg>
    </div>
  );
}

function BarraBateria({ valor }) {
  const claseColor = valor >= 85 ? "cr-bat-alta" : valor >= 70 ? "cr-bat-media" : "cr-bat-baja";
  return (
    <div className="cr-bat-wrap">
      <div className="cr-bat-fondo">
        <div className={`cr-bat-relleno ${claseColor}`} style={{ width: `${valor}%` }} />
      </div>
      <span className={`cr-bat-valor ${claseColor}`}>{valor}%</span>
    </div>
  );
}

function BtnCantidad({ etiq, alClick, deshabilitado }) {
  return (
    <button
      onClick={alClick}
      disabled={deshabilitado}
      className={`cr-btn-cant${deshabilitado ? " cr-disabled" : ""}`}
    >
      {etiq}
    </button>
  );
}

function ItemCarro({ art, alQuitar, alCant, deshabilitado }) {
  const claseEstado = ESTADO_CLASE[art.estado] ?? ESTADO_CLASE["Bueno"];
  return (
    <div className="cr-item-row">
      <div
        className="cr-item-thumb"
        style={{
          background: `${art.color_hex ?? "#94a3b8"}22`,
          border: `1.5px solid ${art.color_hex ?? "#94a3b8"}44`,
        }}
      >
        <IconoMovil hex={art.color_hex ?? "#94a3b8"} />
        {art.imagen_url && (
          <img src={art.imagen_url} alt={art.modelo}
            className="cr-item-thumb-img"
            onError={e => { e.currentTarget.style.display = "none" }}
          />
        )}
      </div>
      <div className="cr-item-body">
        <div className="cr-item-top">
          <div>
            <p className="cr-item-modelo">{art.modelo}</p>
            <p className="cr-item-specs">
              {art.almacenamiento} GB · {art.ram} GB RAM ·{" "}
              <span className="cr-color-wrap">
                <span
                  className="cr-color-dot"
                  style={{ background: art.color_hex }}
                />
                {art.color}
              </span>
            </p>
          </div>
          <button
            onClick={() => !deshabilitado && alQuitar(art.movil_id)}
            disabled={deshabilitado}
            className={`cr-btn-remove${deshabilitado ? " cr-disabled" : ""}`}
          >
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
              <path d="M18 6L6 18M6 6l12 12"/>
            </svg>
          </button>
        </div>

        <div className="cr-item-badges">
          <span className={`cr-item-estado ${claseEstado}`}>{art.estado}</span>
          <BarraBateria valor={art.salud_bateria}/>
        </div>

        <div className="cr-item-actions">
          <div className="cr-qty-wrap">
            <BtnCantidad etiq="−" alClick={() => !deshabilitado && alCant(art.movil_id, art.cantidad - 1)} deshabilitado={deshabilitado || art.cantidad <= 1}/>
            <span className="cr-qty-num">{art.cantidad}</span>
            <BtnCantidad etiq="+" alClick={() => !deshabilitado && alCant(art.movil_id, art.cantidad + 1)} deshabilitado={deshabilitado || art.cantidad >= art.stock}/>
          </div>
          <div className="cr-price-col">
            <p className="cr-subtotal">{fmtPrecio(art.subtotal)}</p>
            {art.cantidad > 1 && <p className="cr-price-unit">{fmtPrecio(art.precio)} / ud.</p>}
          </div>
        </div>
      </div>
    </div>
  );
}

function FormPago({ total, alExito, alCancelar, t, datosPerfil, alGuardarPerfil }) {
  const pagoStripe  = useStripe();
  const elemsPago   = useElements();
  const [errorPago, fijarErrorPago] = useState(null);
  const [cargando,  fijarCargando]  = useState(false);

  const pagar = async () => {
    if (!pagoStripe || !elemsPago) return;
    fijarCargando(true);
    fijarErrorPago(null);
    const { error: errStripe, paymentIntent: intento } = await pagoStripe.confirmPayment({
      elements: elemsPago,
      redirect: "if_required",
      confirmParams: {
        return_url: window.location.href,
        payment_method_data: { billing_details: { address: { country: "ES" } } },
      },
    });
    if (errStripe) {
      fijarErrorPago(errStripe.message);
      fijarCargando(false);
      return;
    }
    if (intento?.status === "succeeded") {
      if (datosPerfil && Object.values(datosPerfil).some(v => v !== "")) {
        try {
          const usuarioActual = await llamarApi("/user/cliente", {
            method: "PUT",
            body: JSON.stringify(datosPerfil),
          });
          alGuardarPerfil?.(usuarioActual);
        } catch (err) {
          console.error("Error guardando perfil:", err);
        }
      }
      const res = await llamarApi("/checkout/confirm", {
        method: "POST",
        body: JSON.stringify({ payment_intent_id: intento.id, lang: localStorage.getItem("retech-lang") || "es" }),
      });
      if (res.compra_id) {
        alExito(res.compra_id);
      } else {
        fijarErrorPago(res.message ?? "Error al registrar la compra.");
      }
    }
    fijarCargando(false);
  };

  return (
    <div>
      <PaymentElement options={{ layout:"tabs", fields:{ billingDetails:{ address:{ country:"never" } } } }}/>
      {errorPago && (
        <div className="cr-error-pago">{errorPago}</div>
      )}
      <div className="cr-pay-btns">
        <button onClick={alCancelar} disabled={cargando} className="cr-btn-back">
          {t('cart.back')}
        </button>
        <button
          onClick={pagar}
          disabled={!pagoStripe || cargando}
          className={`cr-btn-pay${cargando || !pagoStripe ? " inactivo" : " activo"}`}
        >
          {cargando ? <><Girador/> {t('cart.processing')}</> : <><IconoCandado/> {t('cart.pay')(fmtPrecio(total))}</>}
        </button>
      </div>
    </div>
  );
}

function FilaResumen({ etiq, valor, opaco, negrita, grande }) {
  return (
    <div className="cr-summary-row">
      <span className={`cr-summary-label${grande ? " grande" : ""}${opaco ? " opaco" : ""}${negrita ? " negrita" : ""}`}>
        {etiq}
      </span>
      <span className={`cr-summary-value${grande ? " grande" : ""}${negrita ? " negrita" : ""}${opaco ? " opaco" : ""}`}>
        {valor}
      </span>
    </div>
  );
}

function ResumenPedido({ arts, alPagar, cargandoIntento, t, esInvitado }) {
  const total       = arts.reduce((s, a) => s + a.subtotal, 0);
  const totalPiezas = arts.reduce((s, a) => s + a.cantidad, 0);

  return (
    <div className="cr-resumen">
      <h2 className="cr-resumen-titulo">{t('cart.summaryTitle')}</h2>

      <div className="cr-resumen-items">
        {arts.map(art => (
          <div key={art.movil_id} className="cr-resumen-item">
            <div
              className="cr-resumen-item-thumb"
              style={{
                background: `${art.color_hex ?? "#94a3b8"}22`,
                border: `1.5px solid ${art.color_hex ?? "#94a3b8"}44`,
              }}
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                <rect x="6" y="2" width="12" height="20" rx="3" stroke={art.color_hex ?? "#94a3b8"} strokeWidth="1.8"/>
                <circle cx="12" cy="18.5" r="1" fill={art.color_hex ?? "#94a3b8"}/>
              </svg>
              {art.imagen_url && (
                <img src={art.imagen_url} alt={art.modelo}
                  className="cr-resumen-item-thumb-img"
                  onError={e => { e.currentTarget.style.display = "none" }}
                />
              )}
            </div>
            <div className="cr-resumen-item-info">
              <p className="cr-resumen-item-modelo">{art.modelo}</p>
              <p className="cr-resumen-item-specs">{art.almacenamiento}GB · x{art.cantidad}</p>
            </div>
            <span className="cr-resumen-item-precio">{fmtPrecio(art.subtotal)}</span>
          </div>
        ))}
      </div>

      <div className="cr-resumen-totales">
        <FilaResumen etiq={t('cart.subtotal')(totalPiezas)} valor={fmtPrecio(total)} />
        <FilaResumen etiq={t('cart.total')} valor={fmtPrecio(total)} negrita grande />
      </div>

      <div className="cr-resumen-envio">
        <span className="cr-resumen-envio-texto">{t('cart.freeShipping')}</span>
      </div>

      {esInvitado ? (
        <div className="cr-resumen-guest">
          <div className="cr-resumen-guest-aviso">{t('cart.guestCheckout')}</div>
          <button onClick={alPagar} className="cr-btn-comprar activo">
            <IconoCandado /> {t('cart.loginToBuy')}
          </button>
        </div>
      ) : (
        <>
          <button
            onClick={alPagar}
            disabled={cargandoIntento || arts.length === 0}
            className={`cr-btn-comprar${cargandoIntento || arts.length === 0 ? " inactivo" : " activo"}`}
            onMouseEnter={(e) => { if (!cargandoIntento) e.currentTarget.classList.add("hover"); }}
            onMouseLeave={(e) => { e.currentTarget.classList.remove("hover"); }}
          >
            {cargandoIntento ? <><Girador /> {t('cart.preparingPay')}</> : <><IconoCandado /> {t('cart.checkout')}</>}
          </button>
          <div className="cr-resumen-stripe">
            <svg width="34" height="14" viewBox="0 0 60 25">
              <text x="0" y="18" fontFamily="Arial" fontSize="18" fontWeight="bold" fill="#635bff">stripe</text>
            </svg>
            <span className="cr-resumen-stripe-texto">{t('cart.stripeSecure')}</span>
          </div>
        </>
      )}
    </div>
  );
}

const PAISES = [
  { code: 'ES', label: 'España' },
  { code: 'PT', label: 'Portugal' },
  { code: 'FR', label: 'Francia' },
  { code: 'DE', label: 'Alemania' },
  { code: 'IT', label: 'Italia' },
  { code: 'GB', label: 'Reino Unido' },
  { code: 'NL', label: 'Países Bajos' },
  { code: 'BE', label: 'Bélgica' },
  { code: 'CH', label: 'Suiza' },
  { code: 'AT', label: 'Austria' },
  { code: 'MX', label: 'México' },
  { code: 'AR', label: 'Argentina' },
  { code: 'CO', label: 'Colombia' },
  { code: 'US', label: 'Estados Unidos' },
];

function generarFacturaHTML(compraId, arts, total, usuario, etiquetas, localeFecha) {
  const fecha      = new Date().toLocaleDateString(localeFecha, { day: "numeric", month: "long", year: "numeric" });
  const numFactura = `FAC-${String(compraId).padStart(5, "0")}`;

  const fmtTel = (t) => {
    if (!t) return null;
    const d = t.replace(/\D/g, '').slice(0, 9);
    if (d.length <= 3) return `+34 ${d}`;
    if (d.length <= 5) return `+34 ${d.slice(0,3)} ${d.slice(3)}`;
    if (d.length <= 7) return `+34 ${d.slice(0,3)} ${d.slice(3,5)} ${d.slice(5)}`;
    return `+34 ${d.slice(0,3)} ${d.slice(3,5)} ${d.slice(5,7)} ${d.slice(7)}`;
  };

  const c = usuario?.cliente ?? {};
  const clienteNombre    = c.nombre && c.apellidos ? `${c.nombre} ${c.apellidos}` : usuario?.name ?? "—";
  const clienteEmail     = usuario?.email    ?? "—";
  const clienteNif       = c.nif             ?? null;
  const clienteTel       = fmtTel(c.telefono);
  const clienteMunicipio = c.municipio       ?? null;
  const clienteProvincia = c.provincia       ?? null;
  const clienteCp        = c.codigo_postal   ?? null;
  const clienteCalle     = c.calle           ?? null;
  const clienteEtiqPais  = c.pais ? (PAISES.find(x => x.code === c.pais)?.label ?? c.pais) : null;

  const filas = arts.map(art => `
    <tr>
      <td><strong>${art.modelo ?? ""}</strong><br><small>${art.almacenamiento ?? ""} GB · ${art.ram ?? ""} GB RAM · ${art.color ?? ""} · ${art.estado ?? ""}</small></td>
      <td>${art.cantidad}</td>
      <td>${fmtPrecio(art.precio)}</td>
      <td>${fmtPrecio(art.subtotal)}</td>
    </tr>
  `).join("");

  return `<!DOCTYPE html>
<html lang="${localeFecha.split('-')[0]}">
<head>
  <meta charset="UTF-8">
  <title>Factura ${numFactura}</title>
  <style>
    * { box-sizing: border-box; margin: 0; padding: 0; }
    body { font-family: Arial, Helvetica, sans-serif; color: #1e293b; padding: 52px; font-size: 13px; background: #fff; }
    .top-bar { background: #0f172a; height: 5px; border-radius: 3px; margin-bottom: 40px; }
    .header-row { display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 36px; }
    .brand { font-size: 30px; font-weight: 900; letter-spacing: -1.5px; color: #0f172a; }
    .brand span { color: #6366f1; }
    .tagline { color: #64748b; font-size: 11.5px; margin-top: 4px; }
    .invoice-meta { text-align: right; }
    .invoice-num { font-size: 24px; font-weight: 800; color: #0f172a; letter-spacing: -1px; }
    .invoice-meta p { color: #64748b; font-size: 12px; margin-top: 4px; line-height: 1.6; }
    .info-row { display: grid; grid-template-columns: 1fr 1fr; gap: 32px; margin-bottom: 36px; }
    .info-block { background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 12px; padding: 18px 20px; }
    .info-block h3 { font-size: 9px; font-weight: 800; letter-spacing: 1.5px; text-transform: uppercase; color: #94a3b8; margin-bottom: 12px; }
    .info-block p { font-size: 12.5px; color: #1e293b; line-height: 1.75; }
    .info-block p strong { color: #0f172a; font-weight: 700; }
    hr { border: none; border-top: 2px solid #e2e8f0; margin: 0 0 24px; }
    table { width: 100%; border-collapse: collapse; }
    thead th { background: #0f172a; color: #fff; padding: 11px 14px; font-size: 10px; text-transform: uppercase; letter-spacing: .8px; text-align: left; }
    thead th:first-child { border-radius: 6px 0 0 6px; }
    thead th:last-child  { border-radius: 0 6px 6px 0; }
    th:nth-child(2), th:nth-child(3), th:nth-child(4) { text-align: right; }
    tbody td { padding: 13px 14px; border-bottom: 1px solid #f1f5f9; vertical-align: top; font-size: 12.5px; }
    tbody td:nth-child(2), tbody td:nth-child(3), tbody td:nth-child(4) { text-align: right; white-space: nowrap; }
    small { color: #64748b; font-size: 11px; }
    .totals { margin-top: 24px; display: flex; justify-content: flex-end; }
    .totals-inner { width: 280px; background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 12px; padding: 16px 20px; }
    .total-final { display: flex; justify-content: space-between; padding: 12px 0 0; margin-top: 10px; border-top: 2px solid #0f172a; font-size: 17px; font-weight: 800; color: #0f172a; }
    .footer { margin-top: 48px; padding-top: 20px; border-top: 1px solid #e2e8f0; display: flex; justify-content: space-between; align-items: center; }
    .footer-left { color: #94a3b8; font-size: 11px; line-height: 1.8; }
    .footer-badge { background: #6366f1; color: #fff; font-size: 10px; font-weight: 800; padding: 5px 12px; border-radius: 20px; letter-spacing: .5px; }
    @media print { body { padding: 28px; } .top-bar { display: none; } }
  </style>
</head>
<body>
  <div class="top-bar"></div>
  <div class="header-row">
    <div>
      <div class="brand">Re<span>Tech</span></div>
      <p class="tagline">${etiquetas.tagline}</p>
    </div>
    <div class="invoice-meta">
      <div class="invoice-num">${numFactura}</div>
      <p>${etiquetas.issueDate} <strong style="color:#0f172a">${fecha}</strong></p>
      <p>${etiquetas.orderNum} #${compraId}</p>
    </div>
  </div>

  <div class="info-row">
    <div class="info-block">
      <h3>${etiquetas.seller}</h3>
      <p>
        <strong>ReTech SL</strong><br>
        CIF: B-08700123<br>
        Carrer de la Tecnologia, 12<br>
        08700 Igualada, Barcelona<br>
        Tel: +34 938 00 12 34<br>
        info@retech.cat
      </p>
    </div>
    <div class="info-block">
      <h3>${etiquetas.client}</h3>
      <p>
        <strong>${clienteNombre}</strong><br>
        ${clienteNif        ? `NIF: ${clienteNif}<br>`  : ""}
        ${clienteCalle      ? `${clienteCalle}<br>`     : ""}
        ${clienteMunicipio  ? `${clienteMunicipio}${clienteProvincia ? `, ${clienteProvincia}` : ''}<br>` : ""}
        ${clienteCp         ? `CP ${clienteCp}${clienteEtiqPais ? ` — ${clienteEtiqPais}` : ''}<br>` : ""}
        ${clienteTel        ? `Tel: ${clienteTel}<br>`  : ""}
        ${clienteEmail}
      </p>
    </div>
  </div>

  <hr>
  <table>
    <thead>
      <tr><th>${etiquetas.product}</th><th>${etiquetas.quantity}</th><th>${etiquetas.unitPrice}</th><th>${etiquetas.total}</th></tr>
    </thead>
    <tbody>${filas}</tbody>
  </table>
  <div class="totals">
    <div class="totals-inner">
      <div class="total-final"><span>${etiquetas.total}</span><span>${fmtPrecio(total)}</span></div>
    </div>
  </div>
  <div class="footer">
    <div class="footer-left">
      <p>${etiquetas.thanks}</p>
      <p>${etiquetas.simplifiedInvoice}</p>
    </div>
    <div class="footer-badge">RETECH CERT</div>
  </div>
</body>
</html>`;
}

function PantallaExito({ compraId, datosPerfil, usuario: usuarioProp }) {
  const { t } = useIdioma();
  const { user: usuarioCtx } = useAutenticacion();
  const usuario = usuarioProp ?? usuarioCtx;
  const [arts,            fijarArts]            = useState([]);
  const [total,           fijarTotal]           = useState(0);
  const [cargandoPedido,  fijarCargandoPedido]  = useState(true);

  useEffect(() => {
    const cargar = async () => {
      try {
        const res = await fetch(`/api/compras/${compraId}`, {
          credentials: "include",
          headers: { "Accept": "application/json" },
        });
        if (!res.ok) throw new Error();
        const pedido = await res.json();

        const ids = [...new Set((pedido.items || []).map(i => i.movil_id))];
        const resultados = await Promise.all(
          ids.map(id =>
            fetch(`/api/products/${id}`, { headers: { "Accept": "application/json" } })
              .then(r => r.ok ? r.json() : null).catch(() => null)
          )
        );
        const cache = {};
        ids.forEach((id, i) => { if (resultados[i]) cache[id] = resultados[i]; });

        const artsFusion = (pedido.items || []).map(art => {
          const movil  = cache[art.movil_id] || {};
          const precio = art.precio ?? art.precio_unitario ?? movil.precio ?? 0;
          return { ...movil, cantidad: art.cantidad, precio, subtotal: precio * art.cantidad };
        });

        fijarArts(artsFusion);
        fijarTotal(pedido.precio_total ?? artsFusion.reduce((s, a) => s + a.subtotal, 0));
      } catch {
        // Si falla la carga se muestran los botones igual sin artículos
      } finally {
        fijarCargandoPedido(false);
      }
    };
    cargar();
  }, [compraId]);

  const verFactura = () => {
    const usuarioFactura = {
      ...usuario,
      cliente: { ...(usuario?.cliente ?? {}), ...(datosPerfil ?? {}) },
    };
    const htmlFactura = generarFacturaHTML(compraId, arts, total, usuarioFactura, t('invoice'), t('orders.dateLocale'));
    const ventana = window.open("", "_blank");
    if (!ventana) return;
    ventana.document.write(htmlFactura);
    ventana.document.close();
    ventana.focus();
    ventana.print();
  };

  return (
    <>
      <div className="cr-success-wrap">
        <div className="cr-success-box">
          <div className="cr-success-icon">
            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5">
              <polyline points="20 6 9 17 4 12"/>
            </svg>
          </div>
          <h1 className="cr-success-title">{t('cart.orderConfirmed')}</h1>
          <p className="cr-success-processed">{t('cart.orderProcessed')}</p>
          <p className="cr-success-num">#{compraId}</p>

          {cargandoPedido && (
            <div className="cr-success-spinner"><Girador tamano={22} color="#6366f1"/></div>
          )}

          <div className="cr-success-btns">
            <button
              onClick={verFactura}
              disabled={cargandoPedido || arts.length === 0}
              className={`cr-btn-invoice${cargandoPedido || arts.length === 0 ? " inactivo" : ""}`}
            >
              {t('cart.downloadInvoice')}
            </button>
            <a href="/" className="cr-btn-keep-shopping">
              {t('cart.keepShopping')}
            </a>
          </div>
        </div>
      </div>

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Sora:wght@400;600;700;800&family=Inter:wght@400;500;600&display=swap');
        * { box-sizing: border-box; }
        body { margin: 0; font-family: 'Inter', sans-serif; background: #f8fafc; }
        @keyframes cr-spin { to { transform: rotate(360deg); } }
        .spinner { animation: cr-spin .8s linear infinite; }

        .cr-success-wrap {
          min-height: 100vh;
          background: #f8fafc;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 24px;
        }
        .cr-success-box {
          background: #fff;
          border-radius: 24px;
          padding: 40px;
          text-align: center;
          max-width: 480px;
          width: 100%;
          border: 1px solid #e2e8f0;
          box-shadow: 0 8px 32px rgba(15, 23, 42, .08);
        }
        .cr-success-icon {
          width: 72px;
          height: 72px;
          border-radius: 50%;
          background: #0f172a;
          margin: 0 auto 20px;
          display: flex;
          align-items: center;
          justify-content: center;
          box-shadow: 0 8px 20px rgba(15, 23, 42, .2);
        }
        .cr-success-title {
          margin: 0 0 8px;
          font-size: 24px;
          font-weight: 800;
          color: #0f172a;
          font-family: 'Sora', sans-serif;
        }
        .cr-success-processed { margin: 0 0 4px; color: #64748b; font-size: 14px; }
        .cr-success-num       { margin: 0 0 24px; color: #94a3b8; font-size: 12.5px; }
        .cr-success-spinner   { margin-bottom: 24px; }
        .cr-success-btns {
          display: flex;
          gap: 12px;
          justify-content: center;
          flex-wrap: wrap;
        }
        .cr-btn-invoice {
          padding: 12px 22px;
          background: #f8fafc;
          border: 1px solid #e2e8f0;
          border-radius: 10px;
          font-size: 13.5px;
          font-weight: 700;
          cursor: pointer;
          color: #0f172a;
          font-family: 'Sora', sans-serif;
        }
        .cr-btn-invoice.inactivo { cursor: not-allowed; opacity: 0.5; }
        .cr-btn-keep-shopping {
          padding: 12px 22px;
          background: linear-gradient(135deg, #6366f1, #4f46e5);
          color: #fff;
          border-radius: 10px;
          text-decoration: none;
          font-size: 13.5px;
          font-weight: 700;
          font-family: 'Sora', sans-serif;
          box-shadow: 0 4px 12px rgba(99, 102, 241, .35);
        }

        @media (max-width: 480px) {
          .cr-success-box { padding: 28px 20px; }
          .cr-success-title { font-size: 20px; }
          .cr-success-btns { flex-direction: column; align-items: center; }
        }
      `}</style>
    </>
  );
}

function Girador({ tamano = 18, color = "white" }) {
  return (
    <svg width={tamano} height={tamano} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2.5"
      className="spinner">
      <path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83"/>
    </svg>
  );
}

function IconoCandado() {
  return (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5">
      <rect x="3" y="11" width="18" height="11" rx="2"/>
      <path d="M7 11V7a5 5 0 0110 0v4"/>
    </svg>
  );
}

const VALIDAR = {
  nombre:        v => v.trim() !== "",
  apellidos:     v => v.trim() !== "",
  nif:           v => v === "" || /^\d{8}[A-Za-z]$/.test(v),
  pais:          v => v.trim() !== "",
  provincia:     () => true,
  municipio:     () => true,
  codigo_postal: v => v.trim() !== "",
  calle:         () => true,
  telefono:      v => v === "" || /^\d{9}$/.test(v),
};

function FormPerfil({ usuario, alCambiarDatos, t }) {
  const c = usuario?.cliente ?? {};
  const inicial = {
    nombre:        c.nombre        ?? "",
    apellidos:     c.apellidos     ?? "",
    nif:           c.nif           ?? "",
    pais:          c.pais          ?? "",
    provincia:     c.provincia     ?? "",
    municipio:     c.municipio     ?? "",
    codigo_postal: c.codigo_postal ?? "",
    calle:         c.calle         ?? "",
    telefono:      c.telefono      ?? "",
  };
  const [datos,      fijarDatos]      = useState(inicial);
  const [tocados,    fijarTocados]    = useState(() =>
    Object.fromEntries(Object.entries(inicial).filter(([,v]) => v !== "").map(([k]) => [k, true]))
  );
  const [estadoCp,   fijarEstadoCp]   = useState(null);

  const validez = Object.fromEntries(Object.keys(datos).map(k => [k, VALIDAR[k](datos[k])]));

  useEffect(() => {
    const todoValido = Object.values(validez).every(Boolean) &&
      datos.nombre.trim() && datos.apellidos.trim() && datos.pais.trim() && datos.codigo_postal.trim();
    alCambiarDatos?.(datos, !!todoValido);
  }, []);

  useEffect(() => {
    const cp   = datos.codigo_postal?.trim();
    const pais = datos.pais?.trim();
    if (!cp || cp.length < 4 || !pais) { fijarEstadoCp(null); return; }
    fijarEstadoCp('loading');
    const temporizador = setTimeout(async () => {
      try {
        const res = await fetch(`https://api.zippopotam.us/${pais}/${cp}`);
        if (!res.ok) { fijarEstadoCp('invalid'); return; }
        const data = await res.json();
        const lugar = data.places?.[0];
        if (lugar) {
          fijarEstadoCp('valid');
          fijarDatos(prev => ({
            ...prev,
            municipio: lugar['place name'] || prev.municipio,
            provincia: lugar.state || prev.provincia,
          }));
        } else {
          fijarEstadoCp('invalid');
        }
      } catch {
        fijarEstadoCp(null);
      }
    }, 600);
    return () => clearTimeout(temporizador);
  }, [datos.codigo_postal, datos.pais]);

  const formatTelefono = (raw = "") => {
    const d = raw.replace(/\D/g, "").slice(0, 9);
    if (d.length <= 3) return d;
    if (d.length <= 5) return `${d.slice(0, 3)} ${d.slice(3)}`;
    if (d.length <= 7) return `${d.slice(0, 3)} ${d.slice(3, 5)} ${d.slice(5)}`;
    return `${d.slice(0, 3)} ${d.slice(3, 5)} ${d.slice(5, 7)} ${d.slice(7)}`;
  };

  const alCambiar = (campo, valor) => {
    const nuevosDatos = { ...datos, [campo]: valor };
    fijarDatos(nuevosDatos);
    fijarTocados(p => ({ ...p, [campo]: true }));
    const nuevaValidez = Object.fromEntries(Object.keys(nuevosDatos).map(k => [k, VALIDAR[k](nuevosDatos[k])]));
    const todoValido = Object.values(nuevaValidez).every(Boolean) &&
      nuevosDatos.nombre.trim() && nuevosDatos.apellidos.trim() && nuevosDatos.pais.trim() && nuevosDatos.codigo_postal.trim();
    alCambiarDatos?.(nuevosDatos, !!todoValido);
  };

  const MENSAJES_ERROR = {
    nombre:        t('cart.profileFieldRequired'),
    apellidos:     t('cart.profileFieldRequired'),
    nif:           t('cart.profileNifError'),
    pais:          t('cart.profileFieldRequired'),
    provincia:     "",
    municipio:     "",
    codigo_postal: t('cart.profileFieldRequired'),
    calle:         "",
    telefono:      t('cart.profilePhoneError'),
  };

  const campoInput = (etiq, campo) => {
    const esValido    = validez[campo];
    const tieneValor  = datos[campo] !== "";
    const fueTocado   = tocados[campo];
    const mostrarTick  = tieneValor && esValido;
    const mostrarError = fueTocado && !esValido;
    const estado       = mostrarError ? "error" : mostrarTick ? "valido" : "neutro";

    return (
      <div>
        <label className="cr-field-label">{etiq}</label>
        <div className="cr-field-wrap">
          <input
            type="text"
            value={datos[campo]}
            onChange={e => alCambiar(campo, e.target.value)}
            onBlur={() => fijarTocados(p => ({ ...p, [campo]: true }))}
            className={`cr-field-input ${estado}`}
          />
          {mostrarTick && (
            <svg className="cr-field-tick" width="15" height="15" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M16.704 4.153a.75.75 0 01.143 1.052l-8 10.5a.75.75 0 01-1.127.075l-4.5-4.5a.75.75 0 011.06-1.06l3.894 3.893 7.48-9.817a.75.75 0 011.05-.143z" clipRule="evenodd"/>
            </svg>
          )}
        </div>
        {mostrarError && (
          <p className="cr-field-error">{MENSAJES_ERROR[campo]}</p>
        )}
      </div>
    );
  };

  return (
    <div className="cr-form-perfil">
      <h3 className="cr-form-titulo">{t('cart.profileModalTitle')}</h3>
      <p className="cr-form-desc">{t('cart.profileModalDesc')}</p>
      <div className="cr-form-campos">
        {campoInput(t('profile.name'),     "nombre")}
        {campoInput(t('profile.surnames'), "apellidos")}
        {campoInput(t('profile.nif'),      "nif")}

        {/* País — selector */}
        <div>
          <label className="cr-field-label">{t('profile.pais')}</label>
          <select
            value={datos.pais}
            onChange={e => alCambiar("pais", e.target.value)}
            onBlur={() => fijarTocados(p => ({ ...p, pais: true }))}
            className={`cr-field-select${tocados.pais && !datos.pais ? " error" : datos.pais ? " valido" : " neutro"}${datos.pais ? " tiene-valor" : ""}`}
          >
            <option value="">— {t('profile.pais')} —</option>
            {PAISES.map(p => <option key={p.code} value={p.code}>{p.label}</option>)}
          </select>
          {tocados.pais && !datos.pais && <p className="cr-field-error">{t('cart.profileFieldRequired')}</p>}
        </div>

        {/* Código postal con validación automática */}
        <div>
          <label className="cr-field-label">{t('profile.codigoPostal')}</label>
          <input
            type="text"
            value={datos.codigo_postal}
            onChange={e => alCambiar("codigo_postal", e.target.value)}
            onBlur={() => fijarTocados(p => ({ ...p, codigo_postal: true }))}
            className={`cr-field-input${
              tocados.codigo_postal && !datos.codigo_postal ? " error"
              : estadoCp === 'valid'   ? " valido"
              : estadoCp === 'invalid' ? " error"
              : " neutro"
            }`}
          />
          {estadoCp === 'loading' && <p className="cr-field-status validando">Validando…</p>}
          {estadoCp === 'valid'   && <p className="cr-field-status cp-ok">✓ Código postal válido</p>}
          {estadoCp === 'invalid' && <p className="cr-field-status cp-err">{t('cart.profileCpNotFound')}</p>}
          {tocados.codigo_postal && !datos.codigo_postal && <p className="cr-field-error">{t('cart.profileFieldRequired')}</p>}
        </div>

        {campoInput(t('profile.provincia'), "provincia")}
        {campoInput(t('profile.municipio'), "municipio")}
        {campoInput(t('profile.calle'),     "calle")}

        {/* Teléfono con prefijo español */}
        {(() => {
          const campo        = "telefono";
          const esValido     = validez[campo];
          const tieneValor   = datos[campo] !== "";
          const fueTocado    = tocados[campo];
          const mostrarTick  = tieneValor && esValido;
          const mostrarError = fueTocado && !esValido;
          const estado       = mostrarError ? "error" : mostrarTick ? "valido" : "neutro";
          return (
            <div>
              <label className="cr-field-label">{t('profile.phone')}</label>
              <div className="cr-phone-wrap">
                <span className="cr-phone-prefix">🇪🇸 +34</span>
                <div className="cr-field-wrap cr-phone-input-wrap">
                  <input
                    type="tel"
                    value={formatTelefono(datos[campo])}
                    onChange={e => alCambiar(campo, e.target.value.replace(/\D/g, "").slice(0, 9))}
                    onBlur={() => fijarTocados(p => ({ ...p, [campo]: true }))}
                    placeholder="600 00 00 00"
                    className={`cr-field-input cr-phone-input ${estado}`}
                  />
                  {mostrarTick && (
                    <svg className="cr-field-tick" width="15" height="15" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M16.704 4.153a.75.75 0 01.143 1.052l-8 10.5a.75.75 0 01-1.127.075l-4.5-4.5a.75.75 0 011.06-1.06l3.894 3.893 7.48-9.817a.75.75 0 011.05-.143z" clipRule="evenodd"/>
                    </svg>
                  )}
                </div>
              </div>
              {mostrarError && (
                <p className="cr-field-error">{MENSAJES_ERROR[campo]}</p>
              )}
            </div>
          );
        })()}
      </div>
    </div>
  );
}

export default function PaginaCarrito() {
  const navegar   = useNavigate();
  const ubicacion = useLocation();
  const { t } = useIdioma();
  const { isAuthenticated: estaAuth, user: usuario, setUser: fijarUsuario } = useAutenticacion();
  const [arts,            fijarArts]            = useState([]);
  const [cargando,        fijarCargando]        = useState(true);
  const [cargandoIntento, fijarCargandoIntento] = useState(false);
  const [secretoCliente,  fijarSecretoCliente]  = useState(null);
  const [totalIntento,    fijarTotalIntento]    = useState(0);
  const [idExito,         fijarIdExito]         = useState(null);
  const [errorApi,        fijarErrorApi]        = useState(null);
  const [esInvitado,      fijarEsInvitado]      = useState(!estaAuth);
  const [datosPerfil,     fijarDatosPerfil]     = useState(null);

  const cargarCarro = useCallback(async () => {
    fijarCargando(true);
    if (!estaAuth) {
      fijarEsInvitado(true);
      const guardado = obtenerCarritoInvitado();
      fijarArts(guardado.map(art => ({ ...art, subtotal: art.precio * art.cantidad })));
      fijarCargando(false);
      return;
    }
    try {
      const datos = await llamarApi("/carrito");
      fijarArts(datos.items ?? []);
      fijarEsInvitado(false);
    } catch (err) {
      fijarErrorApi(t('cart.loadError'));
    } finally {
      fijarCargando(false);
    }
  }, [estaAuth]);

  useEffect(() => { cargarCarro(); }, [cargarCarro]);

  useEffect(() => {
    if (!estaAuth || cargando) return;
    if (sessionStorage.getItem('retech-auto-checkout') !== '1') return;
    sessionStorage.removeItem('retech-auto-checkout');
    irAPagar();
  }, [estaAuth, cargando]);

  const quitarArt = async (movilId) => {
    if (!estaAuth) {
      const actualizado = obtenerCarritoInvitado().filter(a => a.movil_id !== movilId);
      guardarCarritoInvitado(actualizado);
      fijarArts(prev => prev.filter(a => a.movil_id !== movilId));
      window.dispatchEvent(new Event("cart-updated"));
      return;
    }
    await llamarApi(`/carrito/${movilId}`, { method: "DELETE" });
    await cargarCarro();
  };

  const cambiarCant = async (movilId, nuevaCantidad) => {
    if (!estaAuth) {
      const actualizado = obtenerCarritoInvitado().map(a =>
        a.movil_id === movilId ? { ...a, cantidad: nuevaCantidad } : a
      );
      guardarCarritoInvitado(actualizado);
      fijarArts(prev => prev.map(a =>
        a.movil_id === movilId
          ? { ...a, cantidad: nuevaCantidad, subtotal: a.precio * nuevaCantidad }
          : a
      ));
      window.dispatchEvent(new Event("cart-updated"));
      return;
    }
    await llamarApi(`/carrito/${movilId}`, {
      method: "PATCH",
      body: JSON.stringify({ cantidad: nuevaCantidad }),
    });
    await cargarCarro();
  };

  const vaciarCarro = async () => {
    if (!estaAuth) {
      limpiarCarritoInvitado();
      fijarArts([]);
      window.dispatchEvent(new Event("cart-updated"));
      return;
    }
    await llamarApi("/carrito/vaciar", { method: "DELETE" });
    fijarArts([]);
  };

  const irAPagar = async () => {
    if (!estaAuth) {
      sessionStorage.setItem('retech-auto-checkout', '1');
      navegar("/login", { state: { from: ubicacion.pathname } });
      return;
    }

    fijarCargandoIntento(true);
    fijarErrorApi(null);

    try {
      await fetch(`${API}/sanctum/csrf-cookie`, { credentials: 'include' });
      const datos = await llamarApi("/checkout/intent", { method: "POST" });

      if (datos && datos.client_secret) {
        fijarSecretoCliente(datos.client_secret);
        fijarTotalIntento(datos.amount);
      } else {
        fijarErrorApi(datos.message ?? "No se pudo iniciar el pago. ¿Has iniciado sesión?");
      }
    } catch (err) {
      if (err.message === "Unauthenticated.") {
        sessionStorage.setItem('retech-auto-checkout', '1');
        setTimeout(() => {
          navegar("/login", { state: { from: ubicacion.pathname } });
        }, 2500);
      } else {
        fijarErrorApi(err.message || "Error desconocido: " + err);
      }
    } finally {
      fijarCargandoIntento(false);
    }
  };

  if (idExito) return <PantallaExito compraId={idExito} datosPerfil={datosPerfil} usuario={usuario}/>;

  return (
    <>
      <Navbar />

      <div className="cr-page">
        <div className="cr-container">

          <div className="cr-header">
            <div className="cr-header-icon">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.2">
                <path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z"/>
                <line x1="3" y1="6" x2="21" y2="6"/>
                <path d="M16 10a4 4 0 01-8 0"/>
              </svg>
            </div>
            <div>
              <h1 className="cr-title">
                {secretoCliente ? t('cart.payTitle') : t('cart.title')}
              </h1>
              {!secretoCliente && (
                <p className="cr-subtitle">
                  {cargando ? t('cart.loading') : arts.length === 0 ? t('cart.emptyStatus') : t('cart.itemsCount')(arts.reduce((s, a) => s + a.cantidad, 0))}
                </p>
              )}
            </div>
          </div>

          {errorApi && (
            <div className="cr-error">{errorApi}</div>
          )}

          {cargando ? (
            <div className="cr-spinner">
              <Girador tamano={32} color="#6366f1"/>
            </div>
          ) : arts.length === 0 && !secretoCliente ? (
            <div className="cr-empty">
              <h2 className="cr-empty-title">{t('cart.emptyTitle')}</h2>
              <p className="cr-empty-desc">{t('cart.emptyDesc')}</p>
            </div>
          ) : (
            <div className="cr-grid">
              <div className="cr-panel">
                {secretoCliente ? (
                  <div className="cr-pay-wrap">
                    <div>
                      <FormPerfil
                        usuario={usuario}
                        alCambiarDatos={(datos) => fijarDatosPerfil(datos)}
                        t={t}
                      />
                      <div className="cr-pay-sep"/>
                    </div>
                    <h3 className="cr-pay-title">{t('cart.paymentData')}</h3>
                    <Elements stripe={promesaStripe} options={{ clientSecret: secretoCliente, appearance:{ theme:"stripe", variables:{ colorPrimary:"#6366f1", borderRadius:"10px", fontFamily:"Inter, sans-serif" } } }}>
                      <FormPago total={totalIntento} alExito={(id) => fijarIdExito(id)} alCancelar={() => fijarSecretoCliente(null)} t={t} datosPerfil={datosPerfil} alGuardarPerfil={fijarUsuario}/>
                    </Elements>
                  </div>
                ) : (
                  <>
                    <div className="cr-list-head">
                      <span className="cr-list-label">{t('cart.products')}</span>
                    </div>
                    {arts.map((art) => (
                      <ItemCarro key={art.movil_id} art={art} alQuitar={quitarArt} alCant={cambiarCant} deshabilitado={cargandoIntento}/>
                    ))}
                    <div className="cr-foot">
                      <button onClick={vaciarCarro} className="cr-btn-vaciar">
                        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                          <polyline points="3 6 5 6 21 6"/>
                          <path d="M19 6l-1 14H6L5 6M10 11v6M14 11v6M9 6V4h6v2"/>
                        </svg>
                        {t('cart.clearCart')}
                      </button>
                    </div>
                  </>
                )}
              </div>
              <ResumenPedido arts={arts} alPagar={irAPagar} cargandoIntento={cargandoIntento} t={t} esInvitado={!estaAuth}/>
            </div>
          )}
        </div>
      </div>

      <Footer />

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Sora:wght@400;600;700;800&family=Inter:wght@400;500;600&display=swap');
        * { box-sizing: border-box; }
        body { margin: 0; font-family: 'Inter', sans-serif; background: #f8fafc; }
        @keyframes cr-spin    { to { transform: rotate(360deg); } }
        @keyframes cr-fadeIn  { from { opacity: 0; transform: translateY(8px); } to { opacity: 1; transform: translateY(0); } }

        /* ── Spinner ───────────────────────────────────────── */
        .spinner { animation: cr-spin .8s linear infinite; }

        /* ── Batería ───────────────────────────────────────── */
        .cr-bat-wrap  { display: flex; align-items: center; gap: 5px; }
        .cr-bat-fondo { width: 34px; height: 7px; background: #e5e7eb; border-radius: 4px; overflow: hidden; }
        .cr-bat-relleno { height: 100%; border-radius: 4px; transition: width .5s; }
        .cr-bat-alta  { background: #22c55e; color: #22c55e; }
        .cr-bat-media { background: #f59e0b; color: #f59e0b; }
        .cr-bat-baja  { background: #ef4444; color: #ef4444; }
        .cr-bat-valor { font-size: 10px; font-weight: 700; background: transparent; }

        /* ── Icono de teléfono ─────────────────────────────── */
        .cr-phone-icon {
          width: 52px; height: 52px;
          border-radius: 13px;
          display: flex; align-items: center; justify-content: center;
          flex-shrink: 0;
        }

        /* ── Botón cantidad ────────────────────────────────── */
        .cr-btn-cant {
          width: 30px; height: 30px;
          border: none; background: none;
          font-size: 17px;
          display: flex; align-items: center; justify-content: center;
        }
        .cr-btn-cant.cr-disabled { cursor: not-allowed; color: #cbd5e1; }
        .cr-btn-cant:not(.cr-disabled) { cursor: pointer; color: #475569; }

        /* ── Estados de producto ───────────────────────────── */
        .cr-est-excelente { background: #d1fae5; color: #065f46; }
        .cr-est-mbueno    { background: #dbeafe; color: #1e40af; }
        .cr-est-bueno     { background: #fef9c3; color: #854d0e; }
        .cr-est-aceptable { background: #fee2e2; color: #991b1b; }

        /* ── Item del carrito ──────────────────────────────── */
        .cr-item-row {
          display: flex;
          gap: 14px;
          padding: 18px 0;
          border-bottom: 1px solid #f1f5f9;
        }
        .cr-item-thumb {
          width: 52px; height: 52px;
          border-radius: 13px;
          display: flex; align-items: center; justify-content: center;
          flex-shrink: 0;
          overflow: hidden;
          position: relative;
        }
        .cr-item-thumb-img {
          position: absolute; inset: 0;
          width: 100%; height: 100%;
          object-fit: contain;
          padding: 4px;
        }
        .cr-item-body { flex: 1; min-width: 0; }
        .cr-item-top {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          gap: 8px;
        }
        .cr-item-modelo {
          margin: 0;
          font-weight: 700;
          font-size: 14.5px;
          color: #0f172a;
          font-family: 'Sora', sans-serif;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }
        .cr-item-specs { margin: 2px 0 0; font-size: 12px; color: #64748b; }
        .cr-color-wrap { display: inline-flex; align-items: center; gap: 3px; }
        .cr-color-dot {
          width: 7px; height: 7px;
          border-radius: 50%;
          display: inline-block;
          border: 1px solid #cbd5e1;
        }
        .cr-btn-remove {
          background: none; border: none;
          padding: 3px; line-height: 1;
          color: #94a3b8;
          transition: color .15s;
        }
        .cr-btn-remove:not(.cr-disabled) { cursor: pointer; }
        .cr-btn-remove:not(.cr-disabled):hover { color: #ef4444; }
        .cr-btn-remove.cr-disabled { cursor: not-allowed; }
        .cr-item-badges {
          display: flex; align-items: center;
          gap: 8px; margin-top: 7px;
        }
        .cr-item-estado {
          font-size: 10.5px;
          font-weight: 700;
          padding: 2px 7px;
          border-radius: 20px;
        }
        .cr-item-actions {
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-top: 10px;
        }
        .cr-qty-wrap {
          display: flex; align-items: center;
          background: #f8fafc;
          border: 1px solid #e2e8f0;
          border-radius: 8px;
        }
        .cr-qty-num {
          width: 26px;
          text-align: center;
          font-size: 13px;
          font-weight: 700;
          color: #0f172a;
        }
        .cr-price-col { text-align: right; }
        .cr-subtotal {
          margin: 0;
          font-weight: 800; font-size: 16px;
          color: #0f172a;
          font-family: 'Sora', sans-serif;
        }
        .cr-price-unit { margin: 0; font-size: 10.5px; color: #94a3b8; }

        /* ── Formulario de pago ────────────────────────────── */
        .cr-error-pago {
          margin-top: 12px;
          padding: 10px 14px;
          background: #fef2f2;
          border: 1px solid #fecaca;
          border-radius: 8px;
          font-size: 12.5px;
          color: #dc2626;
        }
        .cr-pay-btns { display: flex; gap: 10px; margin-top: 20px; }
        .cr-btn-back {
          flex: 1;
          padding: 13px;
          background: #f8fafc;
          border: 1px solid #e2e8f0;
          border-radius: 10px;
          font-size: 13.5px; font-weight: 600;
          cursor: pointer; color: #475569;
        }
        .cr-btn-pay {
          flex: 2;
          padding: 13px;
          color: #fff; border: none;
          border-radius: 10px;
          font-size: 14px; font-weight: 700;
          font-family: 'Sora', sans-serif;
          display: flex; align-items: center; justify-content: center;
          gap: 8px;
        }
        .cr-btn-pay.activo {
          background: linear-gradient(135deg, #6366f1, #4f46e5);
          cursor: pointer;
          box-shadow: 0 4px 14px rgba(99, 102, 241, .4);
        }
        .cr-btn-pay.inactivo { background: #94a3b8; cursor: not-allowed; }

        /* ── Fila de resumen ───────────────────────────────── */
        .cr-summary-row { display: flex; justify-content: space-between; align-items: center; }
        .cr-summary-label { font-size: 13px; color: #475569; font-weight: 400; }
        .cr-summary-label.grande  { font-size: 14.5px; }
        .cr-summary-label.opaco   { color: #94a3b8; }
        .cr-summary-label.negrita { color: #0f172a; font-weight: 800; font-family: 'Sora', sans-serif; }
        .cr-summary-value { font-size: 13px; font-weight: 600; color: #0f172a; font-family: 'Sora', sans-serif; }
        .cr-summary-value.grande  { font-size: 19px; font-weight: 800; }
        .cr-summary-value.negrita { color: #4f46e5; font-weight: 800; }
        .cr-summary-value.opaco   { color: #94a3b8; }

        /* ── Resumen del pedido ────────────────────────────── */
        .cr-resumen {
          position: sticky; top: 24px;
          background: #fff;
          border: 1px solid #e2e8f0;
          border-radius: 20px;
          padding: 26px;
          box-shadow: 0 4px 24px rgba(15, 23, 42, .07);
        }
        .cr-resumen-titulo {
          margin: 0 0 16px;
          font-size: 17px; font-weight: 800;
          color: #0f172a;
          font-family: 'Sora', sans-serif;
          letter-spacing: -.3px;
        }
        .cr-resumen-items { display: flex; flex-direction: column; gap: 8px; margin-bottom: 16px; }
        .cr-resumen-item { display: flex; align-items: center; gap: 10px; }
        .cr-resumen-item-thumb {
          width: 38px; height: 38px;
          border-radius: 9px;
          flex-shrink: 0;
          overflow: hidden; position: relative;
          display: flex; align-items: center; justify-content: center;
        }
        .cr-resumen-item-thumb-img {
          position: absolute; inset: 0;
          width: 100%; height: 100%;
          object-fit: contain; padding: 2px;
        }
        .cr-resumen-item-info { flex: 1; min-width: 0; }
        .cr-resumen-item-modelo {
          margin: 0;
          font-size: 12px; font-weight: 700; color: #0f172a;
          white-space: nowrap; overflow: hidden; text-overflow: ellipsis;
        }
        .cr-resumen-item-specs { margin: 0; font-size: 11px; color: #64748b; }
        .cr-resumen-item-precio { font-size: 12px; font-weight: 700; color: #0f172a; flex-shrink: 0; }
        .cr-resumen-totales {
          border-top: 1px solid #f1f5f9;
          padding-top: 14px;
          display: flex; flex-direction: column; gap: 11px;
        }
        .cr-resumen-envio {
          margin: 18px 0;
          background: #f0fdf4;
          border: 1px solid #bbf7d0;
          border-radius: 10px;
          padding: 9px 13px;
          display: flex; align-items: center; gap: 7px;
        }
        .cr-resumen-envio-texto { font-size: 12px; color: #15803d; font-weight: 600; }
        .cr-resumen-guest { margin-top: 4px; }
        .cr-resumen-guest-aviso {
          padding: 12px 14px;
          background: #fefce8;
          border: 1px solid #fde68a;
          border-radius: 10px;
          margin-bottom: 12px;
          font-size: 12.5px; color: #92400e; line-height: 1.5;
        }

        /* ── Botón comprar ─────────────────────────────────── */
        .cr-btn-comprar {
          width: 100%;
          padding: 15px;
          color: #fff; border: none;
          border-radius: 12px;
          font-size: 14.5px; font-weight: 700;
          font-family: 'Sora', sans-serif;
          display: flex; align-items: center; justify-content: center;
          gap: 9px;
          transition: transform .15s;
        }
        .cr-btn-comprar.activo {
          background: #0f172a;
          cursor: pointer;
          box-shadow: 0 4px 14px rgba(15, 23, 42, .3);
        }
        .cr-btn-comprar.activo.hover { transform: translateY(-1px); }
        .cr-btn-comprar.inactivo { background: #94a3b8; cursor: not-allowed; }
        .cr-resumen-stripe {
          margin-top: 12px;
          display: flex; align-items: center; justify-content: center; gap: 5px;
        }
        .cr-resumen-stripe-texto { font-size: 10.5px; color: #94a3b8; }

        /* ── Formulario de perfil en checkout ─────────────── */
        .cr-form-perfil {
          background: #fff;
          border: 1px solid #e2e8f0;
          border-radius: 20px;
          padding: 22px;
          box-shadow: 0 4px 24px rgba(15, 23, 42, .07);
        }
        .cr-form-titulo {
          margin: 0 0 4px;
          font-size: 14px; font-weight: 800;
          color: #0f172a;
          font-family: 'Sora', sans-serif;
        }
        .cr-form-desc { margin: 0 0 16px; font-size: 12px; color: #64748b; }
        .cr-form-campos { display: flex; flex-direction: column; gap: 11px; }

        .cr-field-label {
          display: block;
          font-size: 11px; font-weight: 700;
          color: #94a3b8;
          text-transform: uppercase; letter-spacing: .05em;
          margin-bottom: 4px;
        }
        .cr-field-wrap { position: relative; }
        .cr-field-input {
          width: 100%; box-sizing: border-box;
          padding: 10px 36px 10px 13px;
          border-radius: 10px;
          font-size: 13.5px; outline: none;
          font-family: inherit; color: #0f172a;
          transition: border-color .15s, background .15s;
        }
        .cr-field-input.neutro { border: 1px solid #e2e8f0; background: #fff; }
        .cr-field-input.valido { border: 1px solid #86efac; background: #f0fdf4; }
        .cr-field-input.error  { border: 1px solid #fca5a5; background: #fef2f2; }
        .cr-field-tick {
          position: absolute;
          right: 11px; top: 50%;
          transform: translateY(-50%);
          color: #22c55e;
          flex-shrink: 0;
        }
        .cr-field-error  { margin: 3px 0 0 2px; font-size: 11px; color: #ef4444; }
        .cr-field-status { margin: 3px 0 0 2px; font-size: 11px; }
        .cr-field-status.validando { color: #6366f1; }
        .cr-field-status.cp-ok     { color: #22c55e; }
        .cr-field-status.cp-err    { color: #ef4444; }
        .cr-field-select {
          width: 100%; box-sizing: border-box;
          padding: 10px 13px;
          border-radius: 10px;
          font-size: 13.5px; outline: none;
          font-family: inherit; cursor: pointer;
        }
        .cr-field-select.neutro { border: 1px solid #e2e8f0; background: #fff; color: #94a3b8; }
        .cr-field-select.valido { border: 1px solid #86efac; background: #f0fdf4; color: #0f172a; }
        .cr-field-select.error  { border: 1px solid #fca5a5; background: #fef2f2; color: #0f172a; }
        .cr-field-select.tiene-valor { color: #0f172a; }

        /* ── Teléfono prefijo (checkout) ──────────────────── */
        .cr-phone-wrap {
          display: flex;
          align-items: stretch;
        }
        .cr-phone-prefix {
          display: flex;
          align-items: center;
          padding: 0 10px;
          background: #0f172a;
          border: 1px solid #0f172a;
          border-right: none;
          border-radius: 10px 0 0 10px;
          font-size: 13px;
          font-weight: 700;
          color: #fff;
          white-space: nowrap;
          user-select: none;
          gap: .3rem;
          flex-shrink: 0;
        }
        .cr-phone-input-wrap {
          flex: 1;
          position: relative;
        }
        .cr-phone-input {
          border-radius: 0 10px 10px 0 !important;
          padding-left: 12px !important;
        }

        /* ── Página del carrito ────────────────────────────── */
        .cr-page {
          min-height: 100vh;
          background: #f8fafc;
          padding: 32px 16px 64px;
        }
        .cr-container { max-width: 1060px; margin: 0 auto; }
        .cr-header {
          display: flex; align-items: center;
          gap: 12px; margin-bottom: 28px;
        }
        .cr-header-icon {
          width: 38px; height: 38px;
          background: #0f172a;
          border-radius: 11px;
          display: flex; align-items: center; justify-content: center;
          box-shadow: 0 4px 10px rgba(99, 102, 241, .3);
          flex-shrink: 0;
        }
        .cr-title {
          margin: 0;
          font-size: 24px; font-weight: 800;
          color: #0f172a;
          font-family: 'Sora', sans-serif;
          letter-spacing: -.5px;
        }
        .cr-subtitle { margin: 0; font-size: 12.5px; color: #64748b; }
        .cr-error {
          padding: 12px 16px;
          background: #fef2f2;
          border: 1px solid #fecaca;
          border-radius: 10px;
          margin-bottom: 20px;
          font-size: 13px; color: #dc2626; font-weight: 500;
        }
        .cr-spinner { text-align: center; padding: 80px; }
        .cr-empty {
          text-align: center;
          padding: 72px 20px;
          background: #fff;
          border-radius: 20px;
          border: 1px solid #e2e8f0;
        }
        .cr-empty-icon { font-size: 56px; margin-bottom: 14px; }
        .cr-empty-title {
          margin: 0 0 6px;
          font-size: 19px; font-weight: 700;
          color: #0f172a;
          font-family: 'Sora', sans-serif;
        }
        .cr-empty-desc { margin: 0; color: #64748b; font-size: 13.5px; }
        .cr-grid {
          display: grid;
          grid-template-columns: 1fr 340px;
          gap: 24px;
          align-items: flex-start;
        }
        .cr-panel {
          background: #fff;
          border-radius: 20px;
          border: 1px solid #e2e8f0;
          padding: 6px 24px 4px;
          box-shadow: 0 2px 10px rgba(15, 23, 42, .04);
        }
        .cr-pay-wrap { padding: 20px 0; }
        .cr-pay-sep  { margin: 24px 0; border-top: 2px solid #f1f5f9; }
        .cr-pay-title {
          margin: 0 0 18px;
          font-size: 14px; font-weight: 700;
          color: #94a3b8;
          text-transform: uppercase; letter-spacing: .7px;
        }
        .cr-list-head { padding: 14px 0 4px; border-bottom: 2px solid #f1f5f9; }
        .cr-list-label {
          font-size: 11.5px; font-weight: 700;
          color: #94a3b8;
          text-transform: uppercase; letter-spacing: .7px;
        }
        .cr-foot { padding: 14px 0; }
        .cr-btn-vaciar {
          background: none; border: none;
          cursor: pointer;
          font-size: 12px; color: #ef4444; font-weight: 600;
          display: flex; align-items: center; gap: 4px;
          padding: 0;
        }

        /* ── Responsive ────────────────────────────────────── */
        @media (max-width: 900px) {
          .cr-grid {
            grid-template-columns: 1fr;
          }
          .cr-resumen {
            position: static;
          }
        }

        @media (max-width: 640px) {
          .cr-page   { padding: 20px 12px 48px; }
          .cr-header { margin-bottom: 20px; }
          .cr-title  { font-size: 20px; }
          .cr-panel  { padding: 4px 16px 4px; }
          .cr-resumen { padding: 18px; }
          .cr-empty  { padding: 48px 16px; }
          .cr-empty-icon { font-size: 44px; }
          .cr-empty-title { font-size: 16px; }
        }

        @media (max-width: 480px) {
          .cr-page   { padding: 14px 10px 40px; }
          .cr-title  { font-size: 18px; }
          .cr-header-icon { width: 32px; height: 32px; }
          .cr-pay-btns { flex-direction: column; }
          .cr-btn-pay  { flex: none; }
          .cr-btn-back { flex: none; }
          .cr-item-modelo { font-size: 13px; }
          .cr-subtotal    { font-size: 14px; }
        }

      `}</style>
    </>
  );
}
