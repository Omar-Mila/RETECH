import { useEffect, useState } from "react";
import { useIdioma } from "../context/LanguageContext";

const imagenesSlide = [
  "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?auto=format&fit=crop&w=1400&h=420&q=80",
  "https://images.pexels.com/photos/19037726/pexels-photo-19037726.jpeg",
  "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?auto=format&fit=crop&w=1400&h=420&q=80",
];

export default function Carousel() {
  const { t } = useIdioma();
  const diapositivas = t('carousel.slides');
  const [actual, fijarActual] = useState(0);

  useEffect(() => {
    const intervalo = setInterval(() => {
      fijarActual((prev) => (prev + 1) % diapositivas.length);
    }, 6000);
    return () => clearInterval(intervalo);
  }, [diapositivas.length]);

  return (
    <div className="relative w-full h-[420px] overflow-hidden">

      {diapositivas.map((diapositiva, indice) => (
        <div
          key={indice}
          className={`
            absolute inset-0 transition-opacity duration-700
            ${indice === actual ? "opacity-100" : "opacity-0"}
          `}
        >
          <img
            src={imagenesSlide[indice]}
            alt={diapositiva.title}
            className="w-full h-full object-cover"
          />

          <div className="absolute inset-0 bg-linear-to-r from-black/80 via-black/40 to-transparent" />

          <div className="absolute inset-0 flex items-center">
            <div className="px-10 max-w-xl text-white">
              <h2 className="text-4xl font-bold mb-4">
                {diapositiva.title}
              </h2>
              <p className="text-lg mb-6">
                {diapositiva.description}
              </p>

              <div className="flex gap-4">
                <button className="bg-white text-black px-6 py-3 rounded font-medium">
                  {diapositiva.cta}
                </button>
                <button className="border border-white px-6 py-3 rounded font-medium">
                  {t('carousel.knowMore')}
                </button>
              </div>
            </div>
          </div>
        </div>
      ))}

      <div className="absolute bottom-5 left-10 flex gap-2">
        {diapositivas.map((_, indice) => (
          <button
            key={indice}
            onClick={() => fijarActual(indice)}
            className={`w-3 h-3 rounded-full ${
              indice === actual ? "bg-white" : "bg-white/40"
            }`}
          />
        ))}
      </div>

    </div>
  );
}
