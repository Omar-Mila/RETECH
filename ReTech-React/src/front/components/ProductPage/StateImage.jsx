import { useState } from "react"
import { useIdioma } from "../../context/LanguageContext"

const IMG_ESTADO = {
  "Como nuevo": "/A.png",
  "Buen estado": "/B.png",
  "Funcional":   "/C.png",
}

export default function ImagenEstado({ estadoSeleccionado }) {
  const { t } = useIdioma()
  const [abierto, fijarAbierto] = useState(false)

  if (!estadoSeleccionado) return null

  const infoEstado = t('product.stateInfo')
  const insignia   = infoEstado[estadoSeleccionado]?.badge ?? estadoSeleccionado
  const urlImagen  = IMG_ESTADO[estadoSeleccionado] ?? ""

  return (
    <>
      {/* Tarjeta */}
      <div className="si-card">
        <h3 className="si-title">{t('productInfo.phoneCondition')}</h3>
        <img
          src={urlImagen}
          alt={insignia}
          className="si-img"
          onClick={() => fijarAbierto(true)}
          title={t('productInfo.clickToZoom') ?? "Ver en grande"}
        />
      </div>

      {/* Modal lightbox */}
      {abierto && (
        <div className="si-modal-overlay" onClick={() => fijarAbierto(false)}>
          <img
            src={urlImagen}
            alt={insignia}
            className="si-modal-img"
            onClick={e => e.stopPropagation()}
          />
          <button className="si-modal-close" onClick={() => fijarAbierto(false)}>
            ×
          </button>
        </div>
      )}

      <style>{`

        /* tarjeta */
        .si-card {
          margin-top: 1.5rem;
          border: 1px solid #e5e7eb;
          border-radius: 0.5rem;
          padding: 1rem;
          background: #fff;
        }
        .si-title {
          font-weight: 600;
          margin: 0 0 0.75rem 0;
          font-size: 1rem;
        }
        .si-img {
          width: 100%;
          max-width: 28rem;
          display: block;
          margin: 0 auto;
          object-fit: contain;
          border-radius: 0.375rem;
          cursor: zoom-in;
          transition: opacity 0.15s;
        }
        .si-img:hover { opacity: 0.9; }

        /* modal */
        .si-modal-overlay {
          position: fixed;
          inset: 0;
          z-index: 9999;
          background: rgba(0, 0, 0, 0.75);
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: zoom-out;
        }
        .si-modal-img {
          max-width: 90vw;
          max-height: 90vh;
          object-fit: contain;
          border-radius: 0.75rem;
          box-shadow: 0 8px 40px rgba(0, 0, 0, 0.4);
        }
        .si-modal-close {
          position: fixed;
          top: 1.25rem;
          right: 1.5rem;
          background: rgba(255, 255, 255, 0.15);
          border: none;
          color: #fff;
          font-size: 1.75rem;
          line-height: 1;
          width: 2.75rem;
          height: 2.75rem;
          border-radius: 50%;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: background 0.15s;
        }
        .si-modal-close:hover { background: rgba(255, 255, 255, 0.28); }

        /* responsive */
        @media (max-width: 480px) {
          .si-card        { padding: 0.75rem; margin-top: 1rem; }
          .si-modal-close { top: 0.75rem; right: 0.75rem; width: 2.25rem; height: 2.25rem; font-size: 1.4rem; }
        }

      `}</style>
    </>
  )
}
