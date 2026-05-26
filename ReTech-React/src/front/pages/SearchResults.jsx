import { useEffect, useState, useMemo, useRef } from "react"
import { useSearchParams, Link } from "react-router-dom"
import Navbar from "../components/Navbar"
import Footer from "../components/Footer"
import { useIdioma } from "../context/LanguageContext"

/* ─── Mapa nombre de color → hex aproximado ─── */
const COLOR_MAP = {
  'negro': '#1c1c1e', 'black': '#1c1c1e',
  'blanco': '#f5f5f0', 'white': '#f5f5f0', 'blanco estrella': '#f5f5f0',
  'azul': '#3b82f6', 'blue': '#3b82f6', 'azul marino': '#1e3a8a',
  'azul cielo': '#7dd3fc', 'azul titanio': '#4f6e8a', 'azul alpino': '#4a7c9e',
  'rojo': '#ef4444', 'red': '#ef4444',
  'verde': '#22c55e', 'green': '#22c55e',
  'oro': '#d4a853', 'gold': '#d4a853', 'dorado': '#d4a853',
  'plata': '#b0b8c4', 'silver': '#b0b8c4', 'plateado': '#b0b8c4',
  'rosa': '#f472b6', 'pink': '#f472b6',
  'morado': '#8b5cf6', 'purple': '#8b5cf6', 'violeta': '#8b5cf6',
  'gris': '#9ca3af', 'gray': '#9ca3af', 'grey': '#9ca3af',
  'naranja': '#f97316', 'orange': '#f97316',
  'amarillo': '#eab308', 'yellow': '#eab308',
  'titanio': '#a0a0a2', 'titanium': '#a0a0a2',
  'titanio negro': '#2e2e30', 'black titanium': '#2e2e30',
  'titanio blanco': '#e8e8e3', 'white titanium': '#e8e8e3',
  'titanio natural': '#c8b89a', 'natural titanium': '#c8b89a',
  'grafito': '#374151', 'graphite': '#374151',
  'medianoche': '#1e293b', 'midnight': '#1e293b',
  'starlight': '#fef3c7', 'luz estelar': '#fef3c7',
  'coral': '#f87171',
  'lima': '#84cc16', 'lime': '#84cc16',
  'cyan': '#06b6d4', 'teal': '#0d9488',
  'burdeos': '#881337', 'burgundy': '#881337',
  'lavanda': '#c4b5fd', 'lavender': '#c4b5fd',
  'beige': '#d6b896', 'crema': '#fde68a',
  'cobre': '#b87333', 'copper': '#b87333',
  'champagne': '#f7e7ce',
  'verde pino': '#15803d', 'deep green': '#166534',
  'verde alpino': '#4d7c3f',
  'arena': '#e2c27d', 'desierto': '#c2996e',
  'marina': '#1d4ed8', 'ocean blue': '#1d4ed8',
}

function getColorHex(nombre) {
  const key = (nombre ?? '').toLowerCase().trim()
  if (COLOR_MAP[key]) return COLOR_MAP[key]
  // Búsqueda parcial
  for (const [k, v] of Object.entries(COLOR_MAP)) {
    if (key.includes(k) || k.includes(key)) return v
  }
  return '#94a3b8'
}

/* ─── Imagen con skeleton / error ─── */
function PhoneImage({ src, alt }) {
  const [status, setStatus] = useState("loading")
  return (
    <div className="sr-img-wrap">
      {status !== "loaded" && (
        <div className="sr-img-placeholder">
          {status === "error"
            ? <span className="sr-img-error">📱</span>
            : <div className="sr-img-skeleton" />
          }
        </div>
      )}
      <img
        src={src}
        alt={alt}
        className={`sr-img${status === "loaded" ? " sr-img--loaded" : ""}`}
        onLoad={() => setStatus("loaded")}
        onError={() => setStatus("error")}
      />
    </div>
  )
}

