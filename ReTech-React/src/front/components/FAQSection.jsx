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
    <section className="faq-section">
      <div className="faq-inner">

        <h2 className="faq-title">{t('faq.title')}</h2>

        <div className="faq-list">
          {preguntas.map((elemento, indice) => (
            <div key={indice} className="faq-item">

              <button
                onClick={() => alternar(indice)}
                className="faq-btn"
              >
                <span className="faq-question">{elemento.q}</span>
                <ChevronDownIcon
                  className={`faq-chevron${indiceAbierto === indice ? " faq-chevron--open" : ""}`}
                />
              </button>

              {indiceAbierto === indice && (
                <div className="faq-answer">{elemento.a}</div>
              )}

            </div>
          ))}
        </div>

      </div>

      <style>{`

        /* ── Sección ────────────────────────────────────────── */
        .faq-section {
          width: 100%;
          background: #f9fafb;
          padding: 5rem 0;
        }
        .faq-inner {
          max-width: 56rem;
          margin: 0 auto;
          padding: 0 1.5rem;
        }

        /* ── Título ─────────────────────────────────────────── */
        .faq-title {
          font-size: 2.25rem;
          font-weight: 700;
          text-align: center;
          margin: 0 0 3rem 0;
        }

        /* ── Lista ──────────────────────────────────────────── */
        .faq-list {
          display: flex;
          flex-direction: column;
          gap: 1rem;
        }

        /* ── Item ───────────────────────────────────────────── */
        .faq-item {
          background: #fff;
          border-radius: 0.75rem;
          border: 1px solid #f3f4f6;
          overflow: hidden;
        }

        /* ── Botón pregunta ─────────────────────────────────── */
        .faq-btn {
          width: 100%;
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 1.5rem;
          text-align: left;
          background: none;
          border: none;
          cursor: pointer;
          gap: 1rem;
        }
        .faq-btn:hover { background: #fafafa; }

        .faq-question {
          font-weight: 600;
          font-size: 0.9375rem;
          color: #111827;
          flex: 1;
        }

        /* ── Chevron ────────────────────────────────────────── */
        .faq-chevron {
          width: 1.25rem;
          height: 1.25rem;
          flex-shrink: 0;
          transition: transform 0.25s ease;
          color: #6b7280;
        }
        .faq-chevron--open { transform: rotate(180deg); }

        /* ── Respuesta ──────────────────────────────────────── */
        .faq-answer {
          padding: 0 1.5rem 1.5rem;
          color: #4b5563;
          font-size: 0.9rem;
          line-height: 1.6;
        }

        /* ── Responsive ─────────────────────────────────────── */
        @media (max-width: 640px) {
          .faq-section   { padding: 3rem 0; }
          .faq-title     { font-size: 1.75rem; margin-bottom: 2rem; }
          .faq-btn       { padding: 1rem 1.125rem; }
          .faq-answer    { padding: 0 1.125rem 1rem; }
          .faq-question  { font-size: 0.875rem; }
        }

        @media (max-width: 400px) {
          .faq-title  { font-size: 1.4rem; }
          .faq-btn    { padding: 0.875rem 1rem; }
          .faq-answer { padding: 0 1rem 0.875rem; font-size: 0.825rem; }
        }

      `}</style>
    </section>
  );
}
