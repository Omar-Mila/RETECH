import { Link } from "react-router-dom"

export default function PhoneCardS({ modeloId, movilId, nombre, condicion, precio, imagen }) {
  const destino = modeloId
    ? `/models/${modeloId}${movilId ? `?movil=${movilId}` : ""}`
    : "#"

  return (
    <Link to={destino} className="pcs-card">

      <div className="pcs-img-wrap">
        <img src={imagen} alt={nombre} className="pcs-img" />
      </div>

      <h4 className="pcs-name">{nombre}</h4>
      <p className="pcs-condition">{condicion}</p>
      <p className="pcs-price">{precio}€</p>

      <style>{`

        /* tarjeta */
        .pcs-card {
          display: block;
          min-width: 12.5rem;
          background: #fff;
          padding: 1rem;
          border-radius: 0.5rem;
          box-shadow: 0 1px 3px rgba(0,0,0,0.1);
          text-decoration: none;
          color: inherit;
          transition: box-shadow 0.2s;
        }
        .pcs-card:hover { box-shadow: 0 4px 16px rgba(0,0,0,0.12); }

        /* imagen */
        .pcs-img-wrap {
          height: 10rem;
          margin-bottom: 1rem;
          border-radius: 0.375rem;
          overflow: hidden;
        }
        .pcs-img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          transition: transform 0.3s;
        }
        .pcs-card:hover .pcs-img { transform: scale(1.04); }

        /* texto */
        .pcs-name {
          font-weight: 600;
          color: #111827;
          margin: 0 0 0.125rem;
          font-size: 0.9375rem;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }
        .pcs-condition {
          color: #6b7280;
          font-size: 0.875rem;
          margin: 0;
        }
        .pcs-price {
          font-weight: 700;
          color: #111827;
          margin: 0.5rem 0 0;
          font-size: 1rem;
        }

        /* responsive */
        @media (max-width: 480px) {
          .pcs-card      { padding: 0.75rem; }
          .pcs-img-wrap  { height: 7.5rem; margin-bottom: 0.625rem; }
          .pcs-name      { font-size: 0.875rem; }
          .pcs-condition { font-size: 0.8rem; }
          .pcs-price     { font-size: 0.9rem; }
        }

      `}</style>

    </Link>
  )
}
