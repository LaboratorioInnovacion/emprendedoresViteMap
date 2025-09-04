"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Search, Filter, Plus, Activity, MapPin } from "lucide-react";
import { useEmpre } from "../../context/EmpreContext";
import LeafletMapEmprendedores from "../../components/map/LeafletMapEmprendedores";

const niveles = [
  "Primario",
  "Secundario",
  "Terciario",
  "Universitario",
  "Otro",
];

const estados = ["active", "inactive", "pending"];

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

const EmprendedoresPage = () => {
  const router = useRouter();
  const { emprendedores, loading, error, fetchEmprendedores } = useEmpre();
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedNiveles, setSelectedNiveles] = useState([]);
  const [selectedEstados, setSelectedEstados] = useState([]);
  const [showFilters, setShowFilters] = useState(false);

  useEffect(() => {
    fetchEmprendedores();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Filtrar por nombre/apellido, nivel de estudios y estado
  const filtered = emprendedores.filter((emp) => {
    const nombreCompleto = `${emp.nombre || ""} ${
      emp.apellido || ""
    }`.toLowerCase();
    const nivel = emp.nivelEstudios || "Otro";
    const estado = emp.estado || "active";
    const matchesSearch = nombreCompleto.includes(searchTerm.toLowerCase());
    const matchesNivel =
      selectedNiveles.length === 0 || selectedNiveles.includes(nivel);
    const matchesEstado =
      selectedEstados.length === 0 || selectedEstados.includes(estado);
    return matchesSearch && matchesNivel && matchesEstado;
  });

  const resetFilters = () => {
    setSelectedNiveles([]);
    setSelectedEstados([]);
    setSearchTerm("");
  };

  // Definir viewport inicial para el mapa (puedes ajustar el centro y zoom según tu región)
  const defaultViewport = {
    center: [-28.46957, -65.78524],
    zoom: 12,
  };

  return (
    <div className="space-y-4">
      <div className="mb-4">
        <LeafletMapEmprendedores
          emprendedores={emprendedores.map((emp) => ({
            id: emp.id,
            name: `${emp.nombre} ${emp.apellido}`,
            type: emp.nivelEstudios || "Otro",
            address: `${emp.departamento}, ${emp.direccion}`,
            location:
              emp.ubicacion && emp.ubicacion.lat && emp.ubicacion.lng
                ? emp.ubicacion
                : { lat: -32.9471, lng: -60.6306 },
            imageUrl: emp.imageUrl,
            status: emp.estado || "active",
            contact: emp.contact || {},
            description: emp.descripcion || "",
            createdAt: emp.createdAt || null,
            updatedAt: emp.updatedAt || null,
          }))}
          defaultViewport={defaultViewport}
          onBusinessSelect={(id) => router.push(`/emprendedores/${id}`)}
        />
      </div>
      {/* Header Section */}
      <div className="flex flex-col gap-4">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <h2 className="text-2xl font-bold dark:text-white">Emprendedores</h2>
          <div className="flex flex-col sm:flex-row gap-2">
            <div className="relative flex-1 sm:flex-none">
              <input
                type="text"
                placeholder="Buscar emprendedor..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="input pl-9 w-full sm:w-60"
              />
              <Search
                size={16}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
              />
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => setShowFilters(!showFilters)}
                className="btn-outline px-3 flex-1 sm:flex-none justify-center"
                title="Filtros"
              >
                <Filter size={18} />
                <span className="ml-2 sm:hidden">Filtros</span>
              </button>
              <button
                onClick={() => router.push("/emprendedores/new")}
                className="btn-primary flex-1 sm:flex-none justify-center"
              >
                <Plus size={18} className="sm:mr-1" />
                <span className="ml-2 sm:ml-0">Añadir Emprendedor</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Filters Panel */}
      {showFilters && (
        <div className="card animate-fadeIn">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-medium">Filtros</h3>
            <button
              onClick={resetFilters}
              className="text-sm text-primary-600 dark:text-primary-400 hover:underline"
            >
              Borrar Filtros
            </button>
          </div>
          <div className="space-y-6">
            <div>
              <h4 className="font-medium mb-2">Nivel de estudios</h4>
              <div className="flex flex-wrap gap-2">
                {niveles.map((nivel) => {
                  const count = emprendedores.filter(
                    (e) => (e.nivelEstudios || "Otro") === nivel
                  ).length;
                  return (
                    <button
                      key={nivel}
                      onClick={() =>
                        setSelectedNiveles((prev) =>
                          prev.includes(nivel)
                            ? prev.filter((n) => n !== nivel)
                            : [...prev, nivel]
                        )
                      }
                      className={`badge text-xs py-1.5 px-3 capitalize ${
                        selectedNiveles.includes(nivel)
                          ? "bg-primary-100 text-primary-800 dark:bg-primary-900 dark:text-primary-300"
                          : "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300"
                      }`}
                    >
                      {nivel}{" "}
                      <span className="ml-1 text-xs  text-gray-500">
                        ({count})
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>
            <div>
              <h4 className="font-medium mb-2">Estado</h4>
              <div className="flex flex-wrap gap-2">
                {estados.map((estado) => (
                  <button
                    key={estado}
                    onClick={() =>
                      setSelectedEstados((prev) =>
                        prev.includes(estado)
                          ? prev.filter((e) => e !== estado)
                          : [...prev, estado]
                      )
                    }
                    className={`badge text-xs py-1.5 px-3 capitalize ${
                      selectedEstados.includes(estado)
                        ? getStatusBadgeClass(estado)
                        : "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300"
                    }`}
                  >
                    {estado}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Cards para mobile */}
      <div className="block sm:hidden space-y-4">
        {loading ? (
          <div className="text-center py-8 text-gray-500 dark:text-gray-400">
            Cargando...
          </div>
        ) : error ? (
          <div className="text-center py-8 text-red-500">{error}</div>
        ) : filtered.length > 0 ? (
          filtered.map((emp) => (
            <Link
              key={emp.id}
              href={`/emprendedores/${emp.id}`}
              className="cardempre hover:shadow-lg transition-shadow cursor-pointer block"
            >
              {/* <div className="flex items-start gap-4"> */}
              <div className="flex items-start">
                <div className="flex-shrink-0">
                  <div className="h-16 w-16 rounded-lg bg-primary-100 dark:bg-primary-900 flex items-center justify-center text-primary-600 dark:text-primary-400">
                    {(emp.nombre ? emp.nombre.charAt(0) : "?").toUpperCase()}
                  </div>
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3
                        className="text-base font-medium truncate max-w-[180px] overflow-hidden whitespace-nowrap block"
                        title={(emp.nombre || "") + " " + (emp.apellido || "")}
                      >
                        {((emp.nombre || "") + " " + (emp.apellido || "")).length > 30
                          ? ((emp.nombre || "") + " " + (emp.apellido || "")).slice(0, 30) + "..."
                          : (emp.nombre || "") + " " + (emp.apellido || "")}
                      </h3>
                      <span className="badge badge-secondary text-xs capitalize mt-1">
                        {emp.nivelEstudios || "Sin datos"}
                      </span>
                    </div>
                    <span
                      className={`badge ${getStatusBadgeClass(
                        emp.estado || "active"
                      )} flex items-center text-xs`}
                    >
                      <Activity size={12} className="mr-1" />
                      {(emp.estado ? emp.estado.charAt(0).toUpperCase() + emp.estado.slice(1) : "Activo")}
                    </span>
                  </div>
                  <div className="mt-2 text-sm text-gray-600 dark:text-gray-400">
                    <div className="flex items-center">
                      <MapPin size={14} className="mr-1 flex-shrink-0" />
                      <span
                        className="truncate max-w-[160px] overflow-hidden whitespace-nowrap block"
                        title={(emp.departamento || "-") + ', ' + (emp.direccion || "-")}
                      >
                        {((emp.departamento || "-") + ', ' + (emp.direccion || "-")).length > 32
                          ? ((emp.departamento || "-") + ', ' + (emp.direccion || "-")).slice(0, 32) + "..."
                          : (emp.departamento || "-") + ', ' + (emp.direccion || "-")}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </Link>
          ))
        ) : (
          <div className="text-center py-8 text-gray-500 dark:text-gray-400">
            No se encontraron emprendedores.
          </div>
        )}
      </div>

      {/* Tabla para desktop */}
  <div className="hidden sm:block rounded-md">
        <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700 rounded-md">
          <thead className="bg-gray-50 dark:bg-gray-800">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                Nombre
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                Nivel de estudios
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                Departamento
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                Dirección
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                Estado
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                Fecha Nacimiento
              </th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                Acciones
              </th>
            </tr>
          </thead>
          <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
            {loading ? (
              <tr>
                <td
                  colSpan={7}
                  className="px-6 py-4 text-center text-gray-500 dark:text-gray-400"
                >
                  Cargando...
                </td>
              </tr>
            ) : error ? (
              <tr>
                <td colSpan={7} className="px-6 py-4 text-center text-red-500">
                  {error}
                </td>
              </tr>
            ) : filtered.length > 0 ? (
              filtered.map((emp) => (
                <tr
                  key={emp.id}
                  className="hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                >
                  <td className="dark:text-white px-6 py-4 whitespace-nowrap">
                    {emp.nombre} {emp.apellido}
                  </td>
                  <td className="dark:text-white px-6 py-4 whitespace-nowrap">
                    <span className="badge badge-secondary capitalize">
                      {emp.nivelEstudios}
                    </span>
                  </td>
                  <td className="dark:text-white px-6 py-4 whitespace-nowrap">
                    {emp.departamento}
                  </td>
                  <td className="dark:text-white px-6 py-4 whitespace-nowrap">
                    {emp.direccion}
                  </td>
                  <td className="dark:text-white px-6 py-4 whitespace-nowrap">
                    <span
                      className={`badge ${getStatusBadgeClass(
                        emp.estado || "active"
                      )} flex items-center`}
                    >
                      <Activity size={12} className="mr-1" />
                      {(emp.estado || "Activo").charAt(0).toUpperCase() +
                        (emp.estado || "Activo").slice(1)}
                    </span>
                  </td>
                  <td className="dark:text-white px-6 py-4 whitespace-nowrap">
                    {emp.fechaNacimiento
                      ? new Date(emp.fechaNacimiento).toLocaleDateString()
                      : "-"}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <Link
                      href={`/emprendedores/${emp.id}`}
                      className="text-primary-600 dark:text-primary-400 hover:text-primary-800 dark:hover:text-primary-300"
                    >
                      Ver Detalles
                    </Link>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td
                  colSpan={7}
                  className="px-6 py-4 text-center text-gray-500 dark:text-gray-400"
                >
                  No se encontraron emprendedores.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default EmprendedoresPage;
