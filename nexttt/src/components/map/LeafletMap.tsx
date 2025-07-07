import 'leaflet/dist/leaflet.css';
'use client'
import React, { useState, useEffect } from "react";
import dynamic from 'next/dynamic';
import { Business, BusinessType, MapViewport } from "../../types";
import { businessTypeColors } from "../../data/mockData";
import {
  MapPin,
  Search,
  X,
  Phone,
  Mail,
  Globe,
  Activity,
} from "lucide-react";

const DynamicMapContainer = dynamic(() => import('react-leaflet').then(mod => mod.MapContainer), { ssr: false });
const DynamicTileLayer = dynamic(() => import('react-leaflet').then(mod => mod.TileLayer), { ssr: false });
const DynamicMarker = dynamic(() => import('react-leaflet').then(mod => mod.Marker), { ssr: false });
const DynamicPopup = dynamic(() => import('react-leaflet').then(mod => mod.Popup), { ssr: false });

interface BusinessMapProps {
  emprendedores: Business[];
  defaultViewport: MapViewport;
  onBusinessSelect?: (id: string) => void;
  onLocationSelect?: (lat: number, lng: number) => void;
  selectionMode?: boolean;
}

const LeafletMap: React.FC<BusinessMapProps> = ({
  emprendedores,
  defaultViewport,
  onBusinessSelect,
  onLocationSelect,
  selectionMode = false,
}) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedTypes, setSelectedTypes] = useState<string[]>([]);
  const [selectedLocation, setSelectedLocation] = useState<[number, number] | null>(null);
  const [L, setL] = useState<any>(null);

  useEffect(() => {
    const loadLeaflet = async () => {
      const leaflet = await import('leaflet');
      setL(leaflet);
    };
    loadLeaflet();
  }, []);

  const createBusinessIcon = (type: BusinessType) => {
    if (!L) return undefined;
    const color = businessTypeColors[type];
    const svgIcon = `<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 32 32' width='24' height='24'><circle cx='16' cy='16' r='10' fill='${color}' stroke='white' stroke-width='2'/></svg>`;
    const iconUrl = `data:image/svg+xml;utf8,${encodeURIComponent(svgIcon)}`;
    return new L.Icon({
      iconUrl,
      iconSize: [28, 28],
      iconAnchor: [16, 16],
      popupAnchor: [0, -16],
    });
  };

  const filteredBusinesses = emprendedores.filter((business) => {
    const matchesSearch =
      business.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      business.type.toLowerCase().includes(searchTerm.toLowerCase()) ||
      business.address.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType =
      selectedTypes.length === 0 || selectedTypes.includes(business.type);
    return matchesSearch && matchesType;
  });

  const handleLocationSelect = (lat: number, lng: number) => {
    if (onLocationSelect) {
      setSelectedLocation([lat, lng]);
      onLocationSelect(lat, lng);
    }
  };

  const handleBusinessSelect = (id: string) => {
    if (onBusinessSelect) {
      onBusinessSelect(id);
    }
  };

  // Badge de estado
  const getStatusBadgeClass = (status: 'active' | 'inactive' | 'pending') => {
    switch (status) {
      case 'active':
        return 'bg-success-100 text-success-700 dark:bg-success-900/30 dark:text-success-500';
      case 'inactive':
        return 'bg-error-100 text-error-700 dark:bg-error-900/30 dark:text-error-500';
      case 'pending':
        return 'bg-warning-100 text-warning-700 dark:bg-warning-900/30 dark:text-warning-500';
      default:
        return 'bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300';
    }
  };

  return (
    <div>
      <div className="p-4 bg-white dark:bg-gray-800 rounded-t-lg border border-gray-200 dark:border-gray-700">
        <div className="flex items-center gap-2 mb-2">
          <MapPin size={20} className="text-primary-600 dark:text-primary-400" />
          <h2 className="text-lg font-medium">Mapa Negocios</h2>
        </div>
        <div className="relative">
          <input
            type="text"
            placeholder="Buscar negocios o ubicaciones..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="input pl-9 w-full"
          />
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          {searchTerm && (
            <button
              onClick={() => setSearchTerm("")}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
            >
              <X size={16} />
            </button>
          )}
        </div>
        {selectionMode && (
          <div className="mt-2 text-sm text-gray-600 dark:text-gray-400">
            Click on the map to select a location for your business.
          </div>
        )}
      </div>
      {/* Elimina el div con flex-1, deja solo el contenedor de alto fijo */}
      <div className="h-80 lg:h-[500px] rounded-lg overflow-hidden w-full border-x border-b border-gray-200 dark:border-gray-700">
        {L && (
          <DynamicMapContainer
            center={defaultViewport.center}
            zoom={14}
            style={{ height: "100%", width: "100%" }}
          >
            <DynamicTileLayer
              attribution=""
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
            {filteredBusinesses.map((business) => (
              <DynamicMarker
                key={business.id}
                position={[business.location.lat, business.location.lng]}
                icon={createBusinessIcon(business.type)}
              >
                <DynamicPopup>
                  <div className="w-64">
                    <div className="flex items-start gap-3 mb-3">
                      {business.imageUrl ? (
                        <img
                          src={business.imageUrl}
                          alt={business.name}
                          className="w-16 h-16 rounded-lg object-cover"
                        />
                      ) : (
                        <div className="w-16 h-16 rounded-lg bg-primary-100 dark:bg-primary-900 flex items-center justify-center text-primary-600 dark:text-primary-400 text-xl font-bold">
                          {business.name.charAt(0)}
                        </div>
                      )}
                      <div className="flex-1 min-w-0">
                        <h3 className="font-medium text-base mb-1">
                          {business.name}
                        </h3>
                        <div className="flex flex-wrap gap-2">
                          <span className="badge badge-secondary text-xs capitalize">
                            {business.type}
                          </span>
                          <span
                            className={`badge ${getStatusBadgeClass(business.status)} flex items-center text-xs`}
                          >
                            <Activity size={12} className="mr-1" />
                            {business.status.charAt(0).toUpperCase() + business.status.slice(1)}
                          </span>
                        </div>
                      </div>
                    </div>
                    <div className="space-y-2 text-sm">
                      <p className="text-gray-600 dark:text-gray-400 line-clamp-2">
                        {business.description}
                      </p>
                      <div className="flex items-center text-gray-600 dark:text-gray-400">
                        <MapPin size={14} className="mr-1 flex-shrink-0" />
                        <span className="truncate">{business.address}</span>
                      </div>
                      <div className="flex items-center text-gray-600 dark:text-gray-400">
                        <Phone size={14} className="mr-1 flex-shrink-0" />
                        <span>{business.contact.phone}</span>
                      </div>
                      <div className="flex items-center text-gray-600 dark:text-gray-400">
                        <Mail size={14} className="mr-1 flex-shrink-0" />
                        <span className="truncate">
                          {business.contact.email}
                        </span>
                      </div>
                      {business.contact.website && (
                        <div className="flex items-center text-gray-600 dark:text-gray-400">
                          <Globe size={14} className="mr-1 flex-shrink-0" />
                          <a
                            href={business.contact.website}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="truncate text-primary-600 dark:text-primary-400 hover:underline"
                          >
                            {business.contact.website.replace(/^https?:\/\//, "")}
                          </a>
                        </div>
                      )}
                    </div>
                    <div className="mt-3 pt-3 border-t border-gray-200 dark:border-gray-700">
                      <button
                        onClick={() => handleBusinessSelect(business.id)}
                        className="btn-primary w-full justify-center text-sm py-1.5"
                      >
                        Ver Detalles
                      </button>
                    </div>
                  </div>
                </DynamicPopup>
              </DynamicMarker>
            ))}
            {selectionMode && selectedLocation && (
              <DynamicMarker position={selectedLocation}>
                <DynamicPopup>
                  <div className="text-center">
                    <h3 className="font-medium">New Business Location</h3>
                    <p className="text-xs mt-1">
                      Lat: {selectedLocation[0].toFixed(6)}
                      <br />
                      Lng: {selectedLocation[1].toFixed(6)}
                    </p>
                  </div>
                </DynamicPopup>
              </DynamicMarker>
            )}
            {/* Puedes agregar LocationSelector aquí si lo necesitas */}
          </DynamicMapContainer>
        )}
      </div>
      <div className="mt-2 p-3 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
        <h3 className="text-sm font-medium mb-2">Rubros</h3>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
          {Object.entries(businessTypeColors).map(([type, color]) => {
            const isSelected = selectedTypes.includes(type);
            return (
              <button
                key={type}
                onClick={() => {
                  setSelectedTypes((prev) =>
                    isSelected
                      ? prev.filter((t) => t !== type)
                      : [...prev, type]
                  );
                }}
                className={`flex items-center px-2 py-1 text-xs border rounded-full cursor-pointer 
          ${
            isSelected
              ? "bg-primary-100 dark:bg-primary-900 text-primary-700 dark:text-primary-300 border-primary-400"
              : "bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 border-gray-300"
          }`}
              >
                <div
                  className="h-3 w-3 rounded-full mr-2"
                  style={{ backgroundColor: color }}
                ></div>
                <span className="capitalize">{type}</span>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default LeafletMap;
