const fmtPrecio = (n) =>
  new Intl.NumberFormat("es-ES", { style: "currency", currency: "EUR" }).format(n);

export default function CartItem({ art, alQuitar }) {
  return (
    <>
      <style>{`
        .item-carro {
          display: flex;
          align-items: center;
          gap: 12px;
          padding: 12px 18px;
          border-bottom: 1px solid #f1f5f9;
        }
        .item-miniatura {
          width: 52px;
          height: 52px;
          border-radius: 10px;
          background: #f8fafc;
          overflow: hidden;
          flex-shrink: 0;
          border: 1px solid #e2e8f0;
          display: flex;
          align-items: center;
          justify-content: center;
        }
        .item-miniatura img {
          width: 90%;
          height: 90%;
          object-fit: contain;
        }
        .item-detalles {
          flex: 1;
          min-width: 0;
        }
        .item-nombre {
          margin: 0;
          font-size: 13px;
          font-weight: 700;
          color: #1e293b;
          line-height: 1.2;
        }
        .item-specs {
          margin: 2px 0 0;
          font-size: 11px;
          color: #64748b;
        }
        .item-fila-precio {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-top: 4px;
        }
        .item-precio {
          font-size: 12px;
          font-weight: 600;
          color: #4f46e5;
        }
        .item-precio span {
          color: #94a3b8;
          font-weight: 400;
        }
        .btn-quitar {
          background: #fee2e2;
          border: none;
          cursor: pointer;
          color: #ef4444;
          border-radius: 50%;
          width: 26px;
          height: 26px;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 16px;
          transition: background 0.2s;
        }
        .btn-quitar:hover {
          background: #fecaca;
        }
      `}</style>

      <div className="item-carro">
        <div className="item-miniatura">
          <img
            src={art.imagen_url || `https://via.placeholder.com/50?text=${art.modelo}`}
            alt={art.modelo}
          />
        </div>

        <div className="item-detalles">
          <p className="item-nombre">{art.modelo}</p>
          <p className="item-specs">{art.almacenamiento}GB · {art.color}</p>
          <div className="item-fila-precio">
            <span className="item-precio">
              {fmtPrecio(art.precio)} <span>x{art.cantidad}</span>
            </span>
          </div>
        </div>

        <button
          className="btn-quitar"
          onClick={() => alQuitar(art.movil_id)}
        >
          ×
        </button>
      </div>
    </>
  );
}
