import {
  ShieldCheckIcon,
  CurrencyEuroIcon,
  WrenchScrewdriverIcon,
  GlobeAltIcon,
} from "@heroicons/react/24/outline";
import { useIdioma } from "../context/LanguageContext";

const iconos = [CurrencyEuroIcon, ShieldCheckIcon, WrenchScrewdriverIcon, GlobeAltIcon];

export default function WhyReTech() {
  const { t } = useIdioma();
  const caracteristicas = t('why.features');

  return (
    <section className="wr-section">
      <div className="wr-inner">

        <h2 className="wr-title">{t('why.title')}</h2>

        <div className="wr-grid">
          {caracteristicas.map((elemento, indice) => {
            const Icono = iconos[indice];
            return (
              <div key={indice} className="wr-card">
                <Icono className="wr-icon" />
                <h3 className="wr-card-title">{elemento.title}</h3>
                <p  className="wr-card-desc">{elemento.description}</p>
              </div>
            );
          })}
        </div>

      </div>

      <style>{`

        /* ── Sección ────────────────────────────────────────── */
        .wr-section {
          width: 100%;
          background: #fff;
          padding: 5rem 0;
        }
        .wr-inner {
          max-width: 80rem;
          margin: 0 auto;
          padding: 0 1.5rem;
        }

        /* ── Título ─────────────────────────────────────────── */
        .wr-title {
          font-size: 2.25rem;
          font-weight: 700;
          text-align: center;
          margin: 0 0 4rem;
        }

        /* ── Grid ───────────────────────────────────────────── */
        .wr-grid {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 2.5rem;
        }

        /* ── Tarjeta ────────────────────────────────────────── */
        .wr-card {
          background: #f9fafb;
          padding: 2rem;
          border-radius: 1rem;
          border: 1px solid #f3f4f6;
          transition: box-shadow 0.3s, transform 0.3s;
        }
        .wr-card:hover {
          box-shadow: 0 12px 32px rgba(0,0,0,0.1);
          transform: translateY(-4px);
        }

        /* ── Icono ──────────────────────────────────────────── */
        .wr-icon {
          width: 2.5rem;
          height: 2.5rem;
          color: #000;
          margin-bottom: 1.5rem;
          transition: transform 0.3s;
          display: block;
        }
        .wr-card:hover .wr-icon { transform: scale(1.1); }

        /* ── Texto ──────────────────────────────────────────── */
        .wr-card-title {
          font-weight: 600;
          font-size: 1.125rem;
          margin: 0 0 0.75rem;
        }
        .wr-card-desc {
          color: #4b5563;
          font-size: 0.875rem;
          line-height: 1.65;
          margin: 0;
        }

        /* ── Responsive ─────────────────────────────────────── */
        @media (max-width: 1024px) {
          .wr-grid { grid-template-columns: repeat(2, 1fr); gap: 1.5rem; }
        }

        @media (max-width: 640px) {
          .wr-section { padding: 3rem 0; }
          .wr-title   { font-size: 1.75rem; margin-bottom: 2.5rem; }
          .wr-grid    { grid-template-columns: 1fr; gap: 1rem; }
          .wr-card    { padding: 1.5rem; }
          .wr-icon    { width: 2rem; height: 2rem; margin-bottom: 1rem; }
          .wr-card-title { font-size: 1rem; }
        }

        @media (max-width: 400px) {
          .wr-title { font-size: 1.4rem; }
          .wr-card  { padding: 1.25rem; }
        }

      `}</style>
    </section>
  );
}
