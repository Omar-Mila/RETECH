import { createContext, useContext, useState, useCallback } from "react";
import ca from "../../locales/ca";
import es from "../../locales/es";
import en from "../../locales/en";

const traducciones = { ca, es, en };

const ContextoIdioma = createContext(null);

export function ProveedorIdioma({ children }) {
  const [idioma, fijarIdiomaEstado] = useState(() => localStorage.getItem("retech-lang") || "ca");

  const fijarIdioma = (codigo) => {
    localStorage.setItem("retech-lang", codigo);
    fijarIdiomaEstado(codigo);
  };

  const t = useCallback((clave) => {
    const dicc = traducciones[idioma] || traducciones.ca;
    const partes = clave.split(".");
    let valor = dicc;
    for (const parte of partes) {
      valor = valor?.[parte];
      if (valor === undefined) return clave;
    }
    return valor ?? clave;
  }, [idioma]);

  return (
    <ContextoIdioma.Provider value={{ idioma, fijarIdioma, t }}>
      {children}
    </ContextoIdioma.Provider>
  );
}

export function useIdioma() {
  return useContext(ContextoIdioma);
}
