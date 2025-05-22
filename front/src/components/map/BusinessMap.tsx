import React, { useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMapEvent } from 'react-leaflet';
import { Business, BusinessType, MapViewport } from '../../types';
import { businessTypeColors } from '../../data/mockData';
import { Icon } from 'leaflet';
import { MapPin, Building2, Search, X } from 'lucide-react';

interface BusinessMapProps {
  businesses: Business[];
  defaultViewport: MapViewport;
  onBusinessSelect?: (id: string) => void;
  onLocationSelect?: (lat: number, lng: number) => void;
  selectionMode?: boolean;
}

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
const LocationSelector = ({ onLocationSelect }: { onLocationSelect?: (lat: number, lng: number) => void }) => {
  useMapEvent('click', (e) => {
    if (onLocationSelect) {
      onLocationSelect(e.latlng.lat, e.latlng.lng);
    }
  });
  return null;
};

const BusinessMap: React.FC<BusinessMapProps> = ({
  businesses,
  defaultViewport,
  onBusinessSelect,
  onLocationSelect,
  selectionMode = false
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedLocation, setSelectedLocation] = useState<[number, number] | null>(null);

  // Handle business search
  const filteredBusinesses = businesses.filter(business => 
    business.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    business.type.toLowerCase().includes(searchTerm.toLowerCase()) ||
    business.address.toLowerCase().includes(searchTerm.toLowerCase())
  );

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
          <MapPin size={20} className="text-primary-600 dark:text-primary-400" />
          <h2 className="text-lg font-medium">Business Map</h2>
        </div>
        
        <div className="relative">
          <input
            type="text"
            placeholder="Search businesses or locations..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="input pl-9 w-full"
          />
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          {searchTerm && (
            <button
              onClick={() => setSearchTerm('')}
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
            center={defaultViewport.center}
            zoom={defaultViewport.zoom}
            style={{ height: '100%', width: '100%' }}
          >
            <TileLayer
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
            
            {/* Business markers */}
            {filteredBusinesses.map(business => (
              <Marker
                key={business.id}
                position={[business.location.lat, business.location.lng]}
                icon={createBusinessIcon(business.type)}
                eventHandlers={{
                  click: () => handleBusinessSelect(business.id)
                }}
              >
                <Popup>
                  <div className="text-center">
                    <h3 className="font-medium">{business.name}</h3>
                    <p className="text-sm text-gray-600 capitalize">{business.type}</p>
                    <p className="text-xs mt-1">{business.address}</p>
                    {onBusinessSelect && (
                      <button
                        onClick={() => handleBusinessSelect(business.id)}
                        className="mt-2 text-xs text-white hover:text-primary-800 hover:underline"
                      >
                        View Details
                      </button>
                    )}
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
                      Lat: {selectedLocation[0].toFixed(6)}<br />
                      Lng: {selectedLocation[1].toFixed(6)}
                    </p>
                  </div>
                </Popup>
              </Marker>
            )}
            
            {/* Location selector component */}
            {selectionMode && <LocationSelector onLocationSelect={handleLocationSelect} />}
          </MapContainer>
        </div>
      </div>
      
      {/* Legend */}
      <div className="mt-2 p-3 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
        <h3 className="text-sm font-medium mb-2">Legend</h3>
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
        </div>
      </div>
    </div>
  );
};

export default BusinessMap;