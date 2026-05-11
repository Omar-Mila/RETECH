import { useEffect, useState, useMemo, useRef } from "react"
import { useSearchParams, Link } from "react-router-dom"
import Navbar from "../components/Navbar"
import Footer from "../components/Footer"
import { useLanguage } from "../context/LanguageContext"

const ESTADO_LABELS = {
    "nuevo":        { label: "Nou",         color: "bg-green-100 text-green-700" },
    "muy_bueno":    { label: "Molt bo",     color: "bg-blue-100 text-blue-700" },
    "bueno":        { label: "Bo",          color: "bg-yellow-100 text-yellow-700" },
    "aceptable":    { label: "Acceptable",  color: "bg-orange-100 text-orange-700" },
}

function FunnelIcon({ size = 15, color = "currentColor" }) {
    return (
        <svg width={size} height={size} viewBox="0 0 24 24" fill={color} xmlns="http://www.w3.org/2000/svg">
            <path d="M3 4.5A1.5 1.5 0 0 1 4.5 3h15A1.5 1.5 0 0 1 21 4.5v1.086a1.5 1.5 0 0 1-.44 1.06L15 12.208V18.75a1.5 1.5 0 0 1-2.1 1.374l-3-1.5A1.5 1.5 0 0 1 9 17.25v-5.043L3.44 6.646A1.5 1.5 0 0 1 3 5.586V4.5z" />
        </svg>
    )
}

function SortButton({ label, sort, onClick }) {
    const icon = sort === "asc" ? "↑" : sort === "desc" ? "↓" : "↕"
    return (
        <button
            onClick={onClick}
            style={{
                display: "inline-flex", alignItems: "center", gap: 4,
                padding: "5px 10px",
                border: "1px solid",
                borderColor: sort ? "#0f172a" : "#e2e8f0",
                borderRadius: 8,
                background: sort ? "#0f172a" : "#fff",
                color: sort ? "#fff" : "#475569",
                fontSize: 12, fontWeight: 600,
                cursor: "pointer",
                whiteSpace: "nowrap",
            }}
        >
            {label}
            <span style={{ fontSize: 10, opacity: sort ? 1 : 0.4 }}>{icon}</span>
        </button>
    )
}

