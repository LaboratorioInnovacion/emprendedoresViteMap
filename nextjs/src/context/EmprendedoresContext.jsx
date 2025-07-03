import { useContext, createContext, useState, useEffect } from "react";
import { fetchBusinessData } from "../api/api.js";

const EmprendedoresContext = createContext();

export const EmprendedoresProvider = ({ children }) => {
  const [emprendedores, setEmprendedores] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchemprendedores = async () => {
    try {
      setLoading(true);
      const data = await fetchBusinessData();
      setEmprendedores(data);
    } catch (error) {
      console.error("Error fetching emprendedores:", error);
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    fetchemprendedores();
  }, []);

  return (
    <EmprendedoresContext.Provider
      value={{ fetchemprendedores, emprendedores, setEmprendedores, loading }}
    >
      {children}
    </EmprendedoresContext.Provider>
  );
};

export const useEmprendedores = () => useContext(EmprendedoresContext);
