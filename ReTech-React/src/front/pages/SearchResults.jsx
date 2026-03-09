import { useEffect, useState } from "react"
import { useSearchParams, Link } from "react-router-dom"
import Navbar from "../components/Navbar"
import Footer from "../components/Footer"

const ESTADO_LABELS = {
    "nuevo":        { label: "Nou",         color: "bg-green-100 text-green-700" },
    "muy_bueno":    { label: "Molt bo",     color: "bg-blue-100 text-blue-700" },
    "bueno":        { label: "Bo",          color: "bg-yellow-100 text-yellow-700" },
    "aceptable":    { label: "Acceptable",  color: "bg-orange-100 text-orange-700" },
}

export default function SearchResults() {
    const [searchParams] = useSearchParams()
    const query = searchParams.get("q")
    const [products, setProducts] = useState([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(null)

    useEffect(() => {
        if (!query) return
        setLoading(true)
        setError(null)

        fetch(`http://localhost:8000/api/products/search?q=${encodeURIComponent(query)}`)
            .then(res => {
                if (!res.ok) throw new Error("Error al carregar els resultats")
                return res.json()
            })
            .then(data => {
                setProducts(data)
                setLoading(false)
            })
            .catch(err => {
                setError(err.message)
                setLoading(false)
            })
    }, [query])

    return (
        <div className="min-h-screen flex flex-col">
            <Navbar />

            <main className="flex-1 p-6 max-w-7xl mx-auto w-full">

                {loading && (
                    <div className="flex justify-center py-16">
                        <p className="text-gray-500 animate-pulse">Cercant "{query}"...</p>
                    </div>
                )}

                {error && (
                    <div className="p-6 text-red-500">Error: {error}</div>
                )}

                {!loading && !error && (
                    <>
                        <h1 className="text-xl font-bold mb-1">
                            Resultats per: <span className="text-gray-500">"{query}"</span>
                        </h1>
                        <p className="text-sm text-gray-400 mb-6">{products.length} productes trobats</p>

                        {products.length === 0 ? (
                            <div className="text-center py-16 text-gray-400">
                                <p className="text-4xl mb-3">🔍</p>
                                <p className="text-lg">No s'han trobat mòbils per "{query}"</p>
                            </div>
                        ) : (
                            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                                {products.map(product => {
                                    const estat = ESTADO_LABELS[product.estado] ?? { label: product.estado, color: "bg-gray-100 text-gray-600" }

                                    return (
                                        <Link
                                            to={`/models/${product.id}`}
                                            key={product.id}
                                            className="border rounded-xl p-3 hover:shadow-lg transition flex flex-col"
                                        >
                                            <div className="bg-gray-50 rounded-lg flex items-center justify-center h-44 mb-3">
                                                <img
                                                    src={product.image_url}
                                                    alt={`${product.marca} ${product.modelo}`}
                                                    className="h-40 object-contain"
                                                    onError={(e) => { e.target.src = "/images/no-image.png" }}
                                                />
                                            </div>

                                            <p className="text-xs text-gray-400 uppercase tracking-wide">{product.marca}</p>
                                            <p className="font-semibold text-sm leading-tight">{product.modelo}</p>
                                            <p className="text-xs text-gray-500 mt-1">
                                                {product.almacenamiento}GB · {product.ram}GB RAM · {product.color}
                                            </p>

                                            <span className={`mt-2 text-xs px-2 py-0.5 rounded-full w-fit ${estat.color}`}>
                                                {estat.label}
                                            </span>

                                            <p className="text-xs text-gray-400 mt-1">🔋 {product.salud_bateria}% bateria</p>
                                            <p className="text-lg font-bold mt-auto pt-2">{product.precio} €</p>
                                        </Link>
                                    )
                                })}
                            </div>
                        )}
                    </>
                )}
            </main>

            <Footer />
        </div>
    )
}