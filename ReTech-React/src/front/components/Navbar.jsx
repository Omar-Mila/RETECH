import { useAuth } from "../../auth/AuthContext"
import { useNavigate } from "react-router-dom"
import { Link } from "react-router-dom"
import { useState, useEffect } from "react"
import { searchProducts } from "../../services/searchService"



export default function Navbar() {

    const { user, isAuthenticated, logout, loading } = useAuth()
    const navigate = useNavigate()

    const [query, setQuery] = useState("")
    const [results, setResults] = useState([])
    const [open, setOpen] = useState(false)
    const [loadingSearch, setLoadingSearch] = useState(false)

    useEffect(() => {
        if (query.length < 2) {
            setResults([])
            setOpen(false)
            return
        }

        const timeout = setTimeout(async () => {
            setLoadingSearch(true)
            try {
            console.log("Searching:", query)
            const data = await searchProducts(query)
            console.log("Search results:", data)
            setResults(data)
            setOpen(true)
            } catch (err) {
            console.error("Search error:", err)
            setResults([])
            setOpen(true) // para que veas "No s'han trobat..." o el estado
            } finally {
            setLoadingSearch(false)
            }
        }, 300)

        return () => clearTimeout(timeout)
    }, [query])

    if (loading) {
        return null // o un skeleton si vols
    }
    

    let buttons;

    if (!isAuthenticated){
        buttons = (
            <div className="flex gap-3">
                <button
                    onClick={() => navigate("/login")}
                    className="text-sm font-medium hover:underline"
                >
                    Iniciar sessió
                </button>

                <button
                    onClick={() => navigate("/register")}
                    className="bg-black text-white px-4 py-2 rounded text-sm"
                >
                    Registre
                </button>
            </div>
        )
    }else{
        buttons = (
            <div className="flex items-center gap-4">
                <span className="text-sm">
                    Hola, <strong>{user?.name}</strong>
                </span>

                {user?.role === "admin" && (
                    <button
                        onClick={() => navigate("/admin")}
                        className="text-sm font-medium hover:underline"
                    >
                        Admin - <strong>{user.name}</strong>
                    </button>
                )}

                <button
                    onClick={logout}
                    className="text-sm font-medium text-red-600 hover:underline"
                >
                    Tancar sessió
                </button>
            </div>
        )
    }

    return (
        <header className="border-b">
        
        {/* NAV SUPERIOR – OCUPA TOT */}
        <div className="bg-white w-full flex items-center justify-between">
            <div className="px-6 py-4 flex items-center gap-6 w-full">

                {/* Logo + Nom */}
                <div className="flex items-center gap-2 text-xl font-bold shrink-0">
                    <div className="w-8 h-8 bg-black text-white flex items-center justify-center rounded">
                    R
                    </div>
                    <span>ReTech</span>
                </div>

                {/* Buscador – S’ESTIRA AL MÀXIM */}
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
                        >
                        🔍
                        </button>
                    </span>
                    {open && (
                        <div className="absolute left-0 right-0 bg-white border mt-1 rounded shadow-lg z-50 text-sm">

                            {loadingSearch && (
                                <div className="px-4 py-2 text-gray-500">
                                    Buscando...
                                </div>
                            )}

                            {!loadingSearch && results.length === 0 && (
                                <div className="px-4 py-2 text-gray-400">
                                    No s'han trobat coincidències
                                </div>
                            )}

                            {!loadingSearch && results.map((item) => (
                                <Link
                                    key={item.id}
                                    to={`/models/${item.id}`}
                                    onClick={() => setOpen(false)}
                                    className="px-4 py-2 hover:bg-gray-100 block"
                                >
                                    {item.nombre}
                                </Link>
                            ))}

                        </div>
                    )}
                    </div>
                </div>

                {/* Login / Registre */}
                <div className="flex gap-3 shrink-0">
                    {buttons}
                </div>

            </div>
        </div>

        {/* NAV INFERIOR (pots decidir si també la vols full width) */}
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
