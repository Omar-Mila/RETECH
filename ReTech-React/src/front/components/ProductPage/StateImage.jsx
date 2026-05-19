import { useLanguage } from "../../context/LanguageContext"

const STATE_IMG = {
  "Como nuevo": "/A.png",
  "Buen estado": "/B.png",
  "Funcional": "/C.png",
}

export default function StateImage({ selectedState }) {
  const { t } = useLanguage()

  if (!selectedState) return null

  const stateInfo = t('product.stateInfo')
  const badge = stateInfo[selectedState]?.badge ?? selectedState
  const imageSrc = STATE_IMG[selectedState] ?? ""

  return (
    <div className="mt-6 border rounded-lg p-4 bg-white">
      <h3 className="font-semibold mb-3">{t('productInfo.phoneCondition')}</h3>
      <img
        src={imageSrc}
        alt={badge}
        className="w-full max-w-md mx-auto object-contain rounded"
      />
    </div>
  )
}
