import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { EmprendedoresProvider } from "./context/EmprendedoresContext";
// import App from './App.tsx';
import App from "./App";
import "./index.css";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <EmprendedoresProvider>
      <App />
    </EmprendedoresProvider>
  </StrictMode>
);
