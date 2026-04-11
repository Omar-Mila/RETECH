export default function ColorSelector({ colors, selectedColor, setColor }) {

  if (!colors) return null

  return (
    <div className="space-y-6">

      <div>
        <h3 className="font-semibold mb-2">Color</h3>

        <div className="grid grid-cols-2 gap-4 w-full">
            {colors.map(color => (
                <label key={color.id} className="cursor-pointer w-full">

                <input
                    type="radio"
                    name="color"
                    value={color.id}
                    checked={selectedColor === color.id}
                    onChange={() => setColor(color.id)}
                    className="hidden"
                />

                <div
                    className={`w-full py-4 border rounded text-center transition
                    ${
                        selectedColor === color.id
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