'use client';

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Search, Filter, Plus, Activity, MapPin } from "lucide-react";
import { useEmpre } from "../../context/EmpreContext";

// Elimina la interfaz, ya que los datos vienen del contexto


const EmprendimientosPage = () => {
  const router = useRouter();
  const [emprendimientos, setEmprendimientos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    const fetchEmprendimientos = async () => {
      setLoading(true);
      try {
        const res = await fetch("/api/emprendimientos");
        const data = await res.json();
        setEmprendimientos(data);
      } catch (err) {
        setError("Error al cargar los emprendimientos");
      }
      setLoading(false);
    };
    fetchEmprendimientos();
  }, []);

  // Filtrar por nombre/apellido del emprendedor o denominación del emprendimiento
  const filtered = emprendimientos.filter((emp) => {
    const emprendedor = emp.emprendedor || {};
    const nombreCompleto = `${emprendedor.nombre || ""} ${emprendedor.apellido || ""}`.toLowerCase();
    const denominacion = (emp.denominacion || "").toLowerCase();
    return (
      nombreCompleto.includes(searchTerm.toLowerCase()) ||
      denominacion.includes(searchTerm.toLowerCase())
    );
  });

  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-4">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <h2 className="text-2xl font-bold">Emprendimientos</h2>
          <div className="flex flex-col sm:flex-row gap-2">
            <div className="relative flex-1 sm:flex-none">
              <input
                type="text"
                placeholder="Buscar por emprendedor o denominación..."
                value={searchTerm}
                onChange={e => setSearchTerm(e.target.value)}
                className="input pl-9 w-full sm:w-60"
              />
              <Search
                size={16}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
              />
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
        ) : filtered.length > 0 ? (
          filtered.map((emp) => (
            <div
              key={emp.id}
              className="cardempre hover:shadow-lg transition-shadow cursor-pointer"
            >
              <div className="flex items-start gap-4">
                <div className="flex-shrink-0">
                  <div className="h-16 w-16 rounded-lg bg-primary-100 dark:bg-primary-900 flex items-center justify-center text-primary-600 dark:text-primary-400">
                    {emp.denominacion.charAt(0).toUpperCase()}
                  </div>
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="text-base font-medium truncate">
                        {emp.denominacion}
                      </h3>
                      <span className="badge badge-secondary text-xs capitalize mt-1">
                        {emp.emprendedor?.nombre} {emp.emprendedor?.apellido}
                      </span>
                    </div>
                  </div>
                  <div className="mt-2 text-sm text-gray-600 dark:text-gray-400">
                    <div className="flex items-center">
                      <MapPin size={14} className="mr-1 flex-shrink-0" />
                      <span className="truncate">{emp.direccion}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="text-center py-8 text-gray-500 dark:text-gray-400">
            No se encontraron emprendimientos.
          </div>
        )}
      </div>

      {/* Tabla para desktop */}
      <div className="hidden sm:block overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
          <thead className="bg-gray-50 dark:bg-gray-800">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Denominación</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Emprendedor</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Departamento</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Dirección</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Fecha Inicio</th>
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
            ) : filtered.length > 0 ? (
              filtered.map((emp) => (
                <tr key={emp.id} className="hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
                  <td className="px-6 py-4 whitespace-nowrap">{emp.denominacion}</td>
                  <td className="px-6 py-4 whitespace-nowrap">{emp.emprendedor?.nombre} {emp.emprendedor?.apellido}</td>
                  <td className="px-6 py-4 whitespace-nowrap">{emp.emprendedor?.departamento}</td>
                  <td className="px-6 py-4 whitespace-nowrap">{emp.direccion}</td>
                  <td className="px-6 py-4 whitespace-nowrap">{emp.fechaInicio ? new Date(emp.fechaInicio).toLocaleDateString() : '-'}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <button
                      onClick={() => router.push(`/emprendimientos/${emp.id}`)}
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
                  No se encontraron emprendimientos.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default EmprendimientosPage;
