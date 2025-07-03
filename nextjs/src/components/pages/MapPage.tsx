// Adaptación para Next.js
'use client';
import React from "react";
import BusinessMap from "../map/BusinessMap";
import { calculateMapCenter } from "../../data/mockData";
import { useEmprendedores } from "../../context/EmprendedoresContext";
import { PieChart, Pie, Cell, Tooltip, Legend } from 'recharts';

const MapPage: React.FC = () => {
  // Adaptar lógica de contexto y hooks para Next.js
  return (
    <div>Mapa adaptado a Next.js</div>
  );
};

export default MapPage;
