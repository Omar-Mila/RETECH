import { useState } from "react"
import { ChevronDownIcon } from "@heroicons/react/24/outline"

export default function FAQSection() {

  const faqs = [
    {
      question: "Els mòbils tenen garantia?",
      answer: "Sí, tots els dispositius inclouen garantia oficial de 12 mesos."
    },
    {
      question: "Què significa reacondicionat?",
      answer: "Són dispositius revisats i testats per tècnics professionals."
    },
    {
      question: "Puc retornar el producte?",
      answer: "Sí, tens 14 dies per retornar el dispositiu sense problemes."
    },
    {
      question: "Com es comprova la salut de la bateria?",
      answer: "Cada dispositiu inclou un percentatge verificat de salut de bateria."
    }
  ]

  const [openIndex, setOpenIndex] = useState(null)

  const toggle = (index) => {
    setOpenIndex(openIndex === index ? null : index)
  }

  return (
    <section className="w-full bg-gray-50 py-20">
      <div className="max-w-4xl mx-auto px-6">
        <h2 className="text-4xl font-bold text-center mb-12">
          Preguntes freqüents
        </h2>

        <div className="space-y-4">
          {faqs.map((item, index) => (
            <div
              key={index}
              className="bg-white rounded-xl border border-gray-100"
            >
              <button
                onClick={() => toggle(index)}
                className="w-full flex justify-between items-center p-6 text-left"
              >
                <span className="font-semibold">
                  {item.question}
                </span>

                <ChevronDownIcon
                  className={`w-5 h-5 transition-transform ${
                    openIndex === index ? "rotate-180" : ""
                  }`}
                />
              </button>

              {openIndex === index && (
                <div className="px-6 pb-6 text-gray-600">
                  {item.answer}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
