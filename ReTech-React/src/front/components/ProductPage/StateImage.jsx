export default function StateImage({ selectedState }) {
  let imageSrc = ""
  let label = ""

  if (selectedState === "Como nuevo") {
    imageSrc = "/A.png"
    label = "Estado A"
  } else if (selectedState === "Buen estado") {
    imageSrc = "/B.png"
    label = "Estado B"
  } else if (selectedState === "Funcional") {
    imageSrc = "/C.png"
    label = "Estado C"
  }

  if (!selectedState) return null

  return (
    <div className="mt-6 border rounded-lg p-4 bg-white">
      <h3 className="font-semibold mb-3">Estat del mòbil</h3>
      <img
        src={imageSrc}
        alt={label}
        className="w-full max-w-md mx-auto object-contain rounded"
      />
    </div>
  )
}