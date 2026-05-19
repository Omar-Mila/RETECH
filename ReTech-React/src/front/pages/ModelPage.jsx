import { useState, useEffect } from "react"
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
              <ProductGallery images={images} selectedColor={selectedColor} />
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
