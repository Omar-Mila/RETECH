import { useState } from "react";
import { ChevronDownIcon } from "@heroicons/react/24/outline";
import { useIdioma } from "../context/LanguageContext";

export default function FAQSection() {
  const { t } = useIdioma();
  const preguntas = t('faq.items');
  const [indiceAbierto, fijarIndiceAbierto] = useState(null);

  const alternar = (indice) => {
    fijarIndiceAbierto(indiceAbierto === indice ? null : indice);
  };

  return (
    <section className="w-full bg-gray-50 py-20">
      <div className="max-w-4xl mx-auto px-6">
        <h2 className="text-4xl font-bold text-center mb-12">
          {t('faq.title')}
        </h2>

        <div className="space-y-4">
          {preguntas.map((elemento, indice) => (
            <div
              key={indice}
              className="bg-white rounded-xl border border-gray-100"
            >
              <button
                onClick={() => alternar(indice)}
                className="w-full flex justify-between items-center p-6 text-left"
              >
                <span className="font-semibold">
                  {elemento.q}
                </span>

                <ChevronDownIcon
                  className={`w-5 h-5 transition-transform ${
                    indiceAbierto === indice ? "rotate-180" : ""
                  }`}
                />
              </button>

              {indiceAbierto === indice && (
                <div className="px-6 pb-6 text-gray-600">
                  {elemento.a}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
