import { useState, useEffect, useRef } from "react"
import { useAuth } from "../../auth/AuthContext"
import { useNavigate, Link } from "react-router-dom"
import { searchProducts } from "../../services/searchService"

const API = "http://127.0.0.1:8000"

const apiFetch = (path, opts = {}) =>
  fetch(`${API}/api${path}`, {
    credentials: "include",
    headers: { "Content-Type": "application/json", Accept: "application/json" },
    ...opts,
  }).then((r) => r.json())

const fmt = (n) =>
  new Intl.NumberFormat("es-ES", { style: "currency", currency: "EUR" }).format(n)

function CartDropdown({ onClose }) {
  const [items, setItems]     = useState([])
  const [loading, setLoading] = useState(true)
  const navigate              = useNavigate()

  useEffect(() => {
    apiFetch("/carrito")
      .then((data) => setItems(data.items ?? []))
      .catch(() => setItems([]))
      .finally(() => setLoading(false))
  }, [])

  const handleRemove = async (movilId) => {
    await apiFetch(`/carrito/${movilId}`, { method: "DELETE" })
    const data = await apiFetch("/carrito")
    setItems(data.items ?? [])
  }

  const subtotal = items.reduce((s, i) => s + i.subtotal, 0)
  const total    = subtotal * 1.21

  return (
    <div style={{
      position: "absolute", top: "calc(100% + 10px)", right: 0,
      width: 360, background: "#fff", borderRadius: 16,
      border: "1px solid #e2e8f0", boxShadow: "0 8px 32px rgba(15,23,42,.12)",
      zIndex: 999, overflow: "hidden",
    }}>
      <div style={{ padding: "14px 18px", borderBottom: "1px solid #f1f5f9", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <span style={{ fontWeight: 700, fontSize: 14, color: "#0f172a" }}>
          🛒 Carrito {items.length > 0 && <span style={{ color: "#6366f1" }}>({items.reduce((s,i) => s+i.cantidad, 0)})</span>}
        </span>
        <button onClick={onClose} style={{ background: "none", border: "none", cursor: "pointer", color: "#94a3b8", fontSize: 18 }}>×</button>
      </div>

      <div style={{ maxHeight: 280, overflowY: "auto", padding: "8px 0" }}>
        {loading ? (
          <div style={{ textAlign: "center", padding: 32, color: "#94a3b8", fontSize: 13 }}>Cargando…</div>
        ) : items.length === 0 ? (
          <div style={{ textAlign: "center", padding: "32px 20px" }}>
            <div style={{ fontSize: 36, marginBottom: 8 }}>🛒</div>
            <p style={{ margin: 0, fontSize: 13, color: "#64748b" }}>Tu carrito está vacío</p>
          </div>
        ) : (
          items.map((item) => (
            <div key={item.movil_id} style={{ display: "flex", alignItems: "center", gap: 10, padding: "10px 18px", borderBottom: "1px solid #f8fafc" }}>
              <div style={{ width: 36, height: 36, borderRadius: 10, background: `${item.color_hex}22`, border: `2px solid ${item.color_hex}55`, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                <div style={{ width: 10, height: 10, borderRadius: "50%", background: item.color_hex }}/>
              </div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <p style={{ margin: 0, fontSize: 13, fontWeight: 600, color: "#0f172a", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                  {item.marca} {item.modelo}
                </p>
                <p style={{ margin: 0, fontSize: 11, color: "#94a3b8" }}>{item.almacenamiento}GB · x{item.cantidad}</p>
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: 8, flexShrink: 0 }}>
                <span style={{ fontSize: 13, fontWeight: 700, color: "#0f172a" }}>{fmt(item.subtotal)}</span>
                <button onClick={() => handleRemove(item.movil_id)}
                  style={{ background: "none", border: "none", cursor: "pointer", color: "#cbd5e1", lineHeight: 1, padding: 2 }}
                  onMouseEnter={(e) => e.currentTarget.style.color = "#ef4444"}
                  onMouseLeave={(e) => e.currentTarget.style.color = "#cbd5e1"}>
                  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                    <path d="M18 6L6 18M6 6l12 12"/>
                  </svg>
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      {items.length > 0 && (
        <div style={{ padding: "14px 18px", borderTop: "1px solid #f1f5f9", background: "#fafafa" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
            <span style={{ fontSize: 12, color: "#64748b" }}>Total (IVA inc.)</span>
            <span style={{ fontSize: 16, fontWeight: 800, color: "#4f46e5" }}>{fmt(total)}</span>
          </div>
          <button
            onClick={() => { onClose(); navigate("/carrito") }}
            style={{ width: "100%", padding: "11px", background: "linear-gradient(135deg,#6366f1,#4f46e5)", color: "#fff", border: "none", borderRadius: 10, fontSize: 13.5, fontWeight: 700, cursor: "pointer" }}>
            Ir al carrito →
          </button>
        </div>
      )}
    </div>
  )
}

export default function Navbar() {
  const { user, isAuthenticated, logout, loading } = useAuth()
  const navigate = useNavigate()

  // ── Buscador ──
  const [query,         setQuery]         = useState("")
  const [results,       setResults]       = useState([])
  const [searchOpen,    setSearchOpen]    = useState(false)
  const [loadingSearch, setLoadingSearch] = useState(false)

  // ── Carrito ──
  const [cartOpen,  setCartOpen]  = useState(false)
  const [cartCount, setCartCount] = useState(0)
  const cartRef = useRef(null)

  // Buscador con debounce
  useEffect(() => {
    if (query.length < 2) {
      setResults([])
      setSearchOpen(false)
      return
    }
    const timeout = setTimeout(async () => {
      setLoadingSearch(true)
      try {
        const data = await searchProducts(query)
        setResults(data)
        setSearchOpen(true)
      } catch {
        setResults([])
        setSearchOpen(true)
      } finally {
        setLoadingSearch(false)
      }
    }, 300)
    return () => clearTimeout(timeout)
  }, [query])

  // Contador del carrito al montar
  useEffect(() => {
    apiFetch("/carrito")
      .then((data) => setCartCount(data.total_items ?? 0))
      .catch(() => {})
  }, [])

  // Cerrar carrito al click fuera
  useEffect(() => {
    const handler = (e) => {
      if (cartRef.current && !cartRef.current.contains(e.target)) {
        setCartOpen(false)
      }
    }
    document.addEventListener("mousedown", handler)
    return () => document.removeEventListener("mousedown", handler)
  }, [])

  if (loading) return null

  let buttons
  if (!isAuthenticated) {
    buttons = (
      <div className="flex gap-3">
        <button onClick={() => navigate("/login")} className="text-sm font-medium hover:underline">Iniciar sessió</button>
        <button onClick={() => navigate("/register")} className="bg-black text-white px-4 py-2 rounded text-sm">Registre</button>
      </div>
    )
  } else {
    buttons = (
      <div className="flex items-center gap-4">
        <span className="text-sm">Hola, <strong>{user?.name}</strong></span>
        {user?.role === "admin" && (
          <button onClick={() => navigate("/admin")} className="text-sm font-medium hover:underline">
            Admin - <strong>{user.name}</strong>
          </button>
        )}
        <button onClick={logout} className="text-sm font-medium text-red-600 hover:underline">Tancar sessió</button>
      </div>
    )
  }

  return (
    <header className="border-b">
      <div className="bg-white w-full flex items-center justify-between">
        <div className="px-6 py-4 flex items-center gap-6 w-full">

          {/* Logo */}
          <div className="flex items-center gap-2 text-xl font-bold shrink-0">
            <div className="w-8 h-8 bg-black text-white flex items-center justify-center rounded">R</div>
            <span>ReTech</span>
          </div>

          {/* Buscador con autocompletado */}
          <div className="flex-1">
            <div className="relative">
              <input
                type="text"
                placeholder="Cerca productes..."
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                className="w-full rounded border-gray-300 pe-10 shadow-sm sm:text-sm"
              />
              <span className="absolute inset-y-0 right-2 grid w-8 place-content-center">
                  <button
                      type="button"
                      aria-label="Buscar"
                      className="rounded-full p-1.5 text-gray-600 hover:bg-gray-100"
                      onClick={() => {
                        if (query.trim()) navigate(`/search?q=${encodeURIComponent(query.trim())}`)
                      }}
                    >
                    🔍
                  </button>             
              </span>

              {/* Dropdown resultados búsqueda */}
              {searchOpen && (
                <div className="absolute left-0 right-0 bg-white border mt-1 rounded shadow-lg z-50 text-sm">
                  {loadingSearch && (
                    <div className="px-4 py-2 text-gray-500">Buscando...</div>
                  )}
                  {!loadingSearch && results.length === 0 && (
                    <div className="px-4 py-2 text-gray-400">No s'han trobat coincidències</div>
                  )}
                  {!loadingSearch && results.map((item) => (
                    <Link
                      key={item.id}
                      to={`/models/${item.id}`}
                      onClick={() => { setSearchOpen(false); setQuery("") }}
                      className="px-4 py-2 hover:bg-gray-100 block"
                    >
                      {item.nombre}
                    </Link>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Botones + carrito */}
          <div className="flex items-center gap-4 shrink-0">
            {buttons}

            {/* Icono carrito */}
            <div ref={cartRef} style={{ position: "relative" }}>
              <button onClick={() => setCartOpen((v) => !v)}
                style={{ position: "relative", background: cartOpen ? "#f1f5f9" : "none", border: "1px solid #e2e8f0", borderRadius: 10, padding: "8px 10px", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" }}>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#0f172a" strokeWidth="2">
                  <path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z"/>
                  <line x1="3" y1="6" x2="21" y2="6"/>
                  <path d="M16 10a4 4 0 01-8 0"/>
                </svg>
                {cartCount > 0 && (
                  <span style={{ position: "absolute", top: -6, right: -6, background: "linear-gradient(135deg,#6366f1,#4f46e5)", color: "#fff", fontSize: 10, fontWeight: 700, width: 18, height: 18, borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", border: "2px solid #fff" }}>
                    {cartCount > 9 ? "9+" : cartCount}
                  </span>
                )}
              </button>
              {cartOpen && <CartDropdown onClose={() => setCartOpen(false)}/>}
            </div>
          </div>

        </div>
      </div>

      <nav className="bg-gray-100 w-full">
        <div className="px-6">
          <ul className="flex gap-6 py-3 text-sm font-medium">
            <li><Link to="/">Inici</Link></li>
            <li><Link to="/mobils">Mòbils</Link></li>
            <li><Link to="/tablets">Tablets</Link></li>
            <li><Link to="/accessoris">Accessoris</Link></li>
          </ul>
        </div>
      </nav>
    </header>
  )
}