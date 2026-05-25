import { Link } from "react-router-dom"

export default function PhoneCardS({ modeloId, movilId, name, condition, price, image }) {
  const to = modeloId
    ? `/models/${modeloId}${movilId ? `?movil=${movilId}` : ""}`
    : "#";
  return (
    <Link
      to={to}
      className="min-w-[200px] bg-white p-4 rounded-lg shadow block transition hover:shadow-lg"
    >
      <div className="h-40 mb-4 rounded overflow-hidden">
        <img
          src={image}
          alt={name}
          className="h-full w-full object-cover"
        />
      </div>

      <h4 className="font-semibold text-gray-900">{name}</h4>
      <p className="text-gray-500 text-sm">{condition}</p>
      <p className="font-bold mt-2 text-gray-900">{price}€</p>
    </Link>
  )
}