function FilterPanel({ products, filters, onChange, collapsed, onToggleCollapse, t }) {
    const modelos         = useMemo(() => [...new Set(products.map(p => p.modelo))].sort(), [products])
    const colores         = useMemo(() => [...new Set(products.map(p => p.color))].sort(), [products])
    const almacenamientos = useMemo(() => [...new Set(products.map(p => p.almacenamiento))].sort((a, b) => a - b), [products])
    const maxPrice        = useMemo(() => Math.ceil(Math.max(...products.map(p => p.precio), 0)), [products])

    const toggle = (key, value) => {
        const current = filters[key]
        const next = current.includes(value) ? current.filter(v => v !== value) : [...current, value]
        onChange({ ...filters, [key]: next })
    }

    const activeCount = filters.modelos.length + filters.colores.length + filters.almacenamientos.length + (filters.precioMax < maxPrice ? 1 : 0)

    return (
        <aside style={{
            width: collapsed ? 44 : 236,
            minWidth: collapsed ? 44 : 236,
            flexShrink: 0,
            transition: "width 0.2s, min-width 0.2s",
            background: "#fff",
            border: "1px solid #f1f5f9",
            borderRadius: 12,
            alignSelf: "flex-start",
            position: "sticky",
            top: 88,
            overflow: "hidden",
            maxHeight: "calc(100vh - 104px)",
            display: "flex",
            flexDirection: "column",
            boxShadow: "0 1px 4px rgba(0,0,0,0.04)"
        }}>
            {/* Header */}
            <div style={{
                padding: collapsed ? "12px 0" : "12px 14px",
                borderBottom: collapsed ? "none" : "1px solid #f1f5f9",
                display: "flex",
                justifyContent: collapsed ? "center" : "space-between",
                alignItems: "center",
                flexShrink: 0
            }}>
                <button
                    onClick={onToggleCollapse}
                    title={collapsed ? "Mostrar filtres" : "Ocultar filtres"}
                    style={{
                        background: activeCount > 0 ? "#0f172a" : "transparent",
                        border: "1px solid",
                        borderColor: activeCount > 0 ? "#0f172a" : "#e2e8f0",
                        borderRadius: 8,
                        padding: collapsed ? "7px" : "6px 10px",
                        cursor: "pointer",
                        display: "flex",
                        alignItems: "center",
                        gap: 6,
                        color: activeCount > 0 ? "#fff" : "#334155",
                        position: "relative",
                        flexShrink: 0
                    }}
                >
                    <FunnelIcon size={15} color={activeCount > 0 ? "#fff" : "#334155"} />
                    {!collapsed && <span style={{ fontSize: 12, fontWeight: 700, letterSpacing: "0.02em" }}>Filtres</span>}
                    {activeCount > 0 && (
                        <span style={{
                            background: "#6366f1", color: "#fff", fontSize: 9, fontWeight: 700,
                            width: 15, height: 15, borderRadius: "50%",
                            display: "flex", alignItems: "center", justifyContent: "center",
                            border: "2px solid #fff",
                            position: "absolute", top: -6, right: -6
                        }}>
                            {activeCount}
                        </span>
                    )}
                </button>

                {!collapsed && activeCount > 0 && (
                    <button
                        onClick={() => onChange({ modelos: [], colores: [], almacenamientos: [], precioMax: maxPrice })}
                        style={{ fontSize: 11, color: "#64748b", background: "none", border: "none", cursor: "pointer", textDecoration: "underline" }}
                    >
                        {t('search.clear')}
                    </button>
                )}
            </div>

            {/* Content */}
            {!collapsed && (
                <div style={{ flex: 1, overflowY: "auto" }}>
                    <Section title={t('search.filterModel')}>
                        {modelos.map(m => (
                            <CheckRow key={m} label={m} checked={filters.modelos.includes(m)} onChange={() => toggle("modelos", m)} />
                        ))}
                    </Section>
                    <Section title={t('search.filterColor')}>
                        {colores.map(c => (
                            <CheckRow key={c} label={c} checked={filters.colores.includes(c)} onChange={() => toggle("colores", c)} />
                        ))}
                    </Section>
                    <Section title={t('search.filterStorage')}>
                        {almacenamientos.map(a => (
                            <CheckRow key={a} label={`${a} GB`} checked={filters.almacenamientos.includes(a)} onChange={() => toggle("almacenamientos", a)} />
                        ))}
                    </Section>
                    <Section title={t('search.filterMaxPrice')}>
                        <div style={{ padding: "4px 14px 14px" }}>
                            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 8 }}>
                                <span style={{ fontSize: 11, color: "#64748b" }}>0 €</span>
                                <span style={{ fontSize: 12, fontWeight: 700, color: "#0f172a" }}>{filters.precioMax} €</span>
                            </div>
                            <input
                                type="range" min={0} max={maxPrice} value={filters.precioMax}
                                onChange={e => onChange({ ...filters, precioMax: Number(e.target.value) })}
                                style={{ width: "100%", accentColor: "#0f172a" }}
                            />
                        </div>
                    </Section>
                </div>
            )}
        </aside>
    )
}

function Section({ title, children }) {
    return (
        <div style={{ borderBottom: "1px solid #f1f5f9" }}>
            <p style={{ margin: 0, padding: "10px 14px 5px", fontSize: 10, fontWeight: 700, color: "#94a3b8", textTransform: "uppercase", letterSpacing: "0.07em" }}>{title}</p>
            {children}
        </div>
    )
}

function CheckRow({ label, checked, onChange }) {
    return (
        <label style={{ display: "flex", alignItems: "center", gap: 8, padding: "5px 14px", cursor: "pointer" }}>
            <input type="checkbox" checked={checked} onChange={onChange} style={{ accentColor: "#0f172a", width: 13, height: 13 }} />
            <span style={{ fontSize: 12, color: "#334155" }}>{label}</span>
        </label>
    )
}

const LIMITE = 8

