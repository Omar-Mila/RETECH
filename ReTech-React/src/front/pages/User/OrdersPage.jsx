import { useState, useEffect } from "react";
import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";

const fmt = (n) =>
  new Intl.NumberFormat("es-ES", { style: "currency", currency: "EUR" }).format(n);

function generateInvoiceHTML(compraId, items, total) {
  const date = new Date().toLocaleDateString("es-ES", { day: "numeric", month: "long", year: "numeric" });
  const invoiceNum = `FAC-${String(compraId).padStart(5, "0")}`;
  const rows = items.map(item => `
    <tr>
      <td><strong>${item.modelo ?? ""}</strong><br><small>${item.almacenamiento ?? ""} GB · ${item.ram ?? ""} GB RAM · ${item.color ?? ""} · ${item.estado ?? ""}</small></td>
      <td>${item.cantidad}</td>
      <td>${fmt(item.precio)}</td>
      <td>${fmt(item.subtotal)}</td>
    </tr>
  `).join("");

  return `<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="UTF-8">
  <title>Factura ${invoiceNum}</title>
  <style>
    * { box-sizing: border-box; margin: 0; padding: 0; }
    body { font-family: Arial, Helvetica, sans-serif; color: #1e293b; padding: 48px; font-size: 13px; }
    .header { display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 40px; }
    .brand { font-size: 26px; font-weight: 900; letter-spacing: -1px; color: #0f172a; }
    .brand span { color: #6366f1; }
    .meta { text-align: right; }
    .meta h2 { font-size: 22px; font-weight: 800; color: #0f172a; margin-bottom: 4px; }
    .meta p { color: #64748b; font-size: 12px; line-height: 1.7; }
    hr { border: none; border-top: 2px solid #e2e8f0; margin: 28px 0; }
    table { width: 100%; border-collapse: collapse; }
    thead th { background: #0f172a; color: #fff; padding: 10px 14px; font-size: 11px; text-transform: uppercase; letter-spacing: .5px; text-align: left; }
    th:nth-child(2), th:nth-child(3), th:nth-child(4) { text-align: right; }
    tbody td { padding: 12px 14px; border-bottom: 1px solid #f1f5f9; vertical-align: top; }
    tbody td:nth-child(2), tbody td:nth-child(3), tbody td:nth-child(4) { text-align: right; white-space: nowrap; }
    small { color: #64748b; font-size: 11px; }
    .totals { margin-top: 24px; display: flex; justify-content: flex-end; }
    .totals-inner { width: 260px; }
    .total-final { display: flex; justify-content: space-between; padding: 12px 0; font-size: 17px; font-weight: 800; color: #0f172a; border-top: 2px solid #0f172a; margin-top: 8px; }
    .footer { margin-top: 52px; padding-top: 20px; border-top: 1px solid #e2e8f0; text-align: center; color: #94a3b8; font-size: 11px; line-height: 1.8; }
    @media print { body { padding: 20px; } }
  </style>
</head>
<body>
  <div class="header">
    <div>
      <div class="brand">Re<span>Tech</span></div>
      <p style="color:#64748b;font-size:12px;margin-top:6px;">Tecnologia reacondicionada de confiança</p>
    </div>
    <div class="meta">
      <h2>${invoiceNum}</h2>
      <p>Data: ${date}</p>
      <p>Comanda #${compraId}</p>
    </div>
  </div>
  <hr>
  <table>
    <thead>
      <tr><th>Producte</th><th>Quantitat</th><th>Preu unit.</th><th>Total</th></tr>
    </thead>
    <tbody>${rows}</tbody>
  </table>
  <div class="totals">
    <div class="totals-inner">
      <div class="total-final"><span>Total</span><span>${fmt(total)}</span></div>
    </div>
  </div>
  <div class="footer">
    <p>Gràcies per la teva compra a ReTech</p>
    <p>Aquest document és la teva factura simplificada</p>
  </div>
</body>
</html>`;
}

const ESTADO_COLORS = {
  "Como nuevo":  { bg: "#d1fae5", text: "#065f46" },
  "Excelente":   { bg: "#d1fae5", text: "#065f46" },
  "Muy Bueno":   { bg: "#dbeafe", text: "#1e40af" },
  "Bueno":       { bg: "#fef9c3", text: "#854d0e" },
  "Aceptable":   { bg: "#fee2e2", text: "#991b1b" },
};

