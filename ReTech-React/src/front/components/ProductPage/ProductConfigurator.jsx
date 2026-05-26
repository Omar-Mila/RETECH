import { useMemo, useState, useEffect } from "react"
import { obtenerCarritoInvitado, guardarCarritoInvitado } from "../../../services/guestCart"
import { useIdioma } from "../../context/LanguageContext"
import { useAutenticacion } from "../../../auth/AuthContext"

const IMG_ESTADO = {
  "Como nuevo": "/img/estado/new.avif",
  "Buen estado": "/img/estado/mid.avif",
  "Funcional":   "/img/estado/low.avif",
}

const ETIQ_BATERIA = (b) => {
  if (b >= 100) return "Nueva (100%)"
  if (b >= 90)  return "Excelente Estado (90-95%)"
  if (b >= 80)  return "Buen Estado (80-90%)"
  return `${b}%`
}

function IconoAviso() {
  return (
    <svg className="pc-icon-warn" viewBox="0 0 20 20" fill="currentColor">
      <path fillRule="evenodd" d="M8.485 2.495c.673-1.167 2.357-1.167 3.03 0l6.28 10.875c.673 1.167-.17 2.625-1.516 2.625H3.72c-1.347 0-2.189-1.458-1.515-2.625L8.485 2.495zM10 5a.75.75 0 01.75.75v3.5a.75.75 0 01-1.5 0v-3.5A.75.75 0 0110 5zm0 9a1 1 0 100-2 1 1 0 000 2z" clipRule="evenodd" />
    </svg>
  )
}

