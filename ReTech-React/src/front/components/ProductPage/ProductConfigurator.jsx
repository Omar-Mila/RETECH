import { useMemo, useState, useEffect } from "react"
import { obtenerCarritoInvitado, guardarCarritoInvitado } from "../../../services/guestCart"
import { useIdioma } from "../../context/LanguageContext"
import { useAutenticacion } from "../../../auth/AuthContext"

const IMG_ESTADO = {
  "Como nuevo": "/img/estado/new.avif",
  "Buen estado": "/img/estado/mid.avif",
  "Funcional": "/img/estado/low.avif",
}

const ETIQ_BATERIA = (b) => {
  if (b >= 100) return "Nueva (100%)"
  if (b >= 90)  return "Excelente Estado (90-95%)"
  if (b >= 80)  return "Buen Estado (80-90%)"
  return `${b}%`
}

function IconoAviso() {
  return (
    <svg className="w-3.5 h-3.5 text-amber-500 flex-shrink-0" viewBox="0 0 20 20" fill="currentColor">
      <path fillRule="evenodd" d="M8.485 2.495c.673-1.167 2.357-1.167 3.03 0l6.28 10.875c.673 1.167-.17 2.625-1.516 2.625H3.72c-1.347 0-2.189-1.458-1.515-2.625L8.485 2.495zM10 5a.75.75 0 01.75.75v3.5a.75.75 0 01-1.5 0v-3.5A.75.75 0 0110 5zm0 9a1 1 0 100-2 1 1 0 000 2z" clipRule="evenodd" />
    </svg>
  )
}

function IconoChequeo() {
  return (
    <svg className="w-3.5 h-3.5 text-black flex-shrink-0" viewBox="0 0 20 20" fill="currentColor">
      <path fillRule="evenodd" d="M16.704 4.153a.75.75 0 01.143 1.052l-8 10.5a.75.75 0 01-1.127.075l-4.5-4.5a.75.75 0 011.06-1.06l3.894 3.893 7.48-9.817a.75.75 0 011.05-.143z" clipRule="evenodd" />
    </svg>
  )
}

