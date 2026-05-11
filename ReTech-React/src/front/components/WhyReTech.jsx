import {
  ShieldCheckIcon,
  CurrencyEuroIcon,
  WrenchScrewdriverIcon,
  GlobeAltIcon,
} from "@heroicons/react/24/outline";
import { useLanguage } from "../context/LanguageContext";

const icons = [CurrencyEuroIcon, ShieldCheckIcon, WrenchScrewdriverIcon, GlobeAltIcon];

export default function WhyReTech() {
  const { t } = useLanguage();
  const features = t('why.features');

  return (
    <section className="w-full bg-white py-20">
      <div className="max-w-7xl mx-auto px-6">
        <h2 className="text-4xl font-bold text-center mb-16">
          {t('why.title')}
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
          {features.map((item, index) => {
            const Icon = icons[index];

            return (
              <div
                key={index}
                className="group bg-gray-50 p-8 rounded-2xl border border-gray-100 hover:shadow-xl hover:-translate-y-1 transition-all duration-300"
              >
                <Icon className="w-10 h-10 text-black mb-6 group-hover:scale-110 transition-transform" />

                <h3 className="font-semibold text-lg mb-3">
                  {item.title}
                </h3>

                <p className="text-gray-600 text-sm leading-relaxed">
                  {item.description}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
