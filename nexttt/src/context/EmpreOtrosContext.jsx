import { createContext, useContext, useState } from "react";

const EmpreOtrosContext = createContext();

export function EmpreOtrosProvider({ children }) {
  const [emprendedoresOtros, setEmprendedoresOtros] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchEmprendedoresOtros = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/emprendedoresotros");
      if (!res.ok) throw new Error("Error al cargar emprendedores otros");
      const data = await res.json();
      setEmprendedoresOtros(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <EmpreOtrosContext.Provider
      value={{ emprendedoresOtros, loading, error, fetchEmprendedoresOtros }}
    >
      {children}
    </EmpreOtrosContext.Provider>
  );
}

export function useEmpreOtros() {
  return useContext(EmpreOtrosContext);
}
