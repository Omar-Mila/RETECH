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
    <div className="space-y-6">
      <div>
        <h2 className="font-semibold text-lg mb-3">
          {t('productInfo.features')}
        </h2>
        <ul className="space-y-2 text-sm text-gray-700">
          {caracteristicas.map((elemento, i) => (
            <li key={i} className="flex justify-between border-b pb-1">
              <span className="font-medium">{elemento.label}</span>
              <span>{elemento.value ?? "—"}</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  )
}