/* ─── Iconos ─── */
function FunnelIcon({ size = 15, color = "currentColor" }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill={color}>
      <path d="M3 4.5A1.5 1.5 0 0 1 4.5 3h15A1.5 1.5 0 0 1 21 4.5v1.086a1.5 1.5 0 0 1-.44 1.06L15 12.208V18.75a1.5 1.5 0 0 1-2.1 1.374l-3-1.5A1.5 1.5 0 0 1 9 17.25v-5.043L3.44 6.646A1.5 1.5 0 0 1 3 5.586V4.5z" />
    </svg>
  )
}

function SortButton({ label, sort, onClick }) {
  const icon = sort === "asc" ? "↑" : sort === "desc" ? "↓" : "↕"
  return (
    <button
      onClick={onClick}
      className={`sr-btn-sort${sort ? " sr-btn-sort--active" : ""}`}
    >
      {label}
      <span className={`sr-btn-sort-icon${sort ? " sr-btn-sort-icon--visible" : ""}`}>{icon}</span>
    </button>
  )
}

/* ─── Panel de filtros ─── */
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
    <aside className={`sr-filter-panel${collapsed ? " sr-filter-panel--collapsed" : ""}`}>
      <div className={`sr-filter-head${collapsed ? " sr-filter-head--centered" : ""}`}>
        <button
          onClick={onToggleCollapse}
          title={collapsed ? "Mostrar filtres" : "Ocultar filtres"}
          className={`sr-btn-filter${activeCount > 0 ? " sr-btn-filter--active" : ""}${collapsed ? " sr-btn-filter--compact" : ""}`}
        >
          <FunnelIcon size={15} color={activeCount > 0 ? "#fff" : "#334155"} />
          {!collapsed && <span className="sr-btn-filter-label">Filtres</span>}
          {activeCount > 0 && <span className="sr-filter-badge">{activeCount}</span>}
        </button>
        {!collapsed && activeCount > 0 && (
          <button
            onClick={() => onChange({ modelos: [], colores: [], almacenamientos: [], precioMax: maxPrice })}
            className="sr-btn-clear-filters"
          >
            {t('search.clear')}
          </button>
        )}
      </div>

      {!collapsed && (
        <div className="sr-filter-body">
          <FilterSection title={t('search.filterModel')}>
            {modelos.map(m => (
              <CheckRow key={m} label={m} checked={filters.modelos.includes(m)} onChange={() => toggle("modelos", m)} />
            ))}
          </FilterSection>
          <FilterSection title={t('search.filterColor')}>
            {colores.map(c => (
              <label key={c} className="sr-filter-check-row">
                <input
                  type="checkbox"
                  checked={filters.colores.includes(c)}
                  onChange={() => toggle("colores", c)}
                  className="sr-filter-check"
                />
                <span
                  className="sr-filter-color-dot"
                  style={{ background: getColorHex(c), border: `1.5px solid ${getColorHex(c) === '#f5f5f0' ? '#d1d5db' : 'transparent'}` }}
                />
                <span className="sr-filter-check-label">{c}</span>
              </label>
            ))}
          </FilterSection>
          <FilterSection title={t('search.filterStorage')}>
            {almacenamientos.map(a => (
              <CheckRow key={a} label={`${a} GB`} checked={filters.almacenamientos.includes(a)} onChange={() => toggle("almacenamientos", a)} />
            ))}
          </FilterSection>
          <FilterSection title={t('search.filterMaxPrice')}>
            <div className="sr-filter-price-wrap">
              <div className="sr-filter-price-row">
                <span className="sr-filter-price-min">0 €</span>
                <span className="sr-filter-price-max">{filters.precioMax} €</span>
              </div>
              <input
                type="range" min={0} max={maxPrice} value={filters.precioMax}
                onChange={e => onChange({ ...filters, precioMax: Number(e.target.value) })}
                className="sr-filter-range"
              />
            </div>
          </FilterSection>
        </div>
      )}
    </aside>
  )
}

function FilterSection({ title, children }) {
  return (
    <div className="sr-filter-section">
      <p className="sr-filter-section-title">{title}</p>
      {children}
    </div>
  )
}

function CheckRow({ label, checked, onChange }) {
  return (
    <label className="sr-filter-check-row">
      <input type="checkbox" checked={checked} onChange={onChange} className="sr-filter-check" />
      <span className="sr-filter-check-label">{label}</span>
    </label>
  )
}

