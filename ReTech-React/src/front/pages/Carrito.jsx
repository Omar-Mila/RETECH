import { useState, useEffect, useCallback } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../../auth/AuthContext";
import { getGuestCart, setGuestCart, clearGuestCart } from "../../services/guestCart";
import { loadStripe } from "@stripe/stripe-js";
import {
  Elements,
  PaymentElement,
  useStripe,
  useElements,
} from "@stripe/react-stripe-js";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { useLanguage } from "../context/LanguageContext";

const stripePromise = loadStripe("pk_test_51SehVv68Ge0SylH5spiVqLpHaRCt8s3RsIiwyPi2VINaXKBYxbhDyzF6YThlNyVb0WHAp16SnJ5plSMoMxswIy8S00lVuCfPjV");
const API = "http://localhost:8000";

const apiFetch = async (path, opts = {}) => {
    if (opts.method && opts.method !== 'GET') {
        await fetch(`${API}/sanctum/csrf-cookie`, { credentials: "include" });
    }
    const xsrfToken = document.cookie
      .split("; ")
      .find(r => r.startsWith("XSRF-TOKEN="))
      ?.split("=")[1];
    const response = await fetch(`${API}/api${path}`, {
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
        "Accept": "application/json",
        "X-Requested-With": "XMLHttpRequest",
        ...(xsrfToken ? { "X-XSRF-TOKEN": decodeURIComponent(xsrfToken) } : {}),
      },
      ...opts,
    });

    // Si el servidor da error (401, 500, etc), lanzamos error antes de hacer .json()
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || `Error ${response.status}`);
    }

    return response.json();
};

const fmt = (n) =>
  new Intl.NumberFormat("es-ES", { style: "currency", currency: "EUR" }).format(n);

const ESTADO_BADGE = {
  Excelente:   { bg: "#d1fae5", text: "#065f46" },
  "Muy Bueno": { bg: "#dbeafe", text: "#1e40af" },
  Bueno:       { bg: "#fef9c3", text: "#854d0e" },
  Aceptable:   { bg: "#fee2e2", text: "#991b1b" },
};

function PhoneIcon({ hex }) {
  return (
    <div style={{ width:52,height:52,borderRadius:13,background:`${hex}22`,border:`2px solid ${hex}55`,display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0 }}>
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
        <rect x="6" y="2" width="12" height="20" rx="3" stroke={hex} strokeWidth="1.8"/>
        <circle cx="12" cy="18.5" r="1" fill={hex}/>
        <rect x="9" y="5" width="6" height="1.5" rx="0.75" fill={hex} opacity="0.5"/>
      </svg>
    </div>
  );
}

function BatteryBar({ value }) {
  const color = value >= 85 ? "#22c55e" : value >= 70 ? "#f59e0b" : "#ef4444";
  return (
    <div style={{ display:"flex",alignItems:"center",gap:5 }}>
      <div style={{ width:34,height:7,background:"#e5e7eb",borderRadius:4,overflow:"hidden" }}>
        <div style={{ width:`${value}%`,height:"100%",background:color,borderRadius:4,transition:"width .5s" }}/>
      </div>
      <span style={{ fontSize:10,color,fontWeight:700 }}>{value}%</span>
    </div>
  );
}

function QtyBtn({ label, onClick, disabled }) {
  return (
    <button onClick={onClick} disabled={disabled}
      style={{ width:30,height:30,border:"none",background:"none",cursor:disabled?"not-allowed":"pointer",fontSize:17,color:disabled?"#cbd5e1":"#475569",display:"flex",alignItems:"center",justifyContent:"center" }}>
      {label}
    </button>
  );
}

