import { useState, useEffect, useRef } from "react"
import { useAutenticacion } from "../../auth/AuthContext"
import { useNavigate, useLocation, Link } from "react-router-dom"
import { buscarProductos } from "../../services/searchService"
import { useIdioma } from "../context/LanguageContext"
import { obtenerCarritoInvitado, guardarCarritoInvitado } from "../../services/guestCart"

const API = "http://localhost:8000"

const llamarApi = (ruta, opts = {}) =>
  fetch(`${API}/api${ruta}`, {
    credentials: "include",
    headers: { "Content-Type": "application/json", Accept: "application/json" },
    ...opts,
  }).then((r) => r.json())

const fmtPrecio = (n) =>
  new Intl.NumberFormat("es-ES", { style: "currency", currency: "EUR" }).format(n)

function IconoBandera({ idiom, size = 20 }) {
  const h = size
  const w = Math.round(size * 1.5)

  if (idiom === "ca") return (
    <svg width={w} height={h} viewBox="0 0 3 2" className="nb-bandera">
      <rect width="3" height="2" fill="#FCDD09"/>
      <rect y={2/9}  width="3" height={2/9} fill="#DA121A"/>
      <rect y={6/9}  width="3" height={2/9} fill="#DA121A"/>
      <rect y={10/9} width="3" height={2/9} fill="#DA121A"/>
      <rect y={14/9} width="3" height={2/9} fill="#DA121A"/>
    </svg>
  )

  if (idiom === "es") return (
    <svg width={w} height={h} viewBox="0 0 3 2" className="nb-bandera">
      <rect width="3" height="2" fill="#c60b1e"/>
      <rect y="0.5" width="3" height="1" fill="#ffc400"/>
    </svg>
  )

  return (
    <svg width={w} height={h} viewBox="0 0 60 30" className="nb-bandera">
      <rect width="60" height="30" fill="#012169"/>
      <path d="M0,0 L60,30 M60,0 L0,30" stroke="#fff" strokeWidth="8"/>
      <path d="M0,0 L60,30 M60,0 L0,30" stroke="#C8102E" strokeWidth="4"/>
      <rect x="24" y="0" width="12" height="30" fill="#fff"/>
      <rect x="0" y="9" width="60" height="12" fill="#fff"/>
      <rect x="26" y="0" width="8" height="30" fill="#C8102E"/>
      <rect x="0" y="11" width="60" height="8" fill="#C8102E"/>
    </svg>
  )
}

const OPCIONES_IDIOMA = [
  { code: "ca", label: "CA",  name: "Català"    },
  { code: "es", label: "ES",  name: "Castellano" },
  { code: "en", label: "ENG", name: "English"   },
]

