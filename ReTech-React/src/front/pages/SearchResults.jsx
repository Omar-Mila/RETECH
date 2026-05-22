import { useEffect, useState, useMemo, useRef } from "react"
import { useSearchParams, Link } from "react-router-dom"
import Navbar from "../components/Navbar"
import Footer from "../components/Footer"
import { useIdioma } from "../context/LanguageContext"

function PhoneImage({ src, alt }) {
    const [status, setStatus] = useState("loading")
    return (
        <div className="img-wrap-rel">
            {status !== "loaded" && (
                <div className="img-placeholder">
                    {status === "error"
                        ? <span className="img-error-icono">📱</span>
                        : <div className="img-skeleton" />
                    }
                </div>
            )}
            <img
                src={src}
                alt={alt}
                className={`img-producto${status === "loaded" ? " cargada" : ""}`}
                onLoad={() => setStatus("loaded")}
                onError={() => setStatus("error")}
            />
        </div>
    )
}

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
            className={`btn-orden${sort ? " activo" : ""}`}
        >
            {label}
            <span className={`btn-orden-icono${sort ? " visible" : ""}`}>{icon}</span>
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
        <aside className={`panel-filtros${collapsed ? " colapsado" : ""}`}>
            {/* Cabecera */}
            <div className={`panel-filtros-cab${collapsed ? " centrado" : ""}`}>
                <button
                    onClick={onToggleCollapse}
                    title={collapsed ? "Mostrar filtres" : "Ocultar filtres"}
                    className={`btn-filtros${activeCount > 0 ? " con-activos" : ""}${collapsed ? " compacto" : ""}`}
                >
                    <FunnelIcon size={15} color={activeCount > 0 ? "#fff" : "#334155"} />
                    {!collapsed && <span className="btn-filtros-etiq">Filtres</span>}
                    {activeCount > 0 && (
                        <span className="filtros-badge">{activeCount}</span>
                    )}
                </button>

                {!collapsed && activeCount > 0 && (
                    <button
                        onClick={() => onChange({ modelos: [], colores: [], almacenamientos: [], precioMax: maxPrice })}
                        className="btn-limpiar-filtros"
                    >
                        {t('search.clear')}
                    </button>
                )}
            </div>

            {/* Contenido */}
            {!collapsed && (
                <div className="panel-filtros-body">
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
                        <div className="filtro-precio-wrap">
                            <div className="filtro-precio-row">
                                <span className="filtro-precio-min">0 €</span>
                                <span className="filtro-precio-max">{filters.precioMax} €</span>
                            </div>
                            <input
                                type="range" min={0} max={maxPrice} value={filters.precioMax}
                                onChange={e => onChange({ ...filters, precioMax: Number(e.target.value) })}
                                className="filtro-rango"
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
        <div className="filtro-seccion">
            <p className="filtro-seccion-titulo">{title}</p>
            {children}
        </div>
    )
}

function CheckRow({ label, checked, onChange }) {
    return (
        <label className="filtro-check-fila">
            <input type="checkbox" checked={checked} onChange={onChange} className="filtro-check" />
            <span className="filtro-check-etiq">{label}</span>
        </label>
    )
}

const LIMITE = 8