function CartItem({ item, onRemove, onQty, disabled }) {
  const badge = ESTADO_BADGE[item.estado] ?? ESTADO_BADGE["Bueno"];
  return (
    <div style={{ display:"flex",gap:14,padding:"18px 0",borderBottom:"1px solid #f1f5f9" }}>
      <PhoneIcon hex={item.color_hex}/>
      <div style={{ flex:1,minWidth:0 }}>
        <div style={{ display:"flex",justifyContent:"space-between",alignItems:"flex-start",gap:8 }}>
          <div>
            <p style={{ margin:0,fontWeight:700,fontSize:14.5,color:"#0f172a",fontFamily:"'Sora',sans-serif" }}>
              {item.modelo}
            </p>
            <p style={{ margin:"2px 0 0",fontSize:12,color:"#64748b" }}>
              {item.almacenamiento} GB · {item.ram} GB RAM ·{" "}
              <span style={{ display:"inline-flex",alignItems:"center",gap:3 }}>
                <span style={{ width:7,height:7,borderRadius:"50%",background:item.color_hex,display:"inline-block",border:"1px solid #cbd5e1" }}/>
                {item.color}
              </span>
            </p>
          </div>
          <button onClick={() => !disabled && onRemove(item.movil_id)} disabled={disabled}
            style={{ background:"none",border:"none",cursor:disabled?"not-allowed":"pointer",color:"#94a3b8",padding:3,lineHeight:1 }}
            onMouseEnter={(e) => { if (!disabled) e.currentTarget.style.color = "#ef4444"; }}
            onMouseLeave={(e) => { e.currentTarget.style.color = "#94a3b8"; }}>
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
              <path d="M18 6L6 18M6 6l12 12"/>
            </svg>
          </button>
        </div>

        <div style={{ display:"flex",alignItems:"center",gap:8,marginTop:7 }}>
          <span style={{ fontSize:10.5,fontWeight:700,padding:"2px 7px",borderRadius:20,background:badge.bg,color:badge.text }}>
            {item.estado}
          </span>
          <BatteryBar value={item.salud_bateria}/>
        </div>

        <div style={{ display:"flex",alignItems:"center",justifyContent:"space-between",marginTop:10 }}>
          <div style={{ display:"flex",alignItems:"center",background:"#f8fafc",border:"1px solid #e2e8f0",borderRadius:8 }}>
            <QtyBtn label="−" onClick={() => !disabled && onQty(item.movil_id, item.cantidad - 1)} disabled={disabled || item.cantidad <= 1}/>
            <span style={{ width:26,textAlign:"center",fontSize:13,fontWeight:700,color:"#0f172a" }}>{item.cantidad}</span>
            <QtyBtn label="+" onClick={() => !disabled && onQty(item.movil_id, item.cantidad + 1)} disabled={disabled || item.cantidad >= item.stock}/>
          </div>
          <div style={{ textAlign:"right" }}>
            <p style={{ margin:0,fontWeight:800,fontSize:16,color:"#0f172a",fontFamily:"'Sora',sans-serif" }}>{fmt(item.subtotal)}</p>
            {item.cantidad > 1 && <p style={{ margin:0,fontSize:10.5,color:"#94a3b8" }}>{fmt(item.precio)} / ud.</p>}
          </div>
        </div>
      </div>
    </div>
  );
}

function PaymentForm({ total, onSuccess, onCancel, t, profileFormData }) {
  const stripe   = useStripe();
  const elements = useElements();
  const [error,   setError]   = useState(null);
  const [loading, setLoading] = useState(false);

  const handlePay = async () => {
    if (!stripe || !elements) return;
    setLoading(true);
    setError(null);
    const { error: stripeError, paymentIntent } = await stripe.confirmPayment({
      elements,
      redirect: "if_required",
      confirmParams: {
        return_url: window.location.href,
        payment_method_data: { billing_details: { address: { country: "ES" } } },
      },
    });
    if (stripeError) {
      setError(stripeError.message);
      setLoading(false);
      return;
    }
    if (paymentIntent?.status === "succeeded") {
      if (profileFormData && Object.values(profileFormData).some(v => v !== "")) {
        try {
          await apiFetch("/user/cliente", {
            method: "PUT",
            body: JSON.stringify(profileFormData),
          });
        } catch {
          // No bloqueamos la compra si falla guardar el perfil
        }
      }
      const res = await apiFetch("/checkout/confirm", {
        method: "POST",
        body: JSON.stringify({ payment_intent_id: paymentIntent.id, lang: localStorage.getItem("retech-lang") || "es" }),
      });
      if (res.compra_id) {
        onSuccess(res.compra_id);
      } else {
        setError(res.message ?? "Error al registrar la compra.");
      }
    }
    setLoading(false);
  };

  return (
    <div>
      <PaymentElement options={{ layout:"tabs", fields:{ billingDetails:{ address:{ country:"never" } } } }}/>
      {error && (
        <div style={{ marginTop:12,padding:"10px 14px",background:"#fef2f2",border:"1px solid #fecaca",borderRadius:8,fontSize:12.5,color:"#dc2626" }}>
          {error}
        </div>
      )}
      <div style={{ display:"flex",gap:10,marginTop:20 }}>
        <button onClick={onCancel} disabled={loading}
          style={{ flex:1,padding:"13px",background:"#f8fafc",border:"1px solid #e2e8f0",borderRadius:10,fontSize:13.5,fontWeight:600,cursor:"pointer",color:"#475569" }}>
          {t('cart.back')}
        </button>
        <button onClick={handlePay} disabled={!stripe || loading}
          style={{ flex:2,padding:"13px",background:loading||!stripe?"#94a3b8":"linear-gradient(135deg,#6366f1,#4f46e5)",color:"#fff",border:"none",borderRadius:10,fontSize:14,fontWeight:700,cursor:loading||!stripe?"not-allowed":"pointer",fontFamily:"'Sora',sans-serif",boxShadow:loading?"none":"0 4px 14px rgba(99,102,241,.4)",display:"flex",alignItems:"center",justifyContent:"center",gap:8 }}>
          {loading ? <><Spinner/> {t('cart.processing')}</> : <><LockIcon/> {t('cart.pay')(fmt(total))}</>}
        </button>
      </div>
    </div>
  );
}

