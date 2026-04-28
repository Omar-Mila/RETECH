import { useEffect, useState, Fragment } from "react"
import {
  InboxArrowDownIcon,
  MagnifyingGlassIcon,
  WrenchScrewdriverIcon,
  ShieldCheckIcon,
  TruckIcon,
} from "@heroicons/react/24/outline"

const steps = [
  {
    icon: InboxArrowDownIcon,
    title: "Recepció",
    desc: "Rebem i registrem el dispositiu al sistema.",
  },
  {
    icon: MagnifyingGlassIcon,
    title: "Diagnòstic",
    desc: "Anàlisi exhaustiva de cada component.",
  },
  {
    icon: WrenchScrewdriverIcon,
    title: "Reparació",
    desc: "Substitució de peces per components originals.",
  },
  {
    icon: ShieldCheckIcon,
    title: "Test de qualitat",
    desc: "Superem 30 punts de control certificats.",
  },
  {
    icon: TruckIcon,
    title: "A les teves mans",
    desc: "Enviat en 24h amb garantia inclosa.",
  },
]

export default function PhoneJourney() {
  const [active, setActive] = useState(0)

  useEffect(() => {
    const t = setInterval(() => {
      setActive(prev => (prev + 1) % steps.length)
    }, 2000)
    return () => clearInterval(t)
  }, [])

  return (
    <section className="w-full bg-gray-50 py-20 border-t border-gray-100">
      <div className="max-w-5xl mx-auto px-6">

        <h2 className="text-3xl md:text-4xl font-bold text-center mb-3">
          El camí del teu mòbil
        </h2>
        <p className="text-center text-gray-500 text-sm mb-16">
          Cada dispositiu passa per un procés rigorós abans d'arribar a les teves mans.
        </p>

        {/* Desktop */}
        <div className="hidden md:flex items-start">
          {steps.map((step, i) => {
            const Icon = step.icon
            const isActive = i === active
            const isDone = i < active

            return (
              <Fragment key={i}>
                <div className="flex flex-col items-center w-28 flex-shrink-0">
                  <div className={`relative w-14 h-14 rounded-full flex items-center justify-center border-2 transition-all duration-500
                    ${isActive
                      ? "bg-black border-black scale-110 shadow-xl"
                      : isDone
                      ? "bg-black border-black"
                      : "bg-white border-gray-200"}`}
                  >
                    <Icon className={`w-6 h-6 transition-colors duration-300 ${isActive || isDone ? "text-white" : "text-gray-300"}`} />
                    {isActive && (
                      <span className="absolute inset-0 rounded-full animate-ping bg-black opacity-20" />
                    )}
                  </div>

                  <p className={`mt-4 text-xs font-semibold text-center leading-tight transition-colors duration-300
                    ${isActive ? "text-black" : isDone ? "text-gray-600" : "text-gray-300"}`}>
                    {step.title}
                  </p>

                  <p className={`mt-1 text-xs text-center leading-snug transition-opacity duration-500
                    ${isActive ? "opacity-100 text-gray-500" : "opacity-0"}`}>
                    {step.desc}
                  </p>
                </div>

                {i < steps.length - 1 && (
                  <div className="flex-1 h-0.5 bg-gray-200 mt-7 relative overflow-hidden">
                    <div
                      className="absolute inset-y-0 left-0 bg-black transition-all duration-700 ease-in-out"
                      style={{ width: active > i ? "100%" : "0%" }}
                    />
                  </div>
                )}
              </Fragment>
            )
          })}
        </div>

        {/* Mobile */}
        <div className="md:hidden flex flex-col">
          {steps.map((step, i) => {
            const Icon = step.icon
            const isActive = i === active
            const isDone = i < active

            return (
              <div key={i} className="flex gap-5">
                <div className="flex flex-col items-center flex-shrink-0">
                  <div className={`relative w-11 h-11 rounded-full flex items-center justify-center border-2 transition-all duration-500
                    ${isActive
                      ? "bg-black border-black scale-110 shadow-lg"
                      : isDone
                      ? "bg-black border-black"
                      : "bg-white border-gray-200"}`}
                  >
                    <Icon className={`w-5 h-5 transition-colors duration-300 ${isActive || isDone ? "text-white" : "text-gray-300"}`} />
                    {isActive && (
                      <span className="absolute inset-0 rounded-full animate-ping bg-black opacity-20" />
                    )}
                  </div>

                  {i < steps.length - 1 && (
                    <div className="w-0.5 bg-gray-200 my-1 flex-1 min-h-10 relative overflow-hidden">
                      <div
                        className="absolute inset-x-0 top-0 bg-black transition-all duration-700 ease-in-out"
                        style={{ height: isDone ? "100%" : "0%" }}
                      />
                    </div>
                  )}
                </div>

                <div className="pb-8 pt-1">
                  <p className={`text-sm font-semibold transition-colors duration-300
                    ${isActive ? "text-black" : isDone ? "text-gray-600" : "text-gray-300"}`}>
                    {step.title}
                  </p>
                  <p className={`text-xs mt-0.5 leading-snug transition-opacity duration-500
                    ${isActive ? "opacity-100 text-gray-500" : "opacity-0"}`}>
                    {step.desc}
                  </p>
                </div>
              </div>
            )
          })}
        </div>

      </div>
    </section>
  )
}
