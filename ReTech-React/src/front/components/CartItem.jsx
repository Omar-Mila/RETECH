const fmtPrecio = (n) =>
  new Intl.NumberFormat("es-ES", { style: "currency", currency: "EUR" }).format(n);

export default function CartItem({ art, alQuitar }) {
  return (
    <>
      <div className="ci-row">

        {/* Miniatura */}
        <div className="ci-thumb">
          <img
            src={art.imagen_url || `https://via.placeholder.com/50?text=${art.modelo}`}
            alt={art.modelo}
          />
        </div>

        {/* Detalles */}
        <div className="ci-details">
          <p className="ci-name">{art.modelo}</p>
          <p className="ci-specs">{art.almacenamiento}GB · {art.color}</p>
          <div className="ci-price-row">
            <span className="ci-price">
              {fmtPrecio(art.precio)} <span className="ci-qty">x{art.cantidad}</span>
            </span>
          </div>
        </div>

        {/* Botón quitar */}
        <button className="ci-btn-remove" onClick={() => alQuitar(art.movil_id)}>
          ×
        </button>

      </div>

      <style>{`

        /* ── Fila ───────────────────────────────────────────── */
        .ci-row {
          display: flex;
          align-items: center;
          gap: 0.75rem;
          padding: 0.75rem 1.125rem;
          border-bottom: 1px solid #f1f5f9;
        }

        /* ── Miniatura ──────────────────────────────────────── */
        .ci-thumb {
          width: 3.25rem;
          height: 3.25rem;
          border-radius: 0.625rem;
          background: #f8fafc;
          border: 1px solid #e2e8f0;
          overflow: hidden;
          flex-shrink: 0;
          display: flex;
          align-items: center;
          justify-content: center;
        }
        .ci-thumb img {
          width: 90%;
          height: 90%;
          object-fit: contain;
        }

        /* ── Detalles ───────────────────────────────────────── */
        .ci-details {
          flex: 1;
          min-width: 0;
        }
        .ci-name {
          margin: 0;
          font-size: 0.8125rem;
          font-weight: 700;
          color: #1e293b;
          line-height: 1.2;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }
        .ci-specs {
          margin: 0.125rem 0 0;
          font-size: 0.6875rem;
          color: #64748b;
        }
        .ci-price-row {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-top: 0.25rem;
        }
        .ci-price {
          font-size: 0.75rem;
          font-weight: 600;
          color: #4f46e5;
        }
        .ci-qty {
          color: #94a3b8;
          font-weight: 400;
        }

        /* ── Botón quitar ───────────────────────────────────── */
        .ci-btn-remove {
          background: #fee2e2;
          border: none;
          cursor: pointer;
          color: #ef4444;
          border-radius: 50%;
          width: 1.625rem;
          height: 1.625rem;
          flex-shrink: 0;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 1rem;
          transition: background 0.2s;
        }
        .ci-btn-remove:hover { background: #fecaca; }

        /* ── Responsive ─────────────────────────────────────── */
        @media (max-width: 400px) {
          .ci-row   { padding: 0.625rem 0.75rem; gap: 0.5rem; }
          .ci-thumb { width: 2.75rem; height: 2.75rem; }
          .ci-name  { font-size: 0.75rem; }
          .ci-specs { font-size: 0.625rem; }
        }

      `}</style>
    </>
  );
}