function Row({ label, value, muted, bold, large }) {
  return (
    <div style={{ display:"flex",justifyContent:"space-between",alignItems:"center" }}>
      <span style={{ fontSize:large?14.5:13,color:muted?"#94a3b8":bold?"#0f172a":"#475569",fontWeight:bold?800:400,fontFamily:bold?"'Sora',sans-serif":"inherit" }}>
        {label}
      </span>
      <span style={{ fontSize:large?19:13,fontWeight:bold?800:600,color:bold?"#4f46e5":muted?"#94a3b8":"#0f172a",fontFamily:"'Sora',sans-serif" }}>
        {value}
      </span>
    </div>
  );
}

function OrderSummary({ items, onCheckout, loadingIntent, t, isGuest }) {
  const total = items.reduce((s, i) => s + i.subtotal, 0);
  const totalItems = items.reduce((s, i) => s + i.cantidad, 0);

  return (
    <div style={{ position: "sticky", top: 24, background: "#fff", border: "1px solid #e2e8f0", borderRadius: 20, padding: 26, boxShadow: "0 4px 24px rgba(15,23,42,.07)" }}>
      <h2 style={{ margin: "0 0 22px", fontSize: 17, fontWeight: 800, color: "#0f172a", fontFamily: "'Sora',sans-serif", letterSpacing: "-.3px" }}>
        {t('cart.summaryTitle')}
      </h2>

      <div style={{ display: "flex", flexDirection: "column", gap: 11 }}>
        <Row label={t('cart.subtotal')(totalItems)} value={fmt(total)} />
        <Row label={t('cart.total')} value={fmt(total)} bold large />
      </div>

      <div style={{ margin: "18px 0", background: "#f0fdf4", border: "1px solid #bbf7d0", borderRadius: 10, padding: "9px 13px", display: "flex", alignItems: "center", gap: 7 }}>
        <span>🚚</span>
        <span style={{ fontSize: 12, color: "#15803d", fontWeight: 600 }}>{t('cart.freeShipping')}</span>
      </div>

      {isGuest ? (
        <div style={{ marginTop: 4 }}>
          <div style={{ padding: "12px 14px", background: "#fefce8", border: "1px solid #fde68a", borderRadius: 10, marginBottom: 12, fontSize: 12.5, color: "#92400e", lineHeight: 1.5 }}>
            {t('cart.guestCheckout')}
          </div>
          <button
            onClick={onCheckout}
            style={{ width: "100%", padding: "15px", background: "linear-gradient(135deg,#6366f1,#4f46e5)", color: "#fff", border: "none", borderRadius: 12, fontSize: 14.5, fontWeight: 700, cursor: "pointer", fontFamily: "'Sora',sans-serif", boxShadow: "0 4px 14px rgba(99,102,241,.4)", display: "flex", alignItems: "center", justifyContent: "center", gap: 9 }}
          >
            <LockIcon /> {t('cart.loginToBuy')}
          </button>
        </div>
      ) : (
        <>
          <button
            onClick={onCheckout}
            disabled={loadingIntent || items.length === 0}
            style={{
              width: "100%", padding: "15px",
              background: loadingIntent || items.length === 0 ? "#94a3b8" : "linear-gradient(135deg,#6366f1,#4f46e5)",
              color: "#fff", border: "none", borderRadius: 12, fontSize: 14.5, fontWeight: 700,
              cursor: loadingIntent ? "not-allowed" : "pointer", fontFamily: "'Sora',sans-serif",
              boxShadow: loadingIntent ? "none" : "0 4px 14px rgba(99,102,241,.4)",
              display: "flex", alignItems: "center", justifyContent: "center", gap: 9, transition: "transform .15s"
            }}
            onMouseEnter={(e) => { if (!loadingIntent) e.currentTarget.style.transform = "translateY(-1px)"; }}
            onMouseLeave={(e) => { e.currentTarget.style.transform = "translateY(0)"; }}
          >
            {loadingIntent ? <><Spinner /> {t('cart.preparingPay')}</> : <><LockIcon /> {t('cart.checkout')}</>}
          </button>
          <div style={{ marginTop: 12, display: "flex", alignItems: "center", justifyContent: "center", gap: 5 }}>
            <svg width="34" height="14" viewBox="0 0 60 25">
              <text x="0" y="18" fontFamily="Arial" fontSize="18" fontWeight="bold" fill="#635bff">stripe</text>
            </svg>
            <span style={{ fontSize: 10.5, color: "#94a3b8" }}>{t('cart.stripeSecure')}</span>
          </div>
        </>
      )}
    </div>
  );
}

