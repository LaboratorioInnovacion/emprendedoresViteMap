'use client';
import React, { useState, useEffect } from "react";
import { useEmpre } from "../../../context/EmpreContext";
import { ChevronLeft, BadgeCheck, Phone, MapPin, User, GraduationCap, Calendar, Users, Landmark, Info, Rocket, Pencil, Trash2, Mail } from "lucide-react";
import dynamic from "next/dynamic";
import Image from "next/image";
const MapContainer = dynamic(() => import('react-leaflet').then(mod => mod.MapContainer), { ssr: false });
const TileLayer = dynamic(() => import('react-leaflet').then(mod => mod.TileLayer), { ssr: false });
const Marker = dynamic(() => import('react-leaflet').then(mod => mod.Marker), { ssr: false });
const Popup = dynamic(() => import('react-leaflet').then(mod => mod.Popup), { ssr: false });
import 'leaflet/dist/leaflet.css';
import { useExportPDF } from '../../../hooks/useExportPDF';

// Oculta el warning de Next.js sobre acceso directo a params (migración)
if (typeof window !== "undefined") {
  const originalConsoleError = window.console.error;
  window.console.error = function (...args) {
    if (
      typeof args[0] === "string" &&
      args[0].includes("A param property was accessed directly with `params.id`.")
    ) {
      return;
    }
    originalConsoleError.apply(window.console, args);
  };
}

