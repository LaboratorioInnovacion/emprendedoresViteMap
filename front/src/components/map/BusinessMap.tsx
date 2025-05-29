import React, { useState } from "react";
import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
  useMapEvent,
} from "react-leaflet";
import { Business, BusinessType, MapViewport } from "../../types";
import { businessTypeColors } from "../../data/mockData";
import { Icon } from "leaflet";
import {
  MapPin,
  Building2,
  Search,
  X,
  Phone,
  Mail,
  Globe,
  Activity,
} from "lucide-react";
import { useOutletContext } from "react-router-dom";

interface BusinessMapProps {
  emprendedores: emprendedores[];
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
  const { isMobileSidebarOpen, isMobile } = useOutletContext() as {
    isMobileSidebarOpen: boolean;
    isMobile: boolean;
  };

  const [searchTerm, setSearchTerm] = useState("");
  const [selectedTypes, setSelectedTypes] = useState<string[]>([]);

  const [selectedLocation, setSelectedLocation] = useState<
    [number, number] | null
  >(null);

  // Create custom map pins for businesses
  const createBusinessIcon = (type: BusinessType) => {
    const color = businessTypeColors[type];
    const svgIcon = `
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="${color}" width="24" height="24">
        <path d="M12 0c-4.4 0-8 3.6-8 8 0 5.4 7 13.4 7.3 13.7.2.2.5.3.7.3s.5-.1.7-.3c.3-.3 7.3-8.3 7.3-13.7 0-4.4-3.6-8-8-8zm0 12c-2.2 0-4-1.8-4-4s1.8-4 4-4 4 1.8 4 4-1.8 4-4 4z"/>
      </svg>
    `;

    const iconUrl = `data:image/svg+xml;base64,${btoa(svgIcon)}`;

    return new Icon({
      iconUrl,
      iconSize: [32, 32],
      iconAnchor: [16, 32],
      popupAnchor: [0, -32],
    });
  };

  // Component to handle map clicks for location selection
  const LocationSelector = ({
    onLocationSelect,
  }: {
    onLocationSelect?: (lat: number, lng: number) => void;
  }) => {
    useMapEvent("click", (e) => {
      if (onLocationSelect) {
        onLocationSelect(e.latlng.lat, e.latlng.lng);
      }
    });
    return null;
  };

  // Get status badge class (copiado de Dashboard)
  const getStatusBadgeClass = (status: "active" | "inactive" | "pending") => {
    switch (status) {
      case "active":
        return "bg-success-100 text-success-700 dark:bg-success-900/30 dark:text-success-500";
      case "inactive":
        return "bg-error-100 text-error-700 dark:bg-error-900/30 dark:text-error-500";
      case "pending":
        return "bg-warning-100 text-warning-700 dark:bg-warning-900/30 dark:text-warning-500";
      default:
        return "bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300";
    }
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

  // // Handle business search
  // const filteredBusinesses = emprendedores.filter(business =>
  //   business.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
  //   business.type.toLowerCase().includes(searchTerm.toLowerCase()) ||
  //   business.address.toLowerCase().includes(searchTerm.toLowerCase())
  // );

  // Handle map click for location selection
  const handleLocationSelect = (lat: number, lng: number) => {
    if (onLocationSelect) {
      setSelectedLocation([lat, lng]);
      onLocationSelect(lat, lng);
    }
  };

  // Handle business marker click
  const handleBusinessSelect = (id: string) => {
    if (onBusinessSelect) {
      onBusinessSelect(id);
    }
  };

  return (
    <div className="flex flex-col h-full">
      <div className="p-4 bg-white dark:bg-gray-800 rounded-t-lg border border-gray-200 dark:border-gray-700">
        <div className="flex items-center gap-2 mb-2">
          <MapPin
            size={20}
            className="text-primary-600 dark:text-primary-400"
          />
          <h2 className="text-lg font-medium">Mapa Negocios</h2>
        </div>

        <div className="relative">
          <input
            type="text"
            placeholder="Search businesses or locations..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="input pl-9 w-full"
          />
          <Search
            size={16}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
          />
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

      <div className="flex-1 rounded-b-lg overflow-hidden border-x border-b border-gray-200 dark:border-gray-700">
        <div className="map-container">
          <MapContainer
            // @ts-expect-error center es válido en react-leaflet v4
            center={defaultViewport.center}
            zoom={14}
            style={{ height: "100%", width: "100%" }}
          >
            <TileLayer
              // @ts-expect-error attribution es válido en react-leaflet v4
              attribution=""
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />

            {/* Business markers */}
            {filteredBusinesses.map((business) => (
              <Marker
                key={business.id}
                position={[business.location.lat, business.location.lng]}
                {...({ icon: createBusinessIcon(business.type) } as any)}
              >
                <Popup>
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
                            className={`badge ${getStatusBadgeClass(
                              business.status
                            )} flex items-center text-xs`}
                          >
                            <Activity size={12} className="mr-1" />
                            {business.status.charAt(0).toUpperCase() +
                              business.status.slice(1)}
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
                            {business.contact.website.replace(
                              /^https?:\/\//,
                              ""
                            )}
                          </a>
                        </div>
                      )}
                    </div>

                    <div className="mt-3 pt-3 border-t border-gray-200 dark:border-gray-700">
                      <button
                        onClick={() => handleBusinessSelect(business.id)}
                        className="btn-primary w-full justify-center text-sm py-1.5"
                      >
                        View Details
                      </button>
                    </div>
                  </div>
                </Popup>
              </Marker>
            ))}

            {/* Selected location marker for new business */}
            {selectionMode && selectedLocation && (
              <Marker position={selectedLocation}>
                <Popup>
                  <div className="text-center">
                    <h3 className="font-medium">New Business Location</h3>
                    <p className="text-xs mt-1">
                      Lat: {selectedLocation[0].toFixed(6)}
                      <br />
                      Lng: {selectedLocation[1].toFixed(6)}
                    </p>
                  </div>
                </Popup>
              </Marker>
            )}

            {/* Location selector component */}
            {selectionMode && (
              <LocationSelector onLocationSelect={handleLocationSelect} />
            )}
          </MapContainer>
        </div>
      </div>

      {/* Legend */}
      <div className="mt-2 p-3 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
        {/* <h3 className="text-sm font-medium mb-2">Rubros</h3>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
          {Object.entries(businessTypeColors).map(([type, color]) => (
            <div key={type} className="flex items-center">
              <div 
                className="h-3 w-3 rounded-full mr-1" 
                style={{ backgroundColor: color }}
              ></div>
              <span className="text-xs capitalize">{type}</span>
            </div>
          ))}
        </div> */}
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

export default BusinessMap;