function DropdownCarro({ alCerrar, t }) {
  const [arts, fijarArts]         = useState([])
  const [cargando, fijarCargando] = useState(true)
  const navegar                   = useNavigate()
  const { isAuthenticated }       = useAutenticacion()

  const cargarDatosCarro = async () => {
    fijarCargando(true)
    if (!isAuthenticated) {
      const guardado = obtenerCarritoInvitado()
      fijarArts(guardado.map(art => ({ ...art, subtotal: art.precio * art.cantidad })))
      fijarCargando(false)
      return
    }
    try {
      const datos = await llamarApi("/carrito")
      fijarArts(datos.items ?? [])
    } catch { fijarArts([]) }
    finally  { fijarCargando(false) }
  }

  useEffect(() => {
    cargarDatosCarro()
    window.addEventListener("cart-updated", cargarDatosCarro)
    return () => window.removeEventListener("cart-updated", cargarDatosCarro)
  }, [])

  const quitarArt = async (movilId) => {
    if (!isAuthenticated) {
      const actualizado = obtenerCarritoInvitado().filter(i => i.movil_id !== movilId)
      guardarCarritoInvitado(actualizado)
    } else {
      await llamarApi(`/carrito/${movilId}`, { method: "DELETE" })
    }
    window.dispatchEvent(new Event("cart-updated"))
    cargarDatosCarro()
  }

  const totalCarro = arts.reduce((s, art) => s + (art.subtotal || 0), 0)

  return (
    <div className="nb-drop-cart">
      <div className="nb-drop-cart-head">
        <span className="nb-drop-cart-title">
          {t('nav.cart')}
          {arts.length > 0 && (
            <span className="nb-drop-cart-count">({arts.reduce((s, a) => s + a.cantidad, 0)})</span>
          )}
        </span>
        <button onClick={alCerrar} className="nb-drop-close">×</button>
      </div>

      <div className="nb-drop-cart-list">
        {cargando ? (
          <div className="nb-drop-cart-loading">{t('nav.cartLoading')}</div>
        ) : arts.length === 0 ? (
          <div className="nb-drop-cart-empty">
            <p className="nb-drop-cart-empty-text">{t('nav.cartEmpty')}</p>
          </div>
        ) : (
          arts.map((art) => (
            <div key={art.movil_id} className="nb-drop-cart-item">
              <div className="nb-drop-cart-img">
                <img
                  src={art.imagen_url || `https://via.placeholder.com/48?text=Phone`}
                  className="nb-drop-cart-img-inner"
                  alt="movil"
                />
              </div>
              <div className="nb-drop-cart-info">
                <p className="nb-drop-cart-name">{art.modelo}</p>
                <p className="nb-drop-cart-price">
                  {fmtPrecio(art.precio)} <span className="nb-drop-cart-qty">x{art.cantidad}</span>
                </p>
              </div>
              <button onClick={() => quitarArt(art.movil_id)} className="nb-drop-cart-remove">×</button>
            </div>
          ))
        )}
      </div>

      {arts.length > 0 && (
        <div className="nb-drop-cart-foot">
          <div className="nb-drop-cart-total">
            <span className="nb-drop-cart-total-label">{t('nav.cartTotal')}</span>
            <span className="nb-drop-cart-total-val">{fmtPrecio(totalCarro)}</span>
          </div>
          <button
            onClick={() => { alCerrar(); navegar("/carrito") }}
            className="nb-btn-go-cart"
          >
            {t('nav.goToCart')}
          </button>
        </div>
      )}
    </div>
  )
}

function DropdownUsuario({ user, logout, alCerrar, t }) {
  return (
    <div className="nb-drop-user">
      <div className="nb-drop-user-info">
        <p className="nb-drop-user-name">{user?.name}</p>
        <p className="nb-drop-user-email">{user?.email}</p>
      </div>
      <Link to="/perfil" onClick={alCerrar} className="nb-drop-link">
        <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="12" cy="8" r="4"/>
          <path d="M4 20c0-4 3.6-7 8-7s8 3 8 7"/>
        </svg>
        {t('nav.myProfile')}
      </Link>
      <Link to="/mis-pedidos" onClick={alCerrar} className="nb-drop-link">
        <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z"/>
          <line x1="3" y1="6" x2="21" y2="6"/>
          <path d="M16 10a4 4 0 01-8 0"/>
        </svg>
        {t('nav.myOrders')}
      </Link>
      <div className="nb-drop-user-sep">
        <button onClick={() => { logout(); alCerrar() }} className="nb-btn-logout">
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4"/>
            <polyline points="16 17 21 12 16 7"/>
            <line x1="21" y1="12" x2="9" y2="12"/>
          </svg>
          {t('nav.logout')}
        </button>
      </div>
    </div>
  )
}

