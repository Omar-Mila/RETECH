import { useEffect, useMemo, useState } from "react"
import { useParams } from "react-router-dom"
import { getModelPrice } from "../../../services/productService"

export default function ProductConfigurator({ options }) {
  const { id } = useParams()

  const [openAdvanced, setOpenAdvanced] = useState(false)
  const [loadingPrice, setLoadingPrice] = useState(false)
  const [adding, setAdding] = useState(false)

  const [priceData, setPriceData] = useState(null) // {precio, stock, movil_id, ...}

  // filtros (solo se usan cuando "Personalitzar" está abierto y el user toca algo)
  const [estado, setEstado] = useState("")
  const [almacenamiento, setAlmacenamiento] = useState("")
  const [color, setColor] = useState("")
  const [bateria, setBateria] = useState("")

  // helper: construir params solo con los que tengan valor
  const params = useMemo(() => {
    const p = {}
    if (estado) p.estado = estado
    if (almacenamiento) p.almacenamiento = almacenamiento
    if (color) p.color = color
    if (bateria) p.bateria_min = bateria
    return p
  }, [estado, almacenamiento, color, bateria])

  // 1) Al cargar: precio recomendado (sin filtros)
  useEffect(() => {
    let mounted = true

    async function loadRecommended() {
      setLoadingPrice(true)
      try {
        const data = await getModelPrice(id, {}) // sin filtros
        if (!mounted) return
        setPriceData(data)
      } catch (e) {
        console.error(e)
        if (mounted) setPriceData(null)
      } finally {
        if (mounted) setLoadingPrice(false)
      }
    }

    loadRecommended()

    return () => {
      mounted = false
    }
  }, [id])

  // 2) Si el usuario está personalizando: recalcular precio al cambiar filtros
  useEffect(() => {
    if (!openAdvanced) return

    let mounted = true

    async function loadCustomPrice() {
      setLoadingPrice(true)
      try {
        const data = await getModelPrice(id, params)
        if (!mounted) return
        setPriceData(data)
      } catch (e) {
        console.error(e)
        if (mounted) setPriceData(null)
      } finally {
        if (mounted) setLoadingPrice(false)
      }
    }

    loadCustomPrice()

    return () => {
      mounted = false
    }
  }, [openAdvanced, params, id])

  const handleAddToCart = async () => {
    if (!priceData?.movil_id) {
      alert("Selecciona una combinació válida");
      return;
    }

    setAdding(true);
    try {
      // 1. Obtener la cookie de protección
      await fetch("http://localhost:8000/sanctum/csrf-cookie", { 
        credentials: "include" 
      });

      // 2. Extraer el token de las cookies del navegador (necesario para POST)
      const xsrfToken = document.cookie
        .split("; ")
        .find((row) => row.startsWith("XSRF-TOKEN="))
        ?.split("=")[1];

      const response = await fetch("http://localhost:8000/api/carrito", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Accept": "application/json",
          "X-Requested-With": "XMLHttpRequest",
          "X-XSRF-TOKEN": decodeURIComponent(xsrfToken || ""),
        },
        credentials: "include",
        body: JSON.stringify({
          movil_id: priceData.movil_id,
          cantidad: 1,
        }),
      });

      if (response.ok) {
        // Si el Navbar escucha este evento, se actualizará el numerito del carrito
        window.dispatchEvent(new Event("cart-updated"));
        window.scrollTo({ top: 0, behavior: "smooth" });
      } else {
        const error = await response.json();
        alert(error.message || "Error al afegir");
      }
    } catch (err) {
      console.error("Error de conexió:", err);
      alert("No se ha pogut connectar amb el servidor");
    } finally {
      setAdding(false);
    }
  };

  const hasResult = priceData && priceData.precio != null && priceData.stock > 0

  return (
    <div className="space-y-4 border-t pt-6">
      <h2 className="text-lg font-semibold">Compra</h2>

      {/* TARJETA RECOMENDADA */}
      <div className="border rounded-lg p-4 space-y-2">
        <div className="flex items-start justify-between gap-4">
          <div>
            <div className="text-sm text-gray-500">Recomanat</div>

            {/* Resumen (si backend devuelve extras, los puedes enseñar aquí) */}
            <div className="text-sm">
              {priceData?.almacenamiento ? `${priceData.almacenamiento} GB · ` : ""}
              {priceData?.estado ? `${priceData.estado} · ` : ""}
              {priceData?.salud_bateria ? `Bateria ${priceData.salud_bateria}%` : ""}
            </div>
          </div>

          <div className="text-right">
            <div className="text-2xl font-bold">
              {loadingPrice ? "…" : hasResult ? `${priceData.precio}€` : "—"}
            </div>
            <div className="text-xs text-gray-500">
              {loadingPrice ? "Calculant..." : hasResult ? `Stock: ${priceData.stock}` : "Sense combinacions"}
            </div>
          </div>
        </div>

        <button
          type="button"
          onClick={() => setOpenAdvanced(v => !v)}
          className="text-sm underline"
        >
          {openAdvanced ? "Amagar personalització" : "Personalitzar"}
        </button>
      </div>

      {/* CONFIGURADOR AVANZADO (COLAPSABLE) */}
      {openAdvanced && (
        <div className="space-y-3 border rounded-lg p-4">
          <div className="text-sm font-medium">Configuració</div>

          <select
            value={estado}
            onChange={(e) => setEstado(e.target.value)}
            className="w-full border rounded p-2"
          >
            <option value="">Estat</option>
            {options.estados.map(e => <option key={e} value={e}>{e}</option>)}
          </select>

          <select
            value={almacenamiento}
            onChange={(e) => setAlmacenamiento(e.target.value)}
            className="w-full border rounded p-2"
          >
            <option value="">Emmagatzematge</option>
            {options.almacenamientos.map(a => <option key={a} value={a}>{a} GB</option>)}
          </select>

          <select
            value={color}
            onChange={(e) => setColor(e.target.value)}
            className="w-full border rounded p-2"
          >
            <option value="">Color</option>
            {options.colores.map(c => <option key={c.id} value={c.id}>{c.nombre}</option>)}
          </select>

          <select
              value={bateria}
              onChange={(e) => setBateria(e.target.value)}
              className="w-full border rounded p-2"
          >
            
              {options.baterias.map(b => (
                <option key={b.valor} value={b.valor}>
                  {b.label}
                </option>
              ))}
            </select>
        </div>
      )}

      {/* CTA */}
      <button
        onClick={handleAddToCart}
        disabled={!hasResult || loadingPrice || adding} // Deshabilitar si está añadiendo
        className={`w-full py-3 rounded text-white font-medium transition
          ${(!hasResult || loadingPrice || adding) ? "bg-gray-400 cursor-not-allowed" : "bg-black hover:bg-gray-800"}
        `}
      >
        {adding ? "Afegint..." : "Afegir al carret"} 
      </button>

      {/* Debug útil mientras montas */}
      {/* <pre className="text-xs bg-gray-50 p-2 rounded">{JSON.stringify(priceData, null, 2)}</pre> */}
    </div>
  )
}