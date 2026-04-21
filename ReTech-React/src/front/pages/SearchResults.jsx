import { useEffect, useState, useMemo } from "react"
import { useSearchParams, Link } from "react-router-dom"
import Navbar from "../components/Navbar"
import Footer from "../components/Footer"

const ESTADO_LABELS = {
    "nuevo":        { label: "Nou",         color: "bg-green-100 text-green-700" },
    "muy_bueno":    { label: "Molt bo",     color: "bg-blue-100 text-blue-700" },
    "bueno":        { label: "Bo",          color: "bg-yellow-100 text-yellow-700" },
    "aceptable":    { label: "Acceptable",  color: "bg-orange-100 text-orange-700" },
}

function FilterPanel({ products, filters, onChange, onClose }) {
    const modelos      = useMemo(() => [...new Set(products.map(p => p.modelo))].sort(), [products])
    const colores      = useMemo(() => [...new Set(products.map(p => p.color))].sort(), [products])
    const almacenamientos = useMemo(() => [...new Set(products.map(p => p.almacenamiento))].sort((a, b) => a - b), [products])
    const maxPrice     = useMemo(() => Math.ceil(Math.max(...products.map(p => p.precio), 0)), [products])

    const toggle = (key, value) => {
        const current = filters[key]
        const next = current.includes(value) ? current.filter(v => v !== value) : [...current, value]
        onChange({ ...filters, [key]: next })
    }

    const activeCount = filters.modelos.length + filters.colores.length + filters.almacenamientos.length + (filters.precioMax < maxPrice ? 1 : 0)

    return (
        <>
            {/* Backdrop */}
            <div
                onClick={onClose}
                style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.25)", zIndex: 40 }}
            />

            {/* Panel */}
            <div style={{
                position: "fixed", top: 0, right: 0, bottom: 0, width: 320,
                background: "#fff", zIndex: 50, display: "flex", flexDirection: "column",
                boxShadow: "-4px 0 24px rgba(0,0,0,0.1)"
            }}>
                {/* Header */}
                <div style={{ padding: "18px 20px", borderBottom: "1px solid #f1f5f9", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <span style={{ fontWeight: 700, fontSize: 15, color: "#0f172a" }}>
                        Filtres {activeCount > 0 && <span style={{ background: "#0f172a", color: "#fff", borderRadius: "50%", fontSize: 11, fontWeight: 700, padding: "1px 6px", marginLeft: 6 }}>{activeCount}</span>}
                    </span>
                    <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
                        {activeCount > 0 && (
                            <button
                                onClick={() => onChange({ modelos: [], colores: [], almacenamientos: [], precioMax: maxPrice })}
                                style={{ fontSize: 12, color: "#64748b", background: "none", border: "none", cursor: "pointer", textDecoration: "underline" }}
                            >
                                Netejar
                            </button>
                        )}
                        <button onClick={onClose} style={{ background: "none", border: "none", cursor: "pointer", fontSize: 20, color: "#94a3b8", lineHeight: 1 }}>×</button>
                    </div>
                </div>

                <div style={{ flex: 1, overflowY: "auto", padding: "8px 0" }}>

                    {/* Modelo */}
                    <Section title="Model">
                        {modelos.map(m => (
                            <CheckRow key={m} label={m} checked={filters.modelos.includes(m)} onChange={() => toggle("modelos", m)} />
                        ))}
                    </Section>

                    {/* Color */}
                    <Section title="Color">
                        {colores.map(c => (
                            <CheckRow key={c} label={c} checked={filters.colores.includes(c)} onChange={() => toggle("colores", c)} />
                        ))}
                    </Section>

                    {/* Almacenamiento */}
                    <Section title="Emmagatzematge">
                        {almacenamientos.map(a => (
                            <CheckRow key={a} label={`${a} GB`} checked={filters.almacenamientos.includes(a)} onChange={() => toggle("almacenamientos", a)} />
                        ))}
                    </Section>

                    {/* Precio */}
                    <Section title="Preu màxim">
                        <div style={{ padding: "4px 20px 12px" }}>
                            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 8 }}>
                                <span style={{ fontSize: 12, color: "#64748b" }}>0 €</span>
                                <span style={{ fontSize: 13, fontWeight: 700, color: "#0f172a" }}>{filters.precioMax} €</span>
                            </div>
                            <input
                                type="range"
                                min={0}
                                max={maxPrice}
                                value={filters.precioMax}
                                onChange={e => onChange({ ...filters, precioMax: Number(e.target.value) })}
                                style={{ width: "100%", accentColor: "#0f172a" }}
                            />
                        </div>
                    </Section>

                </div>

                <div style={{ padding: "16px 20px", borderTop: "1px solid #f1f5f9" }}>
                    <button
                        onClick={onClose}
                        style={{ width: "100%", padding: "11px", background: "#0f172a", color: "#fff", border: "none", borderRadius: 10, fontSize: 14, fontWeight: 700, cursor: "pointer" }}
                    >
                        Aplicar filtres
                    </button>
                </div>
            </div>
        </>
    )
}

