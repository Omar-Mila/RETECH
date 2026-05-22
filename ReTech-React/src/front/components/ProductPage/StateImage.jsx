import { useState } from "react"
import { useIdioma } from "../../context/LanguageContext"

const IMG_ESTADO = {
  "Como nuevo": "/A.png",
  "Buen estado": "/B.png",
  "Funcional": "/C.png",
}

export default function ImagenEstado({ estadoSeleccionado }) {
  const { t } = useIdioma()
  const [abierto, fijarAbierto] = useState(false)

  if (!estadoSeleccionado) return null

  const infoEstado = t('product.stateInfo')
  const insignia = infoEstado[estadoSeleccionado]?.badge ?? estadoSeleccionado
  const urlImagen = IMG_ESTADO[estadoSeleccionado] ?? ""

  return (
    <>
      <style>{`
        #modal-fondo {
          position: fixed;
          inset: 0;
          z-index: 9999;
          background: rgba(0, 0, 0, 0.75);
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: zoom-out;
        }
        #modal-img {
          max-width: 90vw;
          max-height: 90vh;
          object-fit: contain;
          border-radius: 12px;
          box-shadow: 0 8px 40px rgba(0, 0, 0, 0.4);
        }
        #btn-cerrar-modal {
          position: fixed;
          top: 20px;
          right: 24px;
          background: rgba(255, 255, 255, 0.15);
          border: none;
          color: #fff;
          font-size: 28px;
          line-height: 1;
          width: 44px;
          height: 44px;
          border-radius: 50%;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
        }
      `}</style>

      <div className="mt-6 border rounded-lg p-4 bg-white">
        <h3 className="font-semibold mb-3">{t('productInfo.phoneCondition')}</h3>
        <img
          src={urlImagen}
          alt={insignia}
          className="w-full max-w-md mx-auto object-contain rounded cursor-zoom-in"
          onClick={() => fijarAbierto(true)}
          title={t('productInfo.clickToZoom') ?? "Ver en grande"}
        />
      </div>

      {abierto && (
        <div id="modal-fondo" onClick={() => fijarAbierto(false)}>
          <img
            id="modal-img"
            src={urlImagen}
            alt={insignia}
            onClick={e => e.stopPropagation()}
          />
          <button id="btn-cerrar-modal" onClick={() => fijarAbierto(false)}>
            ×
          </button>
        </div>
      )}
    </>
  )
}
