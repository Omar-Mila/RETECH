import { useState, useEffect, useMemo } from "react"
import { useParams, useSearchParams } from "react-router-dom"
import { obtenerProducto, obtenerImagenesModelo, obtenerUnidadesModelo } from "../../services/productService"

import Navbar from "../components/Navbar"
import Footer from "../components/Footer"
import ProductGallery from "../components/ProductPage/ProductGallery"
import ProductInfo from "../components/ProductPage/ProductInfo"
import ProductConfigurator from "../components/ProductPage/ProductConfigurator"
import { useIdioma } from "../context/LanguageContext"

export default function ModelPage() {
  const { t } = useIdioma()
  const { id } = useParams()
  const [searchParams] = useSearchParams()
  const initialMovilId = searchParams.get("movil")

  const [modelo,             fijarModelo]             = useState(null)
  const [unidades,           fijarUnidades]           = useState([])
  const [cargando,           fijarCargando]           = useState(true)
  const [imagenes,           fijarImagenes]           = useState([])
  const [colorSeleccionado,  fijarColorSeleccionado]  = useState("")
  const [estadoSeleccionado, fijarEstadoSeleccionado] = useState("")

  const colorGaleria = useMemo(() => {
    if (colorSeleccionado) return colorSeleccionado
    const negro = unidades.find(u => u.color?.toLowerCase() === "negro" || u.color?.toLowerCase() === "black")
    if (negro) return String(negro.color_id)
    return unidades[0] ? String(unidades[0].color_id) : ""
  }, [colorSeleccionado, unidades])

  const urlPortada = useMemo(() => {
    if (imagenes.length === 0) return null
    const img = imagenes.find(i => String(i.color_id) === String(colorGaleria))
    return img?.url ?? imagenes[0]?.url ?? null
  }, [imagenes, colorGaleria])

  useEffect(() => {
    let montado = true
    async function cargarDatos() {
      try {
        const [datosModelo, datosImagenes, datosUnidades] = await Promise.all([
          obtenerProducto(id),
          obtenerImagenesModelo(id),
          obtenerUnidadesModelo(id),
        ])
        if (!montado) return
        fijarModelo(datosModelo)
        fijarImagenes(datosImagenes)
        fijarUnidades(datosUnidades)

        if (datosUnidades.length > 0) {
          const primeraUnidad = initialMovilId
            ? (datosUnidades.find(u => String(u.id) === String(initialMovilId)) ?? datosUnidades[0])
            : datosUnidades[0]
          fijarColorSeleccionado(String(primeraUnidad.color_id))
        }
      } catch (e) {
        console.error(e)
        if (montado) fijarModelo(null)
      } finally {
        if (montado) fijarCargando(false)
      }
    }
    cargarDatos()
    return () => { montado = false }
  }, [id])

  return (
    <div className="mp-page">

      <Navbar />

      <main className="mp-main">

        {cargando && (
          <div className="mp-state-msg">{t("product.loading")}</div>
        )}

        {!cargando && !modelo && (
          <div className="mp-state-msg">{t("product.notFound")}</div>
        )}

        {!cargando && modelo && (
          <div className="mp-layout">

            {/* 1 — Galería */}
            <div className="mp-gallery-wrap">
              <ProductGallery imagenes={imagenes} selectedColor={colorGaleria} />
            </div>

            {/* 2 — Configurador (selectors + compra) */}
            <div className="mp-right">
              <div className="mp-sticky">
                <ProductConfigurator
                  units={unidades}
                  initialMovilId={initialMovilId}
                  selectedColor={colorSeleccionado}
                  setSelectedColor={fijarColorSeleccionado}
                  selectedState={estadoSeleccionado}
                  setSelectedState={fijarEstadoSeleccionado}
                  productName={modelo.nombre}
                  coverImage={urlPortada}
                />
              </div>
            </div>

            {/* 3 — Atributos extra */}
            <div className="mp-info-wrap">
              <ProductInfo producto={modelo} />
            </div>

          </div>
        )}

      </main>

      <Footer />

      <style>{`

        /* Página */
        .mp-page {
          min-height: 100vh;
          display: flex;
          flex-direction: column;
        }

        /* Main */
        .mp-main { flex: 1; }

        /* Mensajes de estado */
        .mp-state-msg {
          padding: 2.5rem;
          color: #64748b;
          font-size: 0.9rem;
        }

        /* Layout principal — grid de 2 columnas */
        .mp-layout {
          max-width: 72rem;
          margin: 0 auto;
          padding: 2.5rem 1.5rem;
          display: grid;
          grid-template-columns: 1fr 440px;
          grid-template-rows: auto 1fr;
          grid-template-areas:
            "gallery  config"
            "info     config";
          column-gap: 3rem;
          row-gap: 2rem;
          align-items: start;
        }

        .mp-gallery-wrap { grid-area: gallery; min-width: 0; }
        .mp-right        { grid-area: config;  min-width: 0; }
        .mp-info-wrap    { grid-area: info;    min-width: 0; }

        /* Sticky del configurador */
        .mp-sticky {
          position: sticky;
          top: 6rem;
        }

        /* Responsive */

        /* Tablet / móvil (≤1024px): columna única, orden: galería → config → info */
        @media (max-width: 1024px) {
          .mp-layout {
            grid-template-columns: 1fr;
            grid-template-rows: auto;
            grid-template-areas:
              "gallery"
              "config"
              "info";
            column-gap: 0;
            row-gap: 2rem;
          }
          .mp-sticky { position: static; }
        }

        @media (max-width: 640px) {
          .mp-layout { padding: 1.5rem 1rem; row-gap: 1.5rem; }
        }

        @media (max-width: 480px) {
          .mp-layout { padding: 1rem 0.75rem; row-gap: 1.25rem; }
        }

      `}</style>

    </div>
  )
}