function Section({ title, children }) {
    return (
        <div style={{ borderBottom: "1px solid #f1f5f9" }}>
            <p style={{ margin: 0, padding: "14px 20px 8px", fontSize: 12, fontWeight: 700, color: "#64748b", textTransform: "uppercase", letterSpacing: "0.06em" }}>{title}</p>
            {children}
        </div>
    )
}

function CheckRow({ label, checked, onChange }) {
    return (
        <label style={{ display: "flex", alignItems: "center", gap: 10, padding: "7px 20px", cursor: "pointer" }}>
            <input type="checkbox" checked={checked} onChange={onChange} style={{ accentColor: "#0f172a", width: 15, height: 15 }} />
            <span style={{ fontSize: 13, color: "#334155" }}>{label}</span>
        </label>
    )
}

export default function SearchResults() {
    const [searchParams] = useSearchParams()
    const query = searchParams.get("q")
    const [products, setProducts] = useState([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(null)
    const [filterOpen, setFilterOpen] = useState(false)
    const [filters, setFilters] = useState({ modelos: [], colores: [], almacenamientos: [], precioMax: Infinity })

    useEffect(() => {
        if (!query) return
        setLoading(true)
        setError(null)
        setFilters({ modelos: [], colores: [], almacenamientos: [], precioMax: Infinity })

        fetch(`http://localhost:8000/api/products/search?q=${encodeURIComponent(query)}`)
            .then(res => {
                if (!res.ok) throw new Error("Error al carregar els resultats")
                return res.json()
            })
            .then(data => {
                setProducts(data)
                setFilters(f => ({ ...f, precioMax: Math.ceil(Math.max(...data.map(p => p.precio), 0)) }))
                setLoading(false)
            })
            .catch(err => {
                setError(err.message)
                setLoading(false)
            })
    }, [query])

    const maxPrice = useMemo(() => Math.ceil(Math.max(...products.map(p => p.precio), 0)), [products])

    const filtered = useMemo(() => {
        return products.filter(p => {
            if (filters.modelos.length && !filters.modelos.includes(p.modelo)) return false
            if (filters.colores.length && !filters.colores.includes(p.color)) return false
            if (filters.almacenamientos.length && !filters.almacenamientos.includes(p.almacenamiento)) return false
            if (p.precio > filters.precioMax) return false
            return true
        })
    }, [products, filters])

    const activeCount = filters.modelos.length + filters.colores.length + filters.almacenamientos.length + (filters.precioMax < maxPrice ? 1 : 0)

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
                        <div className="flex items-center justify-between mb-1">
                            <h1 className="text-xl font-bold">
                                Resultats per: <span className="text-gray-500">"{query}"</span>
                            </h1>
                            <button
                                onClick={() => setFilterOpen(true)}
                                style={{
                                    display: "flex", flexDirection: "column", justifyContent: "center", gap: 4,
                                    padding: "8px 12px", border: "1px solid #e2e8f0", borderRadius: 8,
                                    background: activeCount > 0 ? "#0f172a" : "#fff", cursor: "pointer", position: "relative"
                                }}
                            >
                                {[0,1,2].map(i => (
                                    <span key={i} style={{ display: "block", width: 18, height: 2, background: activeCount > 0 ? "#fff" : "#334155", borderRadius: 2 }} />
                                ))}
                                {activeCount > 0 && (
                                    <span style={{ position: "absolute", top: -6, right: -6, background: "#6366f1", color: "#fff", fontSize: 10, fontWeight: 700, width: 18, height: 18, borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", border: "2px solid #fff" }}>
                                        {activeCount}
                                    </span>
                                )}
                            </button>
                        </div>

                        <p className="text-sm text-gray-400 mb-6">{filtered.length} productes trobats</p>

                        {filterOpen && (
                            <FilterPanel
                                products={products}
                                filters={filters}
                                onChange={setFilters}
                                onClose={() => setFilterOpen(false)}
                            />
                        )}

                        {filtered.length === 0 ? (
                            <div className="text-center py-16 text-gray-400">
                                <p className="text-4xl mb-3">🔍</p>
                                <p className="text-lg">No s'han trobat mòbils per "{query}"</p>
                            </div>
                        ) : (
                            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                                {filtered.map(product => {
                                    const estat = ESTADO_LABELS[product.estado] ?? { label: product.estado, color: "bg-gray-100 text-gray-600" }

                                    return (
                                        <Link
                                            to={`/models/${product.modelo_id}`}
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
