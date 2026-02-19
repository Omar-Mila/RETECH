import { useEffect, useState } from "react"

const slides = [
  {
    title: "Reacondicionats premium",
    description: "Mòbils com nous, revisats i garantits fins a 24 mesos.",
    cta: "Comprar ara",
    image:
      "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9",
  },
  {
    title: "Tecnologia sostenible",
    description: "Millor per a tu. Millor per al planeta.",
    cta: "Descobreix més",
    image:
      "https://images.unsplash.com/photo-1580910051074-7b6c4f1f44b1",
  },
  {
    title: "Qualitat garantida",
    description: "Cada dispositiu passa controls estrictes de qualitat.",
    cta: "Com funciona",
    image:
      "https://images.unsplash.com/photo-1517336714731-489689fd1ca8",
  },
]

export default function Carousel() {
  const [current, setCurrent] = useState(0)

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrent((prev) => (prev + 1) % slides.length)
    }, 6000)

    return () => clearInterval(interval)
  }, [])

  return (
    <div className="relative w-full h-[420px] overflow-hidden">

      {slides.map((slide, index) => (
        <div
          key={index}
          className={`
            absolute inset-0 transition-opacity duration-700
            ${index === current ? "opacity-100" : "opacity-0"}
          `}
        >
          {/* Imatge de fons */}
          <img
            src={slide.image}
            alt={slide.title}
            className="w-full h-full object-cover"
          />

          {/* Overlay */}
          <div className="absolute inset-0 bg-linear-to-r from-black/80 via-black/40 to-transparent" />

          {/* Contingut */}
          <div className="absolute inset-0 flex items-center">
            <div className="px-10 max-w-xl text-white">
              <h2 className="text-4xl font-bold mb-4">
                {slide.title}
              </h2>
              <p className="text-lg mb-6">
                {slide.description}
              </p>

              <div className="flex gap-4">
                <button className="bg-white text-black px-6 py-3 rounded font-medium">
                  {slide.cta}
                </button>
                <button className="border border-white px-6 py-3 rounded font-medium">
                  Saber més
                </button>
              </div>
            </div>
          </div>
        </div>
      ))}

      {/* Dots */}
      <div className="absolute bottom-5 left-10 flex gap-2">
        {slides.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrent(index)}
            className={`w-3 h-3 rounded-full ${
              index === current ? "bg-white" : "bg-white/40"
            }`}
          />
        ))}
      </div>

    </div>
  )
}
