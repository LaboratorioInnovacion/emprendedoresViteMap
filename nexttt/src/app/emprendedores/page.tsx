'use client';

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Search, Filter, Plus, Activity, MapPin } from "lucide-react";
import { useEmpre } from "../../context/EmpreContext";

// Elimina la interfaz, ya que los datos vienen del contexto

const BusinessList = ({ onAddBusiness }) => {
  const router = useRouter();
  const [filters, setFilters] = useState({
    businessTypes: [],
    status: [],
    searchTerm: "",
  });
  const [showFilters, setShowFilters] = useState(false);
  const { emprendedores, loading, error, fetchEmprendedores } = useEmpre();

  useEffect(() => {
    fetchEmprendedores();
    // eslint-disable-next-line
  }, []);

  // Elimina lógica y tipos de businessTypes y statusOptions
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFilters({
      ...filters,
      searchTerm: e.target.value,
    });
  };

  // Adaptar filtro para los campos reales del modelo emprendedor
  const filteredBusinesses = emprendedores.filter((emp) => {
    if (
      filters.searchTerm &&
      !(`${emp.nombre} ${emp.apellido}`.toLowerCase().includes(filters.searchTerm.toLowerCase()))
    ) {
      return false;
    }
    // Si quieres filtrar por otros campos, agrega aquí
    return true;
  });

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

  return (
    <div className="space-y-4">
      {/* Header Section */}
      <div className="flex flex-col gap-4">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <h2 className="text-2xl font-bold">Emprendedores</h2>
          <div className="flex flex-col sm:flex-row gap-2">
            <div className="relative flex-1 sm:flex-none">
              <input
                type="text"
                placeholder="Buscar emprendedor..."
                value={filters.searchTerm}
                onChange={e => setFilters({ ...filters, searchTerm: e.target.value })}
                className="input pl-9 w-full sm:w-60"
              />
              <Search
                size={16}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
              />
            </div>
            <div className="flex gap-2">
              <button
                onClick={onAddBusiness}
                className="btn-primary flex-1 sm:flex-none justify-center"
              >
                <Plus size={18} className="sm:mr-1" />
                <span className="ml-2 sm:ml-0">Añadir Emprendedor</span>
              </button>
            </div>
          </div>
        </div>
      </div>


      {/* Cards para mobile */}
      <div className="block sm:hidden space-y-4">
        {loading ? (
          <div className="text-center py-8 text-gray-500 dark:text-gray-400">Cargando...</div>
        ) : error ? (
          <div className="text-center py-8 text-red-500">{error}</div>
        ) : filteredBusinesses.length > 0 ? (
          filteredBusinesses.map((emp) => (
            <div
              key={emp.id}
              className="cardempre hover:shadow-lg transition-shadow cursor-pointer"
              onClick={() => router.push(`/emprendedores/${emp.id}`)}
            >
              <div className="flex items-start gap-4">
                <div className="flex-shrink-0">
                  <div className="h-16 w-16 rounded-lg bg-primary-100 dark:bg-primary-900 flex items-center justify-center text-primary-600 dark:text-primary-400">
                    {emp.nombre.charAt(0).toUpperCase()}
                  </div>
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="text-base font-medium truncate">
                        {emp.nombre} {emp.apellido}
                      </h3>
                      <span className="badge badge-secondary text-xs capitalize mt-1">
                        {emp.nivelEstudios}
                      </span>
                    </div>
                  </div>
                  <div className="mt-2 text-sm text-gray-600 dark:text-gray-400">
                    <div className="flex items-center">
                      <MapPin size={14} className="mr-1 flex-shrink-0" />
                      <span className="truncate">{emp.departamento}, {emp.direccion}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="text-center py-8 text-gray-500 dark:text-gray-400">
            No se encontraron emprendedores.
          </div>
        )}
      </div>

      {/* Tabla para desktop */}
      <div className="hidden sm:block overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
          <thead className="bg-gray-50 dark:bg-gray-800">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Nombre</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Departamento</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Dirección</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Nivel de estudios</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Fecha Nacimiento</th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Acciones</th>
            </tr>
          </thead>
          <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
            {loading ? (
              <tr>
                <td colSpan={6} className="px-6 py-4 text-center text-gray-500 dark:text-gray-400">Cargando...</td>
              </tr>
            ) : error ? (
              <tr>
                <td colSpan={6} className="px-6 py-4 text-center text-red-500">{error}</td>
              </tr>
            ) : filteredBusinesses.length > 0 ? (
              filteredBusinesses.map((emp) => (
                <tr key={emp.id} className="hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
                  <td className="px-6 py-4 whitespace-nowrap">{emp.nombre} {emp.apellido}</td>
                  <td className="px-6 py-4 whitespace-nowrap">{emp.departamento}</td>
                  <td className="px-6 py-4 whitespace-nowrap">{emp.direccion}</td>
                  <td className="px-6 py-4 whitespace-nowrap">{emp.nivelEstudios}</td>
                  <td className="px-6 py-4 whitespace-nowrap">{new Date(emp.fechaNacimiento).toLocaleDateString()}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <button
                      onClick={() => router.push(`/emprendedores/${emp.id}`)}
                      className="text-primary-600 dark:text-primary-400 hover:text-primary-800 dark:hover:text-primary-300"
                    >
                      Ver Detalles
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={6} className="px-6 py-4 text-center text-gray-500 dark:text-gray-400">
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

export default BusinessList;
