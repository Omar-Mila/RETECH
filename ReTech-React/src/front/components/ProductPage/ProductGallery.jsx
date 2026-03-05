import { useState } from "react"
import { getProducts } from "../../../services/productService";
export default function ProductGallery({ images = [] }) {

  // si no hay imágenes → usamos placeholder
  const defaultImages = images.length > 0
    ? images
    : [
        "https://via.placeholder.com/600x600?text=ReTech",
        "https://via.placeholder.com/600x600?text=ReTech+Back",
        "https://via.placeholder.com/600x600?text=ReTech+Side"
      ]

  const [selected, setSelected] = useState(defaultImages[0])

  return (
    <div className="flex gap-4">

      {/* miniaturas */}
      <div className="flex flex-col gap-3">
        {defaultImages.map((img, i) => (
          <img
            key={i}
            src={img}
            onClick={() => setSelected(img)}
            className={`w-20 h-20 object-cover rounded cursor-pointer border
              ${selected === img ? "border-black" : "border-gray-300"}
            `}
          />
        ))}
      </div>

      {/* imagen principal */}
      <div className="flex-1">
        <img
          src={selected}
          className="w-full aspect-square object-contain rounded bg-gray-100"
        />
      </div>

    </div>
  )
}