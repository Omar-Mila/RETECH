import PhoneCardS from "./PhoneCardS"
import { useEffect, useState } from "react"
import { obtenerMasVendidos } from "../../services/productService"
import { useIdioma } from "../context/LanguageContext"

export default function SeccionMoviles() {
  const { t } = useIdioma()
  const [moviles,  fijarMoviles]  = useState([])
  const [cargando, fijarCargando] = useState(true)

  useEffect(() => {
    obtenerMasVendidos()
      .then(datos => fijarMoviles(datos))
      .catch(err  => console.error(err))
      .finally(()  => fijarCargando(false))
  }, [])

  if (cargando) {
    return <div className="ps-loading">{t('phoneSection.loading')}</div>
  }

  return (
    <section className="ps-section">
      <div className="ps-inner">

        {/* Panel izquierdo — ahorro */}
        <div className="ps-promo">
          <h3 className="ps-promo-title">{t('phoneSection.savingsTitle')}</h3>
          <p  className="ps-promo-desc">{t('phoneSection.savingsDesc')}</p>
        </div>

        {/* Panel derecho — más vendidos */}
        <div className="ps-bestsellers">
          <h3 className="ps-bestsellers-title">{t('phoneSection.bestsellers')}</h3>
          <div className="ps-cards-list">
            {moviles.slice(0, 4).map(movil => (
              <PhoneCardS
                key={movil.id}
                modeloId={movil.modelo_id}
                movilId={movil.id}
                nombre={movil.modelo?.nombre ?? movil.modelo}
                condicion={movil.estado}
                precio={movil.precio}
                imagen={movil.image_url ?? "https://via.placeholder.com/300"}
              />
            ))}
          </div>
        </div>

      </div>

      <style>{`

          /* ── Cargando ───────────────────────────────────────── */
          .ps-loading {
            padding: 2.5rem;
            color: #6b7280;
            font-size: 0.9rem;
          }

          /* ── Sección ────────────────────────────────────────── */
          .ps-section {
            width: 100%;
            padding: 3rem 0;
          }

          .ps-inner {
            max-width: 80rem;
            margin: 0 auto;
            padding: 0 1.5rem;

            display: grid;
            grid-template-columns: repeat(2, minmax(0, 1fr));
            gap: 2rem;

            align-items: stretch;
          }

          /* ── Ambos paneles alineados ───────────────────────── */
          .ps-promo,
          .ps-bestsellers {
            width: 100%;
            height: 100%;
            min-width: 0;
            box-sizing: border-box;
          }

          /* ── Panel promo ────────────────────────────────────── */
          .ps-promo {
            background: linear-gradient(135deg, #000, #1f2937);
            color: #fff;
            padding: 2.5rem;
            border-radius: 0.75rem;

            display: flex;
            flex-direction: column;
            justify-content: center;
          }

          .ps-promo-title {
            font-size: 1.875rem;
            font-weight: 700;
            margin: 0 0 1rem;
            line-height: 1.2;
          }

          .ps-promo-desc {
            margin: 0;
            line-height: 1.6;
            color: #d1d5db;
          }

          /* ── Panel más vendidos ─────────────────────────────── */
          .ps-bestsellers {
            background: #f9fafb;
            padding: 1.5rem;
            border-radius: 0.75rem;
            box-shadow: 0 1px 4px rgba(0,0,0,0.06);
          }

          .ps-bestsellers-title {
            font-size: 1.5rem;
            font-weight: 700;
            margin: 0 0 1.5rem;
          }

          .ps-cards-list {
            display: flex;
            gap: 1.25rem;
            overflow-x: auto;
            padding-bottom: 0.5rem;

            scrollbar-width: thin;
            scrollbar-color: #d1d5db transparent;
          }

          .ps-cards-list::-webkit-scrollbar {
            height: 4px;
          }

          .ps-cards-list::-webkit-scrollbar-track {
            background: transparent;
          }

          .ps-cards-list::-webkit-scrollbar-thumb {
            background: #d1d5db;
            border-radius: 9999px;
          }

          /* ── Responsive ─────────────────────────────────────── */

          /* Tablet grande */
          @media (max-width: 900px) {

            .ps-inner {
              grid-template-columns: 1fr;
            }

            .ps-promo,
            .ps-bestsellers {
              width: 100%;
            }

            .ps-promo {
              padding: 2rem;
            }

            .ps-promo-title {
              font-size: 1.5rem;
            }
          }

          /* Tablet pequeña */
          @media (max-width: 768px) {

            .ps-promo {
              padding: 1.75rem;
            }

            .ps-promo-title {
              font-size: 1.25rem;
            }

            .ps-promo-desc {
              font-size: 0.9rem;
            }
          }

          /* Móvil */
          @media (max-width: 640px) {

            .ps-cards-list .pcs-card {
              min-width: calc(50% - 0.375rem);
              flex-shrink: 0;
            }
          }

          /* Móvil pequeño */
          @media (max-width: 480px) {

            .ps-section {
              padding: 2rem 0;
            }

            .ps-inner {
              padding: 0 1rem;
              gap: 1.25rem;
            }

            .ps-promo {
              padding: 1.25rem 1.5rem;
            }

            .ps-promo-title {
              font-size: 1rem;
              margin-bottom: 0.375rem;
            }

            .ps-promo-desc {
              font-size: 0.825rem;
              line-height: 1.4;
            }

            .ps-bestsellers {
              padding: 1rem;
            }

            .ps-bestsellers-title {
              font-size: 1rem;
              margin-bottom: 0.875rem;
            }

            .ps-cards-list {
              gap: 0.625rem;
            }

            .ps-cards-list .pcs-card {
              min-width: calc(50% - 0.3125rem);
            }
          }

          /* Móvil muy pequeño */
          @media (max-width: 360px) {

            .ps-promo-title {
              font-size: 0.9rem;
            }

            .ps-promo-desc {
              display: none;
            }
          }

        `}</style>
    </section>
  )
}
