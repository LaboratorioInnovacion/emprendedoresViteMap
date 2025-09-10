"use client";
import React, { use, useEffect, useState } from "react";
import DashboardMap from "../components/map/DashboardMap";
import "leaflet/dist/leaflet.css";
import StatCard from "../components/dashboard/StatCard";
import RecentBusinessCard from "../components/dashboard/RecentBusinessCard";
import { businessTypeColors, calculateMapCenter } from "../data/mockData";
import { useEmprendimientos } from "../context/EmprendimientosContext";
import { useAuth } from "../context/AuthContext";
import Link from "next/link";
import {
  Building2,
  Map,
  ArrowRight,
  MapPin,
  Phone,
  Activity,
} from "lucide-react";

// Rubros/sectores principales (puedes ajustar los valores y colores)
const filtrosSectoriales = [
  { key: "Produccion", label: "Producción", color: "#E11D48" },
  { key: "Comercio", label: "Comercio", color: "#2563EB" },
  { key: "Servicio", label: "Servicios", color: "#059669" },
];
const estados = ["active", "inactive", "pending"];

const Page = () => {
  const { user, isAuthenticated } = useAuth();
  const { allemprendimientos, fetchemprendimientosall, loading, error } = useEmprendimientos();
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedRubros, setSelectedRubros] = useState([]);
  const [selectedEstados, setSelectedEstados] = useState([]);
  const [showFilters, setShowFilters] = useState(false);
  const mapCenter = calculateMapCenter();
  const defaultViewport = {
    center: mapCenter,
    zoom: 12,
  };

  useEffect(() => {
    console.log("allemprendimientos actualizado:", allemprendimientos);
  }, [allemprendimientos]);

  // Filtrado de emprendimientos (por sector principal y estado)
  const filteredBusinesses = (allemprendimientos || []).filter((business) => {
    const denominacion = (business.denominacion || "").toLowerCase();
    const actividad = business.actividadPrincipal || business.tipoEmprendimiento || "Otro";
    const estado = (business.etapa || "active").toLowerCase();
    const matchesSearch = denominacion.includes(searchTerm.toLowerCase());
    // Determinar el sector principal por prefijo
    const sector = filtrosSectoriales.find(f => actividad.startsWith(f.key))?.key;
    const matchesSector = selectedRubros.length === 0 || (sector && selectedRubros.includes(sector));
    const matchesEstado = selectedEstados.length === 0 || selectedEstados.includes(estado);
    return matchesSearch && matchesSector && matchesEstado;
  });

  const resetFilters = () => {
    setSelectedRubros([]);
    setSelectedEstados([]);
    setSearchTerm("");
  };

  // if (!isAuthenticated) {
  //   return (
  //     <div className="flex items-center justify-center min-h-screen">
  //       <div className="bg-white dark:bg-gray-900 p-8 rounded shadow text-center">
  //         <h2 className="text-2xl font-bold mb-4">Acceso restringido</h2>
  //         <p className="text-gray-600 dark:text-gray-300 mb-4">Debes iniciar sesión para ver el contenido.</p>
  //         <Link href="/login" className="btn-primary">Iniciar sesión</Link>
  //       </div>
  //     </div>
  //   );
  // }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold mb-2 text-gray-800 dark:text-gray-200">Registro Unico de Emprendedores</h1>
          {/* <h1 className="text-2xl font-bold mb-2 dark:text-gray-100">Dashboard</h1> */}
          <p className="text-gray-700 dark:text-white">
            Bienvenido al Sistema de Emprendedores
          </p>
                    {/* <p className="text-gray-600 dark:text-gray-400">
            Registro Unico de Emprendedores
          </p> */}
        </div>
        <div className="flex gap-2 text-black dark:text-white">
          <Link href="/emprendedores" className="btn-outline">
            <Building2 size={18} className="mr-1" />
            Emprendedores
          </Link>
          <Link href="/emprendimientos" className="btn-primary">
            <Map size={18} className="mr-1" />
            Explorar Mapa
          </Link>
        </div>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-1 gap-4">
        <StatCard
          cantidad={(allemprendimientos || []).length}
          empre={undefined}
        />
        {(allemprendimientos || []).map((empre) => (
          <StatCard key={empre.id} empre={empre} cantidad={undefined} />
        ))}
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 cardmapa">
          <div className="h-80 lg:h-[500px] rounded-lg overflow-hidden w-full border-x border-b border-gray-200 dark:border-gray-700 z-0">
            {/* Mapa refactorizado usando DashboardMap */}
            {filteredBusinesses.length > 0 ? (
              <DashboardMap
                businesses={filteredBusinesses.map(business => {
                  // Detectar el sector principal a partir del valor de actividadPrincipal
                  const actividad = business.actividadPrincipal || "";
                  let type = "Otro";
                  if (actividad.startsWith("Produccion")) type = "Produccion";
                  else if (actividad.startsWith("Comercio")) type = "Comercio";
                  else if (actividad.startsWith("Servicio")) type = "Servicio";
                  return {
                    ...business,
                    type,
                  };
                })}
                defaultViewport={defaultViewport}
              />
            ) : (
              <div className="flex items-center justify-center h-full text-gray-800 dark:text-gray-400">
                No hay emprendimientos para mostrar en el mapa.
              </div>
            )}
          </div>
          {/* Filtros visuales de sector principal y estado (ahora debajo del mapa) */}
          <div className="mt-2 p-3 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
            <h3 className="text-lg font-medium mb-2 text-gray-800 dark:text-gray-200">Rubro</h3>
            <div className="grid grid-cols-3 gap-2">
              {filtrosSectoriales.map(({ key, label, color }) => {
                const isSelected = selectedRubros.includes(key);
                return (
                  <button
                    key={key}
                    onClick={() =>
                      setSelectedRubros((prev) =>
                        isSelected ? prev.filter((a) => a !== key) : [...prev, key]
                      )
                    }
                    className={`flex items-center px-2 py-1 text-xs border rounded-full cursor-pointer 
                  ${
                    isSelected
                      ? "bg-primary-100 dark:bg-primary-900 text-primary-700 dark:text-primary-300 border-primary-400"
                      : "bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 border-gray-300"
                  }`}
                  >
                    <div className="h-3 w-3 rounded-full mr-2" style={{ backgroundColor: color }}></div>
                    <span className="capitalize">{label}</span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <Building2
                size={20}
                className="text-primary-600 dark:text-primary-400 mr-2"
              />
              <h2 className="text-xl text-gray-800 dark:text-gray-200 font-semibold">
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
