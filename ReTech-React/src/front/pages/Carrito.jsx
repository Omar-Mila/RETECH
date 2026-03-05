import { useState, useEffect, useCallback } from "react";
import { loadStripe } from "@stripe/stripe-js";
import {
  Elements,
  PaymentElement,
  useStripe,
  useElements,
} from "@stripe/react-stripe-js";

const stripePromise = loadStripe("pk_test_51SehVv68Ge0SylH5spiVqLpHaRCt8s3RsIiwyPi2VINaXKBYxbhDyzF6YThlNyVb0WHAp16SnJ5plSMoMxswIy8S00lVuCfPjV");
const API = "http://127.0.0.1:8000";

const apiFetch = (path, opts = {}) =>
  fetch(`${API}/api${path}`, {
    credentials: "include",
    headers: { "Content-Type": "application/json", Accept: "application/json" },
    ...opts,
  }).then((r) => r.json());

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
              {item.marca} {item.modelo}
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

function PaymentForm({ total, onSuccess, onCancel }) {
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
    });

    if (stripeError) {
      setError(stripeError.message);
      setLoading(false);
      return;
    }

    if (paymentIntent?.status === "succeeded") {
      const res = await apiFetch("/checkout/confirm", {
        method: "POST",
        body: JSON.stringify({ payment_intent_id: paymentIntent.id }),
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
          ← Volver
        </button>
        <button onClick={handlePay} disabled={!stripe || loading}
          style={{ flex:2,padding:"13px",background:loading||!stripe?"#94a3b8":"linear-gradient(135deg,#6366f1,#4f46e5)",color:"#fff",border:"none",borderRadius:10,fontSize:14,fontWeight:700,cursor:loading||!stripe?"not-allowed":"pointer",fontFamily:"'Sora',sans-serif",boxShadow:loading?"none":"0 4px 14px rgba(99,102,241,.4)",display:"flex",alignItems:"center",justifyContent:"center",gap:8 }}>
          {loading ? <><Spinner/> Procesando…</> : <><LockIcon/> Pagar {fmt(total)}</>}
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

function OrderSummary({ items, onCheckout, loadingIntent }) {
  const subtotal   = items.reduce((s, i) => s + i.subtotal, 0);
  const iva        = subtotal * 0.21;
  const total      = subtotal + iva;
  const totalItems = items.reduce((s, i) => s + i.cantidad, 0);

  return (
    <div style={{ position:"sticky",top:24,background:"#fff",border:"1px solid #e2e8f0",borderRadius:20,padding:26,boxShadow:"0 4px 24px rgba(15,23,42,.07)" }}>
      <h2 style={{ margin:"0 0 22px",fontSize:17,fontWeight:800,color:"#0f172a",fontFamily:"'Sora',sans-serif",letterSpacing:"-.3px" }}>
        Resumen del pedido
      </h2>
      <div style={{ display:"flex",flexDirection:"column",gap:11 }}>
        <Row label={`Subtotal (${totalItems} art.)`} value={fmt(subtotal)}/>
        <Row label="IVA (21%)" value={fmt(iva)} muted/>
        <div style={{ borderTop:"2px dashed #e2e8f0",margin:"2px 0" }}/>
        <Row label="Total" value={fmt(total)} bold large/>
      </div>
      <div style={{ margin:"18px 0",background:"#f0fdf4",border:"1px solid #bbf7d0",borderRadius:10,padding:"9px 13px",display:"flex",alignItems:"center",gap:7 }}>
        <span>🚚</span>
        <span style={{ fontSize:12,color:"#15803d",fontWeight:600 }}>¡Envío gratuito incluido!</span>
      </div>
      <button onClick={onCheckout} disabled={loadingIntent || items.length === 0}
        style={{ width:"100%",padding:"15px",background:loadingIntent||items.length===0?"#94a3b8":"linear-gradient(135deg,#6366f1,#4f46e5)",color:"#fff",border:"none",borderRadius:12,fontSize:14.5,fontWeight:700,cursor:loadingIntent?"not-allowed":"pointer",fontFamily:"'Sora',sans-serif",boxShadow:loadingIntent?"none":"0 4px 14px rgba(99,102,241,.4)",display:"flex",alignItems:"center",justifyContent:"center",gap:9,transition:"transform .15s" }}
        onMouseEnter={(e) => { if (!loadingIntent) e.currentTarget.style.transform = "translateY(-1px)"; }}
        onMouseLeave={(e) => { e.currentTarget.style.transform = "translateY(0)"; }}>
        {loadingIntent ? <><Spinner/> Preparando pago…</> : <><LockIcon/> Proceder al pago</>}
      </button>
      <div style={{ marginTop:12,display:"flex",alignItems:"center",justifyContent:"center",gap:5 }}>
        <svg width="34" height="14" viewBox="0 0 60 25">
          <text x="0" y="18" fontFamily="Arial" fontSize="18" fontWeight="bold" fill="#635bff">stripe</text>
        </svg>
        <span style={{ fontSize:10.5,color:"#94a3b8" }}>Pago 100% seguro con Stripe</span>
      </div>
    </div>
  );
}

function SuccessScreen({ compraId }) {
  return (
    <div style={{ minHeight:"100vh",background:"#f8fafc",display:"flex",alignItems:"center",justifyContent:"center",padding:24 }}>
      <div style={{ background:"#fff",borderRadius:24,padding:"52px 40px",textAlign:"center",maxWidth:420,width:"100%",border:"1px solid #e2e8f0",boxShadow:"0 8px 32px rgba(15,23,42,.08)" }}>
        <div style={{ width:72,height:72,borderRadius:"50%",background:"linear-gradient(135deg,#6366f1,#4f46e5)",margin:"0 auto 20px",display:"flex",alignItems:"center",justifyContent:"center",boxShadow:"0 8px 20px rgba(99,102,241,.35)" }}>
          <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5">
            <polyline points="20 6 9 17 4 12"/>
          </svg>
        </div>
        <h1 style={{ margin:"0 0 8px",fontSize:24,fontWeight:800,color:"#0f172a",fontFamily:"'Sora',sans-serif" }}>¡Pedido confirmado!</h1>
        <p style={{ margin:"0 0 6px",color:"#64748b",fontSize:14 }}>Tu pago se ha procesado correctamente.</p>
        <p style={{ margin:"0 0 28px",color:"#94a3b8",fontSize:12.5 }}>Pedido #{compraId}</p>
        <a href="/" style={{ display:"inline-block",padding:"12px 28px",background:"linear-gradient(135deg,#6366f1,#4f46e5)",color:"#fff",borderRadius:10,textDecoration:"none",fontSize:13.5,fontWeight:700,fontFamily:"'Sora',sans-serif",boxShadow:"0 4px 12px rgba(99,102,241,.35)" }}>
          Seguir comprando
        </a>
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

export default function CartCheckoutPage() {
  const [items,         setItems]         = useState([]);
  const [fetchLoading,  setFetchLoading]  = useState(true);
  const [intentLoading, setIntentLoading] = useState(false);
  const [clientSecret,  setClientSecret]  = useState(null);
  const [intentTotal,   setIntentTotal]   = useState(0);
  const [successId,     setSuccessId]     = useState(null);
  const [apiError,      setApiError]      = useState(null);

  const loadCart = useCallback(async () => {
    setFetchLoading(true);
    try {
      const data = await apiFetch("/carrito");
      setItems(data.items ?? []);
    } catch {
      setApiError("No se pudo cargar el carrito.");
    } finally {
      setFetchLoading(false);
    }
  }, []);

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
    await apiFetch(`/carrito/${movilId}`, { method: "DELETE" });
    await loadCart();
  };

  const handleQty = async (movilId, nuevaCantidad) => {
    await apiFetch(`/carrito/${movilId}`, {
      method: "PATCH",
      body: JSON.stringify({ cantidad: nuevaCantidad }),
    });
    await loadCart();
  };

  const handleClear = async () => {
    await apiFetch("/carrito/vaciar", { method: "DELETE" });
    setItems([]);
  };

  const handleCheckout = async () => {
    setIntentLoading(true);
    setApiError(null);
    try {
      const data = await apiFetch("/checkout/intent", { method: "POST" });
      if (data.client_secret) {
        setClientSecret(data.client_secret);
        setIntentTotal(data.amount);
      } else {
        setApiError(data.message ?? "Error al iniciar el pago.");
      }
    } catch {
      setApiError("Error de conexión con el servidor.");
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

      <div style={{ minHeight:"100vh",background:"#f8fafc",padding:"32px 16px 64px" }}>
        <div style={{ maxWidth:1060,margin:"0 auto" }}>

          <div style={{ display:"flex",alignItems:"center",gap:12,marginBottom:28 }}>
            <div style={{ width:38,height:38,background:"linear-gradient(135deg,#6366f1,#4f46e5)",borderRadius:11,display:"flex",alignItems:"center",justifyContent:"center",boxShadow:"0 4px 10px rgba(99,102,241,.3)" }}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.2">
                <path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z"/>
                <line x1="3" y1="6" x2="21" y2="6"/>
                <path d="M16 10a4 4 0 01-8 0"/>
              </svg>
            </div>
            <div>
              <h1 style={{ margin:0,fontSize:24,fontWeight:800,color:"#0f172a",fontFamily:"'Sora',sans-serif",letterSpacing:"-.5px" }}>
                {clientSecret ? "Pago seguro" : "Tu carrito"}
              </h1>
              {!clientSecret && (
                <p style={{ margin:0,fontSize:12.5,color:"#64748b" }}>
                  {fetchLoading ? "Cargando…" : items.length === 0 ? "Vacío" : `${items.reduce((s,i) => s+i.cantidad, 0)} artículos`}
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
              <h2 style={{ margin:"0 0 6px",fontSize:19,fontWeight:700,color:"#0f172a",fontFamily:"'Sora',sans-serif" }}>Tu carrito está vacío</h2>
              <p style={{ margin:0,color:"#64748b",fontSize:13.5 }}>Explora el catálogo y encuentra tu próximo móvil.</p>
            </div>
          ) : (
            <div style={{ display:"grid",gridTemplateColumns:"1fr 340px",gap:24,alignItems:"flex-start" }}>
              <div style={{ background:"#fff",borderRadius:20,border:"1px solid #e2e8f0",padding:"6px 24px 4px",boxShadow:"0 2px 10px rgba(15,23,42,.04)" }}>
                {clientSecret ? (
                  <div style={{ padding:"20px 0" }}>
                    <h3 style={{ margin:"0 0 18px",fontSize:14,fontWeight:700,color:"#94a3b8",textTransform:"uppercase",letterSpacing:".7px" }}>
                      Datos de pago
                    </h3>
                    <Elements stripe={stripePromise} options={{ clientSecret, appearance:{ theme:"stripe", variables:{ colorPrimary:"#6366f1", borderRadius:"10px", fontFamily:"Inter, sans-serif" } } }}>
                      <PaymentForm total={intentTotal} onSuccess={(id) => setSuccessId(id)} onCancel={() => setClientSecret(null)}/>
                    </Elements>
                  </div>
                ) : (
                  <>
                    <div style={{ padding:"14px 0 4px",borderBottom:"2px solid #f1f5f9" }}>
                      <span style={{ fontSize:11.5,fontWeight:700,color:"#94a3b8",textTransform:"uppercase",letterSpacing:".7px" }}>Productos</span>
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
                        Vaciar carrito
                      </button>
                    </div>
                  </>
                )}
              </div>
              <OrderSummary items={items} onCheckout={handleCheckout} loadingIntent={intentLoading}/>
            </div>
          )}
        </div>
      </div>
    </>
  );
}