function BatteryBar({ value }) {
  const color = value >= 85 ? "#22c55e" : value >= 70 ? "#f59e0b" : "#ef4444";
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 5 }}>
      <div style={{ width: 34, height: 7, background: "#e5e7eb", borderRadius: 4, overflow: "hidden" }}>
        <div style={{ width: `${value}%`, height: "100%", background: color, borderRadius: 4 }} />
      </div>
      <span style={{ fontSize: 10, color, fontWeight: 700 }}>{value}%</span>
    </div>
  );
}

function PhoneIcon() {
  return (
    <div style={{ width: 44, height: 44, borderRadius: 12, background: "#f1f5f9", border: "1px solid #e2e8f0", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
        <rect x="6" y="2" width="12" height="20" rx="3" stroke="#64748b" strokeWidth="1.8" />
        <circle cx="12" cy="18.5" r="1" fill="#64748b" />
        <rect x="9" y="5" width="6" height="1.5" rx="0.75" fill="#64748b" opacity="0.5" />
      </svg>
    </div>
  );
}

function OrderItem({ item, movil }) {
  if (!movil) {
    return (
      <div style={{ display: "flex", gap: 12, padding: "14px 0", borderBottom: "1px solid #f1f5f9", alignItems: "center" }}>
        <div style={{ width: 44, height: 44, borderRadius: 12, background: "#f1f5f9", flexShrink: 0 }} />
        <div style={{ flex: 1 }}>
          <div style={{ height: 12, width: 140, background: "#e2e8f0", borderRadius: 4, marginBottom: 6 }} />
          <div style={{ height: 10, width: 90, background: "#f1f5f9", borderRadius: 4 }} />
        </div>
      </div>
    );
  }

  const badge = ESTADO_COLORS[movil.estado] ?? ESTADO_COLORS["Bueno"];
  const precio = item.precio ?? item.precio_unitario ?? movil.precio;
  const subtotal = precio * item.cantidad;

  return (
    <div style={{ display: "flex", gap: 14, padding: "16px 0", borderBottom: "1px solid #f8fafc", alignItems: "flex-start" }}>
      <PhoneIcon />
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: 8 }}>
          <div>
            <p style={{ margin: 0, fontWeight: 700, fontSize: 14, color: "#0f172a", fontFamily: "'Sora', sans-serif" }}>
              {movil.modelo}
            </p>
            <p style={{ margin: "2px 0 0", fontSize: 12, color: "#64748b" }}>
              {movil.almacenamiento} GB · {movil.ram} GB RAM · {movil.color}
            </p>
          </div>
          <div style={{ textAlign: "right", flexShrink: 0 }}>
            <p style={{ margin: 0, fontWeight: 800, fontSize: 15, color: "#0f172a", fontFamily: "'Sora', sans-serif" }}>
              {fmt(subtotal)}
            </p>
            {item.cantidad > 1 && (
              <p style={{ margin: 0, fontSize: 11, color: "#94a3b8" }}>{fmt(precio)} / ud.</p>
            )}
          </div>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 8, marginTop: 8 }}>
          <span style={{ fontSize: 10.5, fontWeight: 700, padding: "2px 8px", borderRadius: 20, background: badge.bg, color: badge.text }}>
            {movil.estat ?? movil.estado}
          </span>
          <BatteryBar value={movil.bateria} />
          <span style={{ fontSize: 11, color: "#94a3b8", marginLeft: "auto" }}>
            × {item.cantidad} {item.cantidad === 1 ? "unitat" : "unitats"}
          </span>
        </div>
      </div>
    </div>
  );
}

