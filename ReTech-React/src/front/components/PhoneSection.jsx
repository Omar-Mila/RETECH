import PhoneCardS from "./PhoneCardS"
import { useEffect, useState } from "react"
import { getBestSellers } from "../../services/productService"
import { useLanguage } from "../context/LanguageContext"

export default function PhonesSection() {
    const { t } = useLanguage()
    const [phones, setPhones] = useState([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        getBestSellers()
        .then(data => setPhones(data))
        .catch(err => console.error(err))
        .finally(() => setLoading(false))
    }, [])
    

    if (loading) {
        return <div className="p-10">{t('phoneSection.loading')}</div>
    }
    return (
        <section className="w-full py-12">
            <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-8">

            <div className="relative rounded-xl overflow-hidden">
            <div className="bg-gradient-to-br from-black to-gray-800 text-white p-10 h-full flex flex-col justify-center rounded-xl">
                <h3 className="text-3xl font-bold mb-4">
                {t('phoneSection.savingsTitle')}
                </h3>
                <p className="mb-6">
                {t('phoneSection.savingsDesc')}
                </p>
            </div>
            </div>

            <div className="bg-gray-50 p-6 rounded-xl shadow">
            <h3 className="text-2xl font-bold mb-6">
                {t('phoneSection.bestsellers')}
            </h3>

            <div className="flex gap-6 overflow-x-auto">
                {phones.slice(0, 4).map(phone => (
                <PhoneCardS
                    key={phone.id}
                    modeloId={phone.modelo_id}
                    movilId={phone.id}
                    name={phone.modelo?.nombre ?? phone.modelo}
                    condition={phone.estado}
                    price={phone.precio}
                    image={phone.image_url ?? "https://via.placeholder.com/300"}
                    />
                ))}
            </div>
            </div>

            </div>
        </section>
    )
}
