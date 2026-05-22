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

  const [modelo, fijarModelo]           = useState(null)
  const [unidades, fijarUnidades]       = useState([])
  const [cargando, fijarCargando]       = useState(true)
  const [imagenes, fijarImagenes]       = useState([])
  const [colorSeleccionado, fijarColorSeleccionado] = useState("")
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
    <div className="min-h-screen flex flex-col">

      <Navbar />

      <main className="flex-1">

        {cargando && <div className="p-10">{t("product.loading")}</div>}

        {!cargando && !modelo && (
          <div className="p-10">{t("product.notFound")}</div>
        )}

        {!cargando && modelo && (
          <div className="max-w-6xl mx-auto px-6 py-10 flex flex-col lg:flex-row gap-12">

            {/* IZQUIERDA */}
            <div className="flex-1 min-w-0 space-y-8">
              <ProductGallery imagenes={imagenes} selectedColor={colorGaleria} />
              <ProductInfo producto={modelo} />
            </div>

            {/* DERECHA */}
            <div className="lg:w-[440px] flex-shrink-0">
              <div className="sticky top-24">
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

          </div>
        )}

      </main>

      <Footer />

    </div>
  )
}
