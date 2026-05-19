import { useState } from "react"
import { useLanguage } from "../../context/LanguageContext"

const STATE_IMG = {
  "Como nuevo": "/A.png",
  "Buen estado": "/B.png",
  "Funcional": "/C.png",
}

export default function StateImage({ selectedState }) {
  const { t } = useLanguage()
  const [open, setOpen] = useState(false)

  if (!selectedState) return null

  const stateInfo = t('product.stateInfo')
  const badge = stateInfo[selectedState]?.badge ?? selectedState
  const imageSrc = STATE_IMG[selectedState] ?? ""

  return (
    <>
      <div className="mt-6 border rounded-lg p-4 bg-white">
        <h3 className="font-semibold mb-3">{t('productInfo.phoneCondition')}</h3>
        <img
          src={imageSrc}
          alt={badge}
          className="w-full max-w-md mx-auto object-contain rounded cursor-zoom-in"
          onClick={() => setOpen(true)}
          title={t('productInfo.clickToZoom') ?? "Ver en grande"}
        />
      </div>

      {open && (
        <div
          onClick={() => setOpen(false)}
          style={{
            position: "fixed", inset: 0, zIndex: 9999,
            background: "rgba(0,0,0,0.75)",
            display: "flex", alignItems: "center", justifyContent: "center",
            cursor: "zoom-out",
          }}
        >
          <img
            src={imageSrc}
            alt={badge}
            onClick={e => e.stopPropagation()}
            style={{
              maxWidth: "90vw", maxHeight: "90vh",
              objectFit: "contain", borderRadius: 12,
              boxShadow: "0 8px 40px rgba(0,0,0,0.4)",
            }}
          />
          <button
            onClick={() => setOpen(false)}
            style={{
              position: "fixed", top: 20, right: 24,
              background: "rgba(255,255,255,0.15)", border: "none",
              color: "#fff", fontSize: 28, lineHeight: 1,
              width: 44, height: 44, borderRadius: "50%",
              cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center",
            }}
          >
            ×
          </button>
        </div>
      )}
    </>
  )
}