function OrderCard({ order, movilsCache, onToggle, isOpen }) {
  const handleInvoice = () => {
    const items = (order.items || []).map(item => {
      const movil = movilsCache[item.movil_id] || {};
      const precio = item.precio ?? item.precio_unitario ?? movil.precio ?? 0;
      return { ...movil, cantidad: item.cantidad, precio, subtotal: precio * item.cantidad };
    });
    const html = generateInvoiceHTML(order.id, items, order.precio_total);
    const win = window.open("", "_blank");
    if (!win) return;
    win.document.write(html);
    win.document.close();
    win.focus();
    win.print();
  };
  const totalProductos = order.items?.reduce((acc, i) => acc + (Number(i.cantidad) || 0), 0) || 0;
  const estadoConfig = {
    pagado:    { bg: "#d1fae5", text: "#065f46",  label: "PAGAT" },
    pendiente: { bg: "#fef9c3", text: "#854d0e",  label: "PENDENT" },
    fallido:   { bg: "#fee2e2", text: "#991b1b",  label: "FALLAT" },
  }[order.estado] ?? { bg: "#f1f5f9", text: "#475569", label: order.estado?.toUpperCase() };

  return (
    <div style={{
      background: "#fff",
      borderRadius: 20,
      border: "1px solid #e2e8f0",
      overflow: "hidden",
      boxShadow: isOpen ? "0 8px 32px rgba(15,23,42,.08)" : "0 2px 8px rgba(15,23,42,.04)",
      transition: "box-shadow .2s",
    }}>
      {/* Header clicable */}
      <button
        onClick={onToggle}
        style={{
          width: "100%", background: "none", border: "none", cursor: "pointer",
          padding: "20px 24px", display: "flex", justifyContent: "space-between",
          alignItems: "center", gap: 16, textAlign: "left",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 16, flex: 1, minWidth: 0 }}>
          <div style={{
            width: 40, height: 40, borderRadius: 12,
            background: "linear-gradient(135deg,#6366f1,#4f46e5)",
            display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0,
            boxShadow: "0 4px 10px rgba(99,102,241,.3)"
          }}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.2">
              <path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z" />
              <line x1="3" y1="6" x2="21" y2="6" />
              <path d="M16 10a4 4 0 01-8 0" />
            </svg>
          </div>
          <div style={{ minWidth: 0 }}>
            <p style={{ margin: 0, fontSize: 11, color: "#94a3b8", fontWeight: 800, letterSpacing: ".5px" }}>
              COMANDA #{order.id}
            </p>
            <p style={{ margin: "2px 0 0", fontSize: 15, fontWeight: 700, color: "#0f172a", fontFamily: "'Sora', sans-serif" }}>
              {new Date(order.created_at).toLocaleDateString("ca-ES", { day: "numeric", month: "long", year: "numeric" })}
            </p>
            <p style={{ margin: 0, fontSize: 12, color: "#64748b" }}>
              {totalProductos} {totalProductos === 1 ? "producte" : "productes"} · {order.metodo_pago}
            </p>
          </div>
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: 12, flexShrink: 0 }}>
          <div style={{ textAlign: "right" }}>
            <p style={{ margin: 0, fontSize: 18, fontWeight: 800, color: "#4f46e5", fontFamily: "'Sora', sans-serif" }}>
              {fmt(order.precio_total)}
            </p>
            <span style={{
              display: "inline-block", marginTop: 4, padding: "3px 10px",
              borderRadius: 8, fontSize: 10, fontWeight: 800,
              background: estadoConfig.bg, color: estadoConfig.text,
            }}>
              {estadoConfig.label}
            </span>
          </div>
          <svg
            width="16" height="16" viewBox="0 0 24 24" fill="none"
            stroke="#94a3b8" strokeWidth="2.5"
            style={{ transform: isOpen ? "rotate(180deg)" : "rotate(0deg)", transition: "transform .2s", flexShrink: 0 }}
          >
            <polyline points="6 9 12 15 18 9" />
          </svg>
        </div>
      </button>

      {/* Desglose expandible */}
      {isOpen && (
        <div style={{ padding: "0 24px 20px", borderTop: "1px solid #f1f5f9" }}>
          <p style={{ margin: "16px 0 4px", fontSize: 11, fontWeight: 700, color: "#94a3b8", textTransform: "uppercase", letterSpacing: ".7px" }}>
            Productes
          </p>

          {order.items?.map((item, i) => (
            <OrderItem
              key={i}
              item={item}
              movil={movilsCache[item.movil_id]}
            />
          ))}

          {/* Totals */}
          <div style={{ marginTop: 16, padding: "16px", background: "#f8fafc", borderRadius: 12, border: "1px solid #e2e8f0" }}>
            <div style={{ display: "flex", justifyContent: "space-between" }}>
              <span style={{ fontWeight: 800, fontSize: 15, color: "#0f172a", fontFamily: "'Sora', sans-serif" }}>Total</span>
              <span style={{ fontWeight: 800, fontSize: 17, color: "#4f46e5", fontFamily: "'Sora', sans-serif" }}>{fmt(order.precio_total)}</span>
            </div>
          </div>

          <div style={{ marginTop: 14, display: "flex", justifyContent: "flex-end" }}>
            <button
              onClick={handleInvoice}
              style={{ padding: "9px 18px", background: "#f8fafc", border: "1px solid #e2e8f0", borderRadius: 10, fontSize: 13, fontWeight: 700, cursor: "pointer", color: "#0f172a", fontFamily: "'Sora', sans-serif" }}
            >
              Descargar factura
            </button>
          </div>

          {order.stripe_intent && (
            <p style={{ margin: "10px 0 0", fontSize: 11, color: "#94a3b8", textAlign: "right" }}>
              Stripe ID: {order.stripe_intent}
            </p>
          )}
        </div>
      )}
    </div>
  );
}

