import { Link } from "react-router-dom"

export default function PhoneCardS({ modeloId, movilId, nombre, condicion, precio, imagen }) {
  const destino = modeloId
    ? `/models/${modeloId}${movilId ? `?movil=${movilId}` : ""}`
    : "#";
  return (
    <Link
      to={destino}
      className="min-w-[200px] bg-white p-4 rounded-lg shadow block transition hover:shadow-lg"
    >
      <div className="h-40 mb-4 rounded overflow-hidden">
        <img
          src={imagen}
          alt={nombre}
          className="h-full w-full object-cover"
        />
      </div>

      <h4 className="font-semibold text-gray-900">{nombre}</h4>
      <p className="text-gray-500 text-sm">{condicion}</p>
      <p className="font-bold mt-2 text-gray-900">{precio}€</p>
    </Link>
  )
}
