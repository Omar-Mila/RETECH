export default function PhoneCardS({ name, condition, price, image }) {
  return (
    <div className="min-w-[200px] bg-white p-4 rounded-lg shadow">
      <div className="h-40 mb-4 rounded overflow-hidden">
        <img
          src={image}
          alt={name}
          className="h-full w-full object-cover"
        />
      </div>

      <h4 className="font-semibold">{name}</h4>
      <p className="text-gray-500 text-sm">{condition}</p>
      <p className="font-bold mt-2">{price}€</p>
    </div>
  )
}
