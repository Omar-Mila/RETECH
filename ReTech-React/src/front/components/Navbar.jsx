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

  if (idiom === "ca") {
    return (
      <svg width={w} height={h} viewBox="0 0 3 2" className="bandera">
        <rect width="3" height="2" fill="#FCDD09"/>
        <rect y={2/9}   width="3" height={2/9} fill="#DA121A"/>
        <rect y={6/9}   width="3" height={2/9} fill="#DA121A"/>
        <rect y={10/9}  width="3" height={2/9} fill="#DA121A"/>
        <rect y={14/9}  width="3" height={2/9} fill="#DA121A"/>
      </svg>
    )
  }

  if (idiom === "es") {
    return (
      <svg width={w} height={h} viewBox="0 0 3 2" className="bandera">
        <rect width="3" height="2" fill="#c60b1e"/>
        <rect y="0.5" width="3" height="1" fill="#ffc400"/>
      </svg>
    )
  }

  return (
    <svg width={w} height={h} viewBox="0 0 60 30" className="bandera">
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
  { code: "ca", label: "CA", name: "Català" },
  { code: "es", label: "ES", name: "Castellano" },
  { code: "en", label: "ENG", name: "English" },
]

function DropdownCarro({ alCerrar, t }) {
  const [arts, fijarArts] = useState([])
  const [cargando, fijarCargando] = useState(true)
  const navegar = useNavigate()
  const { isAuthenticated } = useAutenticacion()

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
    } catch {
      fijarArts([])
    } finally {
      fijarCargando(false)
    }
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
    <div id="drop-carro">
      <div className="drop-carro-cab">
        <span className="drop-carro-titulo">
          🛒 {t('nav.cart')} {arts.length > 0 && <span className="drop-carro-num">({arts.reduce((s, art) => s + art.cantidad, 0)})</span>}
        </span>
        <button onClick={alCerrar} className="btn-cerrar-drop">×</button>
      </div>

      <div className="drop-carro-lista">
        {cargando ? (
          <div className="drop-carro-cargando">{t('nav.cartLoading')}</div>
        ) : arts.length === 0 ? (
          <div className="drop-carro-vacio">
            <div className="drop-carro-icono-vacio">🛒</div>
            <p className="drop-carro-texto-vacio">{t('nav.cartEmpty')}</p>
          </div>
        ) : (
          arts.map((art) => (
            <div key={art.movil_id} className="drop-carro-item">
              <div className="drop-carro-img">
                <img
                  src={art.imagen_url || `https://via.placeholder.com/48?text=Phone`}
                  className="drop-carro-img-inner"
                  alt="movil"
                />
              </div>
              <div className="drop-carro-info">
                <p className="drop-carro-nombre">{art.modelo}</p>
                <p className="drop-carro-precio">
                  {fmtPrecio(art.precio)} <span className="drop-carro-qty">x{art.cantidad}</span>
                </p>
              </div>
              <button onClick={() => quitarArt(art.movil_id)} className="btn-quitar-drop">×</button>
            </div>
          ))
        )}
      </div>

      {arts.length > 0 && (
        <div className="drop-carro-pie">
          <div className="drop-carro-total">
            <span className="drop-carro-total-etiq">{t('nav.cartTotal')}</span>
            <span className="drop-carro-total-val">{fmtPrecio(totalCarro)}</span>
          </div>
          <button
            onClick={() => { alCerrar(); navegar("/carrito") }}
            className="btn-ir-carro"
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
    <div id="drop-user">
      <div className="drop-user-info">
        <p className="drop-user-nombre">{user?.name}</p>
        <p className="drop-user-email">{user?.email}</p>
      </div>
      <Link to="/perfil" onClick={alCerrar} className="dropdown-link">👤 {t('nav.myProfile')}</Link>
      <Link to="/mis-pedidos" onClick={alCerrar} className="dropdown-link">📦 {t('nav.myOrders')}</Link>
      <div className="drop-user-sep">
        <button onClick={() => { logout(); alCerrar(); }} className="btn-logout">
          🚪 {t('nav.logout')}
        </button>
      </div>
    </div>
  )
}