function IconoChequeo() {
  return (
    <svg className="pc-icon-check" viewBox="0 0 20 20" fill="currentColor">
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

  const [agregando,           fijarAgregando]           = useState(false)
  const [modalEstadoAbierto,  fijarModalEstadoAbierto]  = useState(false)
  const [estado,              setEstado]                = useState("")
  const [almacenamiento,      setAlmacenamiento]        = useState("")
  const [bateria,             setBateria]               = useState("")
  const [limpiados,           fijarLimpiados]           = useState({})

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
        (!estado        || u.estado === estado) &&
        (!selectedColor || String(u.color_id) === selectedColor) &&
        (!bateria       || u.salud_bateria >= Number(bateria))
      )
      .map(u => u.almacenamiento)
  )].sort((a, b) => a - b), [units, estado, selectedColor, bateria])

  const coloresDisp = useMemo(() => {
    const seen = new Set()
    return units
      .filter(u =>
        (!estado         || u.estado === estado) &&
        (!almacenamiento || u.almacenamiento === Number(almacenamiento)) &&
        (!bateria        || u.salud_bateria >= Number(bateria))
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
      .filter(({ label }) => { if (seen.has(label)) return false; seen.add(label); return true })
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
      if (excluir !== "estado"         && siguiente.estado         && u.estado !== siguiente.estado)                          return false
      if (excluir !== "almacenamiento" && siguiente.almacenamiento && u.almacenamiento !== Number(siguiente.almacenamiento)) return false
      if (excluir !== "color"          && siguiente.color          && String(u.color_id) !== String(siguiente.color))        return false
      if (excluir !== "bateria"        && siguiente.bateria        && u.salud_bateria < Number(siguiente.bateria))           return false
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
    if (!puedoAgregar) { alert(t("product.selectValidCombo")); return }

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
          "Content-Type":    "application/json",
          "Accept":          "application/json",
          "X-Requested-With":"XMLHttpRequest",
          "X-XSRF-TOKEN":    decodeURIComponent(tokenXsrf || ""),
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

  const haySeleccion    = !!(estado || almacenamiento || selectedColor || bateria)
  const todoSeleccionado = !!(estado && almacenamiento && selectedColor && bateria)
  const hayResultado    = haySeleccion && !!unidadCoincide
  const puedoAgregar    = todoSeleccionado && !!unidadCoincide
  const infoEstado      = t("product.stateInfo")

  return (
    <>
    <div className="pc-container">

      {/* Nombre + botón limpiar */}
      {productName && (
        <div className="pc-header">
          <h1 className="pc-title">{productName}</h1>
          {haySeleccion && (
            <button
              className="pc-btn-clear"
              onClick={() => {
                setEstado(""); setAlmacenamiento(""); setSelectedColor("")
                setSelectedState(""); setBateria(""); fijarLimpiados({})
              }}
            >
              {t("product.clearFields")}
            </button>
          )}
        </div>
      )}

      {/* Campos de selección */}
      <div className="pc-fields">

        {/* Estado */}
        <div className="pc-field">
          <label className="pc-field-label">
            <span className="pc-field-label-left">
              {t("product.stateLabel")}
              {estado && !limpiados.estado && <IconoChequeo />}
              {limpiados.estado && <IconoAviso />}
            </span>
            {estado && (
              <button className="pc-field-clear" onClick={() => alCambiar("estado", "")} aria-label="Limpiar estado">✕</button>
            )}
          </label>
          <select
            value={estado}
            onChange={e => alCambiar("estado", e.target.value)}
            className={`pc-select${limpiados.estado ? " pc-select--warning" : ""}`}
          >
            <option value="">{t("product.selectState")}</option>
            {estadosDisp.map(e => <option key={e} value={e}>{e}</option>)}
          </select>
        </div>

        {/* Preview estado */}
        {estado && infoEstado[estado] && (
          <div className="pc-estado-preview">
            <img
              src={IMG_ESTADO[estado]}
              alt={infoEstado[estado].badge}
              onClick={() => fijarModalEstadoAbierto(true)}
              className="pc-estado-img"
            />
            <div>
              <span className="pc-estado-badge">{infoEstado[estado].badge}</span>
              <p className="pc-estado-desc">{infoEstado[estado].desc}</p>
            </div>
          </div>
        )}

        {/* Almacenamiento */}
        <div className="pc-field">
          <label className="pc-field-label">
            <span className="pc-field-label-left">
              {t("product.storageLabel")}
              {almacenamiento && !limpiados.almacenamiento && <IconoChequeo />}
              {limpiados.almacenamiento && <IconoAviso />}
            </span>
            {almacenamiento && (
              <button className="pc-field-clear" onClick={() => alCambiar("almacenamiento", "")} aria-label="Limpiar almacenamiento">✕</button>
            )}
          </label>
          <select
            value={almacenamiento}
            onChange={e => alCambiar("almacenamiento", e.target.value)}
            className={`pc-select${limpiados.almacenamiento ? " pc-select--warning" : ""}`}
          >
            <option value="">{t("product.selectStorage")}</option>
            {almacDisp.map(a => <option key={a} value={a}>{a} GB</option>)}
          </select>
        </div>

        {/* Color */}
        <div className="pc-field">
          <label className="pc-field-label">
            <span className="pc-field-label-left">
              {t("product.colorLabel")}
              {selectedColor && !limpiados.color && <IconoChequeo />}
              {limpiados.color && <IconoAviso />}
            </span>
            {selectedColor && (
              <button className="pc-field-clear" onClick={() => alCambiar("color", "")} aria-label="Limpiar color">✕</button>
            )}
          </label>
          <select
            value={selectedColor}
            onChange={e => alCambiar("color", e.target.value)}
            className={`pc-select${limpiados.color ? " pc-select--warning" : ""}`}
          >
            <option value="">{t("product.selectColor")}</option>
            {coloresDisp.map(c => <option key={c.id} value={c.id}>{c.nombre}</option>)}
          </select>
        </div>

        {/* Batería */}
        <div className="pc-field">
          <label className="pc-field-label">
            <span className="pc-field-label-left">
              {t("product.batteryLabel")}
              {bateria && !limpiados.bateria && <IconoChequeo />}
              {limpiados.bateria && <IconoAviso />}
            </span>
            {bateria && (
              <button className="pc-field-clear" onClick={() => alCambiar("bateria", "")} aria-label="Limpiar batería">✕</button>
            )}
          </label>
          <select
            value={bateria}
            onChange={e => alCambiar("bateria", e.target.value)}
            className={`pc-select${limpiados.bateria ? " pc-select--warning" : ""}`}
          >
            <option value="">{t("product.selectBattery")}</option>
            {bateriasDisp.map(b => <option key={b.valor} value={b.valor}>{b.label}</option>)}
          </select>
        </div>

      </div>

      {/* Precio */}
      <div className="pc-price-card">

        {/* Resumen chips */}
        {haySeleccion && (
          <div className="pc-summary">
            {estado && (
              <span className="pc-chip">
                <svg className="pc-chip-icon" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>
                </svg>
                <span className="pc-chip-label">{t("product.stateLabel")}</span>
                <span className="pc-chip-value">{estado}</span>
              </span>
            )}
            {almacenamiento && (
              <span className="pc-chip">
                <svg className="pc-chip-icon" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M20.25 6.375c0 2.278-3.694 4.125-8.25 4.125S3.75 8.653 3.75 6.375m16.5 0c0-2.278-3.694-4.125-8.25-4.125S3.75 4.097 3.75 6.375m16.5 0v11.25c0 2.278-3.694 4.125-8.25 4.125s-8.25-1.847-8.25-4.125V6.375"/>
                </svg>
                <span className="pc-chip-value">{almacenamiento} GB</span>
              </span>
            )}
            {selectedColor && (
              <span className="pc-chip">
                <svg className="pc-chip-icon" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M4.098 19.902a3.75 3.75 0 005.304 0l6.401-6.402M6.75 21A3.75 3.75 0 013 17.25V4.125C3 3.504 3.504 3 4.125 3h5.25c.621 0 1.125.504 1.125 1.125v4.072M6.75 21a3.75 3.75 0 003.75-3.75V8.197M6.75 21h13.125c.621 0 1.125-.504 1.125-1.125v-5.25c0-.621-.504-1.125-1.125-1.125h-4.072M10.5 8.197l2.88-2.88c.438-.439 1.15-.439 1.59 0l3.712 3.713c.44.44.44 1.152 0 1.59l-2.879 2.88"/>
                </svg>
                <span className="pc-chip-value">{coloresDisp.find(c => String(c.id) === selectedColor)?.nombre}</span>
              </span>
            )}
            {bateria && (
              <span className="pc-chip">
                <svg className="pc-chip-icon" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M21 10.5h.375a.375.375 0 01.375.375v2.25a.375.375 0 01-.375.375H21m-9 6h9a2.25 2.25 0 002.25-2.25v-6a2.25 2.25 0 00-2.25-2.25h-9m-6.75 0H3a2.25 2.25 0 00-2.25 2.25v6A2.25 2.25 0 003 17.25h9.75"/>
                </svg>
                <span className="pc-chip-value">{ETIQ_BATERIA(Number(bateria))}</span>
              </span>
            )}
          </div>
        )}

        <div className="pc-price-row">
          <span className="pc-price-label">
            {estado ? t("product.configPrice") : t("product.recommendedPrice")}
          </span>
          <span className="pc-price-amount">
            {hayResultado ? `${unidadCoincide.precio}€` : "—"}
          </span>
        </div>
        <div className="pc-price-sub">
          {hayResultado
            ? t("product.unitsAvailable")(unidadCoincide.stock)
            : t("product.noCombo")}
        </div>
      </div>

      {/* Botón compra */}
      <button
        onClick={agregarAlCarro}
        disabled={!puedoAgregar || agregando}
        className={`pc-btn-buy${(!puedoAgregar || agregando) ? " pc-btn-buy--disabled" : ""}`}
      >
        {agregando ? t("product.adding") : t("product.addToCart")}
      </button>

      {/* Información de confianza */}
      <div className="pc-trust">

        <div className="pc-warranty">
          <svg className="pc-icon-lg" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75 11.25 15 15 9.75M21 12c0 1.268-.63 2.39-1.593 3.068a3.745 3.745 0 0 1-1.043 3.296 3.745 3.745 0 0 1-3.296 1.043A3.745 3.745 0 0 1 12 21c-1.268 0-2.39-.63-3.068-1.593a3.745 3.745 0 0 1-3.296-1.043 3.745 3.745 0 0 1-1.043-3.296A3.745 3.745 0 0 1 3 12c0-1.268.63-2.39 1.593-3.068a3.745 3.745 0 0 1 1.043-3.296 3.746 3.746 0 0 1 3.296-1.043A3.746 3.746 0 0 1 12 3c1.268 0 2.39.63 3.068 1.593a3.746 3.746 0 0 1 3.296 1.043 3.746 3.746 0 0 1 1.043 3.296A3.745 3.745 0 0 1 21 12Z" />
          </svg>
          <span className="pc-warranty-text">{t("product.warranty")}</span>
        </div>

        <div className="pc-payments">
          <p className="pc-payments-label">{t("product.accepts")}</p>
          <div className="pc-payments-list">
            <span className="pc-pay-item pc-pay-visa">VISA</span>
            <span className="pc-pay-item pc-pay-mc">
              <span className="pc-mc-red"></span>
              <span className="pc-mc-orange"></span>
            </span>
            <span className="pc-pay-item pc-pay-pp">
              <span className="pc-pp-blue">Pay</span><span className="pc-pp-cyan">Pal</span>
            </span>
            <span className="pc-pay-item pc-pay-bizum">bizum</span>
            <span className="pc-pay-item pc-pay-apple"> Pay</span>
          </div>
        </div>

        <div className="pc-info-list">
          <div className="pc-info-item">
            <svg className="pc-icon-md" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 18.75a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m3 0h6m-9 0H3.375a1.125 1.125 0 01-1.125-1.125V14.25m17.25 4.5a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m3 0h1.125c.621 0 1.129-.504 1.09-1.124a17.902 17.902 0 00-3.213-9.193 2.056 2.056 0 00-1.58-.86H14.25M16.5 18.75h-2.25m0-11.177v-.958c0-.568-.422-1.048-.987-1.106a48.554 48.554 0 00-10.026 0 1.106 1.106 0 00-.987 1.106v7.635m12-6.677v6.677m0 4.5v-4.5m0 0h-12" />
            </svg>
            <span>{t("product.freeShipping")}</span>
          </div>
          <div className="pc-info-item">
            <svg className="pc-icon-md" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span>{t("product.vatIncluded")}</span>
          </div>
          <div className="pc-info-item">
            <svg className="pc-icon-md" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 13.5l10.5-11.25L12 10.5h8.25L9.75 21.75 12 13.5H3.75z" />
            </svg>
            <span>{t("product.chargerIncluded")}</span>
          </div>
        </div>

      </div>

    </div>

    {/* Modal lightbox estado */}
    {modalEstadoAbierto && estado && (
      <div className="pc-modal-overlay" onClick={() => fijarModalEstadoAbierto(false)}>
        <img
          src={IMG_ESTADO[estado]}
          alt={estado}
          className="pc-modal-img"
          onClick={e => e.stopPropagation()}
        />
      </div>
    )}

    <style>{`

      /* Iconos */
      .pc-icon-warn {
        width: 0.875rem; height: 0.875rem;
        color: #f59e0b;
        flex-shrink: 0;
      }
      .pc-icon-check {
        width: 0.875rem; height: 0.875rem;
        color: #22c55e;
        flex-shrink: 0;
      }
      .pc-icon-md {
        width: 0.875rem; height: 0.875rem;
        flex-shrink: 0;
      }
      .pc-icon-lg {
        width: 1rem; height: 1rem;
        color: #4b5563;
        flex-shrink: 0;
      }

      /* Contenedor principal */
      .pc-container {
        display: flex;
        flex-direction: column;
        gap: 1.5rem;
      }

      /* Cabecera nombre + limpiar */
      .pc-header {
        display: flex;
        align-items: center;
        justify-content: space-between;
        gap: 0.75rem;
      }
      .pc-title {
        font-size: 1.5rem;
        font-weight: 700;
        margin: 0;
      }
      .pc-btn-clear {
        font-size: 0.75rem;
        color: #fff;
        background: #000;
        padding: 0.375rem 0.75rem;
        border-radius: 0.375rem;
        border: none;
        cursor: pointer;
        font-weight: 500;
        flex-shrink: 0;
        white-space: nowrap;
      }

      /* Campos */
      .pc-fields {
        display: flex;
        flex-direction: column;
        gap: 1rem;
      }
      .pc-field {
        display: flex;
        flex-direction: column;
      }
      .pc-field-label {
        display: flex;
        align-items: center;
        justify-content: space-between;
        font-size: 0.875rem;
        font-weight: 500;
        color: #374151;
        margin-bottom: 0.25rem;
      }
      .pc-field-label-left {
        display: flex;
        align-items: center;
        gap: 0.375rem;
      }
      .pc-field-clear {
        background: none;
        border: none;
        cursor: pointer;
        color: #ef4444;
        font-size: 0.75rem;
        line-height: 1;
        padding: 0;
      }
      .pc-select {
        width: 100%;
        border: 1px solid #d1d5db;
        border-radius: 0.5rem;
        padding: 0.625rem;
        background: #fff;
        font-size: 0.875rem;
        outline: none;
        transition: border-color 0.15s, box-shadow 0.15s;
      }
      .pc-select:focus {
        border-color: #000;
        box-shadow: 0 0 0 2px rgba(0,0,0,0.15);
      }
      .pc-select--warning {
        border-color: #fbbf24;
      }

      /* Preview estado */
      .pc-estado-preview {
        display: flex;
        gap: 0.75rem;
        align-items: center;
        border: 1px solid #e5e7eb;
        border-radius: 0.75rem;
        overflow: hidden;
        background: #f9fafb;
        padding: 0.75rem;
      }
      .pc-estado-img {
        width: 5rem; height: 5rem;
        object-fit: contain;
        flex-shrink: 0;
        cursor: zoom-in;
        transition: transform 0.2s;
      }
      .pc-estado-img:hover { transform: scale(1.05); }
      .pc-estado-badge {
        display: inline-block;
        font-size: 0.75rem;
        font-weight: 600;
        background: #000;
        color: #fff;
        padding: 0.125rem 0.5rem;
        border-radius: 9999px;
        margin-bottom: 0.25rem;
      }
      .pc-estado-desc {
        font-size: 0.75rem;
        color: #4b5563;
        line-height: 1.4;
        margin: 0;
      }

      /* Tarjeta precio */
      .pc-price-card {
        border: 1px solid #e5e7eb;
        border-radius: 0.5rem;
        padding: 1rem;
        background: #f9fafb;
      }

      /* Chips resumen */
      .pc-summary {
        display: flex;
        flex-wrap: wrap;
        gap: 0.375rem;
        margin-bottom: 0.75rem;
        padding-bottom: 0.75rem;
        border-bottom: 1px solid #e5e7eb;
      }
      .pc-chip {
        display: inline-flex;
        align-items: center;
        gap: 0.375rem;
        font-size: 0.75rem;
        background: #fff;
        border: 1px solid #e5e7eb;
        border-radius: 9999px;
        padding: 0.25rem 0.625rem;
        color: #374151;
      }
      .pc-chip-icon {
        width: 0.75rem; height: 0.75rem;
        color: #9ca3af;
        flex-shrink: 0;
      }
      .pc-chip-label {
        color: #9ca3af;
      }
      .pc-chip-value {
        font-weight: 500;
        color: #1f2937;
      }

      /* Fila precio */
      .pc-price-row {
        display: flex;
        align-items: center;
        justify-content: space-between;
      }
      .pc-price-label {
        font-size: 1.125rem;
        font-weight: 700;
        color: #0f172a;
      }
      .pc-price-amount {
        font-size: 1.5rem;
        font-weight: 700;
      }
      .pc-price-sub {
        font-size: 0.75rem;
        color: #6b7280;
        margin-top: 0.25rem;
      }

      /* Botón compra */
      .pc-btn-buy {
        width: 100%;
        padding: 0.75rem;
        border-radius: 0.5rem;
        border: none;
        color: #fff;
        background: #000;
        font-weight: 500;
        font-size: 1rem;
        cursor: pointer;
        transition: background 0.15s;
      }
      .pc-btn-buy:hover { background: #1f2937; }
      .pc-btn-buy--disabled {
        background: #9ca3af;
        cursor: not-allowed;
      }
      .pc-btn-buy--disabled:hover { background: #9ca3af; }

      /* Sección confianza */
      .pc-trust {
        border: 1px solid #e5e7eb;
        border-radius: 0.75rem;
        padding: 1rem;
        display: flex;
        flex-direction: column;
        gap: 1rem;
        font-size: 0.875rem;
      }
      .pc-warranty {
        display: flex;
        align-items: center;
        gap: 0.5rem;
      }
      .pc-warranty-text {
        font-weight: 500;
        color: #1f2937;
      }

      /* Métodos de pago */
      .pc-payments-label {
        font-size: 0.75rem;
        color: #9ca3af;
        margin-bottom: 0.5rem;
      }
      .pc-payments-list {
        display: flex;
        align-items: center;
        flex-wrap: wrap;
        gap: 0.5rem;
      }
      .pc-pay-item {
        display: inline-flex;
        align-items: center;
        padding: 0.25rem 0.625rem;
        border-radius: 0.25rem;
        border: 1px solid #e5e7eb;
        font-size: 0.75rem;
        font-weight: 700;
      }
      .pc-pay-visa    { background: #1A1F71; color: #fff; letter-spacing: 0.1em; }
      .pc-pay-mc      { background: #fff; gap: 0; padding: 0.25rem 0.5rem; }
      .pc-mc-red      { width: 1rem; height: 1rem; border-radius: 9999px; background: #EB001B; display: inline-block; }
      .pc-mc-orange   { width: 1rem; height: 1rem; border-radius: 9999px; background: #F79E1B; display: inline-block; margin-left: -0.5rem; }
      .pc-pay-pp      { background: #fff; }
      .pc-pp-blue     { color: #003087; }
      .pc-pp-cyan     { color: #009cde; }
      .pc-pay-bizum   { background: #00c2a8; color: #fff; }
      .pc-pay-apple   { background: #000; color: #fff; font-weight: 600; letter-spacing: -0.025em; }

      /* Lista info */
      .pc-info-list {
        display: flex;
        flex-direction: column;
        gap: 0.375rem;
        font-size: 0.75rem;
        color: #4b5563;
      }
      .pc-info-item {
        display: flex;
        align-items: center;
        gap: 0.5rem;
      }

      /* Modal */
      .pc-modal-overlay {
        position: fixed;
        inset: 0;
        z-index: 50;
        display: flex;
        align-items: center;
        justify-content: center;
        background: rgba(0,0,0,0.6);
        backdrop-filter: blur(4px);
        cursor: zoom-out;
      }
      .pc-modal-img {
        max-width: 90vw;
        max-height: 90vh;
        width: 24rem;
        height: 24rem;
        object-fit: contain;
        background: #fff;
        border-radius: 1rem;
        padding: 1rem;
        filter: drop-shadow(0 25px 25px rgba(0,0,0,0.15));
      }

      /* Responsive */
      @media (max-width: 480px) {
        .pc-title        { font-size: 1.2rem; }
        .pc-btn-clear    { font-size: 0.7rem; padding: 0.3rem 0.6rem; }
        .pc-price-amount { font-size: 1.25rem; }
        .pc-btn-buy      { font-size: 0.95rem; padding: 0.7rem; }
        .pc-estado-img   { width: 3.5rem; height: 3.5rem; }
        .pc-payments-list{ gap: 0.375rem; }
        .pc-modal-img    { width: 90vw; height: auto; }
      }

    `}</style>
    </>
  )
}
