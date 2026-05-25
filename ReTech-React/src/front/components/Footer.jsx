import { Link } from "react-router-dom";
import { useIdioma } from "../context/LanguageContext";

export default function Footer() {
  const { t } = useIdioma();

  return (
    <footer className="ft-footer">
      <div className="ft-inner">

        {/* Marca */}
        <div className="ft-col">
          <h3 className="ft-brand">ReTech</h3>
          <p className="ft-desc">{t('footer.description')}</p>
        </div>

        {/* Comprar */}
        <div className="ft-col">
          <h4 className="ft-col-title">{t('footer.buy')}</h4>
          <ul className="ft-list">
            <li>{t('footer.phones')}</li>
            <li>{t('footer.tablets')}</li>
            <li>{t('footer.accessories')}</li>
          </ul>
        </div>

        {/* Soporte */}
        <div className="ft-col">
          <h4 className="ft-col-title">{t('footer.support')}</h4>
          <ul className="ft-list">
            <li>
              <Link to="/contact" className="ft-link">{t('footer.contactUs')}</Link>
            </li>
            <li>{t('footer.warranty')}</li>
            <li>{t('footer.shipping')}</li>
          </ul>
        </div>

        {/* Legal */}
        <div className="ft-col">
          <h4 className="ft-col-title">{t('footer.legal')}</h4>
          <ul className="ft-list">
            <li>{t('footer.privacy')}</li>
            <li>{t('footer.terms')}</li>
          </ul>
        </div>

      </div>

      <div className="ft-copy">
        © {new Date().getFullYear()} ReTech. {t('footer.rights')}
      </div>

      <style>{`

        /* ── Footer ─────────────────────────────────────────── */
        .ft-footer {
          background: #000;
          color: #fff;
          padding: 4rem 0 2rem;
        }

        /* ── Grid interior ──────────────────────────────────── */
        .ft-inner {
          max-width: 80rem;
          margin: 0 auto;
          padding: 0 1.5rem;
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 2.5rem;
        }

        /* ── Columna ────────────────────────────────────────── */
        .ft-col { display: flex; flex-direction: column; }

        .ft-brand {
          font-size: 1.25rem;
          font-weight: 700;
          margin: 0 0 1rem 0;
        }
        .ft-desc {
          color: #9ca3af;
          font-size: 0.875rem;
          line-height: 1.6;
          margin: 0;
        }
        .ft-col-title {
          font-weight: 600;
          font-size: 0.9375rem;
          margin: 0 0 1rem 0;
        }

        /* ── Lista ──────────────────────────────────────────── */
        .ft-list {
          list-style: none;
          margin: 0;
          padding: 0;
          display: flex;
          flex-direction: column;
          gap: 0.5rem;
          color: #9ca3af;
          font-size: 0.875rem;
        }
        .ft-link {
          color: #9ca3af;
          text-decoration: none;
          transition: color 0.15s;
        }
        .ft-link:hover { color: #fff; }

        /* ── Copyright ──────────────────────────────────────── */
        .ft-copy {
          text-align: center;
          color: #6b7280;
          font-size: 0.875rem;
          margin-top: 3rem;
          padding: 0 1.5rem;
        }

        /* ── Responsive ─────────────────────────────────────── */
        @media (max-width: 768px) {
          .ft-inner {
            grid-template-columns: repeat(2, 1fr);
            gap: 2rem;
          }
        }

        @media (max-width: 480px) {
          .ft-footer  { padding: 2.5rem 0 1.5rem; }
          .ft-inner   { grid-template-columns: 1fr; gap: 1.5rem; }
          .ft-copy    { margin-top: 2rem; font-size: 0.8rem; }
          .ft-brand   { font-size: 1.1rem; }
        }

      `}</style>
    </footer>
  );
}
