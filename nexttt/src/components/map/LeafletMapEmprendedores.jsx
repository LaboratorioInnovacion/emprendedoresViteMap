'use client'
import 'leaflet/dist/leaflet.css'; // Importa los estilos de Leaflet para los mapas
import React, { useState, useEffect } from "react";
import dynamic from 'next/dynamic'; // Importa componentes de forma dinámica para evitar problemas de SSR
// import de tipos eliminado para JS puro
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

// Rubros/sectores principales (puedes ajustar los valores y colores)
const filtrosSectoriales = [
  { key: "Produccion", label: "Producción", color: "#E11D48" },
  { key: "Comercio", label: "Comercio", color: "#2563EB" },
  { key: "Servicio", label: "Servicios", color: "#059669" },
];

// Importa los componentes de react-leaflet de forma dinámica para que solo se carguen en el cliente (evita errores de SSR)
const DynamicMapContainer = dynamic(() => import('react-leaflet').then(mod => mod.MapContainer), { ssr: false });
const DynamicTileLayer = dynamic(() => import('react-leaflet').then(mod => mod.TileLayer), { ssr: false });
const DynamicMarker = dynamic(() => import('react-leaflet').then(mod => mod.Marker), { ssr: false });
const DynamicPopup = dynamic(() => import('react-leaflet').then(mod => mod.Popup), { ssr: false });

// Define las props que recibe el componente
// interface BusinessMapProps {
//   emprendedores: Business[]; // Lista de negocios a mostrar
//   defaultViewport: MapViewport; // Vista inicial del mapa (centro y zoom)
//   onBusinessSelect?: (id: string) => void; // Callback al seleccionar un negocio
//   onLocationSelect?: (lat: number, lng: number) => void; // Callback al seleccionar una ubicación en modo selección
//   selectionMode?: boolean; // Si está activo el modo de selección de ubicación
// }

