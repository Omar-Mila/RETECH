import { useState, useEffect } from "react"
export default function ProductGallery({ images = [], selectedColor }) {
  // si no hay imágenes → usamos placeholder
  const filteredImages = selectedColor
    ? images.filter(img => img.color_id == selectedColor)
    : images

  const finalImages = filteredImages.length > 0
    ? filteredImages
    : [
        { url: "https://via.placeholder.com/600x600?text=ReTech" }
      ]

  const [selected, setSelected] = useState(finalImages[0])

  useEffect(() => {
    setSelected(finalImages[0])
  }, [selectedColor, images])

  return (
    <div className="flex gap-4">

      {/* miniaturas */}
      <div className="flex flex-col gap-3">
        {finalImages.map((img, i) => (
            <img
            key={i}
            src={img.url}
            onClick={() => setSelected(img)}
            className={`w-20 h-20 object-cover rounded cursor-pointer border
              ${selected?.url === img.url ? "border-black" : "border-gray-300"}
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