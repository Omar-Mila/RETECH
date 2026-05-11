import { createContext, useContext, useState, useCallback } from "react";
import ca from "../../locales/ca";
import es from "../../locales/es";
import en from "../../locales/en";

const translations = { ca, es, en };

const LanguageContext = createContext(null);

export function LanguageProvider({ children }) {
  const [lang, setLangState] = useState(() => localStorage.getItem("retech-lang") || "ca");

  const setLang = (code) => {
    localStorage.setItem("retech-lang", code);
    setLangState(code);
  };

  const t = useCallback((key) => {
    const dict = translations[lang] || translations.ca;
    const parts = key.split(".");
    let value = dict;
    for (const part of parts) {
      value = value?.[part];
      if (value === undefined) return key;
    }
    return value ?? key;
  }, [lang]);

  return (
    <LanguageContext.Provider value={{ lang, setLang, t }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  return useContext(LanguageContext);
}
