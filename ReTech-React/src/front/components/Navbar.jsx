import { Link } from "react-router-dom"
import { useNavigate } from "react-router-dom"



export default function Navbar() {
    
    const navigate = useNavigate()
    let login = false;

    let buttons;

    if(!login){
        buttons = (
            <div>
                <button onClick={() => navigate("/login")} className="text-sm font-medium hover:underline m-3">
                    Iniciar sessió
                </button>
                <button className="bg-black text-white px-4 py-2 rounded text-sm m-3">
                    Registre
                </button>
            </div>
        )
    }else{
        buttons = (
            <div>
                <button className="bg-black text-white px-4 py-2 rounded text-sm">
                    Tancar Sessió
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
                <li><a href="/">Inici</a></li>
                <li><a href="/mobils">Mòbils</a></li>
                <li><a href="/tablets">Tablets</a></li>
                <li><a href="/accessoris">Accessoris</a></li>
            </ul>
            </div>
        </nav>

        </header>
  )
}