const EmprendedorPage = ({ params }) => {
  // Hook para exportar PDF
  const exportPDF = useExportPDF();
  const { fetchEmprendedorById } = useEmpre();
  const [emprendedor, setEmprendedor] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [L, setL] = useState(null);
  const [markerIcon, setMarkerIcon] = useState(null);
  // ...existing code...
  useEffect(() => {
    // Soporte para Next.js 14+ donde params es una promesa
    let isMounted = true;
    async function load() {
      let id = params.id;
      if (typeof id === "undefined" && typeof params.then === "function") {
        // params es una promesa
        const resolved = await params;
        id = resolved.id;
      }
      setLoading(true);
      setError("");
      const data = await fetchEmprendedorById(id);
      if (isMounted) {
        if (data && !data.error) {
          setEmprendedor(data);
        } else {
          setError(data?.error || "Error al cargar el emprendedor");
        }
        setLoading(false);
      }
    }
    load();
    return () => { isMounted = false; };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [params]);

  useEffect(() => {
    const loadLeaflet = async () => {
      const leaflet = await import('leaflet');
      setL(leaflet);
      const svgIcon = `<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 32 32' width='24' height='24'><circle cx='16' cy='16' r='10' fill='#2563eb' stroke='white' stroke-width='2'/></svg>`;
      const iconUrl = `data:image/svg+xml;utf8,${encodeURIComponent(svgIcon)}`;
      const icon = new leaflet.Icon({
        iconUrl,
        iconSize: [28, 28],
        iconAnchor: [16, 16],
        popupAnchor: [0, -16],
      });
      setMarkerIcon(icon);
    };
    loadLeaflet();
  }, []);

  if (loading) return <div className="text-center py-8 text-gray-500 dark:text-gray-400">Cargando...</div>;
  if (error) return <div className="text-center py-8 text-red-500">{error}</div>;
  if (!emprendedor) return (
    <div className="flex flex-col items-center justify-center py-12">
      <User size={48} className="text-gray-400 mb-4" />
      <h2 className="text-2xl font-bold mb-2">No se encontró Emprendedor</h2>
      <p className="text-gray-600 dark:text-gray-400 mb-6">
        El emprendedor que estás buscando no existe o ha sido eliminado.
      </p>
      <button onClick={() => window.history.back()} className="btn-primary">
        Volver a Lista
      </button>
    </div>
  );

  // Avatar por defecto si no hay foto
  const avatarUrl = emprendedor.fotoUrl || "/profile-default.png";

  // La API ya devuelve ubicacion como objeto {lat, lng} o null
  const ubicacion = emprendedor.ubicacion && typeof emprendedor.ubicacion.lat === "number" && typeof emprendedor.ubicacion.lng === "number"
    ? emprendedor.ubicacion
    : null;

  // Badge de estado
  const getStatusBadgeClass = () => {
    switch (emprendedor.estado || emprendedor.status) {
      case "active":
      case "ACTIVO":
        return "bg-success-100 text-success-700 dark:bg-success-900/30 dark:text-success-500";
      case "inactive":
      case "INACTIVO":
        return "bg-error-100 text-error-700 dark:bg-error-900/30 dark:text-error-500";
      case "pending":
      case "PENDIENTE":
        return "bg-warning-100 text-warning-700 dark:bg-warning-900/30 dark:text-warning-500";
      default:
        return "bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300";
    }
  };

  return (
  <div className="space-y-4 sm:space-y-6 px-2 sm:px-0">
      {/* Header */}
  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 sm:gap-4">
        <div className="flex items-center">
          <button
            onClick={() => window.history.back()}
            className="mr-3 p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
          >
            <ChevronLeft size={20} className="text-gray-600 dark:text-gray-400" />
          </button>
          <div className="flex items-center gap-3 sm:gap-4 flex-wrap">
            <div className="relative w-14 h-14 sm:w-16 sm:h-16 rounded-full overflow-hidden border-4 border-primary shadow">
              <Image src={avatarUrl} alt="Avatar" width={64} height={64} className="object-cover w-full h-full" />
            </div>
            <div className="min-w-0">
              <h1 className="text-lg sm:text-2xl font-bold flex items-center gap-2 flex-wrap">
                <User className="w-6 h-6 sm:w-7 sm:h-7 text-primary" />
                <span className="truncate max-w-[160px] sm:max-w-none block">{emprendedor.nombre} {emprendedor.apellido}</span>
                {emprendedor.verificado && <BadgeCheck className="ml-2 w-5 h-5 text-green-500" />}
              </h1>
              <div className="flex items-center mt-1 flex-wrap">
                <span className="badge badge-secondary capitalize mr-2 mb-1">
                  {emprendedor.genero}
                </span>
                <span className={`badge ${getStatusBadgeClass()} flex items-center mb-1`}>
                  <Rocket size={12} className="mr-1" />
                  {(emprendedor.estado || emprendedor.status || "Activo").charAt(0).toUpperCase() + (emprendedor.estado || emprendedor.status || "Activo").slice(1)}
                </span>
              </div>
            </div>
          </div>
        </div>
        <div className="flex gap-2">
          <button className="btn-outline">
            <Pencil size={18} className="mr-1" />
            Editar
          </button>
          <button className="btn bg-error-600 text-white hover:bg-error-700 focus:ring-error-500">
            <Trash2 size={18} className="mr-1" />
            Borrar
          </button>
        </div>
      </div>
      {/* Main layout */}
  <div className="grid grid-cols-1 xl:grid-cols-3 gap-4 xl:gap-6">
        {/* Columna izquierda (info y emprendimientos) */}
  <div className="xl:col-span-2 space-y-4 xl:space-y-6 min-w-0">
          {/* Info card */}
          <div className="card p-3 sm:p-6">
            <h2 className="text-lg sm:text-xl font-semibold mb-4">Información del Emprendedor</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-4">
              <div className="space-y-3">
                <div className="flex items-start">
                  <MapPin size={18} className="text-gray-500 mt-0.5 mr-2 flex-shrink-0" />
                  <div>
                    <p className="text-sm font-medium text-gray-700 dark:text-gray-300">Dirección</p>
                    <p className="text-sm text-gray-600 dark:text-gray-400">{emprendedor.direccion}</p>
                  </div>
                </div>
                <div className="flex items-start">
                  <Phone size={18} className="text-gray-500 mt-0.5 mr-2 flex-shrink-0" />
                  <div>
                    <p className="text-sm font-medium text-gray-700 dark:text-gray-300">Teléfono</p>
                    <p className="text-sm text-gray-600 dark:text-gray-400">{emprendedor.telefono}</p>
                  </div>
                </div>
                <div className="flex items-start">
                  <Calendar size={18} className="text-gray-500 mt-0.5 mr-2 flex-shrink-0" />
                  <div>
                    <p className="text-sm font-medium text-gray-700 dark:text-gray-300">Fecha de nacimiento</p>
                    <p className="text-sm text-gray-600 dark:text-gray-400">{emprendedor.fechaNacimiento ? new Date(emprendedor.fechaNacimiento).toLocaleDateString() : '-'}</p>
                  </div>
                </div>
              </div>
              <div className="space-y-3">
                <div className="flex items-start">
                  <GraduationCap size={18} className="text-gray-500 mt-0.5 mr-2 flex-shrink-0" />
                  <div>
                    <p className="text-sm font-medium text-gray-700 dark:text-gray-300">Nivel de estudios</p>
                    <p className="text-sm text-gray-600 dark:text-gray-400">{emprendedor.nivelEstudios}</p>
                  </div>
                </div>
                <div className="flex items-start">
                  <Users size={18} className="text-gray-500 mt-0.5 mr-2 flex-shrink-0" />
                  <div>
                    <p className="text-sm font-medium text-gray-700 dark:text-gray-300">Dependientes económicos</p>
                    <p className="text-sm text-gray-600 dark:text-gray-400">{emprendedor.tieneDependientesEconomicos ? 'Sí' : 'No'}</p>
                  </div>
                </div>
                <div className="flex items-start">
                  <Rocket size={18} className="text-gray-500 mt-0.5 mr-2 flex-shrink-0" />
                  <div>
                    <p className="text-sm font-medium text-gray-700 dark:text-gray-300">Otros sustentos</p>
                    <p className="text-sm text-gray-600 dark:text-gray-400">{emprendedor.poseeOtrosSustentos ? 'Sí' : 'No'}</p>
                  </div>
                </div>
              </div>
            </div>
            <div className="mt-4">
              <p className="text-gray-700 dark:text-gray-300"><strong>Motivación para emprender:</strong> {emprendedor.motivacionEmprender}</p>
            </div>
          </div>
          {/* Emprendimientos */}
          <div className="card p-3 sm:p-6">
            <h2 className="text-lg sm:text-xl font-semibold mb-4 flex items-center gap-2"><Rocket className="w-6 h-6 text-primary" /> Emprendimientos</h2>
            {emprendedor.emprendimientos && emprendedor.emprendimientos.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-4">
                {emprendedor.emprendimientos.map((emp) => (
                  <div key={emp.id} className="p-2 sm:p-4 border rounded-lg bg-white dark:bg-gray-800 shadow flex flex-col gap-2 min-w-0">
                    <h4 className="font-bold text-lg mb-1 flex items-center gap-2">
                      <Rocket className="w-5 h-5 text-primary" />
                      {emp.denominacion}
                    </h4>
                    <div className="flex flex-wrap gap-2 mb-2">
                      <span className="px-2 py-1 rounded bg-green-100 text-green-700 text-xs font-semibold">{emp.etapa}</span>
                      <span className="px-2 py-1 rounded bg-gray-100 text-gray-700 text-xs font-semibold">{emp.direccion}</span>
                    </div>
                    <div className="flex items-center gap-2 text-gray-600 dark:text-gray-300">
                      <Phone className="w-4 h-4" />
                      <span>{emp.telefono}</span>
                    </div>
                    <div className="flex items-center gap-2 text-gray-600 dark:text-gray-300">
                      <Calendar className="w-4 h-4" />
                      <span>{emp.fechaInicio ? new Date(emp.fechaInicio).toLocaleDateString() : '-'}</span>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-500">No tiene emprendimientos registrados.</p>
            )}
          </div>
          {/* Asignaciones */}
          <div className="card p-3 sm:p-6">
            <h2 className="text-lg sm:text-xl font-semibold mb-4 flex items-center gap-2">
              <Landmark className="w-6 h-6 text-primary" /> Asignaciones
            </h2>
            {emprendedor.asignaciones && emprendedor.asignaciones.length > 0 ? (
              <div className="flex flex-col gap-3">
                {emprendedor.asignaciones.map((asig) => (
                  <div key={asig.id} className="border rounded-lg p-3 bg-gray-50 dark:bg-gray-900/40 shadow-sm flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                    <div className="flex-1 min-w-0">
                      <div className="font-semibold text-primary text-base flex items-center gap-2">
                        {asig.herramienta?.nombre || 'Herramienta'}
                        <span className="ml-2 px-2 py-0.5 rounded bg-blue-100 text-blue-700 text-xs font-semibold">
                          {asig.herramienta?.tipoHerramientaEmprendedor?.join(', ') || '-'}
                        </span>
                      </div>
                      <div className="text-sm text-gray-700 dark:text-gray-300 mt-1">
                        <span className="font-medium">Fecha asignación:</span> {asig.fechaAsignacion ? new Date(asig.fechaAsignacion).toLocaleDateString() : '-'}<br />
                        <span className="font-medium">Monto:</span> ${asig.herramienta?.montoPorBeneficiario?.toLocaleString('es-AR') || '-'}<br />
                        <span className="font-medium">Observaciones:</span> {asig.observaciones || 'Sin observaciones'}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-500">No tiene asignaciones registradas.</p>
            )}
          </div>
        </div>
        {/* Columna derecha (mapa y acciones) */}
  <div className="space-y-4 xl:space-y-6 min-w-0">
          {/* Mapa */}
          <div className="card p-3 sm:p-6">
            <h2 className="text-lg sm:text-xl font-semibold mb-4">Ubicación</h2>
            <div className="h-48 sm:h-64 rounded-lg overflow-hidden">
              {L && markerIcon && ubicacion && (
                <MapContainer
                  center={[ubicacion.lat, ubicacion.lng]}
                  zoom={14}
                  style={{ height: "100%", width: "100%" }}
                >
                  <TileLayer
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                  />
                  <Marker
                    position={[ubicacion.lat, ubicacion.lng]}
                    icon={markerIcon}
                  >
                    <Popup>{emprendedor.direccion}</Popup>
                  </Marker>
                </MapContainer>
              )}
            </div>
            {ubicacion && (
              <div className="mt-4">
                <a
                  href={`https://www.google.com/maps/search/?api=1&query=${ubicacion.lat},${ubicacion.lng}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-primary-600 dark:text-primary-400 hover:underline text-sm"
                >
                  Ver en Google Maps
                </a>
              </div>
            )}
          </div>
          {/* Acciones rápidas */}
          <div className="card p-4 sm:p-6">
            <h2 className="text-lg sm:text-xl font-semibold mb-4">Acciones Rápidas</h2>
            <div className="space-y-2 sm:space-y-3">
                <button className="btn-primary w-full justify-center">
                  <Mail size={18} className="mr-2" />
                  Contactar
                </button>
                <button className="btn-outline w-full justify-center">
                  <Pencil size={18} className="mr-2" />
                  Editar Perfil
                </button>
                <button className="btn-outline w-full justify-center" onClick={() => exportPDF(emprendedor)}>
                  Exportar PDF
                </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EmprendedorPage;
