'use client'
import React, { useState } from "react";
import dynamic from 'next/dynamic';
// Importa el componente del mapa dinámicamente para evitar SSR
const LeafletMap = dynamic(() => import('./LeafletMap'), { ssr: false });
import { Business, MapViewport } from "../../types";

interface BusinessMapProps {
  emprendedores: Business[];
  defaultViewport: MapViewport;
  onBusinessSelect?: (id: string) => void;
  onLocationSelect?: (lat: number, lng: number) => void;
  selectionMode?: boolean;
}

const BusinessMap: React.FC<BusinessMapProps> = (props) => {
  // Solo renderiza el mapa real en el cliente
  return <LeafletMap {...props} />;
};

export default BusinessMap;