function generateInvoiceHTML(compraId, items, total, user, labels, dateLocale) {
  const date = new Date().toLocaleDateString(dateLocale, { day: "numeric", month: "long", year: "numeric" });
  const invoiceNum = `FAC-${String(compraId).padStart(5, "0")}`;

  const c = user?.cliente ?? {};
  const clienteName     = c.nombre && c.apellidos ? `${c.nombre} ${c.apellidos}` : user?.name ?? "—";
  const clienteEmail    = user?.email    ?? "—";
  const clienteNif      = c.nif          ?? null;
  const clienteTel      = c.telefono     ?? null;
  const clienteDireccion = c.direccion   ?? null;

  const rows = items.map(item => `
    <tr>
      <td><strong>${item.modelo ?? ""}</strong><br><small>${item.almacenamiento ?? ""} GB · ${item.ram ?? ""} GB RAM · ${item.color ?? ""} · ${item.estado ?? ""}</small></td>
      <td>${item.cantidad}</td>
      <td>${fmt(item.precio)}</td>
      <td>${fmt(item.subtotal)}</td>
    </tr>
  `).join("");

  return `<!DOCTYPE html>
<html lang="${dateLocale.split('-')[0]}">
<head>
  <meta charset="UTF-8">
  <title>Factura ${invoiceNum}</title>
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
      <p class="tagline">${labels.tagline}</p>
    </div>
    <div class="invoice-meta">
      <div class="invoice-num">${invoiceNum}</div>
      <p>${labels.issueDate} <strong style="color:#0f172a">${date}</strong></p>
      <p>${labels.orderNum} #${compraId}</p>
    </div>
  </div>

  <div class="info-row">
    <div class="info-block">
      <h3>${labels.seller}</h3>
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
      <h3>${labels.client}</h3>
      <p>
        <strong>${clienteName}</strong><br>
        ${clienteNif        ? `NIF: ${clienteNif}<br>`  : ""}
        ${clienteDireccion  ? `${clienteDireccion}<br>` : ""}
        ${clienteTel        ? `Tel: ${clienteTel}<br>`  : ""}
        ${clienteEmail}
      </p>
    </div>
  </div>

  <hr>
  <table>
    <thead>
      <tr><th>${labels.product}</th><th>${labels.quantity}</th><th>${labels.unitPrice}</th><th>${labels.total}</th></tr>
    </thead>
    <tbody>${rows}</tbody>
  </table>
  <div class="totals">
    <div class="totals-inner">
      <div class="total-final"><span>${labels.total}</span><span>${fmt(total)}</span></div>
    </div>
  </div>
  <div class="footer">
    <div class="footer-left">
      <p>${labels.thanks}</p>
      <p>${labels.simplifiedInvoice}</p>
    </div>
    <div class="footer-badge">RETECH CERT</div>
  </div>
</body>
</html>`;
}