// Componente principal del mapa
const LeafletMap = ({
  emprendedores,
  defaultViewport,
  onBusinessSelect,
  onLocationSelect,
  selectionMode = false,
}) => {
    // Este componente no tiene filtros ni buscador
  // Estado para la ubicación seleccionada (en modo selección)
  const [selectedLocation, setSelectedLocation] = useState(null);
  // Estado para la instancia de Leaflet (necesario para crear iconos personalizados)
  const [L, setL] = useState(null);

  // Carga dinámica de la librería Leaflet solo en el cliente
  useEffect(() => {
    const loadLeaflet = async () => {
      const leaflet = await import('leaflet');
      setL(leaflet);
    };
    loadLeaflet();
  }, []);

  // Crea un icono SVG personalizado para cada tipo/categoría de negocio (igual que en page.tsx)
  const createBusinessIcon = (type) => {
    if (!L) return undefined;
    // Buscar el color en filtrosSectoriales
    const sector = filtrosSectoriales.find(f => type && (type === f.key || type === f.label || type === f.label.toLowerCase() || type === f.key.toLowerCase()));
    const color = sector ? sector.color : "#4B5563";
    const svgIcon = `<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 32 32' width='24' height='24'><circle cx='16' cy='16' r='10' fill='${color}' stroke='white' stroke-width='2'/></svg>`;
    const iconUrl = `data:image/svg+xml;utf8,${encodeURIComponent(svgIcon)}`;
    return new L.Icon({
      iconUrl,
      iconSize: [28, 28],
      iconAnchor: [16, 16],
      popupAnchor: [0, -16],
    });
  };

  // Estado para los sectores seleccionados en los filtros
  const [selectedSectores, setSelectedSectores] = useState([]);

  // Filtrar negocios según los sectores seleccionados
  const filteredBusinesses = emprendedores.filter((business) => {
    // Determinar el sector principal por prefijo
    const sector = filtrosSectoriales.find(f => (business.actividadPrincipal || "").startsWith(f.key))?.key;
    const matchesSector = selectedSectores.length === 0 || (sector && selectedSectores.includes(sector));
    return matchesSector;
  });

  // Maneja la selección de una ubicación en el mapa (modo selección)
  const handleLocationSelect = (lat, lng) => {
    if (onLocationSelect) {
      setSelectedLocation([lat, lng]);
      onLocationSelect(lat, lng);
    }
  };

  // Maneja la selección de un negocio (al hacer click en "Ver Detalles")
  const handleBusinessSelect = (id) => {
    if (onBusinessSelect) {
      onBusinessSelect(id);
    }
  };

  // Devuelve la clase CSS para el badge de estado del negocio
  const getStatusBadgeClass = (status) => {
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

  // Render principal del componente
  return (
    <div>
      {/* Contenedor del mapa con altura fija */}
      <div className="h-80 lg:h-[500px] rounded-lg overflow-hidden w-full border-x border-b border-gray-200 dark:border-gray-700">
        {/* Solo renderiza el mapa cuando Leaflet está cargado en el cliente */}
        {L && (
          <DynamicMapContainer
            // @ts-expect-error center es válido en react-leaflet v4
            center={defaultViewport.center}
            zoom={14}
            style={{ height: "100%", width: "100%" }}
          >
            {/* Capa base de OpenStreetMap */}
            <DynamicTileLayer
              // @ts-expect-error attribution es válido en react-leaflet v4
              attribution=""
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
            {/* Marcadores de negocios filtrados */}
            {filteredBusinesses.map((business) => (
              <DynamicMarker
                key={business.id}
                position={[(business.location.lat), (business.location.lng)]}
                // El color del marcador depende de la categoría/tipo/rubro
                icon={createBusinessIcon(business.type)}
              >
                {/* Popup con detalles del negocio */}
                <DynamicPopup>
                  <div className="w-64">
                    <div className="flex items-start gap-3 mb-3">
                      {/* Imagen o inicial del negocio */}
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
                          {/* Tipo de negocio */}
                          <span className="badge badge-secondary text-xs capitalize">
                            {business.type}
                          </span>
                          {/* Estado del negocio */}
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
                      {/* Descripción */}
                      <p className="text-gray-600 dark:text-gray-400 line-clamp-2">
                        {business.description}
                      </p>
                      {/* Dirección */}
                      <div className="flex items-center text-gray-600 dark:text-gray-400">
                        <MapPin size={14} className="mr-1 flex-shrink-0" />
                        <span className="truncate">{business.address}</span>
                      </div>
                      {/* Teléfono */}
                      <div className="flex items-center text-gray-600 dark:text-gray-400">
                        <Phone size={14} className="mr-1 flex-shrink-0" />
                        <span>{business.contact.phone}</span>
                      </div>
                      {/* Email */}
                      <div className="flex items-center text-gray-600 dark:text-gray-400">
                        <Mail size={14} className="mr-1 flex-shrink-0" />
                        <span className="truncate">
                          {business.contact.email}
                        </span>
                      </div>
                      {/* Sitio web (si existe) */}
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
                    {/* Botón para ver detalles del negocio */}
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
            {/* Si está en modo selección y hay ubicación seleccionada, muestra un marcador especial */}
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
            {/* Aquí se podría agregar un componente para seleccionar ubicación en el mapa */}
          </DynamicMapContainer>
        )}
      </div>
      {/* Filtros visuales de sector principal (ahora debajo del mapa) */}
      {/* <div className="mt-2 p-3 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
        <h3 className="text-sm font-medium mb-2">Sector</h3>
        <div className="grid grid-cols-3 gap-2">
          {filtrosSectoriales.map(({ key, label, color }) => {
            const isSelected = selectedSectores.includes(key);
            return (
              <button
                key={key}
                onClick={() => {
                  setSelectedSectores((prev) =>
                    isSelected
                      ? prev.filter((a) => a !== key)
                      : [...prev, key]
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
                  style={{ backgroundColor: color as string }}
                ></div>
                <span className="capitalize">{label}</span>
              </button>
            );
          })}
        </div>
      </div> */}
    </div>
  );
};

export default LeafletMap;
