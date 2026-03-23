import { useState, useEffect } from "react";
import Navbar from "../../components/Navbar";

const API = "http://127.0.0.1:8000";

export default function OrdersPage() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // IMPORTANTE: Asegúrate de que el usuario esté logueado antes de entrar aquí
    fetch(`${API}/api/pedidos`, {
      credentials: "include", 
      headers: { 
        "Accept": "application/json",
        "Content-Type": "application/json"
      }
    })
    .then(r => {
      if (r.status === 401) throw new Error("No estas logueado");
      return r.json();
    })
    .then(data => {
      // data ahora viene del PedidosApiController
      setOrders(Array.isArray(data) ? data : []);
    })
    .catch((err) => {
      console.error("Error cargando pedidos:", err);
      setOrders([]);
    })
    .finally(() => setLoading(false));
  }, []);

  const fmt = (n) => new Intl.NumberFormat("es-ES", { style: "currency", currency: "EUR" }).format(n);

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div style={{ maxWidth: 800, margin: "40px auto", padding: "0 20px" }}>
        <h2 style={{ fontSize: 28, fontWeight: 800, marginBottom: 24, color: "#0f172a" }}>Les meves comandes</h2>

        {loading ? (
          <p style={{ textAlign: "center", color: "#64748b" }}>Carregant comandes...</p>
        ) : orders.length === 0 ? (
          <div style={{ textAlign: "center", padding: 60, background: "#fff", borderRadius: 24, border: "1px solid #e2e8f0" }}>
            <div style={{ fontSize: 40, marginBottom: 10 }}>📦</div>
            <p style={{ color: "#64748b" }}>No hem trobat cap comanda vinculada al teu compte.</p>
            <button onClick={() => window.location.href = '/'} style={{ marginTop: 15, color: "#4f46e5", fontWeight: 700, background: "none", border: "none", cursor: "pointer" }}>Anar a la botiga →</button>
          </div>
        ) : (
          <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
            {orders.map(order => {
              // Sumamos las cantidades de los productos guardados en el JSON 'items'
              const totalProductos = order.items?.reduce((acc, item) => acc + (Number(item.cantidad) || 0), 0) || 0;

              return (
                <div key={order.id} style={{ 
                  background: "#fff", padding: 24, borderRadius: 20, border: "1px solid #e2e8f0",
                  display: "flex", justifyContent: "space-between", alignItems: "center"
                }}>
                  <div>
                    <p style={{ margin: 0, fontSize: 11, color: "#94a3b8", fontWeight: 800 }}>COMANDA #{order.id}</p>
                    <p style={{ margin: "4px 0 0", fontSize: 16, fontWeight: 700, color: "#1e293b" }}>
                      {new Date(order.created_at).toLocaleDateString('ca-ES')}
                    </p>
                    <p style={{ margin: 0, fontSize: 13, color: "#64748b" }}>{totalProductos} {totalProductos === 1 ? 'producte' : 'productes'}</p>
                  </div>
                  
                  <div style={{ textAlign: "right" }}>
                    {/* Usamos precio_total porque es el nombre en tu modelo Compra */}
                    <p style={{ margin: 0, fontSize: 18, fontWeight: 800, color: "#4f46e5" }}>{fmt(order.precio_total)}</p>
                    <span style={{ 
                      display: "inline-block", marginTop: 8, padding: "5px 12px", borderRadius: 8, fontSize: 11, fontWeight: 800,
                      background: order.estado === 'pagado' ? "#dcfce7" : "#fef9c3",
                      color: order.estado === 'pagado' ? "#166534" : "#854d0e"
                    }}>
                      {order.estado?.toUpperCase() || 'PENDENT'}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}