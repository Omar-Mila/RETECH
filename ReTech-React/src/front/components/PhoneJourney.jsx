import { useEffect, useState, Fragment } from "react";
import {
  InboxArrowDownIcon,
  MagnifyingGlassIcon,
  WrenchScrewdriverIcon,
  ShieldCheckIcon,
  TruckIcon,
} from "@heroicons/react/24/outline";
import { useIdioma } from "../context/LanguageContext";

const iconosPasos = [
  InboxArrowDownIcon,
  MagnifyingGlassIcon,
  WrenchScrewdriverIcon,
  ShieldCheckIcon,
  TruckIcon,
];

export default function PhoneJourney() {
  const { t } = useIdioma();
  const pasos = t('journey.steps');
  const [activo, fijarActivo] = useState(0);

  useEffect(() => {
    const intervalo = setInterval(() => {
      fijarActivo(prev => (prev + 1) % pasos.length);
    }, 2000);
    return () => clearInterval(intervalo);
  }, [pasos.length]);

  return (
    <>
    <style>{`
      .linea-fill {
        position: absolute;
        inset-y: 0;
        left: 0;
        background: #000;
        transition: width 0.7s ease-in-out;
        width: 0%;
      }
      .linea-fill.activa {
        width: 100%;
      }
      .linea-v-fill {
        position: absolute;
        inset-x: 0;
        top: 0;
        background: #000;
        transition: height 0.7s ease-in-out;
        height: 0%;
      }
      .linea-v-fill.activa {
        height: 100%;
      }
    `}</style>
    <section className="w-full bg-gray-50 py-20 border-t border-gray-100">
      <div className="max-w-5xl mx-auto px-6">

        <h2 className="text-3xl md:text-4xl font-bold text-center mb-3">
          {t('journey.title')}
        </h2>
        <p className="text-center text-gray-500 text-sm mb-16">
          {t('journey.subtitle')}
        </p>

        {/* Desktop */}
        <div className="hidden md:flex items-start">
          {pasos.map((paso, i) => {
            const Icono = iconosPasos[i];
            const estaActivo = i === activo;
            const estaHecho = i < activo;

            return (
              <Fragment key={i}>
                <div className="flex flex-col items-center w-28 flex-shrink-0">
                  <div className={`relative w-14 h-14 rounded-full flex items-center justify-center border-2 transition-all duration-500
                    ${estaActivo
                      ? "bg-black border-black scale-110 shadow-xl"
                      : estaHecho
                      ? "bg-black border-black"
                      : "bg-white border-gray-200"}`}
                  >
                    <Icono className={`w-6 h-6 transition-colors duration-300 ${estaActivo || estaHecho ? "text-white" : "text-gray-300"}`} />
                    {estaActivo && (
                      <span className="absolute inset-0 rounded-full animate-ping bg-black opacity-20" />
                    )}
                  </div>

                  <p className={`mt-4 text-xs font-semibold text-center leading-tight transition-colors duration-300
                    ${estaActivo ? "text-black" : estaHecho ? "text-gray-600" : "text-gray-300"}`}>
                    {paso.title}
                  </p>

                  <p className={`mt-1 text-xs text-center leading-snug transition-opacity duration-500
                    ${estaActivo ? "opacity-100 text-gray-500" : "opacity-0"}`}>
                    {paso.desc}
                  </p>
                </div>

                {i < pasos.length - 1 && (
                  <div className="flex-1 h-0.5 bg-gray-200 mt-7 relative overflow-hidden">
                    <div className={`linea-fill${activo > i ? " activa" : ""}`} />
                  </div>
                )}
              </Fragment>
            );
          })}
        </div>

        {/* Mobile */}
        <div className="md:hidden flex flex-col">
          {pasos.map((paso, i) => {
            const Icono = iconosPasos[i];
            const estaActivo = i === activo;
            const estaHecho = i < activo;

            return (
              <div key={i} className="flex gap-5">
                <div className="flex flex-col items-center flex-shrink-0">
                  <div className={`relative w-11 h-11 rounded-full flex items-center justify-center border-2 transition-all duration-500
                    ${estaActivo
                      ? "bg-black border-black scale-110 shadow-lg"
                      : estaHecho
                      ? "bg-black border-black"
                      : "bg-white border-gray-200"}`}
                  >
                    <Icono className={`w-5 h-5 transition-colors duration-300 ${estaActivo || estaHecho ? "text-white" : "text-gray-300"}`} />
                    {estaActivo && (
                      <span className="absolute inset-0 rounded-full animate-ping bg-black opacity-20" />
                    )}
                  </div>

                  {i < pasos.length - 1 && (
                    <div className="w-0.5 bg-gray-200 my-1 flex-1 min-h-10 relative overflow-hidden">
                      <div className={`linea-v-fill${estaHecho ? " activa" : ""}`} />
                    </div>
                  )}
                </div>

                <div className="pb-8 pt-1">
                  <p className={`text-sm font-semibold transition-colors duration-300
                    ${estaActivo ? "text-black" : estaHecho ? "text-gray-600" : "text-gray-300"}`}>
                    {paso.title}
                  </p>
                  <p className={`text-xs mt-0.5 leading-snug transition-opacity duration-500
                    ${estaActivo ? "opacity-100 text-gray-500" : "opacity-0"}`}>
                    {paso.desc}
                  </p>
                </div>
              </div>
            );
          })}
        </div>

      </div>
    </section>
    </>
  );
}
