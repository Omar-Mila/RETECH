import PhoneCardS from "./PhoneCardS"
import { useEffect, useState } from "react"
import { getProducts } from "../../services/productService"

export default function PhonesSection() {

    const [phones, setPhones] = useState([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        getProducts()
        .then(data => setPhones(data))
        .catch(err => console.error(err))
        .finally(() => setLoading(false))
    }, [])

    if (loading) {
        return <div className="p-10">Carregant productes...</div>
    }
    console.info(phones);
    return (
        <section className="w-full py-12">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-8">

            <div className="relative rounded-xl overflow-hidden">
            <div className="bg-gradient-to-br from-black to-gray-800 text-white p-10 h-full flex flex-col justify-center rounded-xl">
                <h3 className="text-3xl font-bold mb-4">
                Estalvia fins a un 70%
                </h3>
                <p className="mb-6">
                Compra dispositius reacondicionats amb garantia i suport tècnic.
                </p>
            </div>
            </div>

            <div className="bg-gray-50 p-6 rounded-xl shadow">
            <h3 className="text-2xl font-bold mb-6">
                Telèfons destacats
            </h3>

            <div className="flex gap-6 overflow-x-auto">
                {phones.map(phone => (
                <PhoneCardS
                    key={phone.id}
                    name={`${phone.modelo.nombre}`}
                    condition={phone.estado}
                    price={phone.precio}
                    image="https://via.placeholder.com/300"
                />
                ))}
            </div>
            </div>

        </div>
        </section>
    )
}
