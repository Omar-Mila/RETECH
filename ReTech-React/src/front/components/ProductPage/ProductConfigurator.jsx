import { useEffect, useMemo, useState } from "react"
import { useParams } from "react-router-dom"
import { getModelPrice } from "../../../services/productService"

export default function ProductConfigurator({ options }) {
  const { id } = useParams()

  const [openAdvanced, setOpenAdvanced] = useState(false)
  const [loadingPrice, setLoadingPrice] = useState(false)

  const [priceData, setPriceData] = useState(null) // {precio, stock, movil_id, ...}

  // filtros (solo se usan cuando "Personalitzar" está abierto y el user toca algo)
  const [estado, setEstado] = useState("")
  const [almacenamiento, setAlmacenamiento] = useState("")
  const [ram, setRam] = useState("")
  const [color, setColor] = useState("")
  const [bateria, setBateria] = useState("")

  // helper: construir params solo con los que tengan valor
  const params = useMemo(() => {
    const p = {}
    if (estado) p.estado = estado
    if (ram) p.ram = ram
    if (almacenamiento) p.almacenamiento = almacenamiento
    if (color) p.color = color
    if (bateria) p.bateria_min = bateria
    return p
  }, [estado, ram, almacenamiento, color, bateria])

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
            value={ram}
            onChange={(e) => setRam(e.target.value)}
            className="w-full border rounded p-2"
          >
            <option value="">RAM</option>
            {options.rams.map(r => <option key={r} value={r}>{r} GB</option>)}
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
            <option value="">Bateria mínima</option>
            <option value="80">80%</option>
            <option value="85">85%</option>
            <option value="90">90%</option>
            <option value="95">95%</option>
          </select>
        </div>
      )}

      {/* CTA */}
      <button
        disabled={!hasResult || loadingPrice}
        className={`w-full py-3 rounded text-white font-medium transition
          ${(!hasResult || loadingPrice) ? "bg-gray-400 cursor-not-allowed" : "bg-black hover:bg-gray-800"}
        `}
      >
        Afegir al carret
      </button>

      {/* Debug útil mientras montas */}
      {/* <pre className="text-xs bg-gray-50 p-2 rounded">{JSON.stringify(priceData, null, 2)}</pre> */}
    </div>
  )
}