import { Link } from "react-router-dom";
import { useIdioma } from "../context/LanguageContext";

export default function Footer() {
  const { t } = useIdioma();

  return (
    <footer className="bg-black text-white py-16">
      <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-4 gap-10">

        <div>
          <h3 className="text-xl font-bold mb-4">ReTech</h3>
          <p className="text-gray-400 text-sm">
            {t('footer.description')}
          </p>
        </div>

        <div>
          <h4 className="font-semibold mb-4">{t('footer.buy')}</h4>
          <ul className="space-y-2 text-gray-400 text-sm">
            <li>{t('footer.phones')}</li>
            <li>{t('footer.tablets')}</li>
            <li>{t('footer.accessories')}</li>
          </ul>
        </div>

        <div>
          <h4 className="font-semibold mb-4">{t('footer.support')}</h4>
          <ul className="space-y-2 text-gray-400 text-sm">
            <Link to="/contact">
              {t('footer.contactUs')}
            </Link>
            <li>{t('footer.warranty')}</li>
            <li>{t('footer.shipping')}</li>
          </ul>
        </div>

        <div>
          <h4 className="font-semibold mb-4">{t('footer.legal')}</h4>
          <ul className="space-y-2 text-gray-400 text-sm">
            <li>{t('footer.privacy')}</li>
            <li>{t('footer.terms')}</li>
          </ul>
        </div>

      </div>

      <div className="text-center text-gray-500 text-sm mt-12">
        © {new Date().getFullYear()} ReTech. {t('footer.rights')}
      </div>
    </footer>
  );
}
