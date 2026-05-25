import { useState, useEffect, useMemo } from "react"
import { useParams, useSearchParams } from "react-router-dom"
import { getProduct, getModelImages, getModelUnits } from "../../services/productService"

import Navbar from "../components/Navbar"
import Footer from "../components/Footer"
import ProductGallery from "../components/ProductPage/ProductGallery"
import ProductInfo from "../components/ProductPage/ProductInfo"
import ProductConfigurator from "../components/ProductPage/ProductConfigurator"
import { useLanguage } from "../context/LanguageContext"

export default function ModelPage() {
  const { t } = useLanguage()
  const { id } = useParams()
  const [searchParams] = useSearchParams()
  const initialMovilId = searchParams.get("movil")

  const [model, setModel]   = useState(null)
  const [units, setUnits]   = useState([])
  const [loading, setLoading] = useState(true)
  const [images, setImages] = useState([])
  const [selectedColor, setSelectedColor] = useState("")
  const [selectedState, setSelectedState] = useState("")

  // Color para la galería: si hay selección úsala, si no busca negro, si no el primero disponible
  const galleryColor = useMemo(() => {
    if (selectedColor) return selectedColor
    const negro = units.find(u => u.color?.toLowerCase() === "negro" || u.color?.toLowerCase() === "black")
    if (negro) return String(negro.color_id)
    return units[0] ? String(units[0].color_id) : ""
  }, [selectedColor, units])

  // URL de portada para el color activo (usada al añadir al carrito guest)
  const coverImageUrl = useMemo(() => {
    if (images.length === 0) return null
    const img = images.find(i => String(i.color_id) === String(galleryColor))
    return img?.url ?? images[0]?.url ?? null
  }, [images, galleryColor])

  useEffect(() => {
    let mounted = true
    async function loadData() {
      try {
        const [modelData, imagesData, unitsData] = await Promise.all([
          getProduct(id),
          getModelImages(id),
          getModelUnits(id),
        ])
        if (!mounted) return
        setModel(modelData)
        setImages(imagesData)
        setUnits(unitsData)

        // Pre-select color so the gallery filters correctly on first render
        if (unitsData.length > 0) {
          const firstUnit = initialMovilId
            ? (unitsData.find(u => String(u.id) === String(initialMovilId)) ?? unitsData[0])
            : unitsData[0]
          setSelectedColor(String(firstUnit.color_id))
        }
      } catch (e) {
        console.error(e)
        if (mounted) setModel(null)
      } finally {
        if (mounted) setLoading(false)
      }
    }
    loadData()
    return () => { mounted = false }
  }, [id])

  return (
    <div className="min-h-screen flex flex-col">

      <Navbar />

      <main className="flex-1">

        {loading && <div className="p-10">{t("product.loading")}</div>}

        {!loading && !model && (
          <div className="p-10">{t("product.notFound")}</div>
        )}

        {!loading && model && (
          <div className="max-w-6xl mx-auto px-6 py-10 flex flex-col lg:flex-row gap-12">

            {/* IZQUIERDA */}
            <div className="flex-1 min-w-0 space-y-8">
              <ProductGallery images={images} selectedColor={galleryColor} />
              <ProductInfo product={model} />
            </div>

            {/* DERECHA */}
            <div className="lg:w-[440px] flex-shrink-0">
              <div className="sticky top-24">
                <ProductConfigurator
                  units={units}
                  initialMovilId={initialMovilId}
                  selectedColor={selectedColor}
                  setSelectedColor={setSelectedColor}
                  selectedState={selectedState}
                  setSelectedState={setSelectedState}
                  productName={model.nombre}
                  coverImage={coverImageUrl}
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
