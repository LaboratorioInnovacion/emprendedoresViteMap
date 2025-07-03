import React, { useState } from "react";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import { Business, BusinessType, MapViewport } from "../../types";
import { businessTypeColors } from "../../data/mockData";
import { Icon } from "leaflet";
import { MapPin, Building2, Search, X, Phone, Mail, Globe, Activity } from "lucide-react";

interface BusinessMapProps {
  emprendedores: any[];
  defaultViewport: MapViewport;
  onBusinessSelect?: (id: string) => void;
  onLocationSelect?: (lat: number, lng: number) => void;
  selectionMode?: boolean;
}

const BusinessMap: React.FC<BusinessMapProps> = ({
  emprendedores,
  defaultViewport,
  onBusinessSelect,
  onLocationSelect,
  selectionMode = false,
}) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedTypes, setSelectedTypes] = useState<string[]>([]);
  const [selectedLocation, setSelectedLocation] = useState<[number, number] | null>(null);
  // ...resto de la lógica...
  return <div>BusinessMap adaptado a Next.js</div>;
};

export default BusinessMap;
