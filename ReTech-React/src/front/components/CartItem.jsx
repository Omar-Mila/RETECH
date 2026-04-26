const fmt = (n) =>
  new Intl.NumberFormat("es-ES", { style: "currency", currency: "EUR" }).format(n);

export default function CartItem({ item, onRemove }) {
  return (
    <div style={{ 
      display: "flex", 
      alignItems: "center", 
      gap: 12, 
      padding: "12px 18px", 
      borderBottom: "1px solid #f1f5f9"
    }}>
      {/* Miniatura del producto */}
      <div style={{ 
        width: 52, height: 52, borderRadius: 10, 
        background: "#f8fafc", overflow: "hidden", 
        flexShrink: 0, border: "1px solid #e2e8f0",
        display: "flex", alignItems: "center", justifyContent: "center"
      }}>
        <img 
          src={item.imagen_url || `https://via.placeholder.com/50?text=${item.modelo}`}
          alt={item.modelo}
          style={{ width: "90%", height: "90%", objectFit: "contain" }}
        />
      </div>

      {/* Detalles */}
      <div style={{ flex: 1, minWidth: 0 }}>
        <p style={{ margin: 0, fontSize: 13, fontWeight: 700, color: "#1e293b", lineHeight: 1.2 }}>
          {item.modelo}
        </p>
        <p style={{ margin: "2px 0 0", fontSize: 11, color: "#64748b" }}>
          {item.almacenamiento}GB · {item.color}
        </p>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: 4 }}>
          <span style={{ fontSize: 12, fontWeight: 600, color: "#4f46e5" }}>
            {fmt(item.precio)} <span style={{ color: "#94a3b8", fontWeight: 400 }}>x{item.cantidad}</span>
          </span>
        </div>
      </div>

      {/* Botón de eliminar */}
      <button 
        onClick={() => onRemove(item.movil_id)}
        style={{ 
          background: "#fee2e2", border: "none", cursor: "pointer", 
          color: "#ef4444", borderRadius: "50%", width: 26, height: 26, 
          display: "flex", alignItems: "center", justifyContent: "center", 
          fontSize: 16, transition: "0.2s" 
        }}
        onMouseEnter={(e) => e.currentTarget.style.background = "#fecaca"}
        onMouseLeave={(e) => e.currentTarget.style.background = "#fee2e2"}
      >
        ×
      </button>
    </div>
  );
}