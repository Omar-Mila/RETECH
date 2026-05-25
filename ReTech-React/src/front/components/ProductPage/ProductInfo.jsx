import { useIdioma } from "../../context/LanguageContext"

export default function ProductInfo({ producto }) {
  const { t } = useIdioma()

  const caracteristicas = [
    { label: t('productInfo.processor'),   value: producto.procesador },
    { label: t('productInfo.screen'),      value: `${producto.pantalla_pulgadas}" · ${producto.hz_pantalla}Hz` },
    { label: t('productInfo.battery'),     value: `${producto.bateria_mah} mAh` },
    { label: t('productInfo.mainCamera'),  value: `${producto.camara_principal_mp} MP` },
    { label: t('productInfo.frontCamera'), value: `${producto.camara_frontal_mp} MP` },
    { label: t('productInfo.connector'),   value: producto.conector },
    { label: "5G",                         value: producto.cinco_g ? t('productInfo.yes') : t('productInfo.no') },
    { label: "NFC",                        value: producto.nfc ? t('productInfo.yes') : t('productInfo.no') },
    { label: "SIM",                        value: producto.tipo_sim },
    { label: t('productInfo.refurbisher'), value: producto.empresa },
  ]

  return (
    <div className="pi-container">
      <div>
        <h2 className="pi-title">{t('productInfo.features')}</h2>
        <ul className="pi-list">
          {caracteristicas.map((elemento, i) => (
            <li key={i} className="pi-row">
              <span className="pi-row-label">{elemento.label}</span>
              <span className="pi-row-value">{elemento.value ?? "—"}</span>
            </li>
          ))}
        </ul>
      </div>

      <style>{`

        /* contenedor */
        .pi-container {
          display: flex;
          flex-direction: column;
          gap: 1.5rem;
        }

        /* título */
        .pi-title {
          font-size: 1.125rem;
          font-weight: 600;
          margin: 0 0 0.75rem 0;
        }

        /* lista de características */
        .pi-list {
          list-style: none;
          margin: 0;
          padding: 0;
          display: flex;
          flex-direction: column;
          gap: 0.5rem;
          font-size: 0.875rem;
          color: #374151;
        }

        /* fila */
        .pi-row {
          display: flex;
          justify-content: space-between;
          align-items: baseline;
          gap: 1rem;
          border-bottom: 1px solid #e5e7eb;
          padding-bottom: 0.25rem;
        }
        .pi-row-label {
          font-weight: 500;
          flex-shrink: 0;
        }
        .pi-row-value {
          color: #4b5563;
          text-align: right;
          word-break: break-word;
        }

        /* responsive */
        @media (max-width: 480px) {
          .pi-list  { font-size: 0.8rem; }
          .pi-title { font-size: 1rem; }
          .pi-row {
            flex-direction: column;
            gap: 0.125rem;
            align-items: flex-start;
          }
          .pi-row-value { text-align: left; }
        }

      `}</style>
    </div>
  )
}