function SuccessScreen({ compraId }) {
  const { t } = useLanguage();
  const { user } = useAuth();
  const [items, setItems] = useState([]);
  const [total, setTotal] = useState(0);
  const [loadingOrder, setLoadingOrder] = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        const res = await fetch(`/api/compras/${compraId}`, {
          credentials: "include",
          headers: { "Accept": "application/json" },
        });
        if (!res.ok) throw new Error();
        const order = await res.json();

        const ids = [...new Set((order.items || []).map(i => i.movil_id))];
        const results = await Promise.all(
          ids.map(id =>
            fetch(`/api/products/${id}`, { headers: { "Accept": "application/json" } })
              .then(r => r.ok ? r.json() : null).catch(() => null)
          )
        );
        const cache = {};
        ids.forEach((id, i) => { if (results[i]) cache[id] = results[i]; });

        const merged = (order.items || []).map(item => {
          const movil = cache[item.movil_id] || {};
          const precio = item.precio ?? item.precio_unitario ?? movil.precio ?? 0;
          return { ...movil, cantidad: item.cantidad, precio, subtotal: precio * item.cantidad };
        });

        setItems(merged);
        setTotal(order.precio_total ?? merged.reduce((s, i) => s + i.subtotal, 0));
      } catch {
        // Si falla la carga, se muestran los botones igual sin items
      } finally {
        setLoadingOrder(false);
      }
    };
    load();
  }, [compraId]);

  const handleInvoice = () => {
    const html = generateInvoiceHTML(compraId, items, total, user, t('invoice'), t('orders.dateLocale'));
    const win = window.open("", "_blank");
    if (!win) return;
    win.document.write(html);
    win.document.close();
    win.focus();
    win.print();
  };

  return (
    <div style={{ minHeight:"100vh",background:"#f8fafc",display:"flex",alignItems:"center",justifyContent:"center",padding:24 }}>
      <div style={{ background:"#fff",borderRadius:24,padding:"40px",textAlign:"center",maxWidth:480,width:"100%",border:"1px solid #e2e8f0",boxShadow:"0 8px 32px rgba(15,23,42,.08)" }}>
        <div style={{ width:72,height:72,borderRadius:"50%",background:"#0f172a",margin:"0 auto 20px",display:"flex",alignItems:"center",justifyContent:"center",boxShadow:"0 8px 20px rgba(15,23,42,.2)" }}>
          <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5">
            <polyline points="20 6 9 17 4 12"/>
          </svg>
        </div>
        <h1 style={{ margin:"0 0 8px",fontSize:24,fontWeight:800,color:"#0f172a",fontFamily:"'Sora',sans-serif" }}>{t('cart.orderConfirmed')}</h1>
        <p style={{ margin:"0 0 4px",color:"#64748b",fontSize:14 }}>{t('cart.orderProcessed')}</p>
        <p style={{ margin:"0 0 24px",color:"#94a3b8",fontSize:12.5 }}>{t('cart.orderNumber')} #{compraId}</p>

        {loadingOrder && (
          <div style={{ marginBottom:24 }}><Spinner size={22} color="#6366f1"/></div>
        )}

        <div style={{ display:"flex",gap:12,justifyContent:"center",flexWrap:"wrap" }}>
          <button
            onClick={handleInvoice}
            disabled={loadingOrder || items.length === 0}
            style={{ padding:"12px 22px",background:"#f8fafc",border:"1px solid #e2e8f0",borderRadius:10,fontSize:13.5,fontWeight:700,cursor:loadingOrder||items.length===0?"not-allowed":"pointer",color:"#0f172a",fontFamily:"'Sora',sans-serif",opacity:loadingOrder||items.length===0?0.5:1 }}
          >
            {t('cart.downloadInvoice')}
          </button>
          <a href="/" style={{ padding:"12px 22px",background:"linear-gradient(135deg,#6366f1,#4f46e5)",color:"#fff",borderRadius:10,textDecoration:"none",fontSize:13.5,fontWeight:700,fontFamily:"'Sora',sans-serif",boxShadow:"0 4px 12px rgba(99,102,241,.35)" }}>
            {t('cart.keepShopping')}
          </a>
        </div>
      </div>
    </div>
  );
}

function Spinner({ size = 18, color = "white" }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2.5"
      style={{ animation:"spin .8s linear infinite" }}>
      <path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83"/>
    </svg>
  );
}

function LockIcon() {
  return (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5">
      <rect x="3" y="11" width="18" height="11" rx="2"/>
      <path d="M7 11V7a5 5 0 0110 0v4"/>
    </svg>
  );
}

const VALIDATE = {
  nombre:    v => v.trim() !== "",
  apellidos: v => v.trim() !== "",
  nif:       v => v === "" || /^\d{8}[A-Za-z]$/.test(v),
  direccion: v => v.trim() !== "",
  telefono:  v => v === "" || /^\d{9}$/.test(v),
};

