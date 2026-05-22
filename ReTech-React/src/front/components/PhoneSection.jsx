import PhoneCardS from "./PhoneCardS"
import { useEffect, useState } from "react"
import { obtenerMasVendidos } from "../../services/productService"
import { useIdioma } from "../context/LanguageContext"

export default function SeccionMoviles() {
    const { t } = useIdioma()
    const [moviles, fijarMoviles] = useState([])
    const [cargando, fijarCargando] = useState(true)

    useEffect(() => {
        obtenerMasVendidos()
        .then(datos => fijarMoviles(datos))
        .catch(err => console.error(err))
        .finally(() => fijarCargando(false))
    }, [])


    if (cargando) {
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
                {moviles.slice(0, 4).map(movil => (
                <PhoneCardS
                    key={movil.id}
                    modeloId={movil.modelo_id}
                    movilId={movil.id}
                    nombre={movil.modelo?.nombre ?? movil.modelo}
                    condicion={movil.estado}
                    precio={movil.precio}
                    imagen={movil.image_url ?? "https://via.placeholder.com/300"}
                    />
                ))}
            </div>
            </div>

            </div>
        </section>
    )
}
