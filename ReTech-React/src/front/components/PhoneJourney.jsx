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
    <section className="pj-section">
      <div className="pj-inner">

        <h2 className="pj-title">{t('journey.title')}</h2>
        <p className="pj-subtitle">{t('journey.subtitle')}</p>

        {/* Desktop */}
        <div className="pj-desktop">
          {pasos.map((paso, i) => {
            const Icono     = iconosPasos[i];
            const estaActivo = i === activo;
            const estaHecho  = i < activo;

            return (
              <Fragment key={i}>
                <div className="pj-step">
                  <div className={`pj-circle${estaActivo ? " pj-circle--active" : estaHecho ? " pj-circle--done" : ""}`}>
                    <Icono className={`pj-icon${estaActivo || estaHecho ? " pj-icon--on" : ""}`} />
                    {estaActivo && <span className="pj-ping" />}
                  </div>
                  <p className={`pj-step-title${estaActivo ? " pj-step-title--active" : estaHecho ? " pj-step-title--done" : ""}`}>
                    {paso.title}
                  </p>
                  <p className={`pj-step-desc${estaActivo ? " pj-step-desc--active" : ""}`}>
                    {paso.desc}
                  </p>
                </div>

                {i < pasos.length - 1 && (
                  <div className="pj-line">
                    <div className={`pj-line-fill${activo > i ? " pj-line-fill--active" : ""}`} />
                  </div>
                )}
              </Fragment>
            );
          })}
        </div>

        {/* Mobile */}
        <div className="pj-mobile">
          {pasos.map((paso, i) => {
            const Icono     = iconosPasos[i];
            const estaActivo = i === activo;
            const estaHecho  = i < activo;

            return (
              <div key={i} className="pj-m-row">
                <div className="pj-m-track">
                  <div className={`pj-m-circle${estaActivo ? " pj-circle--active" : estaHecho ? " pj-circle--done" : ""}`}>
                    <Icono className={`pj-m-icon${estaActivo || estaHecho ? " pj-icon--on" : ""}`} />
                    {estaActivo && <span className="pj-ping" />}
                  </div>
                  {i < pasos.length - 1 && (
                    <div className="pj-vline">
                      <div className={`pj-vline-fill${estaHecho ? " pj-vline-fill--active" : ""}`} />
                    </div>
                  )}
                </div>

                <div className="pj-m-content">
                  <p className={`pj-m-title${estaActivo ? " pj-step-title--active" : estaHecho ? " pj-step-title--done" : ""}`}>
                    {paso.title}
                  </p>
                  <p className={`pj-m-desc${estaActivo ? " pj-step-desc--active" : ""}`}>
                    {paso.desc}
                  </p>
                </div>
              </div>
            );
          })}
        </div>

      </div>
    </section>

    <style>{`

      /* Sección */
      .pj-section {
        width: 100%;
        background: #f9fafb;
        padding: 5rem 0;
        border-top: 1px solid #f3f4f6;
      }
      .pj-inner {
        max-width: 64rem;
        margin: 0 auto;
        padding: 0 1.5rem;
      }

      /* Cabecera */
      .pj-title {
        font-size: 2rem;
        font-weight: 700;
        text-align: center;
        margin: 0 0 0.75rem;
      }
      .pj-subtitle {
        text-align: center;
        color: #6b7280;
        font-size: 0.875rem;
        margin: 0 0 4rem;
      }

      /* Desktop */
      .pj-desktop {
        display: flex;
        align-items: flex-start;
      }
      .pj-step {
        display: flex;
        flex-direction: column;
        align-items: center;
        width: 7rem;
        flex-shrink: 0;
      }

      /* Círculo */
      .pj-circle {
        position: relative;
        width: 3.5rem; height: 3.5rem;
        border-radius: 50%;
        display: flex;
        align-items: center;
        justify-content: center;
        border: 2px solid #e5e7eb;
        background: #fff;
        transition: transform 0.5s, box-shadow 0.5s, background 0.5s, border-color 0.5s;
      }
      .pj-circle--active {
        background: #000;
        border-color: #000;
        transform: scale(1.1);
        box-shadow: 0 8px 24px rgba(0,0,0,0.2);
      }
      .pj-circle--done {
        background: #000;
        border-color: #000;
      }

      /* Icono */
      .pj-icon {
        width: 1.5rem; height: 1.5rem;
        color: #d1d5db;
        transition: color 0.3s;
      }
      .pj-icon--on { color: #fff; }

      /* Ping animado */
      .pj-ping {
        position: absolute;
        inset: 0;
        border-radius: 50%;
        background: #000;
        opacity: 0.2;
        animation: pj-ping 1s cubic-bezier(0,0,0.2,1) infinite;
      }
      @keyframes pj-ping {
        75%, 100% { transform: scale(2); opacity: 0; }
      }

      /* Texto paso */
      .pj-step-title {
        margin: 1rem 0 0;
        font-size: 0.75rem;
        font-weight: 600;
        text-align: center;
        line-height: 1.3;
        color: #d1d5db;
        transition: color 0.3s;
      }
      .pj-step-title--active { color: #000; }
      .pj-step-title--done   { color: #4b5563; }

      .pj-step-desc {
        margin: 0.25rem 0 0;
        font-size: 0.75rem;
        text-align: center;
        line-height: 1.4;
        color: #6b7280;
        opacity: 0;
        transition: opacity 0.5s;
      }
      .pj-step-desc--active { opacity: 1; }

      /* Línea horizontal */
      .pj-line {
        flex: 1;
        height: 2px;
        background: #e5e7eb;
        margin-top: 1.75rem;
        position: relative;
        overflow: hidden;
      }
      .pj-line-fill {
        position: absolute;
        inset-y: 0; left: 0;
        background: #000;
        width: 0%;
        transition: width 0.7s ease-in-out;
      }
      .pj-line-fill--active { width: 100%; }

      /* Mobile */
      .pj-mobile { display: none; flex-direction: column; }

      .pj-m-row {
        display: flex;
        gap: 1.25rem;
      }
      .pj-m-track {
        display: flex;
        flex-direction: column;
        align-items: center;
        flex-shrink: 0;
      }
      .pj-m-circle {
        position: relative;
        width: 2.75rem; height: 2.75rem;
        border-radius: 50%;
        display: flex;
        align-items: center;
        justify-content: center;
        border: 2px solid #e5e7eb;
        background: #fff;
        transition: transform 0.5s, background 0.5s, border-color 0.5s;
      }
      /* Especificidad mayor para sobreescribir .pj-m-circle { background: #fff } */
      .pj-m-circle.pj-circle--active {
        background: #000;
        border-color: #000;
        transform: scale(1.1);
        box-shadow: 0 8px 24px rgba(0,0,0,0.2);
      }
      .pj-m-circle.pj-circle--done {
        background: #000;
        border-color: #000;
      }
      .pj-m-icon {
        width: 1.25rem; height: 1.25rem;
        color: #d1d5db;
        transition: color 0.3s;
      }

      /* Línea vertical */
      .pj-vline {
        width: 2px;
        background: #e5e7eb;
        flex: 1;
        min-height: 2.5rem;
        margin: 0.25rem 0;
        position: relative;
        overflow: hidden;
      }
      .pj-vline-fill {
        position: absolute;
        inset-x: 0; top: 0;
        background: #000;
        height: 0%;
        transition: height 0.7s ease-in-out;
      }
      .pj-vline-fill--active { height: 100%; }

      /* Contenido mobile */
      .pj-m-content { padding: 0.25rem 0 2rem; }
      .pj-m-title {
        font-size: 0.875rem;
        font-weight: 600;
        color: #d1d5db;
        margin: 0;
        transition: color 0.3s;
      }
      .pj-m-desc {
        font-size: 0.75rem;
        margin: 0.25rem 0 0;
        line-height: 1.4;
        color: #6b7280;
        opacity: 0;
        transition: opacity 0.5s;
      }
      .pj-m-desc.pj-step-desc--active { opacity: 1; }

      /* Responsive */
      @media (max-width: 768px) {
        .pj-desktop { display: none; }
        .pj-mobile  { display: flex; }
        .pj-title   { font-size: 1.6rem; }
        .pj-subtitle{ margin-bottom: 2.5rem; }
      }

      @media (max-width: 480px) {
        .pj-section  { padding: 3rem 0; }
        .pj-title    { font-size: 1.35rem; }
        .pj-subtitle { margin-bottom: 2rem; font-size: 0.8rem; }
      }

    `}</style>
    </>
  );
}
