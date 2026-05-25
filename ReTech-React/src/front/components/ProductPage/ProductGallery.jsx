import { useState, useEffect, useMemo } from "react"

export default function ProductGallery({ imagenes = [], selectedColor }) {

  const imagenesFinal = useMemo(() => {
    if (imagenes.length === 0) return [{ url: "https://via.placeholder.com/600x600?text=ReTech" }]

    if (selectedColor) {
      const filtradas = imagenes.filter(img => String(img.color_id) === String(selectedColor))
      if (filtradas.length > 0) return filtradas
    }

    const primerColorId = imagenes[0].color_id
    return imagenes.filter(img => img.color_id === primerColorId)
  }, [imagenes, selectedColor])

  const [indiceSeleccionado, fijarIndiceSeleccionado] = useState(0)

  useEffect(() => {
    fijarIndiceSeleccionado(0)
  }, [imagenesFinal])

  const seleccionada = imagenesFinal[indiceSeleccionado] ?? imagenesFinal[0]

  return (
    <div className="pg-container">

      {/* Miniaturas */}
      <div className="pg-thumbs">
        {imagenesFinal.map((img, i) => (
          <img
            key={i}
            src={img.url}
            onClick={() => fijarIndiceSeleccionado(i)}
            className={`pg-thumb${indiceSeleccionado === i ? " pg-thumb--active" : ""}`}
          />
        ))}
      </div>

      {/* Imagen principal */}
      <div className="pg-main">
        <img src={seleccionada?.url} className="pg-main-img" />
      </div>

      <style>{`

        /* contenedor */
        .pg-container {
          display: flex;
          gap: 1rem;
        }

        /* miniaturas */
        .pg-thumbs {
          display: flex;
          flex-direction: column;
          gap: 0.75rem;
          flex-shrink: 0;
        }
        .pg-thumb {
          width: 5rem;
          height: 5rem;
          object-fit: cover;
          border-radius: 0.375rem;
          cursor: pointer;
          border: 2px solid #d1d5db;
          transition: border-color 0.15s;
        }
        .pg-thumb:hover   { border-color: #6b7280; }
        .pg-thumb--active { border-color: #000; }

        /* imagen principal */
        .pg-main {
          flex: 1;
          min-width: 0;
        }
        .pg-main-img {
          width: 100%;
          aspect-ratio: 1 / 1;
          object-fit: contain;
          border-radius: 0.5rem;
          background: #f3f4f6;
          display: block;
        }

        /* responsive */
        @media (max-width: 540px) {
          .pg-container {
            flex-direction: column-reverse;
            gap: 0.75rem;
          }
          .pg-thumbs {
            flex-direction: row;
            overflow-x: auto;
            gap: 0.5rem;
            padding-bottom: 0.25rem;
          }
          .pg-thumb {
            width: 3.5rem;
            height: 3.5rem;
            flex-shrink: 0;
          }
          .pg-main-img {
            border-radius: 0.75rem;
          }
        }

      `}</style>

    </div>
  )
}
