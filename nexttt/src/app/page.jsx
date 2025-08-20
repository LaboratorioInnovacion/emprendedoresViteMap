"use client";
import React, { use, useEffect, useState } from "react";
import DashboardMap from "../components/map/DashboardMap";
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

// Rubros/sectores principales (puedes ajustar los valores y colores)
const filtrosSectoriales = [
  { key: "Produccion", label: "Producción", color: "#E11D48" },
  { key: "Comercio", label: "Comercio", color: "#2563EB" },
  { key: "Servicio", label: "Servicios", color: "#059669" },
];
const estados = ["active", "inactive", "pending"];

const Page = () => {
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

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold mb-2">Dashboard</h1>
          <p className="text-gray-600 dark:text-gray-400">
            Bienvenido al Sistema de Emprendimientos
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
          {/* Filtros visuales de sector principal y estado */}
          <div className="p-4 border-b border-gray-200 dark:border-gray-700 flex flex-wrap gap-2 items-center">
            {/* Rubros/sectores */}
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
                  className={`flex items-center px-2 py-1 text-xs border rounded-full cursor-pointer mr-2 mb-2 ${
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
          <div className="h-80 lg:h-[500px] rounded-lg overflow-hidden">
            {/* Mapa refactorizado usando DashboardMap */}
            {filteredBusinesses.length > 0 ? (
              <DashboardMap
                businesses={filteredBusinesses.map(business => ({
                  ...business,
                  // Forzar el type a Produccion, Comercio o Servicio si matchea, si no "Otro"
                  type: (() => {
                    const actividad = business.actividadPrincipal || business.tipoEmprendimiento || "Otro";
                    if (actividad.startsWith("Produccion")) return "Produccion";
                    if (actividad.startsWith("Comercio")) return "Comercio";
                    if (actividad.startsWith("Servicio")) return "Servicio";
                    return "Otro";
                  })(),
                }))}
                defaultViewport={defaultViewport}
              />
            ) : (
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
