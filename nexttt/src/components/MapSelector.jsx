"use client";
import { MapContainer, TileLayer, Marker, Popup, useMapEvents } from "react-leaflet";
import { useEffect, useState } from "react";

export default function MapSelector({ ubicacion, onSelect }) {
  const [position, setPosition] = useState(ubicacion || { lat: -34.6037, lng: -58.3816 });

  const MapClickHandler = () => {
    useMapEvents({
      click(e) {
        setPosition(e.latlng);
        onSelect(e.latlng);
      },
    });
    return null;
  };

  useEffect(() => {
    if (!ubicacion && navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        ({ coords }) => {
          setPosition({ lat: coords.latitude, lng: coords.longitude });
        },
        (err) => console.warn("No se pudo obtener geolocalización", err)
      );
    }
  }, []);

  return (
    <MapContainer
      center={position}
      zoom={13}
      scrollWheelZoom={true}
      style={{ height: "100%", width: "100%" }}
    >
      <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
      <MapClickHandler />
      <Marker position={[position.lat, position.lng]}>
        <Popup>Ubicación seleccionada</Popup>
      </Marker>
    </MapContainer>
  );
}