function ProfileForm({ user, onDataChange, t }) {
  const c = user?.cliente ?? {};
  const initial = {
    nombre:    c.nombre    ?? "",
    apellidos: c.apellidos ?? "",
    nif:       c.nif       ?? "",
    direccion: c.direccion ?? "",
    telefono:  c.telefono  ?? "",
  };
  const [form,    setForm]    = useState(initial);
  const [touched, setTouched] = useState(() =>
    Object.fromEntries(Object.entries(initial).filter(([,v]) => v !== "").map(([k]) => [k, true]))
  );

  const validity = Object.fromEntries(Object.keys(form).map(k => [k, VALIDATE[k](form[k])]));

  useEffect(() => {
    const allValid = Object.values(validity).every(Boolean) &&
      form.nombre.trim() && form.apellidos.trim() && form.direccion.trim();
    onDataChange?.(form, !!allValid);
  }, []);

  const handleChange = (key, value) => {
    const newForm = { ...form, [key]: value };
    setForm(newForm);
    setTouched(p => ({ ...p, [key]: true }));
    const newValidity = Object.fromEntries(Object.keys(newForm).map(k => [k, VALIDATE[k](newForm[k])]));
    const allValid = Object.values(newValidity).every(Boolean) &&
      newForm.nombre.trim() && newForm.apellidos.trim() && newForm.direccion.trim();
    onDataChange?.(newForm, !!allValid);
  };

  const ERRORS = {
    nombre:    t('cart.profileFieldRequired'),
    apellidos: t('cart.profileFieldRequired'),
    nif:       t('cart.profileNifError'),
    direccion: t('cart.profileFieldRequired'),
    telefono:  t('cart.profilePhoneError'),
  };

  const field = (label, key) => {
    const isValid   = validity[key];
    const hasValue  = form[key] !== "";
    const isTouched = touched[key];
    const showTick  = hasValue && isValid;
    const showError = isTouched && !isValid;
    const border    = showError ? "#fca5a5" : showTick ? "#86efac" : "#e2e8f0";
    const bg        = showError ? "#fef2f2" : showTick ? "#f0fdf4" : "#fff";

    return (
      <div>
        <label style={{ display:"block", fontSize:11, fontWeight:700, color:"#94a3b8", textTransform:"uppercase", letterSpacing:".05em", marginBottom:4 }}>
          {label}
        </label>
        <div style={{ position:"relative" }}>
          <input
            type="text"
            value={form[key]}
            onChange={e => handleChange(key, e.target.value)}
            onBlur={() => setTouched(p => ({ ...p, [key]: true }))}
            style={{ width:"100%", boxSizing:"border-box", padding:"10px 36px 10px 13px", border:`1px solid ${border}`, borderRadius:10, fontSize:13.5, outline:"none", fontFamily:"inherit", color:"#0f172a", background:bg, transition:"border-color .15s, background .15s" }}
          />
          {showTick && (
            <svg style={{ position:"absolute", right:11, top:"50%", transform:"translateY(-50%)", color:"#22c55e", flexShrink:0 }} width="15" height="15" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M16.704 4.153a.75.75 0 01.143 1.052l-8 10.5a.75.75 0 01-1.127.075l-4.5-4.5a.75.75 0 011.06-1.06l3.894 3.893 7.48-9.817a.75.75 0 011.05-.143z" clipRule="evenodd"/>
            </svg>
          )}
        </div>
        {showError && (
          <p style={{ margin:"3px 0 0 2px", fontSize:11, color:"#ef4444" }}>{ERRORS[key]}</p>
        )}
      </div>
    );
  };

  return (
    <div style={{ background:"#fff", border:"1px solid #e2e8f0", borderRadius:20, padding:22, boxShadow:"0 4px 24px rgba(15,23,42,.07)" }}>
      <h3 style={{ margin:"0 0 4px", fontSize:14, fontWeight:800, color:"#0f172a", fontFamily:"'Sora',sans-serif" }}>
        {t('cart.profileModalTitle')}
      </h3>
      <p style={{ margin:"0 0 16px", fontSize:12, color:"#64748b" }}>
        {t('cart.profileModalDesc')}
      </p>
      <div style={{ display:"flex", flexDirection:"column", gap:11 }}>
        {field(t('profile.name'),     "nombre")}
        {field(t('profile.surnames'), "apellidos")}
        {field(t('profile.nif'),      "nif")}
        {field(t('profile.address'),  "direccion")}
        {field(t('profile.phone'),    "telefono")}
      </div>
    </div>
  );
}

export default function CartCheckoutPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const { t } = useLanguage();
  const { isAuthenticated, user, setUser } = useAuth();
  const [items,         setItems]         = useState([]);
  const [fetchLoading,  setFetchLoading]  = useState(true);
  const [intentLoading, setIntentLoading] = useState(false);
  const [clientSecret,  setClientSecret]  = useState(null);
  const [intentTotal,   setIntentTotal]   = useState(0);
  const [successId,     setSuccessId]     = useState(null);
  const [apiError,      setApiError]      = useState(null);
  const [isGuest,       setIsGuest]       = useState(!isAuthenticated);
  const [profileFormData, setProfileFormData] = useState(null);

  const loadCart = useCallback(async () => {
    setFetchLoading(true);
    if (!isAuthenticated) {
      setIsGuest(true);
      const stored = getGuestCart();
      setItems(stored.map(item => ({ ...item, subtotal: item.precio * item.cantidad })));
      setFetchLoading(false);
      return;
    }
    try {
      const data = await apiFetch("/carrito");
      setItems(data.items ?? []);
      setIsGuest(false);
    } catch (err) {
      setApiError(t('cart.loadError'));
    } finally {
      setFetchLoading(false);
    }
  }, [isAuthenticated]);