export default function SearchResults() {
    const { t } = useLanguage()
    const [searchParams]   = useSearchParams()
    const query             = searchParams.get("q")
    const [productos, setProductos]             = useState([])
    const [cargando, setCargando]               = useState(true)
    const [error, setError]                     = useState(null)
    const [filtroColapsado, setFiltroColapsado] = useState(window.innerWidth < 768)
    const [filtros, setFiltros]                 = useState({ modelos: [], colores: [], almacenamientos: [], precioMax: Infinity })
    const [ordenPrecio, setOrdenPrecio]         = useState(null)
    const [ordenNombre, setOrdenNombre]         = useState(null)
    const [cantidad, setCantidad]               = useState(LIMITE)
    const centinelaRef                          = useRef(null)

    useEffect(() => {
        if (!query) return
        setCargando(true)
        setError(null)
        setFiltros({ modelos: [], colores: [], almacenamientos: [], precioMax: Infinity })
        setOrdenPrecio(null)
        setOrdenNombre(null)

        fetch(`http://localhost:8000/api/products/search?q=${encodeURIComponent(query)}`)
            .then(res => {
                if (!res.ok) throw new Error("Error al carregar els resultats")
                return res.json()
            })
            .then(data => {
                setProductos(data)
                setFiltros(f => ({ ...f, precioMax: Math.ceil(Math.max(...data.map(p => p.precio), 0)) }))
                setCargando(false)
            })
            .catch(err => {
                setError(err.message)
                setCargando(false)
            })
    }, [query])

    const precioMaximo = useMemo(() => Math.ceil(Math.max(...productos.map(p => p.precio), 0)), [productos])

    const filtrados = useMemo(() => {
        let resultado = productos.filter(p => {
            if (filtros.modelos.length && !filtros.modelos.includes(p.modelo)) return false
            if (filtros.colores.length && !filtros.colores.includes(p.color)) return false
            if (filtros.almacenamientos.length && !filtros.almacenamientos.includes(p.almacenamiento)) return false
            if (p.precio > filtros.precioMax) return false
            return true
        })
        if (ordenPrecio) {
            resultado = [...resultado].sort((a, b) => ordenPrecio === "asc" ? a.precio - b.precio : b.precio - a.precio)
        } else if (ordenNombre) {
            resultado = [...resultado].sort((a, b) => {
                const na = `${a.marca} ${a.modelo}`, nb = `${b.marca} ${b.modelo}`
                return ordenNombre === "asc" ? na.localeCompare(nb) : nb.localeCompare(na)
            })
        }
        return resultado
    }, [productos, filtros, ordenPrecio, ordenNombre])

    // Resetear paginacion cuando cambian filtros u ordenacion
    useEffect(() => {
        setCantidad(LIMITE)
    }, [filtrados])

    // Scroll infinito: cuando el centinela entra en pantalla, cargamos mas
    const hayMas = cantidad < filtrados.length
    useEffect(() => {
        const el = centinelaRef.current
        if (!el) return
        const observador = new IntersectionObserver(
            (entradas) => {
                if (entradas[0].isIntersecting && hayMas) {
                    setCantidad(c => c + LIMITE)
                }
            },
            { rootMargin: "150px" }
        )
        observador.observe(el)
        return () => observador.disconnect()
    }, [hayMas])

    const visibles = filtrados.slice(0, cantidad)

    const alternarOrdenPrecio = () => {
        setOrdenNombre(null)
        setOrdenPrecio(s => s === null ? "asc" : s === "asc" ? "desc" : null)
    }
    const alternarOrdenNombre = () => {
        setOrdenPrecio(null)
        setOrdenNombre(s => s === null ? "asc" : s === "asc" ? "desc" : null)
    }

    const etiquetasFiltrosActivos = [
        ...filtros.modelos.map(m => ({ label: m, quitar: () => setFiltros(f => ({ ...f, modelos: f.modelos.filter(v => v !== m) })) })),
        ...filtros.colores.map(c => ({ label: c, quitar: () => setFiltros(f => ({ ...f, colores: f.colores.filter(v => v !== c) })) })),
        ...filtros.almacenamientos.map(a => ({ label: `${a} GB`, quitar: () => setFiltros(f => ({ ...f, almacenamientos: f.almacenamientos.filter(v => v !== a) })) })),
        ...(filtros.precioMax < precioMaximo ? [{ label: `≤ ${filtros.precioMax} €`, quitar: () => setFiltros(f => ({ ...f, precioMax: precioMaximo })) }] : [])
    ]

    return (
        <div className="min-h-screen flex flex-col">
            <Navbar />

            <main className="flex-1 flex flex-col md:flex-row gap-6 max-w-7xl mx-auto w-full px-6 py-6 items-start">

                {cargando && (
                    <div className="flex justify-center py-16 w-full">
                        <p className="text-gray-400 animate-pulse">{t('search.searching')(query)}</p>
                    </div>
                )}

                {error && (
                    <div className="p-6 text-red-500 w-full">Error: {error}</div>
                )}

                {!cargando && !error && (
                    <>
                        <FilterPanel
                            products={productos}
                            filters={filtros}
                            onChange={setFiltros}
                            collapsed={filtroColapsado}
                            onToggleCollapse={() => setFiltroColapsado(c => !c)}
                            t={t}
                        />

                        <div style={{ flex: 1, minWidth: 0 }}>
                            {/* Cabecera */}
                            <div style={{ display: "flex", flexWrap: "wrap", alignItems: "center", gap: 8, marginBottom: 4 }}>
                                <h1 style={{ fontSize: 17, fontWeight: 700, margin: 0, whiteSpace: "nowrap" }}>
                                    {t('search.results')(query)}
                                </h1>

                                <div style={{ display: "flex", gap: 6, alignItems: "center" }}>
                                    <SortButton label={t('search.price')} sort={ordenPrecio} onClick={alternarOrdenPrecio} />
                                    <SortButton label={t('search.name')} sort={ordenNombre} onClick={alternarOrdenNombre} />
                                </div>

                                {/* Burbujas de filtros activos */}
                                {etiquetasFiltrosActivos.length > 0 && (
                                    <div style={{ display: "flex", flexWrap: "wrap", gap: 4, alignItems: "center" }}>
                                        {etiquetasFiltrosActivos.map((chip, i) => (
                                            <span key={i} style={{
                                                display: "inline-flex", alignItems: "center", gap: 3,
                                                background: "#f8fafc", color: "#475569",
                                                fontSize: 11, fontWeight: 500,
                                                padding: "3px 6px 3px 9px", borderRadius: 999,
                                                border: "1px solid #e2e8f0"
                                            }}>
                                                {chip.label}
                                                <button
                                                    onClick={chip.quitar}
                                                    style={{ background: "none", border: "none", cursor: "pointer", color: "#94a3b8", fontSize: 14, lineHeight: 1, padding: "0 2px", display: "flex", alignItems: "center" }}
                                                >
                                                    ×
                                                </button>
                                            </span>
                                        ))}
                                    </div>
                                )}
                            </div>

                            <p style={{ fontSize: 12, color: "#94a3b8", marginBottom: 20, marginTop: 2 }}>{t('search.found')(filtrados.length)}</p>

                            {filtrados.length === 0 ? (
                                <div className="text-center py-16 text-gray-400">
                                    <p className="text-4xl mb-3">🔍</p>
                                    <p className="text-lg">{t('search.noResults')(query)}</p>
                                </div>
                            ) : (
                                <>
                                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                                        {visibles.map(producto => {
                                            const estat = ESTADO_LABELS[producto.estado] ?? { label: producto.estado, color: "bg-gray-100 text-gray-600" }

                                            return (
                                                <Link
                                                    to={`/models/${producto.modelo_id}`}
                                                    key={producto.id}
                                                    className="border rounded-xl p-3 hover:shadow-lg transition flex flex-col"
                                                >
                                                    <div className="bg-gray-50 rounded-lg flex items-center justify-center h-44 mb-3">
                                                        <img
                                                            src={producto.image_url}
                                                            alt={`${producto.marca} ${producto.modelo}`}
                                                            className="h-40 object-contain"
                                                            onError={(e) => { e.target.src = "/images/no-image.png" }}
                                                        />
                                                    </div>
                                                    <p className="text-xs text-gray-400 uppercase tracking-wide">{producto.marca}</p>
                                                    <p className="font-semibold text-sm leading-tight">{producto.modelo}</p>
                                                    <p className="text-xs text-gray-500 mt-1">
                                                        {producto.almacenamiento}GB · {producto.ram}GB RAM · {producto.color}
                                                    </p>
                                                    <span className={`mt-2 text-xs px-2 py-0.5 rounded-full w-fit ${estat.color}`}>
                                                        {estat.label}
                                                    </span>
                                                    <p className="text-xs text-gray-400 mt-1">{t('search.battery')(producto.salud_bateria)}</p>
                                                    <p className="text-lg font-bold mt-auto pt-2">{producto.precio} €</p>
                                                </Link>
                                            )
                                        })}
                                    </div>

                                    {/* Centinela para el scroll infinito */}
                                    <div ref={centinelaRef} style={{ height: 1 }} />

                                    {hayMas && (
                                        <div style={{ textAlign: "center", padding: "24px 0 8px", color: "#94a3b8", fontSize: 13 }}>
                                            {t('search.loadingMore')}
                                        </div>
                                    )}

                                    {!hayMas && filtrados.length > LIMITE && (
                                        <div style={{ textAlign: "center", padding: "24px 0 8px", color: "#cbd5e1", fontSize: 12 }}>
                                            {t('search.allLoaded')(filtrados.length)}
                                        </div>
                                    )}
                                </>
                            )}
                        </div>
                    </>
                )}
            </main>

            <Footer />
        </div>
    )
}