export default function ProductConfigurator({
  units = [],
  initialMovilId = null,
  selectedColor,
  setSelectedColor,
  selectedState,
  setSelectedState,
  productName,
  coverImage = null,
}) {
  const { isAuthenticated } = useAutenticacion()
  const { t } = useIdioma()

  const [agregando, fijarAgregando] = useState(false)
  const [modalEstadoAbierto, fijarModalEstadoAbierto] = useState(false)
  const [estado, setEstado] = useState("")
  const [almacenamiento, setAlmacenamiento] = useState("")
  const [bateria, setBateria] = useState("")
  const [limpiados, fijarLimpiados] = useState({})

  const estadosDisp = useMemo(() => [...new Set(
    units
      .filter(u =>
        (!almacenamiento || u.almacenamiento === Number(almacenamiento)) &&
        (!selectedColor  || String(u.color_id) === selectedColor) &&
        (!bateria        || u.salud_bateria >= Number(bateria))
      )
      .map(u => u.estado)
  )], [units, almacenamiento, selectedColor, bateria])

  const almacDisp = useMemo(() => [...new Set(
    units
      .filter(u =>
        (!estado       || u.estado === estado) &&
        (!selectedColor || String(u.color_id) === selectedColor) &&
        (!bateria       || u.salud_bateria >= Number(bateria))
      )
      .map(u => u.almacenamiento)
  )].sort((a, b) => a - b), [units, estado, selectedColor, bateria])

  const coloresDisp = useMemo(() => {
    const seen = new Set()
    return units
      .filter(u =>
        (!estado          || u.estado === estado) &&
        (!almacenamiento  || u.almacenamiento === Number(almacenamiento)) &&
        (!bateria         || u.salud_bateria >= Number(bateria))
      )
      .filter(u => { if (seen.has(u.color_id)) return false; seen.add(u.color_id); return true })
      .map(u => ({ id: u.color_id, nombre: u.color }))
  }, [units, estado, almacenamiento, bateria])

  const bateriasDisp = useMemo(() => {
    const valores = [...new Set(
      units
        .filter(u =>
          (!estado         || u.estado === estado) &&
          (!almacenamiento || u.almacenamiento === Number(almacenamiento)) &&
          (!selectedColor  || String(u.color_id) === selectedColor)
        )
        .map(u => u.salud_bateria)
    )].sort((a, b) => a - b)

    const seen = new Set()
    return valores
      .map(b => ({ valor: b, label: ETIQ_BATERIA(b) }))
      .filter(({ label }) => {
        if (seen.has(label)) return false
        seen.add(label)
        return true
      })
  }, [units, estado, almacenamiento, selectedColor])

  const unidadCoincide = useMemo(() => units
    .filter(u =>
      (!estado         || u.estado === estado) &&
      (!almacenamiento || u.almacenamiento === Number(almacenamiento)) &&
      (!selectedColor  || String(u.color_id) === selectedColor) &&
      (!bateria        || u.salud_bateria >= Number(bateria))
    )
    .sort((a, b) => a.precio - b.precio)[0] ?? null
  , [units, estado, almacenamiento, selectedColor, bateria])

  useEffect(() => {
    if (units.length === 0) return
    const objetivo = initialMovilId
      ? units.find(u => String(u.id) === String(initialMovilId))
      : null
    seleccionarUnidad(objetivo ?? units[0])
  }, [units])

  function seleccionarUnidad(unidad) {
    setEstado(unidad.estado)
    setSelectedState(unidad.estado)
    setAlmacenamiento(String(unidad.almacenamiento))
    setSelectedColor(String(unidad.color_id))
    setBateria(String(unidad.salud_bateria))
  }

  function alCambiar(campo, valor) {
    const siguiente = {
      estado:         campo === "estado"         ? valor : estado,
      almacenamiento: campo === "almacenamiento" ? valor : almacenamiento,
      color:          campo === "color"          ? valor : selectedColor,
      bateria:        campo === "bateria"        ? valor : bateria,
    }

    const filtrarUnidades = (excluir) => units.filter(u => {
      if (excluir !== "estado"         && siguiente.estado         && u.estado !== siguiente.estado)                                return false
      if (excluir !== "almacenamiento" && siguiente.almacenamiento && u.almacenamiento !== Number(siguiente.almacenamiento))       return false
      if (excluir !== "color"          && siguiente.color          && String(u.color_id) !== String(siguiente.color))              return false
      if (excluir !== "bateria"        && siguiente.bateria        && u.salud_bateria < Number(siguiente.bateria))                 return false
      return true
    })

    const limpiados2 = {}
    if (campo !== "estado" && siguiente.estado) {
      if (!new Set(filtrarUnidades("estado").map(u => u.estado)).has(siguiente.estado))
        { siguiente.estado = ""; limpiados2.estado = true }
    }
    if (campo !== "almacenamiento" && siguiente.almacenamiento) {
      if (!new Set(filtrarUnidades("almacenamiento").map(u => String(u.almacenamiento))).has(siguiente.almacenamiento))
        { siguiente.almacenamiento = ""; limpiados2.almacenamiento = true }
    }
    if (campo !== "color" && siguiente.color) {
      if (!new Set(filtrarUnidades("color").map(u => String(u.color_id))).has(siguiente.color))
        { siguiente.color = ""; limpiados2.color = true }
    }
    if (campo !== "bateria" && siguiente.bateria) {
      if (!new Set(filtrarUnidades("bateria").map(u => String(u.salud_bateria))).has(siguiente.bateria))
        { siguiente.bateria = ""; limpiados2.bateria = true }
    }

    delete limpiados2[campo]
    fijarLimpiados(limpiados2)

    setEstado(siguiente.estado)
    setAlmacenamiento(siguiente.almacenamiento)
    setSelectedColor(siguiente.color)
    setSelectedState(siguiente.estado)
    setBateria(siguiente.bateria)
  }

  const agregarAlCarro = async () => {
    if (!puedoAgregar) {
      alert(t("product.selectValidCombo"))
      return
    }

    if (!isAuthenticated) {
      const carro = obtenerCarritoInvitado()
      const existente = carro.find(i => i.movil_id === unidadCoincide.id)
      if (existente) {
        existente.cantidad += 1
        existente.subtotal = existente.precio * existente.cantidad
      } else {
        const objColor = coloresDisp.find(c => String(c.id) === String(selectedColor))
        carro.push({
          movil_id:       unidadCoincide.id,
          cantidad:       1,
          precio:         unidadCoincide.precio,
          subtotal:       unidadCoincide.precio,
          modelo:         productName,
          estado:         unidadCoincide.estado,
          almacenamiento: unidadCoincide.almacenamiento,
          ram:            unidadCoincide.ram,
          salud_bateria:  unidadCoincide.salud_bateria,
          color:          objColor?.nombre ?? "",
          color_hex:      "#94a3b8",
          stock:          unidadCoincide.stock,
          imagen_url:     coverImage,
        })
      }
      guardarCarritoInvitado(carro)
      window.dispatchEvent(new Event("cart-updated"))
      window.scrollTo({ top: 0, behavior: "smooth" })
      return
    }

    fijarAgregando(true)
    try {
      await fetch("http://localhost:8000/sanctum/csrf-cookie", { credentials: "include" })
      const tokenXsrf = document.cookie
        .split("; ")
        .find(r => r.startsWith("XSRF-TOKEN="))
        ?.split("=")[1]

      const respuesta = await fetch("http://localhost:8000/api/carrito", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Accept": "application/json",
          "X-Requested-With": "XMLHttpRequest",
          "X-XSRF-TOKEN": decodeURIComponent(tokenXsrf || ""),
        },
        credentials: "include",
        body: JSON.stringify({ movil_id: unidadCoincide.id, cantidad: 1 }),
      })

      if (respuesta.ok) {
        window.dispatchEvent(new Event("cart-updated"))
        window.scrollTo({ top: 0, behavior: "smooth" })
      } else {
        const error = await respuesta.json()
        alert(error.message || t("product.addError"))
      }
    } catch (err) {
      console.error(err)
      alert(t("product.connectionError"))
    } finally {
      fijarAgregando(false)
    }
  }

  const haySeleccion = !!(estado || almacenamiento || selectedColor || bateria)
  const todoSeleccionado = !!(estado && almacenamiento && selectedColor && bateria)
  const hayResultado = haySeleccion && !!unidadCoincide
  const puedoAgregar = todoSeleccionado && !!unidadCoincide

  const infoEstado = t("product.stateInfo")

  return (
    <>
    <div className="space-y-6">

      {productName && (
        <div className="flex items-center justify-between gap-3">
          <h1 className="text-2xl font-bold">{productName}</h1>
          {haySeleccion && (
            <button
              onClick={() => {
                setEstado("")
                setAlmacenamiento("")
                setSelectedColor("")
                setSelectedState("")
                setBateria("")
                fijarLimpiados({})
              }}
              className="text-xs text-black hover:text-gray-600 underline underline-offset-2 flex-shrink-0 transition-colors"
            >
              {t("product.clearFields")}
            </button>
          )}
        </div>
      )}

      <div className="space-y-4">

        {/* Estado */}
        <div>
          <label className="flex items-center gap-1.5 text-sm font-medium text-gray-700 mb-1">
            {t("product.stateLabel")}
            {estado && !limpiados.estado && <IconoChequeo />}
            {limpiados.estado && <IconoAviso />}
          </label>
          <select
            value={estado}
            onChange={e => alCambiar("estado", e.target.value)}
            className={`w-full border rounded-lg p-2.5 bg-white focus:ring-2 focus:ring-black focus:border-black ${limpiados.estado ? "border-amber-400" : ""}`}
          >
            <option value="">{t("product.selectState")}</option>
            {estadosDisp.map(e => (
              <option key={e} value={e}>{e}</option>
            ))}
          </select>
        </div>

        {/* Previsualización estado */}
        {estado && infoEstado[estado] && (
          <div className="rounded-xl border overflow-hidden flex gap-3 bg-gray-50 p-3 items-center">
            <img
              src={IMG_ESTADO[estado]}
              alt={infoEstado[estado].badge}
              onClick={() => fijarModalEstadoAbierto(true)}
              className="w-20 h-20 object-contain flex-shrink-0 cursor-zoom-in hover:scale-105 transition-transform"
            />
            <div>
              <span className="inline-block text-xs font-semibold bg-black text-white px-2 py-0.5 rounded-full mb-1">
                {infoEstado[estado].badge}
              </span>
              <p className="text-xs text-gray-600 leading-snug">{infoEstado[estado].desc}</p>
            </div>
          </div>
        )}

        {/* Almacenamiento */}
        <div>
          <label className="flex items-center gap-1.5 text-sm font-medium text-gray-700 mb-1">
            {t("product.storageLabel")}
            {almacenamiento && !limpiados.almacenamiento && <IconoChequeo />}
            {limpiados.almacenamiento && <IconoAviso />}
          </label>
          <select
            value={almacenamiento}
            onChange={e => alCambiar("almacenamiento", e.target.value)}
            className={`w-full border rounded-lg p-2.5 bg-white focus:ring-2 focus:ring-black focus:border-black ${limpiados.almacenamiento ? "border-amber-400" : ""}`}
          >
            <option value="">{t("product.selectStorage")}</option>
            {almacDisp.map(a => (
              <option key={a} value={a}>{a} GB</option>
            ))}
          </select>
        </div>

        {/* Color */}
        <div>
          <label className="flex items-center gap-1.5 text-sm font-medium text-gray-700 mb-1">
            {t("product.colorLabel")}
            {selectedColor && !limpiados.color && <IconoChequeo />}
            {limpiados.color && <IconoAviso />}
          </label>
          <select
            value={selectedColor}
            onChange={e => alCambiar("color", e.target.value)}
            className={`w-full border rounded-lg p-2.5 bg-white focus:ring-2 focus:ring-black focus:border-black ${limpiados.color ? "border-amber-400" : ""}`}
          >
            <option value="">{t("product.selectColor")}</option>
            {coloresDisp.map(c => (
              <option key={c.id} value={c.id}>{c.nombre}</option>
            ))}
          </select>
        </div>

        {/* Batería */}
        <div>
          <label className="flex items-center gap-1.5 text-sm font-medium text-gray-700 mb-1">
            {t("product.batteryLabel")}
            {bateria && !limpiados.bateria && <IconoChequeo />}
            {limpiados.bateria && <IconoAviso />}
          </label>
          <select
            value={bateria}
            onChange={e => alCambiar("bateria", e.target.value)}
            className={`w-full border rounded-lg p-2.5 bg-white focus:ring-2 focus:ring-black focus:border-black ${limpiados.bateria ? "border-amber-400" : ""}`}
          >
            <option value="">{t("product.selectBattery")}</option>
            {bateriasDisp.map(b => (
              <option key={b.valor} value={b.valor}>{b.label}</option>
            ))}
          </select>
        </div>

      </div>

      {/* Precio */}
      <div className="border rounded-lg p-4 bg-gray-50">
        <div className="flex items-center justify-between">
          <span className="text-sm text-gray-500">
            {estado ? t("product.configPrice") : t("product.recommendedPrice")}
          </span>
          <span className="text-2xl font-bold">
            {hayResultado ? `${unidadCoincide.precio}€` : "—"}
          </span>
        </div>
        <div className="text-xs text-gray-500 mt-1">
          {hayResultado
            ? t("product.unitsAvailable")(unidadCoincide.stock)
            : t("product.noCombo")}
        </div>
      </div>

      {/* Botón compra */}
      <button
        onClick={agregarAlCarro}
        disabled={!puedoAgregar || agregando}
        className={`w-full py-3 rounded-lg text-white font-medium transition
          ${(!puedoAgregar || agregando)
            ? "bg-gray-400 cursor-not-allowed"
            : "bg-black hover:bg-gray-800"
          }`}
      >
        {agregando ? t("product.adding") : t("product.addToCart")}
      </button>

      {/* Información de confianza */}
      <div className="border rounded-xl p-4 space-y-4 text-sm">

        <div className="flex items-center gap-2">
          <svg className="w-4 h-4 text-gray-600 flex-shrink-0" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.955 11.955 0 003 12c0 6.627 5.373 12 12 12s12-5.373 12-12c0-2.03-.506-3.944-1.397-5.617" />
          </svg>
          <span className="font-medium text-gray-800">{t("product.warranty")}</span>
        </div>

        <div>
          <p className="text-xs text-gray-400 mb-2">{t("product.accepts")}</p>
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

        <div className="space-y-1.5 text-gray-600 text-xs">
          <div className="flex items-center gap-2">
            <svg className="w-3.5 h-3.5 flex-shrink-0" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 18.75a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m3 0h6m-9 0H3.375a1.125 1.125 0 01-1.125-1.125V14.25m17.25 4.5a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m3 0h1.125c.621 0 1.129-.504 1.09-1.124a17.902 17.902 0 00-3.213-9.193 2.056 2.056 0 00-1.58-.86H14.25M16.5 18.75h-2.25m0-11.177v-.958c0-.568-.422-1.048-.987-1.106a48.554 48.554 0 00-10.026 0 1.106 1.106 0 00-.987 1.106v7.635m12-6.677v6.677m0 4.5v-4.5m0 0h-12" />
            </svg>
            <span>{t("product.freeShipping")}</span>
          </div>
          <div className="flex items-center gap-2">
            <svg className="w-3.5 h-3.5 flex-shrink-0" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span>{t("product.vatIncluded")}</span>
          </div>
          <div className="flex items-center gap-2">
            <svg className="w-3.5 h-3.5 flex-shrink-0" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 13.5l10.5-11.25L12 10.5h8.25L9.75 21.75 12 13.5H3.75z" />
            </svg>
            <span>{t("product.chargerIncluded")}</span>
          </div>
        </div>

      </div>

    </div>

    {/* Modal lightbox estado */}
    {modalEstadoAbierto && estado && (
      <div
        className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm cursor-zoom-out"
        onClick={() => fijarModalEstadoAbierto(false)}
      >
        <img
          src={IMG_ESTADO[estado]}
          alt={estado}
          className="max-w-[90vw] max-h-[90vh] w-96 h-96 object-contain drop-shadow-2xl bg-white rounded-2xl p-4"
          onClick={e => e.stopPropagation()}
        />
      </div>
    )}
    </>
  )
}
