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
    <div className="car-container">

      {diapositivas.map((diapositiva, indice) => (
        <div
          key={indice}
          className={`car-slide${indice === actual ? " car-slide--active" : ""}`}
        >
          <img
            src={imagenesSlide[indice]}
            alt={diapositiva.title}
            className="car-img"
          />

          <div className="car-overlay" />

          <div className="car-content-wrap">
            <div className="car-content">
              <h2 className="car-title">{diapositiva.title}</h2>
              <p className="car-desc">{diapositiva.description}</p>
              <div className="car-btns">
                <button className="car-btn-primary">{diapositiva.cta}</button>
                <button className="car-btn-secondary">{t('carousel.knowMore')}</button>
              </div>
            </div>
          </div>
        </div>
      ))}

      {/* Indicadores */}
      <div className="car-dots">
        {diapositivas.map((_, indice) => (
          <button
            key={indice}
            onClick={() => fijarActual(indice)}
            className={`car-dot${indice === actual ? " car-dot--active" : ""}`}
            aria-label={`Diapositiva ${indice + 1}`}
          />
        ))}
      </div>

      <style>{`

        /* ── Contenedor ─────────────────────────────────────── */
        .car-container {
          position: relative;
          width: 100%;
          height: 420px;
          overflow: hidden;
        }

        /* ── Diapositiva ────────────────────────────────────── */
        .car-slide {
          position: absolute;
          inset: 0;
          opacity: 0;
          transition: opacity 0.7s ease;
        }
        .car-slide--active { opacity: 1; }

        /* ── Imagen de fondo ────────────────────────────────── */
        .car-img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          display: block;
        }

        /* ── Gradiente oscuro ───────────────────────────────── */
        .car-overlay {
          position: absolute;
          inset: 0;
          background: linear-gradient(to right, rgba(0,0,0,0.80), rgba(0,0,0,0.40), transparent);
        }

        /* ── Contenido de texto ─────────────────────────────── */
        .car-content-wrap {
          position: absolute;
          inset: 0;
          display: flex;
          align-items: center;
        }
        .car-content {
          padding: 0 2.5rem;
          max-width: 36rem;
          color: #fff;
        }
        .car-title {
          font-size: 2.25rem;
          font-weight: 700;
          margin: 0 0 1rem 0;
          line-height: 1.2;
        }
        .car-desc {
          font-size: 1.125rem;
          margin: 0 0 1.5rem 0;
          line-height: 1.5;
        }

        /* ── Botones ────────────────────────────────────────── */
        .car-btns {
          display: flex;
          gap: 1rem;
          flex-wrap: wrap;
        }
        .car-btn-primary {
          background: #fff;
          color: #000;
          padding: 0.75rem 1.5rem;
          border-radius: 0.375rem;
          border: none;
          font-weight: 500;
          cursor: pointer;
          transition: opacity 0.15s;
        }
        .car-btn-primary:hover { opacity: 0.88; }
        .car-btn-secondary {
          background: transparent;
          color: #fff;
          padding: 0.75rem 1.5rem;
          border-radius: 0.375rem;
          border: 1px solid #fff;
          font-weight: 500;
          cursor: pointer;
          transition: background 0.15s;
        }
        .car-btn-secondary:hover { background: rgba(255,255,255,0.12); }

        /* ── Indicadores ────────────────────────────────────── */
        .car-dots {
          position: absolute;
          bottom: 1.25rem;
          left: 2.5rem;
          display: flex;
          gap: 0.5rem;
        }
        .car-dot {
          width: 0.75rem;
          height: 0.75rem;
          border-radius: 50%;
          border: none;
          background: rgba(255,255,255,0.4);
          cursor: pointer;
          padding: 0;
          transition: background 0.2s;
        }
        .car-dot--active  { background: #fff; }
        .car-dot:hover    { background: rgba(255,255,255,0.75); }

        /* ── Responsive ─────────────────────────────────────── */

        /* Tablet grande (≤1024px) */
        @media (max-width: 1024px) {
          .car-container { height: 360px; }
          .car-title     { font-size: 2rem; }
          .car-desc      { font-size: 1rem; }
        }

        /* Tablet pequeña (≤768px) */
        @media (max-width: 768px) {
          .car-container { height: 300px; }
          .car-content   { padding: 0 2rem; max-width: 26rem; }
          .car-title     { font-size: 1.625rem; margin-bottom: 0.625rem; }
          .car-desc      { font-size: 0.9rem; margin-bottom: 1.125rem; }
          .car-btn-primary,
          .car-btn-secondary { padding: 0.625rem 1.125rem; font-size: 0.85rem; }
        }

        /* Móvil (≤640px) */
        @media (max-width: 640px) {
          .car-container { height: 250px; }
          .car-overlay   { background: linear-gradient(to right, rgba(0,0,0,0.88) 0%, rgba(0,0,0,0.55) 60%, rgba(0,0,0,0.2) 100%); }
          .car-content   { padding: 0 1.25rem; max-width: 100%; }
          .car-title     { font-size: 1.35rem; margin-bottom: 0.375rem; }
          .car-desc      { font-size: 0.825rem; margin-bottom: 0.875rem; }
          .car-btn-primary,
          .car-btn-secondary { padding: 0.5rem 0.875rem; font-size: 0.8rem; }
          .car-dots      { left: 1.25rem; bottom: 0.75rem; }
          .car-dot       { width: 0.55rem; height: 0.55rem; }
        }

        /* Móvil pequeño (≤480px) */
        @media (max-width: 480px) {
          .car-container { height: 210px; }
          .car-title     { font-size: 1.15rem; }
          .car-desc      { display: none; }
          .car-btns      { gap: 0.5rem; }
          .car-btn-primary,
          .car-btn-secondary { padding: 0.45rem 0.75rem; font-size: 0.78rem; }
        }

        /* Móvil muy pequeño (≤360px) */
        @media (max-width: 360px) {
          .car-container { height: 190px; }
          .car-title     { font-size: 1.05rem; }
          .car-btns      { flex-direction: column; gap: 0.375rem; }
        }

      `}</style>

    </div>
  );
}