// const loadCart = useCallback(async () => {
//   setFetchLoading(true);
//   // MOCK - quitar cuando conectes la API real
//   setItems([
//     {
//       movil_id: 1,
//       cantidad: 1,
//       precio: 749.99,
//       subtotal: 749.99,
//       modelo: "iPhone 14 Pro",
//       marca: "Apple",
//       color: "Negro Espacial",
//       color_hex: "#1c1c1e",
//       almacenamiento: 256,
//       ram: 6,
//       estado: "Excelente",
//       salud_bateria: 92,
//       stock: 5,
//     },
//     {
//       movil_id: 2,
//       cantidad: 2,
//       precio: 619.00,
//       subtotal: 1238.00,
//       modelo: "Galaxy S23 Ultra",
//       marca: "Samsung",
//       color: "Crema",
//       color_hex: "#c8b89a",
//       almacenamiento: 512,
//       ram: 12,
//       estado: "Muy Bueno",
//       salud_bateria: 87,
//       stock: 3,
//     },
//     {
//       movil_id: 3,
//       cantidad: 1,
//       precio: 439.50,
//       subtotal: 439.50,
//       modelo: "Pixel 8 Pro",
//       marca: "Google",
//       color: "Azul Bahía",
//       color_hex: "#4a90d9",
//       almacenamiento: 128,
//       ram: 12,
//       estado: "Bueno",
//       salud_bateria: 81,
//       stock: 2,
//     },
//   ]);
//   setFetchLoading(false);
// }, []);

  useEffect(() => { loadCart(); }, [loadCart]);

  const handleRemove = async (movilId) => {
    if (!isAuthenticated) {
      const updated = getGuestCart().filter(i => i.movil_id !== movilId);
      setGuestCart(updated);
      setItems(prev => prev.filter(i => i.movil_id !== movilId));
      window.dispatchEvent(new Event("cart-updated"));
      return;
    }
    await apiFetch(`/carrito/${movilId}`, { method: "DELETE" });
    await loadCart();
  };

  const handleQty = async (movilId, nuevaCantidad) => {
    if (!isAuthenticated) {
      const updated = getGuestCart().map(i =>
        i.movil_id === movilId ? { ...i, cantidad: nuevaCantidad } : i
      );
      setGuestCart(updated);
      setItems(prev => prev.map(i =>
        i.movil_id === movilId
          ? { ...i, cantidad: nuevaCantidad, subtotal: i.precio * nuevaCantidad }
          : i
      ));
      window.dispatchEvent(new Event("cart-updated"));
      return;
    }
    await apiFetch(`/carrito/${movilId}`, {
      method: "PATCH",
      body: JSON.stringify({ cantidad: nuevaCantidad }),
    });
    await loadCart();
  };

  const handleClear = async () => {
    if (!isAuthenticated) {
      clearGuestCart();
      setItems([]);
      window.dispatchEvent(new Event("cart-updated"));
      return;
    }
    await apiFetch("/carrito/vaciar", { method: "DELETE" });
    setItems([]);
  };

  const handleCheckout = async () => {
    if (!isAuthenticated) {
      navigate("/login", { state: { from: location.pathname } });
      return;
    }

    setIntentLoading(true);
    setApiError(null);
    
    try {
      // 1. Inicializamos la protección CSRF
      await fetch(`${API}/sanctum/csrf-cookie`, { credentials: 'include' });

      // 2. Realizamos la petición real para crear el pago
      // Usamos apiFetch porque ya tiene las credentials y headers configurados
      const data = await apiFetch("/checkout/intent", { 
        method: "POST" 
      });

      // 3. Procesamos la respuesta del servidor
      if (data && data.client_secret) {
        setClientSecret(data.client_secret);
        setIntentTotal(data.amount);
      } else {
        // Si el error es "Unauthenticated", es que el middleware 'auth' falló
        setApiError(data.message ?? "No se pudo iniciar el pago. ¿Has iniciado sesión?");
      }
    } catch (err) {
      if (err.message === "Unauthenticated.") {
        setAuthToast(true);
        setTimeout(() => {
          setAuthToast(false);
          navigate("/login");
        }, 2500);
      } else {
        setApiError(err.message || "Error desconocido: " + err);
      }
    } finally {
      setIntentLoading(false);
    }
  };

  if (successId) return <SuccessScreen compraId={successId}/>;

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Sora:wght@400;600;700;800&family=Inter:wght@400;500;600&display=swap');
        * { box-sizing: border-box; }
        body { margin: 0; font-family: 'Inter', sans-serif; background: #f8fafc; }
        @keyframes fadeIn { from { opacity:0; transform:translateY(8px); } to { opacity:1; transform:translateY(0); } }
        @keyframes spin { to { transform:rotate(360deg); } }
      `}</style>
      <Navbar />

      <div style={{ minHeight:"100vh",background:"#f8fafc",padding:"32px 16px 64px" }}>
        <div style={{ maxWidth:1060,margin:"0 auto" }}>

          <div style={{ display:"flex",alignItems:"center",gap:12,marginBottom:28 }}>
            <div style={{ width:38,height:38,background:"#0f172a",borderRadius:11,display:"flex",alignItems:"center",justifyContent:"center",boxShadow:"0 4px 10px rgba(99,102,241,.3)" }}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.2">
                <path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z"/>
                <line x1="3" y1="6" x2="21" y2="6"/>
                <path d="M16 10a4 4 0 01-8 0"/>
              </svg>
            </div>
            <div>
              <h1 style={{ margin:0,fontSize:24,fontWeight:800,color:"#0f172a",fontFamily:"'Sora',sans-serif",letterSpacing:"-.5px" }}>
                {clientSecret ? t('cart.payTitle') : t('cart.title')}
              </h1>
              {!clientSecret && (
                <p style={{ margin:0,fontSize:12.5,color:"#64748b" }}>
                  {fetchLoading ? t('cart.loading') : items.length === 0 ? t('cart.emptyStatus') : t('cart.itemsCount')(items.reduce((s,i) => s+i.cantidad, 0))}
                </p>
              )}
            </div>
          </div>

          {apiError && (
            <div style={{ padding:"12px 16px",background:"#fef2f2",border:"1px solid #fecaca",borderRadius:10,marginBottom:20,fontSize:13,color:"#dc2626",fontWeight:500 }}>
              {apiError}
            </div>
          )}

          {fetchLoading ? (
            <div style={{ textAlign:"center",padding:80 }}>
              <Spinner size={32} color="#6366f1"/>
            </div>
          ) : items.length === 0 && !clientSecret ? (
            <div style={{ textAlign:"center",padding:"72px 20px",background:"#fff",borderRadius:20,border:"1px solid #e2e8f0" }}>
              <div style={{ fontSize:56,marginBottom:14 }}>🛒</div>
              <h2 style={{ margin:"0 0 6px",fontSize:19,fontWeight:700,color:"#0f172a",fontFamily:"'Sora',sans-serif" }}>{t('cart.emptyTitle')}</h2>
              <p style={{ margin:0,color:"#64748b",fontSize:13.5 }}>{t('cart.emptyDesc')}</p>
            </div>
          ) : (
            <div style={{ display:"grid",gridTemplateColumns:"1fr 340px",gap:24,alignItems:"flex-start" }}>
              <div style={{ background:"#fff",borderRadius:20,border:"1px solid #e2e8f0",padding:"6px 24px 4px",boxShadow:"0 2px 10px rgba(15,23,42,.04)" }}>
                {clientSecret ? (
                  <div style={{ padding:"20px 0" }}>
                    <div style={{ marginBottom:24 }}>
                      <ProfileForm
                        user={user}
                        onDataChange={(data) => setProfileFormData(data)}
                        t={t}
                      />
                      <div style={{ margin:"24px 0", borderTop:"2px solid #f1f5f9" }}/>
                    </div>
                    <h3 style={{ margin:"0 0 18px",fontSize:14,fontWeight:700,color:"#94a3b8",textTransform:"uppercase",letterSpacing:".7px" }}>
                      {t('cart.paymentData')}
                    </h3>
                    <Elements stripe={stripePromise} options={{ clientSecret, appearance:{ theme:"stripe", variables:{ colorPrimary:"#6366f1", borderRadius:"10px", fontFamily:"Inter, sans-serif" } } }}>
                      <PaymentForm total={intentTotal} onSuccess={(id) => setSuccessId(id)} onCancel={() => setClientSecret(null)} t={t} profileFormData={profileFormData}/>
                    </Elements>
                  </div>
                ) : (
                  <>
                    <div style={{ padding:"14px 0 4px",borderBottom:"2px solid #f1f5f9" }}>
                      <span style={{ fontSize:11.5,fontWeight:700,color:"#94a3b8",textTransform:"uppercase",letterSpacing:".7px" }}>{t('cart.products')}</span>
                    </div>
                    {items.map((item) => (
                      <CartItem key={item.movil_id} item={item} onRemove={handleRemove} onQty={handleQty} disabled={intentLoading}/>
                    ))}
                    <div style={{ padding:"14px 0" }}>
                      <button onClick={handleClear}
                        style={{ background:"none",border:"none",cursor:"pointer",fontSize:12,color:"#ef4444",fontWeight:600,display:"flex",alignItems:"center",gap:4,padding:0 }}>
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
              <OrderSummary items={items} onCheckout={handleCheckout} loadingIntent={intentLoading} t={t} isGuest={!isAuthenticated}/>
            </div>
          )}
        </div>
      </div>
      <Footer />
    </>
  );
}