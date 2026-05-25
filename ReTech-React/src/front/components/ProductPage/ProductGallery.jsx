import { useState, useEffect, useMemo } from "react"

export default function ProductGallery({ images = [], selectedColor }) {
  const finalImages = useMemo(() => {
    if (images.length === 0) return [{ url: "https://via.placeholder.com/600x600?text=ReTech" }]

    // Filtra por el color seleccionado
    if (selectedColor) {
      const filtered = images.filter(img => String(img.color_id) === String(selectedColor))
      if (filtered.length > 0) return filtered
    }

    // Fallback: solo las imágenes del primer color disponible (nunca mezcla todos los colores)
    const firstColorId = images[0].color_id
    return images.filter(img => img.color_id === firstColorId)
  }, [images, selectedColor])

  const [selectedIndex, setSelectedIndex] = useState(0)

  useEffect(() => {
    setSelectedIndex(0)
  }, [finalImages])

  const selected = finalImages[selectedIndex] ?? finalImages[0]

  return (
    <div className="flex gap-4">

      {/* miniaturas */}
      <div className="flex flex-col gap-3">
        {finalImages.map((img, i) => (
          <img
            key={i}
            src={img.url}
            onClick={() => setSelectedIndex(i)}
            className={`w-20 h-20 object-cover rounded cursor-pointer border
              ${selectedIndex === i ? "border-black" : "border-gray-300"}
            `}
          />
        ))}
      </div>

      {/* imagen principal */}
      <div className="flex-1">
        <img
          src={selected?.url}
          className="w-full aspect-square object-contain rounded bg-gray-100"
        />
      </div>

    </div>
  )
}
