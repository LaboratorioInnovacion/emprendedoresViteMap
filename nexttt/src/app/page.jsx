"use client";
import React, { use, useEffect, useState } from "react";
import dynamic from "next/dynamic";
import "leaflet/dist/leaflet.css";
import StatCard from "../components/dashboard/StatCard";
import RecentBusinessCard from "../components/dashboard/RecentBusinessCard";
import { businessTypeColors, calculateMapCenter } from "../data/mockData";
import { useEmprendimientos } from "../context/EmprendimientosContext";
import Link from "next/link";
import {
  Building2,
  Map,
  ArrowRight,
  MapPin,
  Phone,
  Activity,
} from "lucide-react";

const Page = () => {
  const { allemprendimientos, fetchemprendimientosall, loading, error } =
    useEmprendimientos();
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedTypes, setSelectedTypes] = useState([]);
  const mapCenter = calculateMapCenter();

  useEffect(() => {
    console.log("allemprendimientos actualizado:", allemprendimientos);
  }, [allemprendimientos]);

  const MapContainer = React.useMemo(
    () =>
      dynamic(() => import("react-leaflet").then((mod) => mod.MapContainer), {
        ssr: false,
      }),
    []
  );
  const TileLayer = React.useMemo(
    () =>
      dynamic(() => import("react-leaflet").then((mod) => mod.TileLayer), {
        ssr: false,
      }),
    []
  );
  const Marker = React.useMemo(
    () =>
      dynamic(() => import("react-leaflet").then((mod) => mod.Marker), {
        ssr: false,
      }),
    []
  );
  const Popup = React.useMemo(
    () =>
      dynamic(() => import("react-leaflet").then((mod) => mod.Popup), {
        ssr: false,
      }),
    []
  );

  // Carga dinámica de leaflet para evitar problemas de SSR
  const [L, setL] = useState(null);
  useEffect(() => {
    const loadLeaflet = async () => {
      const leaflet = await import("leaflet");
      setL(leaflet);
    };
    loadLeaflet();
  }, []);

  // Función para decodificar la ubicación
  // Función robusta para decodificar la ubicación
  function parseUbicacion(ubicacionObj) {
    if (!ubicacionObj) return null;
    // Si ya es un objeto {lat, lng}
    if (
      typeof ubicacionObj.lat === "number" &&
      typeof ubicacionObj.lng === "number"
    ) {
      return ubicacionObj;
    }
    // Si es un string JSON
    if (typeof ubicacionObj === "string") {
      try {
        const parsed = JSON.parse(ubicacionObj);
        if (
          parsed &&
          typeof parsed.lat === "number" &&
          typeof parsed.lng === "number"
        ) {
          return parsed;
        }
      } catch (e) {}
    }
    // Si es un objeto tipo array de bytes (como el caso reportado)
    if (
      typeof ubicacionObj === "object" &&
      Object.keys(ubicacionObj).every((k) => !isNaN(Number(k)))
    ) {
      try {
        const str = String.fromCharCode(...Object.values(ubicacionObj));
        const parsed = JSON.parse(str);
        if (
          parsed &&
          typeof parsed.lat === "number" &&
          typeof parsed.lng === "number"
        ) {
          return parsed;
        }
      } catch (e) {
        console.error("Error parseando ubicacion:", e, ubicacionObj);
      }
    }
    return null;
  }

  // Filtro de negocios (usar solo emprendimientos del contexto)
  const filteredBusinesses = (allemprendimientos || []).filter((business) => {
    const matchesSearch =
      business.denominacion?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      "" ||
      business.tipoEmprendimiento
        ?.toLowerCase()
        .includes(searchTerm.toLowerCase()) ||
      "" ||
      business.direccion?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      "";
    const matchesType =
      selectedTypes.length === 0 ||
      selectedTypes.includes(business.tipoEmprendimiento);
    return matchesSearch && matchesType;
  });

  // Crear iconos personalizados para los negocios
  const createBusinessIcon = (type) => {
    if (!L) return null;
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

  // Badge de estado
  const getStatusBadgeClass = (status) => {
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

  useEffect(() => {
    console.log("Fetching emprendimientos...", filteredBusinesses);
    return () => {};
  }, []);

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold mb-2">Dashboard</h1>
          <p className="text-gray-600 dark:text-gray-400">
            Bienvenido al Sistema de Emprendimientos
          </p>
          <p>
            ADMIN : asd@asd.com contra: asdasd <br />
            SUPERUSER: zxc@zxc.com contra: zxc <br />
            EMPRENDEDOR :qwerty@qwerty.com contra: qwerty
          </p>
        </div>
        <div className="flex gap-2">
          <Link href="/BusinessesPage" className="btn-outline">
            <Building2 size={18} className="mr-1" />
            Emprendedores
          </Link>
          <Link href="/MapPage" className="btn-primary">
            <Map size={18} className="mr-1" />
            Explorar Mapa
          </Link>
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-1 gap-4">
        <StatCard
          cantidad={(allemprendimientos || []).length}
          empre={undefined}
        />
        {(allemprendimientos || []).map((empre) => (
          <StatCard key={empre.id} empre={empre} cantidad={undefined} />
        ))}
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 card">
          <div className="h-80 lg:h-[500px] rounded-lg overflow-hidden">
            {/* Renderizar mapa si hay Leaflet y emprendimientos */}
            {L && filteredBusinesses.length > 0 && (
              <MapContainer
                center={mapCenter}
                zoom={12}
                style={{ height: "100%", width: "100%" }}
                zoomControl={false}
              >
                <TileLayer
                  attribution=""
                  url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />
                {filteredBusinesses.map((business) => {
                  const ubicacion = parseUbicacion(business.ubicacion);
                  if (!ubicacion || typeof ubicacion.lat !== "number" || typeof ubicacion.lng !== "number") {
                    console.warn("No se pudo parsear la ubicación del emprendimiento:", business.id, business.denominacion, business.ubicacion, "Resultado:", ubicacion);
                    return null;
                  }
                  console.log("Marcador:", business.id, business.denominacion, ubicacion);
                  return (
                    <Marker
                      key={business.id}
                      position={[ubicacion.lat, ubicacion.lng]}
                      icon={createBusinessIcon(business.tipoEmprendimiento)}
                    >
                      <Popup>
                        <div className="w-64">
                          <h3 className="font-medium text-base mb-1">
                            {business.denominacion}
                          </h3>
                          <div className="flex flex-wrap gap-2 mb-2">
                            <span className="badge badge-secondary text-xs capitalize">
                              {business.tipoEmprendimiento}
                            </span>
                          </div>
                          <div className="space-y-2 text-sm">
                            <div className="flex items-center text-gray-600 dark:text-gray-400">
                              <MapPin
                                size={14}
                                className="mr-1 flex-shrink-0"
                              />
                              <span className="truncate">
                                {business.direccion}
                              </span>
                            </div>
                            <div className="flex items-center text-gray-600 dark:text-gray-400">
                              <span>
                                Lat: {ubicacion.lat}, Lng: {ubicacion.lng}
                              </span>
                            </div>
                            {business.telefono && (
                              <div className="flex items-center text-gray-600 dark:text-gray-400">
                                <Phone
                                  size={14}
                                  className="mr-1 flex-shrink-0"
                                />
                                <span>{business.telefono}</span>
                              </div>
                            )}
                          </div>
                          <div className="mt-3 pt-3 border-t border-gray-200 dark:border-gray-700">
                            <Link
                              href={`/emprendimientos/${business.id}`}
                              className="btn-primary w-full justify-center text-sm py-1.5"
                              style={{ color: "#fff" }}
                            >
                              Ver Detalles
                            </Link>
                          </div>
                        </div>
                      </Popup>
                    </Marker>
                  );
                })}
              </MapContainer>
            )}
            {filteredBusinesses.length === 0 && (
              <div className="flex items-center justify-center h-full text-gray-400">
                No hay emprendimientos para mostrar en el mapa.
              </div>
            )}
          </div>
        </div>
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <Building2
                size={20}
                className="text-primary-600 dark:text-primary-400 mr-2"
              />
              <h2 className="text-xl font-semibold">
                Emprendimientos Recientes
              </h2>
            </div>
            <Link
              href="/emprendimientos"
              className="text-sm text-primary-600 dark:text-primary-400 hover:underline flex items-center"
            >
              Ver Todo
              <ArrowRight size={16} className="ml-1" />
            </Link>
          </div>
          {(allemprendimientos || []).slice(-3).map((business) => {
            // Adaptar los datos para RecentBusinessCard
            const adaptedBusiness = {
              id: business.id,
              name: business.denominacion,
              description: business.actividadPrincipal || business.sector || "",
              address: business.direccion,
              contact: {
                phone: business.telefono,
                email: business.email,
              },
              type: business.tipoEmprendimiento,
              status: business.etapa ? business.etapa.toLowerCase() : "active",
              imageUrl: "", // Si tienes una imagen, pon la url aquí
            };
            return (
              <RecentBusinessCard
                key={business.id}
                business={adaptedBusiness}
              />
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default Page;
