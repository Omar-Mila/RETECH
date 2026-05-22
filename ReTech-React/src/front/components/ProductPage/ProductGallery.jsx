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
    <div className="flex gap-4">

      {/* miniaturas */}
      <div className="flex flex-col gap-3">
        {imagenesFinal.map((img, i) => (
          <img
            key={i}
            src={img.url}
            onClick={() => fijarIndiceSeleccionado(i)}
            className={`w-20 h-20 object-cover rounded cursor-pointer border
              ${indiceSeleccionado === i ? "border-black" : "border-gray-300"}
            `}
          />
        ))}
      </div>

      {/* imagen principal */}
      <div className="flex-1">
        <img
          src={seleccionada?.url}
          className="w-full aspect-square object-contain rounded bg-gray-100"
        />
      </div>

    </div>
  )
}
