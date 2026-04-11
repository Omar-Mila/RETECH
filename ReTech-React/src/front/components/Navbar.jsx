import { useState, useEffect, useRef } from "react"
import { useAuth } from "../../auth/AuthContext"
import { useNavigate, Link } from "react-router-dom"
import { searchProducts } from "../../services/searchService"

const API = "http://localhost:8000"

const apiFetch = (path, opts = {}) =>
  fetch(`${API}/api${path}`, {
    credentials: "include",
    headers: { "Content-Type": "application/json", Accept: "application/json" },
    ...opts,
  }).then((r) => r.json())

const fmt = (n) =>
  new Intl.NumberFormat("es-ES", { style: "currency", currency: "EUR" }).format(n)

// --- DROP-DOWN DEL CARRITO (TU DISEÑO ORIGINAL) ---
function CartDropdown({ onClose }) {
  const [items, setItems] = useState([])
  const [loading, setLoading] = useState(true)
  const navigate = useNavigate()

  const loadCartData = () => {
    setLoading(true)
    apiFetch("/carrito")
      .then((data) => { setItems(data.items ?? []) })
      .catch(() => setItems([]))
      .finally(() => setLoading(false))
  }

  useEffect(() => {
    loadCartData()
    window.addEventListener("cart-updated", loadCartData)
    return () => window.removeEventListener("cart-updated", loadCartData)
  }, [])

  const handleRemove = async (movilId) => {
    await apiFetch(`/carrito/${movilId}`, { method: "DELETE" })
    window.dispatchEvent(new Event("cart-updated"))
    loadCartData()
  }

  const total = items.reduce((s, i) => s + (i.subtotal || 0), 0);

  return (
    <div style={{
      position: "absolute", top: "calc(100% + 10px)", right: 0,
      width: 360, background: "#fff", borderRadius: 16,
      border: "1px solid #e2e8f0", boxShadow: "0 8px 32px rgba(15,23,42,.12)",
      zIndex: 999, overflow: "hidden",
    }}>
      <div style={{ padding: "14px 18px", borderBottom: "1px solid #f1f5f9", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <span style={{ fontWeight: 700, fontSize: 14, color: "#0f172a" }}>
          🛒 Carrito {items.length > 0 && <span style={{ color: "#6366f1" }}>({items.reduce((s, i) => s + i.cantidad, 0)})</span>}
        </span>
        <button onClick={onClose} style={{ background: "none", border: "none", cursor: "pointer", color: "#94a3b8", fontSize: 18 }}>×</button>
      </div>

      <div style={{ maxHeight: 350, overflowY: "auto", padding: "8px 0" }}>
        {loading ? (
          <div style={{ textAlign: "center", padding: 32, color: "#94a3b8", fontSize: 13 }}>Cargando…</div>
        ) : items.length === 0 ? (
          <div style={{ textAlign: "center", padding: "32px 20px" }}>
            <div style={{ fontSize: 36, marginBottom: 8 }}>🛒</div>
            <p style={{ margin: 0, fontSize: 13, color: "#64748b" }}>Tu carrito está vacío</p>
          </div>
        ) : (
          items.map((item) => (
            <div key={item.movil_id} style={{ display: "flex", alignItems: "center", gap: 12, padding: "12px 18px", borderBottom: "1px solid #f8fafc" }}>
              <div style={{ width: 48, height: 48, borderRadius: 8, background: "#f1f5f9", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, overflow: 'hidden' }}>
                <img src={item.imagen_url || `https://via.placeholder.com/48?text=Phone`} style={{ width: '80%', height: '80%', objectFit: 'contain' }} alt="movil" />
              </div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <p style={{ margin: 0, fontSize: 13, fontWeight: 700, color: "#0f172a", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{item.marca} {item.modelo}</p>
                <p style={{ margin: 0, fontSize: 12, color: "#4f46e5", fontWeight: 600 }}>{fmt(item.precio)} <span style={{ color: "#94a3b8", fontWeight: 400 }}>x{item.cantidad}</span></p>
              </div>
              <button onClick={() => handleRemove(item.movil_id)} style={{ background: "#fee2e2", border: "none", cursor: "pointer", color: "#ef4444", width: 24, height: 24, borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 14 }}>×</button>
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
          <button onClick={() => { onClose(); navigate("/carrito") }} style={{ width: "100%", padding: "11px", background: "linear-gradient(135deg,#6366f1,#4f46e5)", color: "#fff", border: "none", borderRadius: 10, fontSize: 13.5, fontWeight: 700, cursor: "pointer" }}>
            Ir al carrito →
          </button>
        </div>
      )}
    </div>
  )
}

// --- NUEVO DROP-DOWN DE USUARIO (MISMO ESTILO QUE EL CARRITO) ---
function UserDropdown({ user, logout, onClose }) {
  return (
    <div style={{
      position: "absolute", top: "calc(100% + 10px)", right: 0,
      width: 240, background: "#fff", borderRadius: 16,
      border: "1px solid #e2e8f0", boxShadow: "0 8px 32px rgba(15,23,42,.12)",
      zIndex: 999, overflow: "hidden", padding: "8px 0"
    }}>
      <div style={{ padding: "12px 18px", background: "#f8fafc", marginBottom: 8, borderBottom: "1px solid #f1f5f9" }}>
        <p style={{ margin: 0, fontSize: 13, fontWeight: 700, color: "#0f172a" }}>{user?.name}</p>
        <p style={{ margin: 0, fontSize: 11, color: "#64748b" }}>{user?.email}</p>
      </div>
      <Link to="/perfil" onClick={onClose} className="dropdown-link">👤 Mi perfil</Link>
      <Link to="/mis-pedidos" onClick={onClose} className="dropdown-link">📦 Mis comandes</Link>
      <div style={{ borderTop: "1px solid #f1f5f9", marginTop: 8, paddingTop: 8 }}>
        <button onClick={() => { logout(); onClose(); }} style={{ width: "100%", textAlign: "left", padding: "10px 18px", background: "none", border: "none", color: "#ef4444", fontSize: 13, cursor: "pointer", fontWeight: 600 }}>
          🚪 Tancar sessió
        </button>
      </div>
    </div>
  )
}

export default function Navbar() {
  const { user, isAuthenticated, logout, loading } = useAuth()
  const navigate = useNavigate()

  const [query, setQuery] = useState("")
  const [results, setResults] = useState([])
  const [searchOpen, setSearchOpen] = useState(false)
  const [loadingSearch, setLoadingSearch] = useState(false)

  const [cartOpen, setCartOpen] = useState(false)
  const [userOpen, setUserOpen] = useState(false)
  const [cartCount, setCartCount] = useState(0)
  const cartRef = useRef(null)
  const userRef = useRef(null)
  const searchRef = useRef(null)

  useEffect(() => {
    if (query.length < 2) { setResults([]); setSearchOpen(false); return; }
    const timeout = setTimeout(async () => {
      setLoadingSearch(true)
      try {
        const data = await searchProducts(query)
        setResults(data); setSearchOpen(true)
      } catch { setResults([]); setSearchOpen(true) } 
      finally { setLoadingSearch(false) }
    }, 300)
    return () => clearTimeout(timeout)
  }, [query])

  useEffect(() => {
    const fetchCount = () => {
      apiFetch("/carrito").then((data) => setCartCount(data.total_items ?? 0)).catch(() => setCartCount(0));
    };
    window.addEventListener("cart-updated", fetchCount);
    fetchCount();
    return () => window.removeEventListener("cart-updated", fetchCount);
  }, []);

  useEffect(() => {
    const handler = (e) => {
      if (cartRef.current && !cartRef.current.contains(e.target)) setCartOpen(false)
      if (userRef.current && !userRef.current.contains(e.target)) setUserOpen(false)
      if (searchRef.current && !searchRef.current.contains(e.target)) setSearchOpen(false)
    }
    document.addEventListener("mousedown", handler)
    return () => document.removeEventListener("mousedown", handler)
  }, [])

  if (loading) return null

  return (
    <header className="border-b">
      <div className="bg-white w-full flex items-center justify-between">
        <div className="px-6 py-4 flex items-center gap-6 w-full">

          {/* Logo */}
          <Link to="/" style={{ textDecoration: 'none', color: 'inherit' }} className="flex items-center gap-2 text-xl font-bold shrink-0">
            <div className="w-8 h-8 bg-black text-white flex items-center justify-center rounded">R</div>
            <span>ReTech</span>
          </Link>

          {/* Buscador */}
          <div className="flex-1">
            <div className="relative" ref={searchRef}>
              <input 
                type="text" 
                placeholder="Cerca productes..." 
                value={query} 
                onChange={(e) => setQuery(e.target.value)}
                onFocus={() => { {/* focus en la caja de búsqueda */}
                  if (query.length >= 2) setSearchOpen(true)
                }}
                onKeyDown={(e) => { {/* usar enter para buscar */}
                  if (e.key === "Enter" && query.trim()) {
                    setSearchOpen(false)
                    navigate(`/search?q=${encodeURIComponent(query.trim())}`)
                  }
                }}
                className="w-full rounded border-gray-300 ps-4 py-2 pe-12 shadow-sm sm:text-sm focus:ring-2 focus:black focus:border-black"
              />
              <span className="absolute inset-y-0 right-2 grid w-8 place-content-center">
                  <button type="button" className="rounded-full p-1.5 text-gray-600 hover:bg-gray-100"
                    onClick={() => { if (query.trim()) navigate(`/search?q=${encodeURIComponent(query.trim())}`) }}>🔍</button> 
              </span>
              {searchOpen && (
                <div className="absolute left-0 right-0 bg-white border mt-1 rounded shadow-lg z-50 text-sm">
                  {loadingSearch ? <div className="px-4 py-2 text-gray-500">Buscando...</div> : 
                   results.length === 0 ? <div className="px-4 py-2 text-gray-400">No s'han trobat coincidències</div> :
                   results.map((item) => (
                    <Link key={item.id} to={`/models/${item.modelo_id}`} onClick={() => { setSearchOpen(false); setQuery("") }} className="px-4 py-2 hover:bg-gray-100 block no-underline text-gray-700">
                      {item.nombre}
                    </Link>
                  ))}
                </div>
              )}
            </div>
          </div>

          <div className="flex items-center gap-4 shrink-0">
            {/* --- SECCIÓN LOGIN / USER --- */}
            {!isAuthenticated ? (
              <div className="flex gap-3">
                <button onClick={() => navigate("/login")} className="text-sm font-medium hover:underline">Iniciar sessió</button>
                <button onClick={() => navigate("/register")} className="bg-black text-white px-4 py-2 rounded text-sm">Registre</button>
              </div>
            ) : (
              <div ref={userRef} style={{ position: "relative" }}>
                <button onClick={() => setUserOpen(!userOpen)} 
                  style={{ background: userOpen ? "#f1f5f9" : "none", border: "1px solid #e2e8f0", borderRadius: 10, padding: "8px 12px", cursor: "pointer", display: "flex", alignItems: "center", gap: 8 }}>
                  <span style={{ fontSize: 13, fontWeight: 700 }}>{user?.name}</span>
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#0f172a" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                    <circle cx="12" cy="7" r="4"></circle>
                  </svg>
                </button>
                {userOpen && <UserDropdown user={user} logout={logout} onClose={() => setUserOpen(false)} />}
              </div>
            )}

            {/* --- SECCIÓN CARRITO --- */}
            <div ref={cartRef} style={{ position: "relative" }}>
              <button onClick={() => setCartOpen((v) => !v)}
                style={{ position: "relative", background: cartOpen ? "#f1f5f9" : "none", border: "1px solid #e2e8f0", borderRadius: 10, padding: "8px 10px", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" }}>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#0f172a" strokeWidth="2">
                  <path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z"/><line x1="3" y1="6" x2="21" y2="6"/><path d="M16 10a4 4 0 01-8 0"/>
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
          <ul className="flex gap-6 py-3 text-sm font-medium list-none m-0">
            <li><Link to="/" className="text-gray-700 no-underline">Inici</Link></li>
            <li><Link to="/mobils" className="text-gray-700 no-underline">Mòbils</Link></li>
            <li><Link to="/tablets" className="text-gray-700 no-underline">Tablets</Link></li>
            <li><Link to="/accessoris" className="text-gray-700 no-underline">Accessoris</Link></li>
          </ul>
        </div>
      </nav>

      {/* Estilos locales para los links del dropdown */}
      <style>{`
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
    </header>
  )
}