export default function Navbar() {
  const { user, isAuthenticated, logout, loading } = useAutenticacion()
  const { idioma, fijarIdioma, t }                 = useIdioma()
  const navegar                                    = useNavigate()
  const ubicacion                                  = useLocation()

  const [busqueda,          fijarBusqueda]          = useState("")
  const [resultados,        fijarResultados]        = useState([])
  const [busquedaAbierta,   fijarBusquedaAbierta]   = useState(false)
  const [cargandoBusqueda,  fijarCargandoBusqueda]  = useState(false)
  const [carroAbierto,      fijarCarroAbierto]      = useState(false)
  const [usuarioAbierto,    fijarUsuarioAbierto]    = useState(false)
  const [idiomaAbierto,     fijarIdiomaAbierto]     = useState(false)
  const [cantidadCarro,     fijarCantidadCarro]     = useState(0)

  const refCarro    = useRef(null)
  const refUsuario  = useRef(null)
  const refIdioma   = useRef(null)
  const refBusqueda = useRef(null)

  useEffect(() => {
    if (busqueda.length < 2) { fijarResultados([]); fijarBusquedaAbierta(false); return }
    const timer = setTimeout(async () => {
      fijarCargandoBusqueda(true)
      try {
        const datos = await buscarProductos(busqueda)
        fijarResultados(datos); fijarBusquedaAbierta(true)
      } catch { fijarResultados([]); fijarBusquedaAbierta(true) }
      finally  { fijarCargandoBusqueda(false) }
    }, 300)
    return () => clearTimeout(timer)
  }, [busqueda])

  useEffect(() => {
    const obtenerCantidad = () => {
      if (!isAuthenticated) {
        const arts = obtenerCarritoInvitado()
        fijarCantidadCarro(arts.reduce((s, a) => s + a.cantidad, 0))
        return
      }
      llamarApi("/carrito")
        .then((d) => fijarCantidadCarro(d.total_items ?? 0))
        .catch(() => fijarCantidadCarro(0))
    }
    window.addEventListener("cart-updated", obtenerCantidad)
    obtenerCantidad()
    return () => window.removeEventListener("cart-updated", obtenerCantidad)
  }, [isAuthenticated])

  useEffect(() => {
    const handler = (e) => {
      if (refCarro.current    && !refCarro.current.contains(e.target))    fijarCarroAbierto(false)
      if (refUsuario.current  && !refUsuario.current.contains(e.target))  fijarUsuarioAbierto(false)
      if (refIdioma.current   && !refIdioma.current.contains(e.target))   fijarIdiomaAbierto(false)
      if (refBusqueda.current && !refBusqueda.current.contains(e.target)) fijarBusquedaAbierta(false)
    }
    document.addEventListener("mousedown", handler)
    return () => document.removeEventListener("mousedown", handler)
  }, [])

  if (loading) return null

  return (
    <header className="nb-header">

      {/* Barra principal */}
      <div className="nb-bar">
        <div className="nb-bar-inner">

          {/* Logo */}
          <Link to="/" className="nb-logo">
            <div className="nb-logo-icon">R</div>
            <span className="nb-logo-text">ReTech</span>
          </Link>

          {/* Buscador */}
          <div className="nb-search-wrap" ref={refBusqueda}>
            <input
              type="text"
              placeholder={t('nav.searchPlaceholder')}
              value={busqueda}
              onChange={(e) => fijarBusqueda(e.target.value)}
              onFocus={() => { if (busqueda.length >= 2) fijarBusquedaAbierta(true) }}
              onKeyDown={(e) => {
                if (e.key === "Enter" && busqueda.trim()) {
                  fijarBusquedaAbierta(false)
                  navegar(`/search?q=${encodeURIComponent(busqueda.trim())}`)
                }
              }}
              className="nb-search-input"
            />
            <span className="nb-search-icon-wrap">
              <button
                type="button"
                className="nb-search-btn"
                onClick={() => { if (busqueda.trim()) navegar(`/search?q=${encodeURIComponent(busqueda.trim())}`) }}
              ></button>
            </span>
            {busquedaAbierta && (
              <div className="nb-search-results">
                {cargandoBusqueda ? (
                  <div className="nb-search-msg">{t('nav.searching')}</div>
                ) : resultados.length === 0 ? (
                  <div className="nb-search-msg nb-search-msg--empty">{t('nav.noResults')}</div>
                ) : (
                  resultados.map((art) => (
                    <Link
                      key={art.id}
                      to={`/models/${art.modelo_id}`}
                      onClick={() => { fijarBusquedaAbierta(false); fijarBusqueda("") }}
                      className="nb-search-result"
                    >
                      {art.nombre}
                    </Link>
                  ))
                )}
              </div>
            )}
          </div>

          {/* Acciones */}
          <div className="nb-actions">

            {/* Selector idioma */}
            <div ref={refIdioma} className="nb-lang-wrap">
              <button
                onClick={() => fijarIdiomaAbierto((v) => !v)}
                className={`nb-btn-lang${idiomaAbierto ? " nb-btn-lang--open" : ""}`}
              >
                <IconoBandera idiom={idioma} size={18} />
                <span className="nb-lang-label">
                  {OPCIONES_IDIOMA.find(o => o.code === idioma)?.label}
                </span>
                <svg width="10" height="6" viewBox="0 0 10 6" fill="none">
                  <path d="M1 1l4 4 4-4" stroke="#94a3b8" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </button>

              {idiomaAbierto && (
                <div className="nb-drop-lang">
                  {OPCIONES_IDIOMA.map((opc) => (
                    <button
                      key={opc.code}
                      onClick={() => { fijarIdioma(opc.code); fijarIdiomaAbierto(false) }}
                      className={`nb-drop-lang-opt${idioma === opc.code ? " nb-drop-lang-opt--active" : ""}`}
                    >
                      <IconoBandera idiom={opc.code} size={16} />
                      <span className="nb-drop-lang-code">{opc.label}</span>
                      <span className="nb-drop-lang-name">{opc.name}</span>
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Login / Usuario */}
            {!isAuthenticated ? (
              <div className="nb-auth-btns">
                <button
                  onClick={() => navegar("/login", { state: { from: ubicacion.pathname } })}
                  className="nb-btn-login"
                >{t('nav.login')}</button>
                <button
                  onClick={() => navegar("/register")}
                  className="nb-btn-register"
                >{t('nav.register')}</button>
              </div>
            ) : (
              <div ref={refUsuario} className="nb-user-wrap">
                <button
                  onClick={() => fijarUsuarioAbierto(!usuarioAbierto)}
                  className={`nb-btn-user${usuarioAbierto ? " nb-btn-user--open" : ""}`}
                >
                  <span className="nb-btn-user-name">{user?.name}</span>
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#0f172a" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
                    <circle cx="12" cy="7" r="4"/>
                  </svg>
                </button>
                {usuarioAbierto && <DropdownUsuario user={user} logout={logout} alCerrar={() => fijarUsuarioAbierto(false)} t={t} />}
              </div>
            )}

            {/* Carrito */}
            <div ref={refCarro} className="nb-cart-wrap">
              <button
                onClick={() => fijarCarroAbierto((v) => !v)}
                className={`nb-btn-cart${carroAbierto ? " nb-btn-cart--open" : ""}`}
              >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#0f172a" strokeWidth="2">
                  <path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z"/>
                  <line x1="3" y1="6" x2="21" y2="6"/>
                  <path d="M16 10a4 4 0 01-8 0"/>
                </svg>
                {cantidadCarro > 0 && (
                  <span className="nb-cart-badge">{cantidadCarro > 9 ? "9+" : cantidadCarro}</span>
                )}
              </button>
              {carroAbierto && <DropdownCarro alCerrar={() => fijarCarroAbierto(false)} t={t} />}
            </div>

          </div>
        </div>
      </div>

      {/* Barra de marcas */}
      <div className="nb-brands-bar">
        <Link to="/contact" className="nb-contact-link">{t('nav.contact')}</Link>
        <div className="nb-brands-list">
          {["iPhone", "Samsung", "Xiaomi", "Google"].map((marca) => (
            <button
              key={marca}
              onClick={() => navegar(`/search?q=${marca}`)}
              className="nb-brand-btn"
            >
              {marca}
            </button>
          ))}
        </div>
      </div>

      <style>{`

        /* Header */
        .nb-header {
          border-bottom: 1px solid #e5e7eb;
          background: #fff;
        }

        /* Barra principal */
        .nb-bar { background: #fff; width: 100%; }
        .nb-bar-inner {
          display: flex;
          align-items: center;
          gap: 1.5rem;
          padding: 1rem 1.5rem;
          width: 100%;
          box-sizing: border-box;
        }

        /* Logo */
        .nb-logo {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          font-size: 1.25rem;
          font-weight: 700;
          text-decoration: none;
          color: inherit;
          flex-shrink: 0;
        }
        .nb-logo-icon {
          width: 2rem; height: 2rem;
          background: #000;
          color: #fff;
          display: flex;
          align-items: center;
          justify-content: center;
          border-radius: 0.25rem;
          font-weight: 700;
        }
        .nb-logo-text { white-space: nowrap; }

        /* Buscador */
        .nb-search-wrap {
          flex: 1;
          position: relative;
          min-width: 0;
        }
        .nb-search-input {
          width: 100%;
          border: 1px solid #d1d5db;
          border-radius: 0.375rem;
          padding: 0.5rem 2.5rem 0.5rem 1rem;
          font-size: 0.875rem;
          outline: none;
          box-sizing: border-box;
          transition: border-color 0.15s, box-shadow 0.15s;
        }
        .nb-search-input:focus {
          border-color: #000;
          box-shadow: 0 0 0 2px rgba(0,0,0,0.1);
        }
        .nb-search-icon-wrap {
          position: absolute;
          inset-y: 0;
          right: 0.5rem;
          display: flex;
          align-items: center;
        }
        .nb-search-btn {
          background: none;
          border: none;
          cursor: pointer;
          padding: 0.375rem;
          border-radius: 50%;
          color: #4b5563;
          font-size: 0.875rem;
        }
        .nb-search-btn:hover { background: #f3f4f6; }
        .nb-search-results {
          position: absolute;
          left: 0; right: 0;
          top: calc(100% + 4px);
          background: #fff;
          border: 1px solid #e5e7eb;
          border-radius: 0.5rem;
          box-shadow: 0 4px 16px rgba(0,0,0,0.1);
          z-index: 50;
          overflow: hidden;
        }
        .nb-search-msg {
          padding: 0.5rem 1rem;
          font-size: 0.875rem;
          color: #6b7280;
        }
        .nb-search-msg--empty { color: #9ca3af; }
        .nb-search-result {
          display: block;
          padding: 0.5rem 1rem;
          font-size: 0.875rem;
          color: #374151;
          text-decoration: none;
          transition: background 0.1s;
        }
        .nb-search-result:hover { background: #f3f4f6; }

        /* Acciones */
        .nb-actions {
          display: flex;
          align-items: center;
          gap: 0.75rem;
          flex-shrink: 0;
        }

        /* Selector idioma */
        .nb-lang-wrap  { position: relative; }
        .nb-btn-lang {
          display: flex;
          align-items: center;
          gap: 0.375rem;
          background: none;
          border: 1px solid #e2e8f0;
          border-radius: 0.625rem;
          padding: 0.4375rem 0.625rem;
          cursor: pointer;
          white-space: nowrap;
        }
        .nb-btn-lang--open { background: #f1f5f9; }
        .nb-lang-label {
          font-size: 0.6875rem;
          font-weight: 700;
          color: #0f172a;
          letter-spacing: 0.05em;
        }
        .nb-drop-lang {
          position: absolute;
          top: calc(100% + 8px);
          right: 0;
          background: #fff;
          border: 1px solid #e2e8f0;
          border-radius: 0.75rem;
          box-shadow: 0 8px 24px rgba(15,23,42,0.10);
          z-index: 999;
          overflow: hidden;
          min-width: 9rem;
        }
        .nb-drop-lang-opt {
          width: 100%;
          display: flex;
          align-items: center;
          gap: 0.625rem;
          padding: 0.625rem 0.875rem;
          background: none;
          border: none;
          border-left: 2px solid transparent;
          cursor: pointer;
          text-align: left;
        }
        .nb-drop-lang-opt--active {
          background: #f8fafc;
          border-left-color: #6366f1;
        }
        .nb-drop-lang-code { font-size: 0.75rem; font-weight: 700; color: #0f172a; }
        .nb-drop-lang-name { font-size: 0.6875rem; color: #94a3b8; }

        /* Auth */
        .nb-auth-btns { display: flex; gap: 0.75rem; align-items: center; }
        .nb-btn-login {
          background: none;
          border: none;
          cursor: pointer;
          font-size: 0.875rem;
          font-weight: 500;
          text-decoration: underline;
          text-underline-offset: 2px;
          white-space: nowrap;
        }
        .nb-btn-register {
          background: #000;
          color: #fff;
          border: none;
          padding: 0.5rem 1rem;
          border-radius: 0.375rem;
          font-size: 0.875rem;
          cursor: pointer;
          white-space: nowrap;
          transition: background 0.15s;
        }
        .nb-btn-register:hover { background: #1f2937; }

        /* Usuario */
        .nb-user-wrap { position: relative; }
        .nb-btn-user {
          background: none;
          border: 1px solid #e2e8f0;
          border-radius: 0.625rem;
          padding: 0.5rem 0.75rem;
          cursor: pointer;
          display: flex;
          align-items: center;
          gap: 0.5rem;
        }
        .nb-btn-user--open { background: #f1f5f9; }
        .nb-btn-user-name  { font-size: 0.8125rem; font-weight: 700; }
        .nb-drop-user {
          position: absolute;
          top: calc(100% + 10px);
          right: 0;
          width: 15rem;
          background: #fff;
          border-radius: 1rem;
          border: 1px solid #e2e8f0;
          box-shadow: 0 8px 32px rgba(15,23,42,0.12);
          z-index: 999;
          overflow: hidden;
          padding: 0.5rem 0;
        }
        .nb-drop-user-info {
          padding: 0.75rem 1.125rem;
          background: #f8fafc;
          margin-bottom: 0.5rem;
          border-bottom: 1px solid #f1f5f9;
        }
        .nb-drop-user-name  { margin: 0; font-size: 0.8125rem; font-weight: 700; color: #0f172a; }
        .nb-drop-user-email { margin: 0; font-size: 0.6875rem; color: #64748b; }
        .nb-drop-link {
          display: flex;
          align-items: center;
          gap: 8px;
          padding: 0.625rem 1.125rem;
          text-decoration: none;
          color: #334155;
          font-size: 0.8125rem;
          font-weight: 500;
          transition: background 0.1s;
        }
        .nb-drop-link:hover { background: #f8fafc; }
        .nb-drop-user-sep {
          border-top: 1px solid #f1f5f9;
          margin-top: 0.5rem;
          padding-top: 0.5rem;
        }
        .nb-btn-logout {
          width: 100%;
          display: flex;
          align-items: center;
          gap: 8px;
          padding: 0.625rem 1.125rem;
          background: none;
          border: none;
          color: #ef4444;
          font-size: 0.8125rem;
          cursor: pointer;
          font-weight: 600;
        }

        /* Carrito */
        .nb-cart-wrap { position: relative; }
        .nb-btn-cart {
          position: relative;
          background: none;
          border: 1px solid #e2e8f0;
          border-radius: 0.625rem;
          padding: 0.5rem 0.625rem;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
        }
        .nb-btn-cart--open { background: #f1f5f9; }
        .nb-cart-badge {
          position: absolute;
          top: -6px; right: -6px;
          background: linear-gradient(135deg, #6366f1, #4f46e5);
          color: #fff;
          font-size: 0.625rem;
          font-weight: 700;
          width: 1.125rem; height: 1.125rem;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          border: 2px solid #fff;
        }
        .nb-drop-cart {
          position: absolute;
          top: calc(100% + 10px);
          right: 0;
          width: 22.5rem;
          background: #fff;
          border-radius: 1rem;
          border: 1px solid #e2e8f0;
          box-shadow: 0 8px 32px rgba(15,23,42,0.12);
          z-index: 999;
          overflow: hidden;
        }
        .nb-drop-cart-head {
          padding: 0.875rem 1.125rem;
          border-bottom: 1px solid #f1f5f9;
          display: flex;
          justify-content: space-between;
          align-items: center;
        }
        .nb-drop-cart-title { font-weight: 700; font-size: 0.875rem; color: #0f172a; }
        .nb-drop-cart-count { color: #6366f1; }
        .nb-drop-close {
          background: none; border: none; cursor: pointer;
          color: #94a3b8; font-size: 1.125rem; line-height: 1;
        }
        .nb-drop-cart-list  { max-height: 22rem; overflow-y: auto; padding: 0.5rem 0; }
        .nb-drop-cart-loading {
          text-align: center; padding: 2rem;
          color: #94a3b8; font-size: 0.8125rem;
        }
        .nb-drop-cart-empty { text-align: center; padding: 2rem 1.25rem; }
        .nb-drop-cart-empty-icon { font-size: 2.25rem; margin-bottom: 0.5rem; }
        .nb-drop-cart-empty-text { margin: 0; font-size: 0.8125rem; color: #64748b; }
        .nb-drop-cart-item {
          display: flex; align-items: center; gap: 0.75rem;
          padding: 0.75rem 1.125rem;
          border-bottom: 1px solid #f8fafc;
        }
        .nb-drop-cart-img {
          width: 3rem; height: 3rem;
          border-radius: 0.5rem;
          background: #f1f5f9;
          display: flex; align-items: center; justify-content: center;
          flex-shrink: 0; overflow: hidden;
        }
        .nb-drop-cart-img-inner { width: 80%; height: 80%; object-fit: contain; }
        .nb-drop-cart-info  { flex: 1; min-width: 0; }
        .nb-drop-cart-name  {
          margin: 0; font-size: 0.8125rem; font-weight: 700; color: #0f172a;
          white-space: nowrap; overflow: hidden; text-overflow: ellipsis;
        }
        .nb-drop-cart-price { margin: 0; font-size: 0.75rem; color: #4f46e5; font-weight: 600; }
        .nb-drop-cart-qty   { color: #94a3b8; font-weight: 400; }
        .nb-drop-cart-remove {
          background: #fee2e2; border: none; cursor: pointer;
          color: #ef4444; width: 1.5rem; height: 1.5rem;
          border-radius: 50%; display: flex; align-items: center;
          justify-content: center; font-size: 0.875rem; flex-shrink: 0;
          transition: background 0.15s;
        }
        .nb-drop-cart-remove:hover { background: #fecaca; }
        .nb-drop-cart-foot {
          padding: 0.875rem 1.125rem;
          border-top: 1px solid #f1f5f9;
          background: #fafafa;
        }
        .nb-drop-cart-total {
          display: flex; justify-content: space-between;
          align-items: center; margin-bottom: 0.75rem;
        }
        .nb-drop-cart-total-label { font-size: 0.75rem; color: #64748b; }
        .nb-drop-cart-total-val   { font-size: 1rem; font-weight: 800; color: #4f46e5; }
        .nb-btn-go-cart {
          width: 100%; padding: 0.6875rem;
          background: #0f172a;
          color: #fff; border: none; border-radius: 0.625rem;
          font-size: 0.84375rem; font-weight: 700; cursor: pointer;
          transition: opacity 0.15s;
        }
        .nb-btn-go-cart:hover { opacity: 0.8; }

        /* Banderas */
        .nb-bandera { border-radius: 2px; display: block; flex-shrink: 0; }

        /* Barra marcas */
        .nb-brands-bar {
          background: #fff;
          border-top: 1px solid #f3f4f6;
          padding: 0.5rem 1.5rem;
          display: flex;
          align-items: center;
          gap: 0.5rem;
        }
        .nb-contact-link {
          font-size: 0.875rem;
          font-weight: 500;
          color: #000;
          text-decoration: underline;
          text-underline-offset: 2px;
          flex-shrink: 0;
          margin-right: 0.5rem;
          white-space: nowrap;
          transition: opacity 0.15s;
        }
        .nb-contact-link:hover { opacity: 0.7; }
        .nb-brands-list {
          flex: 1;
          display: flex;
          justify-content: center;
          gap: 0.5rem;
          flex-wrap: wrap;
        }
        .nb-brand-btn {
          padding: 0.375rem 1.25rem;
          border-radius: 9999px;
          border: 1px solid #e5e7eb;
          background: none;
          font-size: 0.875rem;
          font-weight: 500;
          color: #4b5563;
          cursor: pointer;
          white-space: nowrap;
          transition: background 0.15s, color 0.15s;
        }
        .nb-brand-btn:hover { background: #f3f4f6; color: #111827; }

        /* Responsive */

        /* Tablet (≤768px): ocultar textos no esenciales */
        @media (max-width: 768px) {
          .nb-bar-inner     { gap: 0.75rem; padding: 0.75rem 1rem; }
          .nb-logo-text     { display: none; }
          .nb-btn-user-name { display: none; }
          .nb-lang-label    { display: none; }
          .nb-brands-bar    { padding: 0.5rem 1rem; overflow-x: auto; flex-wrap: nowrap; }
          .nb-brands-list   { flex-wrap: nowrap; justify-content: flex-start; }
          .nb-drop-cart     { width: min(22.5rem, 92vw); right: -0.5rem; }
          .nb-drop-user     { right: -0.5rem; }
        }

        /* Móvil (≤540px): quitar lupa, comprimir buscador */
        @media (max-width: 540px) {
          .nb-bar-inner        { gap: 0.5rem; padding: 0.625rem 0.875rem; }
          .nb-search-icon-wrap { display: none; }
          .nb-search-input     { padding: 0.4rem 0.75rem; font-size: 0.8rem; }
          .nb-actions          { gap: 0.375rem; }
          .nb-brand-btn        { padding: 0.3rem 0.875rem; font-size: 0.8rem; }
          .nb-contact-link     { font-size: 0.8rem; }
        }

        /* iPhone 12 / móvil estándar (≤430px): todo comprimido */
        @media (max-width: 430px) {
          .nb-bar-inner    { gap: 0.25rem; padding: 0.5rem 0.625rem; }
          .nb-logo-icon    { width: 1.75rem; height: 1.75rem; font-size: 0.875rem; }
          .nb-search-input { padding: 0.35rem 0.6rem; font-size: 0.76rem; }
          .nb-actions      { gap: 0.2rem; }
          .nb-btn-lang     { padding: 0.35rem 0.4rem; gap: 0.2rem; }
          .nb-btn-login    { font-size: 0.72rem; }
          .nb-btn-register { padding: 0.35rem 0.5rem; font-size: 0.72rem; }
          .nb-btn-cart     { padding: 0.35rem 0.4rem; }
          .nb-btn-user     { padding: 0.35rem 0.45rem; gap: 0.2rem; }
          .nb-brand-btn    { padding: 0.25rem 0.625rem; font-size: 0.75rem; }
          .nb-contact-link { font-size: 0.75rem; }
          .nb-brands-bar   { padding: 0.35rem 0.625rem; }
          .nb-drop-cart    { width: calc(100vw - 0.75rem); right: -0.25rem; }
          .nb-drop-user    { right: -0.25rem; }
        }

        /* Muy pequeño (≤360px): ocultar login, mantener register */
        @media (max-width: 360px) {
          .nb-bar-inner    { gap: 0.15rem; padding: 0.5rem; }
          .nb-logo-icon    { width: 1.5rem; height: 1.5rem; font-size: 0.75rem; }
          .nb-btn-login    { display: none; }
          .nb-btn-register { padding: 0.3rem 0.45rem; font-size: 0.68rem; }
          .nb-drop-cart    { width: calc(100vw - 0.5rem); right: -0.125rem; }
        }

      `}</style>

    </header>
  )
}