export default function OrdersPage() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [movilsCache, setMovilsCache] = useState({});
  const [openId, setOpenId] = useState(null);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const response = await fetch("/api/compras", {
          credentials: "include",
          headers: { "Accept": "application/json" },
        });

        if (response.ok) {
          const data = await response.json();
          setOrders(data);

          // Recopilar todos los movil_id únicos de todos los pedidos
          const ids = [...new Set(data.flatMap(o => (o.items || []).map(i => i.movil_id)))];

          // Cargar todos los móviles en paralelo
          const results = await Promise.all(
            ids.map(id =>
              fetch(`/api/products/${id}`, { headers: { "Accept": "application/json" } })
                .then(r => r.ok ? r.json() : null)
                .catch(() => null)
            )
          );

          const cache = {};
          ids.forEach((id, i) => { if (results[i]) cache[id] = results[i]; });
          setMovilsCache(cache);
        }
      } catch (error) {
        console.error("Error:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, []);

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Sora:wght@400;600;700;800&display=swap');
        * { box-sizing: border-box; }
        @keyframes spin { to { transform: rotate(360deg); } }
      `}</style>
      <Navbar />
      <div style={{ minHeight: "100vh", background: "#f8fafc", padding: "40px 16px 80px" }}>
        <div style={{ maxWidth: 720, margin: "0 auto" }}>

          <div style={{ marginBottom: 28 }}>
            <h2 style={{ margin: 0, fontSize: 26, fontWeight: 800, color: "#0f172a", fontFamily: "'Sora', sans-serif", letterSpacing: "-.5px" }}>
              Les meves comandes
            </h2>
            {!loading && (
              <p style={{ margin: "4px 0 0", fontSize: 13, color: "#64748b" }}>
                {orders.length} {orders.length === 1 ? "comanda" : "comandes"} realitzades
              </p>
            )}
          </div>

          {loading ? (
            <div style={{ textAlign: "center", padding: 80 }}>
              <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#6366f1" strokeWidth="2.5"
                style={{ animation: "spin .8s linear infinite" }}>
                <path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83" />
              </svg>
            </div>
          ) : orders.length === 0 ? (
            <div style={{ textAlign: "center", padding: 60, background: "#fff", borderRadius: 24, border: "1px solid #e2e8f0" }}>
              <div style={{ fontSize: 48, marginBottom: 12 }}>📦</div>
              <p style={{ margin: 0, fontSize: 16, fontWeight: 700, color: "#0f172a", fontFamily: "'Sora', sans-serif" }}>
                Cap comanda encara
              </p>
              <p style={{ margin: "6px 0 20px", color: "#64748b", fontSize: 13.5 }}>
                No hem trobat cap comanda vinculada al teu compte.
              </p>
              <button
                onClick={() => window.location.href = "/"}
                style={{ padding: "10px 24px", background: "linear-gradient(135deg,#6366f1,#4f46e5)", color: "#fff", border: "none", borderRadius: 10, fontWeight: 700, cursor: "pointer", fontSize: 13.5, fontFamily: "'Sora', sans-serif" }}
              >
                Anar a la botiga →
              </button>
            </div>
          ) : (
            <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
              {orders.map(order => (
                <OrderCard
                  key={order.id}
                  order={order}
                  movilsCache={movilsCache}
                  isOpen={openId === order.id}
                  onToggle={() => setOpenId(openId === order.id ? null : order.id)}
                />
              ))}
            </div>
          )}

        </div>
      </div>
      <Footer />
    </>
  );
}