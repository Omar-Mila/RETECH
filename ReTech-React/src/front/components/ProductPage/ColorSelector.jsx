export default function ColorSelector({ colores, colorSeleccionado, fijarColor }) {

  if (!colores) return null

  return (
    <div className="cs-container">

      <div>
        <h3 className="cs-title">Color</h3>

        <div className="cs-grid">
          {colores.map(color => (
            <label key={color.id} className="cs-label">

              <input
                type="radio"
                name="color"
                value={color.id}
                checked={colorSeleccionado === color.id}
                onChange={() => fijarColor(color.id)}
                className="cs-input"
              />

              <div className={`cs-option${colorSeleccionado === color.id ? " cs-option--active" : ""}`}>
                {color.nombre}
              </div>

            </label>
          ))}
        </div>
      </div>

      <style>{`
        .cs-container {
          display: flex;
          flex-direction: column;
          gap: 1.5rem;
        }

        .cs-title {
          font-weight: 600;
          margin-bottom: 0.5rem;
        }

        .cs-grid {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 1rem;
          width: 100%;
        }

        .cs-label {
          cursor: pointer;
          width: 100%;
        }

        .cs-input {
          display: none;
        }

        .cs-option {
          width: 100%;
          padding: 1rem 0;
          border: 1px solid #d1d5db;
          border-radius: 0.25rem;
          text-align: center;
          transition: border-color 0.15s ease;
        }

        .cs-option:hover {
          border-color: #000;
        }

        .cs-option--active {
          border-color: #000;
          background-color: #f3f4f6;
        }

        @media (max-width: 480px) {
          .cs-grid {
            grid-template-columns: 1fr;
          }
          .cs-option {
            padding: 0.75rem 0;
            font-size: 0.9rem;
          }
        }
      `}</style>

    </div>
  )
}
