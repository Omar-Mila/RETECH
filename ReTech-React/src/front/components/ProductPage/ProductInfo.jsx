export default function ProductInfo({ product }) {

  const caracteristicas = [
    { label: "Processador", value: product.procesador },
    { label: "Pantalla", value: `${product.pantalla_pulgadas}" · ${product.hz_pantalla}Hz` },
    { label: "Bateria", value: `${product.bateria_mah} mAh` },
    { label: "Càmera principal", value: `${product.camara_principal_mp} MP` },
    { label: "Càmera frontal", value: `${product.camara_frontal_mp} MP` },
    { label: "Conector", value: product.conector },
    { label: "5G", value: product.cinco_g ? "Sí" : "No" },
    { label: "NFC", value: product.nfc ? "Sí" : "No" },
    { label: "SIM", value: product.tipo_sim }
  ]

  return (
    <div className="space-y-6">

      {/* Nombre modelo */}
      <h1 className="text-3xl font-bold">
        {product.nombre}
      </h1>

      {/* Características */}
      <div>
        <h2 className="font-semibold text-lg mb-3">
          Característiques
        </h2>

        <ul className="space-y-2 text-sm text-gray-700">
          {caracteristicas.map((item, i) => (
            <li key={i} className="flex justify-between border-b pb-1">
              <span className="font-medium">{item.label}</span>
              <span>{item.value ?? "—"}</span>
            </li>
          ))}
        </ul>
      </div>

    </div>
  )
}