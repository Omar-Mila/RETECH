import { useState, useEffect } from "react"
import { useParams } from "react-router-dom"
import { getProduct, getModelOptions } from "../../services/productService"
import { getModelImages } from "../../services/productService";


import Navbar from "../components/Navbar"
import Footer from "../components/Footer"
import ProductGallery from "../components/ProductPage/ProductGallery"
import ProductInfo from "../components/ProductPage/ProductInfo"
import ProductConfigurator from "../components/ProductPage/ProductConfigurator"
import StateImage from "../components/ProductPage/StateImage"

export default function ModelPage() {

  const { id } = useParams()

  const [model, setModel] = useState(null)
  const [options, setOptions] = useState(null)
  const [loading, setLoading] = useState(true)
  const [images, setImages] = useState([]);
  const [selectedColor, setSelectedColor] = useState("")
  const [selectedState, setSelectedState] = useState("")

  useEffect(() => {
    let mounted = true

    async function loadData() {
      try {

        const modelData = await getProduct(id)
        const optionsData = await getModelOptions(id)
        const imagesData = await getModelImages(id) 

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

    return () => {
      mounted = false
    }

  }, [id])

  return (
    <div className="min-h-screen flex flex-col">

      <Navbar />

      <main className="flex-1">

        {loading && <div className="p-10">Carregant model...</div>}

        {!loading && !model && (
          <div className="p-10">
            Model no trobat
          </div>
        )}

        {!loading && model && (
          <div className="max-w-6xl mx-auto px-6 py-10 grid grid-cols-1 lg:grid-cols-2 gap-12">

            {/* IZQUIERDA */}
            <div className="lg:top-24 h-fit">
                <ProductGallery 
                    images={images} 
                    selectedColor={selectedColor} 
                />

                <StateImage selectedState={selectedState} />
                
            </div>

            {/* DERECHA */}
            <div className="space-y-8">

                <ProductInfo product={model} />

                <ProductConfigurator
                  options={options}
                  selectedColor={selectedColor}
                  setSelectedColor={setSelectedColor}
                  selectedState={selectedState}
                  setSelectedState={setSelectedState}
                />

            </div>

          </div>
          
        
        )}

      </main>

      <Footer />

    </div>
  )
}