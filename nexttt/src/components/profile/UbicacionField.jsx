import { useEffect, useState } from "react";
import { MapContainer, TileLayer, Marker, useMapEvents } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";

// Fix para los íconos de Leaflet en Next.js
if (typeof window !== "undefined") {
  delete L.Icon.Default.prototype._getIconUrl;
  L.Icon.Default.mergeOptions({
    iconRetinaUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon-2x.png",
    iconUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png",
    shadowUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png",
  });
}

export default function UbicacionField({ ubicacion, setUbicacion }) {
  const [position, setPosition] = useState(ubicacion || null);
  const [mapReady, setMapReady] = useState(false);

  useEffect(() => {
    if (!position && typeof window !== "undefined" && navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        ({ coords }) => {
          const newPos = { lat: coords.latitude, lng: coords.longitude };
          setPosition(newPos);
          setUbicacion(newPos);
        },
        (err) => {
          console.error("Error obteniendo ubicación:", err);
          alert("No se pudo obtener la ubicación. Verificá los permisos del navegador.");
        }
      );
    }
  }, [position, setUbicacion]);

  const DraggableMarker = () => {
    useMapEvents({
      click(e) {
        const { lat, lng } = e.latlng;
        setPosition({ lat, lng });
        setUbicacion({ lat, lng });
      },
    });

    return position ? (
      <Marker
        position={position}
        draggable={true}
        eventHandlers={{
          dragend: (e) => {
            const marker = e.target;
            const { lat, lng } = marker.getLatLng();
            setPosition({ lat, lng });
            setUbicacion({ lat, lng });
          },
        }}
      />
    ) : null;
  };

  return (
    <div className="col-span-1 md:col-span-2">
      <label className="block text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">
        Ubicación
      </label>
      <input
        className="w-full mb-4 p-2 border border-gray-300 rounded-md dark:bg-gray-700 dark:border-gray-600 focus:ring-2 focus:ring-primary-500"
        value={
          position && typeof position.lat === "number" && typeof position.lng === "number"
            ? `${position.lat.toFixed(6)}, ${position.lng.toFixed(6)}`
            : ""
        }
        onChange={(e) => {
          const [latStr, lngStr] = e.target.value.split(",").map((s) => s.trim());
          const lat = parseFloat(latStr);
          const lng = parseFloat(lngStr);
          if (!isNaN(lat) && !isNaN(lng)) {
            const newPos = { lat, lng };
            setPosition(newPos);
            setUbicacion(newPos);
          }
        }}
        placeholder="Latitud, Longitud"
      />
      {position && (
        <div className="h-64 rounded-md overflow-hidden">
          <MapContainer
            center={position}
            zoom={13}
            style={{ height: "100%", width: "100%" }}
            whenReady={() => setMapReady(true)}
          >
            <TileLayer
              attribution=""
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
            {mapReady && <DraggableMarker />}
          </MapContainer>
        </div>
      )}
    </div>
  );
}