export default function SearchResults() {
    const { t } = useIdioma()
    const [searchParams]   = useSearchParams()
    const query             = searchParams.get("q")
    const [productos, setProductos]             = useState([])
    const [cargando, setCargando]               = useState(true)
    const [cargandoNueva, setCargandoNueva]     = useState(false)
    const [error, setError]                     = useState(null)
    const [filtroColapsado, setFiltroColapsado] = useState(window.innerWidth < 768)
    const [filtros, setFiltros]                 = useState({ modelos: [], colores: [], almacenamientos: [], precioMax: Infinity })
    const [ordenPrecio, setOrdenPrecio]         = useState(null)
    const [ordenNombre, setOrdenNombre]         = useState(null)
    const [cantidad, setCantidad]               = useState(LIMITE)
    const centinelaRef                          = useRef(null)

    useEffect(() => {
        if (!query) return
        const esPrimeraCarga = productos.length === 0
        if (esPrimeraCarga) setCargando(true)
        else setCargandoNueva(true)
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
                setCargandoNueva(false)
            })
            .catch(err => {
                setError(err.message)
                setCargando(false)
                setCargandoNueva(false)
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

    useEffect(() => {
        setCantidad(LIMITE)
    }, [filtrados])

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
            <style>{`
                /* Imagen de producto */
                .img-wrap-rel {
                    position: relative;
                    width: 100%;
                    height: 100%;
                }
                .img-placeholder {
                    position: absolute;
                    inset: 0;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                }
                .img-error-icono {
                    font-size: 36px;
                    opacity: 0.25;
                }
                .img-skeleton {
                    width: 52px;
                    height: 80px;
                    background: #e2e8f0;
                    border-radius: 8px;
                    animation: pulse 1.5s ease-in-out infinite;
                }
                .img-producto {
                    height: 100%;
                    width: 100%;
                    object-fit: contain;
                    opacity: 0;
                    transition: opacity 0.25s;
                    display: block;
                }
                .img-producto.cargada { opacity: 1; }

                /* Botón ordenar */
                .btn-orden {
                    display: inline-flex;
                    align-items: center;
                    gap: 4px;
                    padding: 5px 10px;
                    border: 1px solid #e2e8f0;
                    border-radius: 8px;
                    background: #fff;
                    color: #475569;
                    font-size: 12px;
                    font-weight: 600;
                    cursor: pointer;
                    white-space: nowrap;
                }
                .btn-orden.activo {
                    border-color: #0f172a;
                    background: #0f172a;
                    color: #fff;
                }
                .btn-orden-icono {
                    font-size: 10px;
                    opacity: 0.4;
                }
                .btn-orden-icono.visible { opacity: 1; }
                .thumb-img-wrap { overflow: hidden; }

                /* Panel de filtros */
                .panel-filtros {
                    width: 236px;
                    min-width: 236px;
                    flex-shrink: 0;
                    transition: width 0.2s, min-width 0.2s;
                    background: #fff;
                    border: 1px solid #f1f5f9;
                    border-radius: 12px;
                    align-self: flex-start;
                    position: sticky;
                    top: 88px;
                    overflow: hidden;
                    max-height: calc(100vh - 104px);
                    display: flex;
                    flex-direction: column;
                    box-shadow: 0 1px 4px rgba(0, 0, 0, 0.04);
                }
                .panel-filtros.colapsado {
                    width: 44px;
                    min-width: 44px;
                }
                .panel-filtros-cab {
                    padding: 12px 14px;
                    border-bottom: 1px solid #f1f5f9;
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    flex-shrink: 0;
                }
                .panel-filtros-cab.centrado {
                    padding: 12px 0;
                    border-bottom: none;
                    justify-content: center;
                }
                .btn-filtros {
                    background: transparent;
                    border: 1px solid #e2e8f0;
                    border-radius: 8px;
                    padding: 6px 10px;
                    cursor: pointer;
                    display: flex;
                    align-items: center;
                    gap: 6px;
                    color: #334155;
                    position: relative;
                    flex-shrink: 0;
                }
                .btn-filtros.compacto { padding: 7px; }
                .btn-filtros.con-activos {
                    background: #0f172a;
                    border-color: #0f172a;
                    color: #fff;
                }
                .btn-filtros-etiq {
                    font-size: 12px;
                    font-weight: 700;
                    letter-spacing: 0.02em;
                }
                .filtros-badge {
                    background: #6366f1;
                    color: #fff;
                    font-size: 9px;
                    font-weight: 700;
                    width: 15px;
                    height: 15px;
                    border-radius: 50%;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    border: 2px solid #fff;
                    position: absolute;
                    top: -6px;
                    right: -6px;
                }
                .btn-limpiar-filtros {
                    font-size: 11px;
                    color: #64748b;
                    background: none;
                    border: none;
                    cursor: pointer;
                    text-decoration: underline;
                }
                .panel-filtros-body {
                    flex: 1;
                    overflow-y: auto;
                }
                .filtro-seccion {
                    border-bottom: 1px solid #f1f5f9;
                }
                .filtro-seccion-titulo {
                    margin: 0;
                    padding: 10px 14px 5px;
                    font-size: 10px;
                    font-weight: 700;
                    color: #94a3b8;
                    text-transform: uppercase;
                    letter-spacing: 0.07em;
                }
                .filtro-check-fila {
                    display: flex;
                    align-items: center;
                    gap: 8px;
                    padding: 5px 14px;
                    cursor: pointer;
                }
                .filtro-check {
                    accent-color: #0f172a;
                    width: 13px;
                    height: 13px;
                }
                .filtro-check-etiq {
                    font-size: 12px;
                    color: #334155;
                }
                .filtro-precio-wrap {
                    padding: 4px 14px 14px;
                }
                .filtro-precio-row {
                    display: flex;
                    justify-content: space-between;
                    margin-bottom: 8px;
                }
                .filtro-precio-min {
                    font-size: 11px;
                    color: #64748b;
                }
                .filtro-precio-max {
                    font-size: 12px;
                    font-weight: 700;
                    color: #0f172a;
                }
                .filtro-rango {
                    width: 100%;
                    accent-color: #0f172a;
                }

                /* Lista de resultados */
                .resultados-wrap {
                    flex: 1;
                    min-width: 0;
                    transition: opacity 0.2s;
                }
                .resultados-wrap.cargando { opacity: 0.5; }
                .resultados-cab {
                    display: flex;
                    flex-wrap: wrap;
                    align-items: center;
                    gap: 8px;
                    margin-bottom: 4px;
                }
                .resultados-titulo {
                    font-size: 17px;
                    font-weight: 700;
                    margin: 0;
                    white-space: nowrap;
                }
                .resultados-orden {
                    display: flex;
                    gap: 6px;
                    align-items: center;
                }
                .chips-activos {
                    display: flex;
                    flex-wrap: wrap;
                    gap: 4px;
                    align-items: center;
                }
                .chip-filtro {
                    display: inline-flex;
                    align-items: center;
                    gap: 3px;
                    background: #f8fafc;
                    color: #475569;
                    font-size: 11px;
                    font-weight: 500;
                    padding: 3px 6px 3px 9px;
                    border-radius: 999px;
                    border: 1px solid #e2e8f0;
                }
                .btn-chip-quitar {
                    background: none;
                    border: none;
                    cursor: pointer;
                    color: #94a3b8;
                    font-size: 14px;
                    line-height: 1;
                    padding: 0 2px;
                    display: flex;
                    align-items: center;
                }
                .resultados-conteo {
                    font-size: 12px;
                    color: #94a3b8;
                    margin-bottom: 20px;
                    margin-top: 2px;
                }
                .centinela { height: 1px; }
                .cargando-mas {
                    text-align: center;
                    padding: 24px 0 8px;
                    color: #94a3b8;
                    font-size: 13px;
                }
                .todo-cargado {
                    text-align: center;
                    padding: 24px 0 8px;
                    color: #cbd5e1;
                    font-size: 12px;
                }
            `}</style>

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

                        <div className={`resultados-wrap${cargandoNueva ? " cargando" : ""}`}>
                            {/* Cabecera */}
                            <div className="resultados-cab">
                                <h1 className="resultados-titulo">
                                    {t('search.results')(query)}
                                </h1>

                                <div className="resultados-orden">
                                    <SortButton label={t('search.price')} sort={ordenPrecio} onClick={alternarOrdenPrecio} />
                                    <SortButton label={t('search.name')} sort={ordenNombre} onClick={alternarOrdenNombre} />
                                </div>

                                {etiquetasFiltrosActivos.length > 0 && (
                                    <div className="chips-activos">
                                        {etiquetasFiltrosActivos.map((chip, i) => (
                                            <span key={i} className="chip-filtro">
                                                {chip.label}
                                                <button onClick={chip.quitar} className="btn-chip-quitar">×</button>
                                            </span>
                                        ))}
                                    </div>
                                )}
                            </div>

                            <p className="resultados-conteo">{t('search.found')(filtrados.length)}</p>

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
                                                    to={`/models/${producto.modelo_id}?movil=${producto.id}`}
                                                    key={producto.id}
                                                    className="border rounded-xl p-3 hover:shadow-lg transition flex flex-col"
                                                >
                                                    <div className="bg-gray-50 rounded-lg h-44 mb-3 thumb-img-wrap">
                                                        <PhoneImage
                                                            src={producto.image_url}
                                                            alt={`${producto.marca} ${producto.modelo}`}
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

                                    <div ref={centinelaRef} className="centinela" />

                                    {hayMas && (
                                        <div className="cargando-mas">{t('search.loadingMore')}</div>
                                    )}

                                    {!hayMas && filtrados.length > LIMITE && (
                                        <div className="todo-cargado">{t('search.allLoaded')(filtrados.length)}</div>
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
