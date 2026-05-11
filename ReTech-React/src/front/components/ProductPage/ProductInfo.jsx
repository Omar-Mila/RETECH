import { useLanguage } from "../../context/LanguageContext"

export default function ProductInfo({ product }) {
  const { t } = useLanguage()

  const caracteristicas = [
    { label: t('productInfo.processor'),   value: product.procesador },
    { label: t('productInfo.screen'),      value: `${product.pantalla_pulgadas}" · ${product.hz_pantalla}Hz` },
    { label: t('productInfo.battery'),     value: `${product.bateria_mah} mAh` },
    { label: t('productInfo.mainCamera'),  value: `${product.camara_principal_mp} MP` },
    { label: t('productInfo.frontCamera'), value: `${product.camara_frontal_mp} MP` },
    { label: t('productInfo.connector'),   value: product.conector },
    { label: "5G",                         value: product.cinco_g ? t('productInfo.yes') : t('productInfo.no') },
    { label: "NFC",                        value: product.nfc ? t('productInfo.yes') : t('productInfo.no') },
    { label: "SIM",                        value: product.tipo_sim },
    { label: t('productInfo.refurbisher'), value: product.empresa },
  ]

  return (
    <div className="space-y-6">
      <div>
        <h2 className="font-semibold text-lg mb-3">
          {t('productInfo.features')}
        </h2>
        <ul className="space-y-2 text-sm text-gray-700">
          {caracteristicas.map((item, i) => (
            <li key={i} className="flex justify-between border-b pb-1">
              <span className="font-medium">{item.label}</span>
              <span>{item.value ?? "—"}</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  )
}
