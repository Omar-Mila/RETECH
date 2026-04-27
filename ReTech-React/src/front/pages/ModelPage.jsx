import { useState, useEffect } from "react"
import { useParams } from "react-router-dom"
import { getProduct, getModelOptions, getModelImages } from "../../services/productService"

import Navbar from "../components/Navbar"
import Footer from "../components/Footer"
import ProductGallery from "../components/ProductPage/ProductGallery"
import ProductInfo from "../components/ProductPage/ProductInfo"
import ProductConfigurator from "../components/ProductPage/ProductConfigurator"

export default function ModelPage() {

  const { id } = useParams()

  const [model, setModel]     = useState(null)
  const [options, setOptions] = useState(null)
  const [loading, setLoading] = useState(true)
  const [images, setImages]   = useState([])
  const [selectedColor, setSelectedColor] = useState("")
  const [selectedState, setSelectedState] = useState("")

  useEffect(() => {
    let mounted = true
    async function loadData() {
      try {
        const [modelData, optionsData, imagesData] = await Promise.all([
          getProduct(id),
          getModelOptions(id),
          getModelImages(id),
        ])
        if (!mounted) return
        setModel(modelData)
        setOptions(optionsData)
        setImages(imagesData)
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

        {loading && <div className="p-10">Carregant model...</div>}

        {!loading && !model && (
          <div className="p-10">Model no trobat</div>
        )}

        {!loading && model && (
          <div className="max-w-6xl mx-auto px-6 py-10 flex flex-col lg:flex-row gap-12">

            {/* IZQUIERDA: scroll normal */}
            <div className="flex-1 min-w-0 space-y-8">
              <ProductGallery images={images} selectedColor={selectedColor} />
              <ProductInfo product={model} />
            </div>

            {/* DERECHA: wrapper que s'estira fins al final del contingut esquerre */}
            <div className="lg:w-[440px] flex-shrink-0">
              {/* El sticky s'ancora aquí dins i té tot el recorregut de la pàgina */}
              <div className="sticky top-24">
                <ProductConfigurator
                  options={options}
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