/* ─── Tarjeta de modelo (agrupada) ─── */
const MAX_SWATCHES = 5

function colorClave(u) {
  return u.color_id != null ? String(u.color_id) : u.color
}

function ModelCard({ grupo }) {
  // Colores únicos disponibles en este grupo
  const coloresUnicos = useMemo(() => {
    const seen = new Set()
    return grupo.unidades
      .filter(u => {
        const k = colorClave(u)
        if (seen.has(k)) return false
        seen.add(k)
        return true
      })
      .map(u => ({
        id:     colorClave(u),
        nombre: u.color,
        hex:    getColorHex(u.color),
      }))
  }, [grupo.unidades])

  // Color por defecto: negro/black o el primero
  const colorDefault = useMemo(() =>
    coloresUnicos.find(c =>
      c.nombre.toLowerCase().includes('negro') ||
      c.nombre.toLowerCase().includes('black')
    )?.id ?? coloresUnicos[0]?.id ?? ''
  , [coloresUnicos])

  // colorFijado: selección permanente (click)
  // colorHover:  preview temporal (mouseenter/leave)
  const [colorFijado, setColorFijado] = useState(null)   // null = usa el default
  const [colorHover,  setColorHover]  = useState(null)   // null = sin hover

  // Lo que se muestra en imagen / label: hover > fijado > default
  const colorActivo  = colorHover ?? colorFijado ?? colorDefault
  // Lo que se usa en el enlace: fijado > default  (nunca el hover temporal)
  const colorEnlace  = colorFijado ?? colorDefault

  // Unidad para mostrar imagen (color activo, precio mínimo)
  const unidadVista = useMemo(() => {
    const deEsteColor = grupo.unidades.filter(u => colorClave(u) === colorActivo)
    const pool = deEsteColor.length > 0 ? deEsteColor : grupo.unidades
    return pool.sort((a, b) => a.precio - b.precio)[0]
  }, [grupo.unidades, colorActivo])

  // Unidad para el enlace (color fijado, precio mínimo)
  const unidadEnlace = useMemo(() => {
    const deEsteColor = grupo.unidades.filter(u => colorClave(u) === colorEnlace)
    const pool = deEsteColor.length > 0 ? deEsteColor : grupo.unidades
    return pool.sort((a, b) => a.precio - b.precio)[0]
  }, [grupo.unidades, colorEnlace])

  const precioDesde = useMemo(() =>
    Math.min(...grupo.unidades.map(u => u.precio))
  , [grupo.unidades])

  const colorNombreActivo = coloresUnicos.find(c => c.id === colorActivo)?.nombre ?? ''

  const swatchesVisibles = coloresUnicos.slice(0, MAX_SWATCHES)
  const swatchesExtra    = coloresUnicos.length - MAX_SWATCHES

  return (
    <Link
      to={`/models/${grupo.modelo_id}${unidadEnlace ? `?movil=${unidadEnlace.id}` : ''}`}
      className="sr-card"
    >
      {/* Imagen — cambia según el color visible */}
      <div className="sr-card-img">
        <PhoneImage
          src={unidadVista?.image_url ?? ''}
          alt={`${grupo.marca} ${grupo.modelo}`}
        />
      </div>

      {/* Info */}
      <p className="sr-card-brand">{grupo.marca}</p>
      <p className="sr-card-name">{grupo.modelo}</p>

      {/* Swatches de color */}
      <div
        className="sr-card-swatches"
        onClick={e => { e.preventDefault(); e.stopPropagation() }}
      >
        {swatchesVisibles.map(c => {
          const esFijado = c.id === (colorFijado ?? colorDefault)
          const esHover  = c.id === colorHover
          const esBlanco = c.hex === '#f5f5f0'

          return (
            <button
              key={c.id}
              title={c.nombre}
              className={`sr-swatch${esFijado ? " sr-swatch--selected" : ""}${esHover && !esFijado ? " sr-swatch--hover" : ""}`}
              style={{
                background: c.hex,
                outline: esFijado
                  ? `2.5px solid #0f172a`
                  : esHover
                    ? `2px solid #94a3b8`
                    : 'none',
                outlineOffset: '2px',
                border: esBlanco ? '1.5px solid #d1d5db' : 'none',
              }}
              onMouseEnter={() => setColorHover(c.id)}
              onMouseLeave={() => setColorHover(null)}
              onClick={e => {
                e.preventDefault()
                e.stopPropagation()
                setColorFijado(c.id)
                setColorHover(null)
              }}
              aria-label={c.nombre}
              aria-pressed={esFijado}
            />
          )
        })}
        {swatchesExtra > 0 && (
          <span className="sr-swatch-extra">+{swatchesExtra}</span>
        )}
      </div>

      {/* Nombre del color visible */}
      <p className="sr-card-color-label">{colorNombreActivo || ' '}</p>

      {/* Precio */}
      <p className="sr-card-price-from">
        <span className="sr-card-price-desde">Desde </span>
        <span className="sr-card-price-num">{precioDesde} €</span>
      </p>

      {/* Nº variantes */}
      <p className="sr-card-variants">
        {grupo.unidades.length} {grupo.unidades.length === 1 ? 'unidad' : 'unidades'} disponibles
      </p>
    </Link>
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

  /* Unidades filtradas (igual que antes) */
  const filtradas = useMemo(() => {
    return productos.filter(p => {
      if (filtros.modelos.length && !filtros.modelos.includes(p.modelo)) return false
      if (filtros.colores.length && !filtros.colores.includes(p.color)) return false
      if (filtros.almacenamientos.length && !filtros.almacenamientos.includes(p.almacenamiento)) return false
      if (p.precio > filtros.precioMax) return false
      return true
    })
  }, [productos, filtros])

  /* Agrupar unidades filtradas por modelo_id → un grupo por modelo */
  const gruposModelo = useMemo(() => {
    const mapa = new Map()
    filtradas.forEach(p => {
      if (!mapa.has(p.modelo_id)) {
        mapa.set(p.modelo_id, {
          modelo_id: p.modelo_id,
          modelo: p.modelo,
          marca: p.marca,
          unidades: [],
        })
      }
      mapa.get(p.modelo_id).unidades.push(p)
    })
    let grupos = [...mapa.values()]

    // Ordenar grupos por precio mínimo o nombre
    if (ordenPrecio) {
      grupos = grupos.sort((a, b) => {
        const pa = Math.min(...a.unidades.map(u => u.precio))
        const pb = Math.min(...b.unidades.map(u => u.precio))
        return ordenPrecio === "asc" ? pa - pb : pb - pa
      })
    } else if (ordenNombre) {
      grupos = grupos.sort((a, b) => {
        const na = `${a.marca} ${a.modelo}`, nb = `${b.marca} ${b.modelo}`
        return ordenNombre === "asc" ? na.localeCompare(nb) : nb.localeCompare(na)
      })
    }
    return grupos
  }, [filtradas, ordenPrecio, ordenNombre])

  useEffect(() => { setCantidad(LIMITE) }, [gruposModelo])

  const hayMas = cantidad < gruposModelo.length
  useEffect(() => {
    const el = centinelaRef.current
    if (!el) return
    const obs = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting && hayMas) setCantidad(c => c + LIMITE) },
      { rootMargin: "150px" }
    )
    obs.observe(el)
    return () => obs.disconnect()
  }, [hayMas])

  const visibles = gruposModelo.slice(0, cantidad)

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
    <div className="sr-page">
      <Navbar />

      <main className="sr-main">

        {cargando && (
          <div className="sr-loading">
            <p className="sr-loading-text">{t('search.searching')(query)}</p>
          </div>
        )}

        {error && <div className="sr-error">Error: {error}</div>}

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

            <div className={`sr-results${cargandoNueva ? " sr-results--loading" : ""}`}>

              {/* Cabecera */}
              <div className="sr-results-head">
                <h1 className="sr-results-title">{t('search.results')(query)}</h1>
                <div className="sr-results-sort">
                  <SortButton label={t('search.price')} sort={ordenPrecio} onClick={alternarOrdenPrecio} />
                  <SortButton label={t('search.name')}  sort={ordenNombre} onClick={alternarOrdenNombre} />
                </div>
                {etiquetasFiltrosActivos.length > 0 && (
                  <div className="sr-chips">
                    {etiquetasFiltrosActivos.map((chip, i) => (
                      <span key={i} className="sr-chip">
                        {chip.label}
                        <button onClick={chip.quitar} className="sr-chip-remove">×</button>
                      </span>
                    ))}
                  </div>
                )}
              </div>

              <p className="sr-results-count">
                {gruposModelo.length} {gruposModelo.length === 1 ? 'modelo' : 'modelos'}
                {filtradas.length !== gruposModelo.length && (
                  <span> · {filtradas.length} unidades</span>
                )}
              </p>

              {gruposModelo.length === 0 ? (
                <div className="sr-no-results">
                  <p className="sr-no-results-text">{t('search.noResults')(query)}</p>
                </div>
              ) : (
                <>
                  <div className="sr-grid">
                    {visibles.map(grupo => (
                      <ModelCard key={grupo.modelo_id} grupo={grupo} />
                    ))}
                  </div>

                  <div ref={centinelaRef} className="sr-sentinel" />

                  {hayMas && (
                    <div className="sr-loading-more">{t('search.loadingMore')}</div>
                  )}
                  {!hayMas && gruposModelo.length > LIMITE && (
                    <div className="sr-all-loaded">{t('search.allLoaded')(gruposModelo.length)}</div>
                  )}
                </>
              )}
            </div>
          </>
        )}
      </main>

      <Footer />

      <style>{`

        @keyframes sr-pulse {
          0%, 100% { opacity: 1; }
          50%       { opacity: 0.45; }
        }
        @keyframes sr-fade-in {
          from { opacity: 0; transform: translateY(6px); }
          to   { opacity: 1; transform: translateY(0); }
        }

        /* Página */
        .sr-page {
          min-height: 100vh;
          display: flex;
          flex-direction: column;
        }

        /* Main */
        .sr-main {
          flex: 1;
          display: flex;
          flex-direction: row;
          gap: 1.5rem;
          max-width: 80rem;
          margin: 0 auto;
          width: 100%;
          padding: 1.5rem;
          align-items: flex-start;
          box-sizing: border-box;
        }

        /* Estados de carga */
        .sr-loading {
          display: flex;
          justify-content: center;
          padding: 4rem 0;
          width: 100%;
        }
        .sr-loading-text {
          color: #9ca3af;
          animation: sr-pulse 1.5s ease-in-out infinite;
        }
        .sr-error {
          padding: 1.5rem;
          color: #ef4444;
          width: 100%;
        }

        /* Imagen */
        .sr-img-wrap {
          position: relative;
          width: 100%;
          height: 100%;
        }
        .sr-img-placeholder {
          position: absolute;
          inset: 0;
          display: flex;
          align-items: center;
          justify-content: center;
        }
        .sr-img-error {
          font-size: 36px;
          opacity: 0.25;
        }
        .sr-img-skeleton {
          width: 52px; height: 80px;
          background: #e2e8f0;
          border-radius: 8px;
          animation: sr-pulse 1.5s ease-in-out infinite;
        }
        .sr-img {
          height: 100%; width: 100%;
          object-fit: contain;
          opacity: 0;
          transition: opacity 0.3s;
          display: block;
        }
        .sr-img--loaded { opacity: 1; }

        /* Botón ordenar */
        .sr-btn-sort {
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
        .sr-btn-sort--active {
          border-color: #0f172a;
          background: #0f172a;
          color: #fff;
        }
        .sr-btn-sort-icon { font-size: 10px; opacity: 0.4; }
        .sr-btn-sort-icon--visible { opacity: 1; }

        /* Panel de filtros */
        .sr-filter-panel {
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
          box-shadow: 0 1px 4px rgba(0,0,0,0.04);
        }
        .sr-filter-panel--collapsed {
          width: 44px;
          min-width: 44px;
        }
        .sr-filter-head {
          padding: 12px 14px;
          border-bottom: 1px solid #f1f5f9;
          display: flex;
          justify-content: space-between;
          align-items: center;
          flex-shrink: 0;
        }
        .sr-filter-head--centered {
          padding: 12px 0;
          border-bottom: none;
          justify-content: center;
        }
        .sr-btn-filter {
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
        .sr-btn-filter--compact { padding: 7px; }
        .sr-btn-filter--active {
          background: #0f172a;
          border-color: #0f172a;
          color: #fff;
        }
        .sr-btn-filter-label {
          font-size: 12px;
          font-weight: 700;
          letter-spacing: 0.02em;
        }
        .sr-filter-badge {
          background: #6366f1;
          color: #fff;
          font-size: 9px; font-weight: 700;
          width: 15px; height: 15px;
          border-radius: 50%;
          display: flex; align-items: center; justify-content: center;
          border: 2px solid #fff;
          position: absolute;
          top: -6px; right: -6px;
        }
        .sr-btn-clear-filters {
          font-size: 11px;
          color: #64748b;
          background: none; border: none;
          cursor: pointer;
          text-decoration: underline;
        }
        .sr-filter-body { flex: 1; overflow-y: auto; }
        .sr-filter-section { border-bottom: 1px solid #f1f5f9; }
        .sr-filter-section-title {
          margin: 0;
          padding: 10px 14px 5px;
          font-size: 10px; font-weight: 700;
          color: #94a3b8;
          text-transform: uppercase; letter-spacing: 0.07em;
        }
        .sr-filter-check-row {
          display: flex;
          align-items: center;
          gap: 8px;
          padding: 5px 14px;
          cursor: pointer;
        }
        .sr-filter-check { accent-color: #0f172a; width: 13px; height: 13px; flex-shrink: 0; }
        .sr-filter-check-label { font-size: 12px; color: #334155; }
        .sr-filter-color-dot {
          width: 12px; height: 12px;
          border-radius: 50%;
          flex-shrink: 0;
          display: inline-block;
        }
        .sr-filter-price-wrap { padding: 4px 14px 14px; }
        .sr-filter-price-row { display: flex; justify-content: space-between; margin-bottom: 8px; }
        .sr-filter-price-min { font-size: 11px; color: #64748b; }
        .sr-filter-price-max { font-size: 12px; font-weight: 700; color: #0f172a; }
        .sr-filter-range { width: 100%; accent-color: #0f172a; }

        /* Resultados */
        .sr-results { flex: 1; min-width: 0; transition: opacity 0.2s; }
        .sr-results--loading { opacity: 0.5; }
        .sr-results-head {
          display: flex;
          flex-wrap: wrap;
          align-items: center;
          gap: 8px;
          margin-bottom: 4px;
        }
        .sr-results-title {
          font-size: 17px; font-weight: 700;
          margin: 0;
          white-space: nowrap;
        }
        .sr-results-sort { display: flex; gap: 6px; align-items: center; }
        .sr-chips { display: flex; flex-wrap: wrap; gap: 4px; align-items: center; }
        .sr-chip {
          display: inline-flex;
          align-items: center;
          gap: 3px;
          background: #f8fafc;
          color: #475569;
          font-size: 11px; font-weight: 500;
          padding: 3px 6px 3px 9px;
          border-radius: 999px;
          border: 1px solid #e2e8f0;
        }
        .sr-chip-remove {
          background: none; border: none;
          cursor: pointer;
          color: #94a3b8;
          font-size: 14px; line-height: 1;
          padding: 0 2px;
          display: flex; align-items: center;
        }
        .sr-results-count {
          font-size: 12px; color: #94a3b8;
          margin-bottom: 20px; margin-top: 2px;
        }

        /* Sin resultados */
        .sr-no-results {
          text-align: center;
          padding: 4rem 1rem;
          color: #9ca3af;
        }
        .sr-no-results-icon { font-size: 2.5rem; margin-bottom: 0.75rem; }
        .sr-no-results-text { font-size: 1.125rem; margin: 0; }

        /* Grid de modelos */
        .sr-grid {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 1rem;
        }

        /* ─── Tarjeta de modelo ─── */
        .sr-card {
          border: 1px solid #e5e7eb;
          border-radius: 14px;
          padding: 0.875rem;
          display: flex;
          flex-direction: column;
          text-decoration: none;
          color: inherit;
          transition: box-shadow 0.2s, transform 0.15s;
          background: #fff;
          animation: sr-fade-in 0.2s ease both;
          gap: 0;
        }
        .sr-card:hover {
          box-shadow: 0 10px 30px rgba(0,0,0,0.1);
          transform: translateY(-2px);
        }

        /* Imagen */
        .sr-card-img {
          background: #f8fafc;
          border-radius: 10px;
          height: 12rem;
          margin-bottom: 0.875rem;
          overflow: hidden;
          transition: background 0.2s;
        }
        .sr-card:hover .sr-card-img { background: #f1f5f9; }

        /* Marca */
        .sr-card-brand {
          font-size: 10px;
          color: #9ca3af;
          text-transform: uppercase;
          letter-spacing: 0.06em;
          margin: 0 0 2px;
          font-weight: 600;
        }

        /* Nombre modelo */
        .sr-card-name {
          font-weight: 700;
          font-size: 0.9rem;
          line-height: 1.3;
          margin: 0 0 10px;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
          color: #0f172a;
        }

        /* Swatches de color */
        .sr-card-swatches {
          display: flex;
          align-items: center;
          gap: 6px;
          margin-bottom: 4px;
          flex-wrap: wrap;
        }
        .sr-swatch {
          width: 16px;
          height: 16px;
          border-radius: 50%;
          cursor: pointer;
          padding: 0;
          transition: transform 0.15s, outline-color 0.15s;
          flex-shrink: 0;
        }
        /* Hover temporal — anillo gris claro */
        .sr-swatch--hover {
          transform: scale(1.2);
        }
        /* Seleccionado con click — anillo negro sólido + ligeramente grande */
        .sr-swatch--selected {
          transform: scale(1.15);
        }
        /* Cuando el ratón entra en cualquier swatch */
        .sr-swatch:hover {
          transform: scale(1.2);
        }
        .sr-swatch-extra {
          font-size: 10px;
          color: #94a3b8;
          font-weight: 600;
          letter-spacing: -0.02em;
        }

        /* Nombre del color activo */
        .sr-card-color-label {
          font-size: 11px;
          color: #6b7280;
          margin: 0 0 8px;
          min-height: 1em;
          transition: color 0.15s;
        }

        /* Precio */
        .sr-card-price-from {
          margin: auto 0 0;
          padding-top: 6px;
        }
        .sr-card-price-desde {
          font-size: 11px;
          color: #9ca3af;
          font-weight: 400;
        }
        .sr-card-price-num {
          font-size: 1.125rem;
          font-weight: 700;
          color: #0f172a;
        }

        /* Variantes disponibles */
        .sr-card-variants {
          font-size: 10px;
          color: #cbd5e1;
          margin: 2px 0 0;
        }

        /* Centinela */
        .sr-sentinel    { height: 1px; }
        .sr-loading-more {
          text-align: center;
          padding: 24px 0 8px;
          color: #94a3b8; font-size: 13px;
        }
        .sr-all-loaded {
          text-align: center;
          padding: 24px 0 8px;
          color: #cbd5e1; font-size: 12px;
        }

        /* Responsive */
        @media (max-width: 1024px) {
          .sr-grid { grid-template-columns: repeat(3, 1fr); }
        }

        @media (max-width: 768px) {
          .sr-main {
            flex-direction: column;
            padding: 1rem;
            gap: 1rem;
            align-items: stretch;
          }
          .sr-filter-panel {
            position: static;
            width: 100%;
            min-width: 0;
            max-height: none;
          }
          .sr-filter-panel--collapsed {
            width: 44px;
            min-width: 44px;
          }
          .sr-grid { grid-template-columns: repeat(2, 1fr); }
        }

        @media (max-width: 480px) {
          .sr-main    { padding: 0.75rem; }
          .sr-grid    { gap: 0.625rem; }
          .sr-card    { padding: 0.625rem; }
          .sr-card-img { height: 9rem; }
          .sr-results-title { font-size: 15px; }
        }

        @media (max-width: 360px) {
          .sr-grid { grid-template-columns: 1fr; }
        }

      `}</style>
    </div>
  )
}