export default function Navbar() {
  const { user, isAuthenticated, logout, loading } = useAutenticacion()
  const { idioma, fijarIdioma, t } = useIdioma()
  const navegar = useNavigate()
  const ubicacion = useLocation()

  const [busqueda, fijarBusqueda] = useState("")
  const [resultados, fijarResultados] = useState([])
  const [busquedaAbierta, fijarBusquedaAbierta] = useState(false)
  const [cargandoBusqueda, fijarCargandoBusqueda] = useState(false)

  const [carroAbierto, fijarCarroAbierto] = useState(false)
  const [usuarioAbierto, fijarUsuarioAbierto] = useState(false)
  const [idiomaAbierto, fijarIdiomaAbierto] = useState(false)
  const [cantidadCarro, fijarCantidadCarro] = useState(0)
  const refCarro = useRef(null)
  const refUsuario = useRef(null)
  const refIdioma = useRef(null)
  const refBusqueda = useRef(null)

  useEffect(() => {
    if (busqueda.length < 2) { fijarResultados([]); fijarBusquedaAbierta(false); return; }
    const temporizador = setTimeout(async () => {
      fijarCargandoBusqueda(true)
      try {
        const datos = await buscarProductos(busqueda)
        fijarResultados(datos); fijarBusquedaAbierta(true)
      } catch { fijarResultados([]); fijarBusquedaAbierta(true) }
      finally { fijarCargandoBusqueda(false) }
    }, 300)
    return () => clearTimeout(temporizador)
  }, [busqueda])

  useEffect(() => {
    const obtenerCantidad = () => {
      if (!isAuthenticated) {
        const arts = obtenerCarritoInvitado()
        fijarCantidadCarro(arts.reduce((s, art) => s + art.cantidad, 0))
        return
      }
      llamarApi("/carrito")
        .then((datos) => fijarCantidadCarro(datos.total_items ?? 0))
        .catch(() => fijarCantidadCarro(0))
    }
    window.addEventListener("cart-updated", obtenerCantidad)
    obtenerCantidad()
    return () => window.removeEventListener("cart-updated", obtenerCantidad)
  }, [isAuthenticated])

  useEffect(() => {
    const manejador = (e) => {
      if (refCarro.current && !refCarro.current.contains(e.target)) fijarCarroAbierto(false)
      if (refUsuario.current && !refUsuario.current.contains(e.target)) fijarUsuarioAbierto(false)
      if (refIdioma.current && !refIdioma.current.contains(e.target)) fijarIdiomaAbierto(false)
      if (refBusqueda.current && !refBusqueda.current.contains(e.target)) fijarBusquedaAbierta(false)
    }
    document.addEventListener("mousedown", manejador)
    return () => document.removeEventListener("mousedown", manejador)
  }, [])

  if (loading) return null

  return (
    <header className="border-b">
      <style>{`
        /* Banderas */
        .bandera {
          border-radius: 2px;
          display: block;
          flex-shrink: 0;
        }

        /* Logo */
        .logo-link { text-decoration: none; color: inherit; }

        /* Selector de idioma */
        .rel-lang { position: relative; }
        .btn-lang {
          display: flex;
          align-items: center;
          gap: 6px;
          background: none;
          border: 1px solid #e2e8f0;
          border-radius: 10px;
          padding: 7px 10px;
          cursor: pointer;
        }
        .btn-lang.abierto { background: #f1f5f9; }
        .lang-etiqueta {
          font-size: 11px;
          font-weight: 700;
          color: #0f172a;
          letter-spacing: 0.05em;
        }
        .drop-lang {
          position: absolute;
          top: calc(100% + 8px);
          right: 0;
          background: #fff;
          border: 1px solid #e2e8f0;
          border-radius: 12px;
          box-shadow: 0 8px 24px rgba(15, 23, 42, .10);
          z-index: 999;
          overflow: hidden;
          min-width: 140px;
        }
        .opc-lang {
          width: 100%;
          display: flex;
          align-items: center;
          gap: 10px;
          padding: 10px 14px;
          background: none;
          border: none;
          border-left: 2px solid transparent;
          cursor: pointer;
          text-align: left;
        }
        .opc-lang.activa {
          background: #f8fafc;
          border-left-color: #6366f1;
        }
        .opc-lang-etiq {
          font-size: 12px;
          font-weight: 700;
          color: #0f172a;
        }
        .opc-lang-nombre {
          font-size: 11px;
          color: #94a3b8;
        }

        /* Botón usuario */
        .rel-user { position: relative; }
        .btn-user {
          background: none;
          border: 1px solid #e2e8f0;
          border-radius: 10px;
          padding: 8px 12px;
          cursor: pointer;
          display: flex;
          align-items: center;
          gap: 8px;
        }
        .btn-user.abierto { background: #f1f5f9; }
        .btn-user-nombre {
          font-size: 13px;
          font-weight: 700;
        }

        /* Desplegable usuario */
        #drop-user {
          position: absolute;
          top: calc(100% + 10px);
          right: 0;
          width: 240px;
          background: #fff;
          border-radius: 16px;
          border: 1px solid #e2e8f0;
          box-shadow: 0 8px 32px rgba(15, 23, 42, .12);
          z-index: 999;
          overflow: hidden;
          padding: 8px 0;
        }
        .drop-user-info {
          padding: 12px 18px;
          background: #f8fafc;
          margin-bottom: 8px;
          border-bottom: 1px solid #f1f5f9;
        }
        .drop-user-nombre {
          margin: 0;
          font-size: 13px;
          font-weight: 700;
          color: #0f172a;
        }
        .drop-user-email {
          margin: 0;
          font-size: 11px;
          color: #64748b;
        }
        .drop-user-sep {
          border-top: 1px solid #f1f5f9;
          margin-top: 8px;
          padding-top: 8px;
        }
        .btn-logout {
          width: 100%;
          text-align: left;
          padding: 10px 18px;
          background: none;
          border: none;
          color: #ef4444;
          font-size: 13px;
          cursor: pointer;
          font-weight: 600;
        }

        /* Botón carrito */
        .rel-carro { position: relative; }
        .btn-carro-nav {
          position: relative;
          background: none;
          border: 1px solid #e2e8f0;
          border-radius: 10px;
          padding: 8px 10px;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
        }
        .btn-carro-nav.abierto { background: #f1f5f9; }
        .carro-badge {
          position: absolute;
          top: -6px;
          right: -6px;
          background: linear-gradient(135deg, #6366f1, #4f46e5);
          color: #fff;
          font-size: 10px;
          font-weight: 700;
          width: 18px;
          height: 18px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          border: 2px solid #fff;
        }

        /* Desplegable carrito */
        #drop-carro {
          position: absolute;
          top: calc(100% + 10px);
          right: 0;
          width: 360px;
          background: #fff;
          border-radius: 16px;
          border: 1px solid #e2e8f0;
          box-shadow: 0 8px 32px rgba(15, 23, 42, .12);
          z-index: 999;
          overflow: hidden;
        }
        .drop-carro-cab {
          padding: 14px 18px;
          border-bottom: 1px solid #f1f5f9;
          display: flex;
          justify-content: space-between;
          align-items: center;
        }
        .drop-carro-titulo {
          font-weight: 700;
          font-size: 14px;
          color: #0f172a;
        }
        .drop-carro-num { color: #6366f1; }
        .btn-cerrar-drop {
          background: none;
          border: none;
          cursor: pointer;
          color: #94a3b8;
          font-size: 18px;
        }
        .drop-carro-lista {
          max-height: 350px;
          overflow-y: auto;
          padding: 8px 0;
        }
        .drop-carro-cargando {
          text-align: center;
          padding: 32px;
          color: #94a3b8;
          font-size: 13px;
        }
        .drop-carro-vacio {
          text-align: center;
          padding: 32px 20px;
        }
        .drop-carro-icono-vacio {
          font-size: 36px;
          margin-bottom: 8px;
        }
        .drop-carro-texto-vacio {
          margin: 0;
          font-size: 13px;
          color: #64748b;
        }
        .drop-carro-item {
          display: flex;
          align-items: center;
          gap: 12px;
          padding: 12px 18px;
          border-bottom: 1px solid #f8fafc;
        }
        .drop-carro-img {
          width: 48px;
          height: 48px;
          border-radius: 8px;
          background: #f1f5f9;
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
          overflow: hidden;
        }
        .drop-carro-img-inner {
          width: 80%;
          height: 80%;
          object-fit: contain;
        }
        .drop-carro-info {
          flex: 1;
          min-width: 0;
        }
        .drop-carro-nombre {
          margin: 0;
          font-size: 13px;
          font-weight: 700;
          color: #0f172a;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }
        .drop-carro-precio {
          margin: 0;
          font-size: 12px;
          color: #4f46e5;
          font-weight: 600;
        }
        .drop-carro-qty {
          color: #94a3b8;
          font-weight: 400;
        }
        .btn-quitar-drop {
          background: #fee2e2;
          border: none;
          cursor: pointer;
          color: #ef4444;
          width: 24px;
          height: 24px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 14px;
        }
        .drop-carro-pie {
          padding: 14px 18px;
          border-top: 1px solid #f1f5f9;
          background: #fafafa;
        }
        .drop-carro-total {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 12px;
        }
        .drop-carro-total-etiq {
          font-size: 12px;
          color: #64748b;
        }
        .drop-carro-total-val {
          font-size: 16px;
          font-weight: 800;
          color: #4f46e5;
        }
        .btn-ir-carro {
          width: 100%;
          padding: 11px;
          background: linear-gradient(135deg, #6366f1, #4f46e5);
          color: #fff;
          border: none;
          border-radius: 10px;
          font-size: 13.5px;
          font-weight: 700;
          cursor: pointer;
        }

        /* Links del desplegable */
        .dropdown-link {
          display: block;
          padding: 10px 18px;
          text-decoration: none;
          color: #334155;
          font-size: 13px;
          font-weight: 500;
        }
        .dropdown-link:hover {
          background-color: #f8fafc;
        }
      `}</style>

      <div className="bg-white w-full flex items-center justify-between">
        <div className="px-6 py-4 flex items-center gap-6 w-full">

          {/* Logo */}
          <Link to="/" className="logo-link flex items-center gap-2 text-xl font-bold shrink-0">
            <div className="w-8 h-8 bg-black text-white flex items-center justify-center rounded">R</div>
            <span>ReTech</span>
          </Link>

          {/* Buscador */}
          <div className="flex-1">
            <div className="relative" ref={refBusqueda}>
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
                className="w-full rounded border-gray-300 ps-4 py-2 pe-12 shadow-sm sm:text-sm focus:ring-2 focus:black focus:border-black"
              />
              <span className="absolute inset-y-0 right-2 grid w-8 place-content-center">
                <button type="button" className="rounded-full p-1.5 text-gray-600 hover:bg-gray-100"
                  onClick={() => { if (busqueda.trim()) navegar(`/search?q=${encodeURIComponent(busqueda.trim())}`) }}>🔍</button>
              </span>
              {busquedaAbierta && (
                <div className="absolute left-0 right-0 bg-white border mt-1 rounded shadow-lg z-50 text-sm">
                  {cargandoBusqueda ? <div className="px-4 py-2 text-gray-500">{t('nav.searching')}</div> :
                   resultados.length === 0 ? <div className="px-4 py-2 text-gray-400">{t('nav.noResults')}</div> :
                   resultados.map((art) => (
                    <Link key={art.id} to={`/models/${art.modelo_id}`} onClick={() => { fijarBusquedaAbierta(false); fijarBusqueda("") }} className="px-4 py-2 hover:bg-gray-100 block no-underline text-gray-700">
                      {art.nombre}
                    </Link>
                  ))}
                </div>
              )}
            </div>
          </div>

          <div className="flex items-center gap-3 shrink-0">

            {/* Selector de idioma */}
            <div ref={refIdioma} className="rel-lang">
              <button
                onClick={() => fijarIdiomaAbierto((v) => !v)}
                className={`btn-lang${idiomaAbierto ? " abierto" : ""}`}
              >
                <IconoBandera idiom={idioma} size={18} />
                <span className="lang-etiqueta">
                  {OPCIONES_IDIOMA.find(o => o.code === idioma)?.label}
                </span>
                <svg width="10" height="6" viewBox="0 0 10 6" fill="none">
                  <path d="M1 1l4 4 4-4" stroke="#94a3b8" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </button>

              {idiomaAbierto && (
                <div className="drop-lang">
                  {OPCIONES_IDIOMA.map((opc) => (
                    <button
                      key={opc.code}
                      onClick={() => { fijarIdioma(opc.code); fijarIdiomaAbierto(false) }}
                      className={`opc-lang${idioma === opc.code ? " activa" : ""}`}
                    >
                      <IconoBandera idiom={opc.code} size={16} />
                      <span className="opc-lang-etiq">{opc.label}</span>
                      <span className="opc-lang-nombre">{opc.name}</span>
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Login / Usuario */}
            {!isAuthenticated ? (
              <div className="flex gap-3">
                <button onClick={() => navegar("/login", { state: { from: ubicacion.pathname } })} className="text-sm font-medium hover:underline">{t('nav.login')}</button>
                <button onClick={() => navegar("/register")} className="bg-black text-white px-4 py-2 rounded text-sm">{t('nav.register')}</button>
              </div>
            ) : (
              <div ref={refUsuario} className="rel-user">
                <button
                  onClick={() => fijarUsuarioAbierto(!usuarioAbierto)}
                  className={`btn-user${usuarioAbierto ? " abierto" : ""}`}
                >
                  <span className="btn-user-nombre">{user?.name}</span>
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#0f172a" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                    <circle cx="12" cy="7" r="4"></circle>
                  </svg>
                </button>
                {usuarioAbierto && <DropdownUsuario user={user} logout={logout} alCerrar={() => fijarUsuarioAbierto(false)} t={t} />}
              </div>
            )}

            {/* Carrito */}
            <div ref={refCarro} className="rel-carro">
              <button
                onClick={() => fijarCarroAbierto((v) => !v)}
                className={`btn-carro-nav${carroAbierto ? " abierto" : ""}`}
              >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#0f172a" strokeWidth="2">
                  <path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z"/><line x1="3" y1="6" x2="21" y2="6"/><path d="M16 10a4 4 0 01-8 0"/>
                </svg>
                {cantidadCarro > 0 && (
                  <span className="carro-badge">
                    {cantidadCarro > 9 ? "9+" : cantidadCarro}
                  </span>
                )}
              </button>
              {carroAbierto && <DropdownCarro alCerrar={() => fijarCarroAbierto(false)} t={t} />}
            </div>

          </div>
        </div>
      </div>

      {/* Botones de marca */}
      <div className="bg-white border-t border-gray-100 px-6 py-2 flex items-center gap-2">
        <Link to="/contact" className="text-sm font-medium text-black underline underline-offset-2 shrink-0 hover:text-black transition mr-2">
          {t('nav.contact')}
        </Link>
        <div className="flex-1 flex justify-center gap-2">
          {["iPhone", "Samsung", "Xiaomi", "Google"].map((marca) => (
            <button
              key={marca}
              onClick={() => navegar(`/search?q=${marca}`)}
              className="px-5 py-1.5 rounded-full border border-gray-200 text-sm font-medium text-gray-600 hover:bg-gray-100 hover:text-gray-900 transition"
            >
              {marca}
            </button>
          ))}
        </div>
      </div>
    </header>
  )
}
