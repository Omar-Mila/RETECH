export default function ColorSelector({ colores, colorSeleccionado, fijarColor }) {

  if (!colores) return null

  return (
    <div className="space-y-6">

      <div>
        <h3 className="font-semibold mb-2">Color</h3>

        <div className="grid grid-cols-2 gap-4 w-full">
            {colores.map(color => (
                <label key={color.id} className="cursor-pointer w-full">

                <input
                    type="radio"
                    name="color"
                    value={color.id}
                    checked={colorSeleccionado === color.id}
                    onChange={() => fijarColor(color.id)}
                    className="hidden"
                />

                <div
                    className={`w-full py-4 border rounded text-center transition
                    ${
                        colorSeleccionado === color.id
                        ? "border-black bg-gray-100"
                        : "border-gray-300 hover:border-black"
                    }
                    `}
                >
                    {color.nombre}
                </div>

                </label>
            ))}
            </div>
      </div>

    </div>
  )
}
