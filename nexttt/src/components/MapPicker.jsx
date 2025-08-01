"use client"


import { useEffect, useState } from "react"
import dynamic from "next/dynamic"

// Dynamically import Leaflet components to avoid SSR issues
const MapContainer = dynamic(() => import("react-leaflet").then((mod) => mod.MapContainer), { ssr: false })
const TileLayer = dynamic(() => import("react-leaflet").then((mod) => mod.TileLayer), { ssr: false })
const Marker = dynamic(() => import("react-leaflet").then((mod) => mod.Marker), { ssr: false })

export default function MapPicker({ onLocationSelect, initialPosition }) {
  const [position, setPosition] = useState(initialPosition || [-34.6037, -58.3816])
  const [map, setMap] = useState(null)

  useEffect(() => {
    if (map) {
      map.on("click", (e) => {
        const newPosition = [e.latlng.lat, e.latlng.lng]
        setPosition(newPosition)
        onLocationSelect?.(newPosition)
      })
    }
  }, [map, onLocationSelect])

  return (
    <div className="h-64 w-full rounded-lg overflow-hidden border border-gray-300">
      <MapContainer center={position} zoom={13} style={{ height: "100%", width: "100%" }} ref={setMap}>
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <Marker position={position} />
      </MapContainer>
    </div>
  )
}
