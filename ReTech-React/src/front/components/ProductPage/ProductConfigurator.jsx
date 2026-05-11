import { useEffect, useMemo, useState } from "react"
import { useParams, useNavigate } from "react-router-dom"
import { getModelPrice, getFilteredOptions } from "../../../services/productService"
import { useLanguage } from "../../context/LanguageContext"

const STATE_IMG = {
  "Como nuevo": "/A.png",
  "Buen estado": "/B.png",
  "Funcional": "/C.png",
}

export default function ProductConfigurator({
  options,
  selectedColor,
  setSelectedColor,
  selectedState,
  setSelectedState,
  productName,
}) {
  const { id } = useParams()
  const navigate = useNavigate()
  const { t } = useLanguage()

  const [loadingPrice, setLoadingPrice] = useState(false)
  const [loadingOptions, setLoadingOptions] = useState(false)
  const [adding, setAdding] = useState(false)
  const [priceData, setPriceData] = useState(null)
  const [authToast, setAuthToast] = useState(false)

  const [estado, setEstado] = useState("")
  const [almacenamiento, setAlmacenamiento] = useState("")
  const [bateria, setBateria] = useState("")

  const [availAlmacenamientos, setAvailAlmacenamientos] = useState(options?.almacenamientos ?? [])
  const [availColores, setAvailColores] = useState(options?.colores ?? [])
  const [availBaterias, setAvailBaterias] = useState(options?.baterias ?? [])

  const params = useMemo(() => {
    const p = {}
    if (estado) p.estado = estado
    if (almacenamiento) p.almacenamiento = almacenamiento
    if (selectedColor) p.color = selectedColor
    if (bateria) p.bateria_min = bateria
    return p
  }, [estado, almacenamiento, selectedColor, bateria])

  useEffect(() => {
    let mounted = true
    async function load() {
      setLoadingPrice(true)
      try {
        const data = await getModelPrice(id, {})
        if (mounted) setPriceData(data)
      } catch (e) {
        console.error(e)
      } finally {
        if (mounted) setLoadingPrice(false)
      }
    }
    load()
    return () => { mounted = false }
  }, [id])

  useEffect(() => {
    if (Object.keys(params).length === 0) return
    let mounted = true
    async function load() {
      setLoadingPrice(true)
      try {
        const data = await getModelPrice(id, params)
        if (mounted) setPriceData(data)
      } catch (e) {
        console.error(e)
        if (mounted) setPriceData(null)
      } finally {
        if (mounted) setLoadingPrice(false)
      }
    }
    load()
    return () => { mounted = false }
  }, [params, id])

  async function fetchFiltered(filterParams) {
    setLoadingOptions(true)
    try {
      return await getFilteredOptions(id, filterParams)
    } catch (e) {
      console.error(e)
      return null
    } finally {
      setLoadingOptions(false)
    }
  }

  const handleEstadoChange = async (value) => {
    setEstado(value)
    setSelectedState(value)
    setAlmacenamiento("")
    setSelectedColor("")
    setBateria("")

    if (!value) {
      setAvailAlmacenamientos(options?.almacenamientos ?? [])
      setAvailColores(options?.colores ?? [])
      setAvailBaterias(options?.baterias ?? [])
      return
    }

    const filtered = await fetchFiltered({ estado: value })
    if (filtered) {
      setAvailAlmacenamientos(filtered.almacenamientos ?? [])
      setAvailColores(filtered.colores ?? [])
      setAvailBaterias(filtered.baterias ?? [])
    }
  }

  const handleAlmacenamientoChange = async (value) => {
    setAlmacenamiento(value)
    setSelectedColor("")
    setBateria("")

    const filterParams = value ? { estado, almacenamiento: value } : { estado }
    const filtered = await fetchFiltered(filterParams)
    if (filtered) {
      setAvailColores(filtered.colores ?? [])
      setAvailBaterias(filtered.baterias ?? [])
    }
  }

  const handleColorChange = async (value) => {
    setSelectedColor(value)
    setBateria("")

    const filterParams = value
      ? { estado, almacenamiento, color: value }
      : { estado, almacenamiento }
    const filtered = await fetchFiltered(filterParams)
    if (filtered) {
      setAvailBaterias(filtered.baterias ?? [])
    }
  }

  const handleAddToCart = async () => {
    if (!priceData?.movil_id) {
      alert(t('product.selectValidCombo'))
      return
    }

    setAdding(true)
    try {
      await fetch("http://localhost:8000/sanctum/csrf-cookie", { credentials: "include" })
      const xsrfToken = document.cookie
        .split("; ")
        .find((row) => row.startsWith("XSRF-TOKEN="))
        ?.split("=")[1]

      const response = await fetch("http://localhost:8000/api/carrito", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Accept": "application/json",
          "X-Requested-With": "XMLHttpRequest",
          "X-XSRF-TOKEN": decodeURIComponent(xsrfToken || ""),
        },
        credentials: "include",
        body: JSON.stringify({ movil_id: priceData.movil_id, cantidad: 1 }),
      })

      if (response.ok) {
        window.dispatchEvent(new Event("cart-updated"))
        window.scrollTo({ top: 0, behavior: "smooth" })
      } else {
        const error = await response.json()
        if (response.status === 401 || error.message === "Unauthenticated.") {
          setAuthToast(true)
          setTimeout(() => {
            setAuthToast(false)
            navigate("/login")
          }, 2500)
        } else {
          alert(error.message || t('product.addError'))
        }
      }
    } catch (err) {
      console.error("Error de connexió:", err)
      alert(t('product.connectionError'))
    } finally {
      setAdding(false)
    }
  }

  const hasResult = priceData && priceData.precio != null && priceData.stock > 0
  const stateInfo = t('product.stateInfo')

  return (
    <>
    {authToast && (
      <div style={{
        position: "fixed", top: 24, left: "50%", transform: "translateX(-50%)",
        zIndex: 9999, background: "#1e293b", color: "#fff",
        padding: "14px 24px", borderRadius: 12, fontSize: 14, fontWeight: 600,
        boxShadow: "0 8px 30px rgba(0,0,0,.25)", display: "flex", alignItems: "center", gap: 10,
        animation: "fadeInToast .25s ease", whiteSpace: "nowrap"
      }}>
        <style>{`@keyframes fadeInToast { from { opacity:0; transform:translateX(-50%) translateY(8px); } to { opacity:1; transform:translateX(-50%) translateY(0); } }`}</style>
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#f87171" strokeWidth="2.2">
          <circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/>
        </svg>
        {t('product.loginRequired')}
      </div>
    )}
    <div className="space-y-6">

      {productName && (
        <h1 className="text-2xl font-bold">{productName}</h1>
      )}

      <div className="space-y-4">

        {/* Estat */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">{t('product.stateLabel')}</label>
          <select
            value={estado}
            onChange={(e) => handleEstadoChange(e.target.value)}
            className="w-full border rounded-lg p-2.5 bg-white focus:ring-2 focus:ring-black focus:border-black"
          >
            <option value="">{t('product.selectState')}</option>
            {options?.estados.map(e => (
              <option key={e} value={e}>{e}</option>
            ))}
          </select>
        </div>

        {/* Previsualització estat */}
        {estado && stateInfo[estado] && (
          <div className="rounded-xl border overflow-hidden flex gap-3 bg-gray-50 p-3 items-center">
            <img
              src={STATE_IMG[estado]}
              alt={stateInfo[estado].badge}
              className="w-20 h-20 object-contain flex-shrink-0"
            />
            <div>
              <span className="inline-block text-xs font-semibold bg-black text-white px-2 py-0.5 rounded-full mb-1">
                {stateInfo[estado].badge}
              </span>
              <p className="text-xs text-gray-600 leading-snug">{stateInfo[estado].desc}</p>
            </div>
          </div>
        )}

        {/* Emmagatzematge */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">{t('product.storageLabel')}</label>
          <select
            value={almacenamiento}
            onChange={(e) => handleAlmacenamientoChange(e.target.value)}
            disabled={!estado || loadingOptions}
            className="w-full border rounded-lg p-2.5 bg-white focus:ring-2 focus:ring-black focus:border-black disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <option value="">
              {!estado ? t('product.selectStateFirst') : t('product.selectStorage')}
            </option>
            {availAlmacenamientos.map(a => (
              <option key={a} value={a}>{a} GB</option>
            ))}
          </select>
        </div>

        {/* Color */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">{t('product.colorLabel')}</label>
          <select
            value={selectedColor}
            onChange={(e) => handleColorChange(e.target.value)}
            disabled={!almacenamiento || loadingOptions}
            className="w-full border rounded-lg p-2.5 bg-white focus:ring-2 focus:ring-black focus:border-black disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <option value="">
              {!almacenamiento ? t('product.selectStorageFirst') : t('product.selectColor')}
            </option>
            {availColores.map(c => (
              <option key={c.id} value={c.id}>{c.nombre}</option>
            ))}
          </select>
        </div>

        {/* Bateria */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">{t('product.batteryLabel')}</label>
          <select
            value={bateria}
            onChange={(e) => setBateria(e.target.value)}
            disabled={!selectedColor || loadingOptions}
            className="w-full border rounded-lg p-2.5 bg-white focus:ring-2 focus:ring-black focus:border-black disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <option value="">
              {!selectedColor ? t('product.selectColorFirst') : t('product.selectBattery')}
            </option>
            {availBaterias.map(b => (
              <option key={b.valor} value={b.valor}>{b.label}</option>
            ))}
          </select>
        </div>

      </div>

      {/* Preu */}
      <div className="border rounded-lg p-4 bg-gray-50">
        <div className="flex items-center justify-between">
          <span className="text-sm text-gray-500">
            {estado ? t('product.configPrice') : t('product.recommendedPrice')}
          </span>
          <span className="text-2xl font-bold">
            {loadingPrice ? "…" : hasResult ? `${priceData.precio}€` : "—"}
          </span>
        </div>
        <div className="text-xs text-gray-500 mt-1">
          {loadingPrice
            ? t('product.calculating')
            : hasResult
            ? t('product.unitsAvailable')(priceData.stock)
            : t('product.noCombo')}
        </div>
      </div>

      {/* Botó compra */}
      <button
        onClick={handleAddToCart}
        disabled={!hasResult || loadingPrice || adding}
        className={`w-full py-3 rounded-lg text-white font-medium transition
          ${(!hasResult || loadingPrice || adding)
            ? "bg-gray-400 cursor-not-allowed"
            : "bg-black hover:bg-gray-800"
          }`}
      >
        {adding ? t('product.adding') : t('product.addToCart')}
      </button>

      {/* Informació de confiança */}
      <div className="border rounded-xl p-4 space-y-4 text-sm">

        {/* Garantia */}
        <div className="flex items-center gap-2">
          <svg className="w-4 h-4 text-gray-600 flex-shrink-0" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.955 11.955 0 003 12c0 6.627 5.373 12 12 12s12-5.373 12-12c0-2.03-.506-3.944-1.397-5.617" />
          </svg>
          <span className="font-medium text-gray-800">{t('product.warranty')}</span>
        </div>

        {/* Mètodes de pagament */}
        <div>
          <p className="text-xs text-gray-400 mb-2">{t('product.accepts')}</p>
          <div className="flex items-center gap-2 flex-wrap">
            <span className="inline-flex items-center px-2.5 py-1 rounded border border-gray-200 bg-[#1A1F71] text-white text-xs font-bold tracking-widest">
              VISA
            </span>
            <span className="inline-flex items-center gap-0.5 px-2 py-1 rounded border border-gray-200 bg-white">
              <span className="w-4 h-4 rounded-full bg-[#EB001B] inline-block"></span>
              <span className="w-4 h-4 rounded-full bg-[#F79E1B] inline-block -ml-2"></span>
            </span>
            <span className="inline-flex items-center px-2.5 py-1 rounded border border-gray-200 bg-white text-xs font-bold">
              <span className="text-[#003087]">Pay</span><span className="text-[#009cde]">Pal</span>
            </span>
            <span className="inline-flex items-center px-2.5 py-1 rounded border border-gray-200 bg-[#00c2a8] text-white text-xs font-bold">
              bizum
            </span>
            <span className="inline-flex items-center px-2.5 py-1 rounded border border-gray-200 bg-black text-white text-xs font-semibold tracking-tight">
               Pay
            </span>
          </div>
        </div>

        {/* Enviament + extras */}
        <div className="space-y-1.5 text-gray-600 text-xs">
          <div className="flex items-center gap-2">
            <svg className="w-3.5 h-3.5 flex-shrink-0" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 18.75a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m3 0h6m-9 0H3.375a1.125 1.125 0 01-1.125-1.125V14.25m17.25 4.5a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m3 0h1.125c.621 0 1.129-.504 1.09-1.124a17.902 17.902 0 00-3.213-9.193 2.056 2.056 0 00-1.58-.86H14.25M16.5 18.75h-2.25m0-11.177v-.958c0-.568-.422-1.048-.987-1.106a48.554 48.554 0 00-10.026 0 1.106 1.106 0 00-.987 1.106v7.635m12-6.677v6.677m0 4.5v-4.5m0 0h-12" />
            </svg>
            <span>{t('product.freeShipping')}</span>
          </div>
          <div className="flex items-center gap-2">
            <svg className="w-3.5 h-3.5 flex-shrink-0" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span>{t('product.vatIncluded')}</span>
          </div>
          <div className="flex items-center gap-2">
            <svg className="w-3.5 h-3.5 flex-shrink-0" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 13.5l10.5-11.25L12 10.5h8.25L9.75 21.75 12 13.5H3.75z" />
            </svg>
            <span>{t('product.chargerIncluded')}</span>
          </div>
        </div>

      </div>

    </div>
    </>
  )
}
