
'use client';

import React, { useState, useEffect } from "react";
import { ChevronLeft, BadgeCheck, Phone, MapPin, User, GraduationCap, Calendar, Users, Landmark, Info, Rocket, Pencil, Trash2, Mail } from "lucide-react";
import Image from "next/image";
import dynamic from "next/dynamic";
const MapContainer = dynamic(() => import('react-leaflet').then(mod => mod.MapContainer), { ssr: false });
const TileLayer = dynamic(() => import('react-leaflet').then(mod => mod.TileLayer), { ssr: false });
const Marker = dynamic(() => import('react-leaflet').then(mod => mod.Marker), { ssr: false });
const Popup = dynamic(() => import('react-leaflet').then(mod => mod.Popup), { ssr: false });
import 'leaflet/dist/leaflet.css';


const EmprendedorPage = ({ params }) => {
  const [emprendedor, setEmprendedor] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [L, setL] = useState(null);
  const [markerIcon, setMarkerIcon] = useState(null);
  // ...existing code...
  useEffect(() => {
    const fetchEmprendedor = async () => {
      setLoading(true);
      try {
        const res = await fetch(`/api/emprendedores/${params.id}`);
        const data = await res.json();
        if (res.ok) {
          setEmprendedor(data);
        } else {
          setError(data.error || "Error al cargar el emprendedor");
        }
      } catch (err) {
        setError("Error de red");
      }
      setLoading(false);
    };
    fetchEmprendedor();
  }, [params.id]);

  useEffect(() => {
    const loadLeaflet = async () => {
      const leaflet = await import('leaflet');
      setL(leaflet);
      // Usar SVG embebido para evitar peticiones 404 de iconos y cuadrados
      const svgIcon = `<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 32 32' width='32' height='32'><circle cx='16' cy='16' r='14' fill='#2563eb' stroke='white' stroke-width='3'/></svg>`;
      const iconUrl = `data:image/svg+xml;utf8,${encodeURIComponent(svgIcon)}`;
      const icon = new leaflet.Icon({
        iconUrl,
        iconSize: [32, 32],
        iconAnchor: [16, 32],
        popupAnchor: [0, -32],
        shadowUrl: undefined, // Evita buscar marker-shadow.png
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

  // Decodificar ubicación si existe
  let ubicacion = null;
  if (emprendedor.ubicacion) {
    if (typeof emprendedor.ubicacion === 'string') {
      try {
        ubicacion = JSON.parse(emprendedor.ubicacion);
      } catch {}
    } else if (typeof emprendedor.ubicacion === 'object') {
      // Si es objeto tipo buffer (como en tu modelo), decodificar
      const str = Object.values(emprendedor.ubicacion as Record<string, number>)
        .map((code: number) => String.fromCharCode(code))
        .join("");
      try {
        ubicacion = JSON.parse(str);
      } catch {}
    }
  }

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
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="flex items-center">
          <button
            onClick={() => window.history.back()}
            className="mr-3 p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
          >
            <ChevronLeft size={20} className="text-gray-600 dark:text-gray-400" />
          </button>
          <div className="flex items-center gap-4">
            <div className="relative w-16 h-16 rounded-full overflow-hidden border-4 border-primary shadow">
              <Image src={avatarUrl} alt="Avatar" width={64} height={64} className="object-cover w-full h-full" />
            </div>
            <div>
              <h1 className="text-2xl font-bold flex items-center gap-2">
                <User className="w-7 h-7 text-primary" />
                {emprendedor.nombre} {emprendedor.apellido}
                {emprendedor.verificado && <BadgeCheck className="ml-2 w-5 h-5 text-green-500" />}
              </h1>
              <div className="flex items-center mt-1">
                <span className="badge badge-secondary capitalize mr-2">
                  {emprendedor.genero}
                </span>
                <span className={`badge ${getStatusBadgeClass()} flex items-center`}>
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
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left column - Info */}
        <div className="lg:col-span-2 space-y-6">
          {/* Info card */}
          <div className="card">
            <h2 className="text-xl font-semibold mb-4">Información del Emprendedor</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
          <div className="card">
            <h2 className="text-xl font-semibold mb-4 flex items-center gap-2"><Rocket className="w-6 h-6 text-primary" /> Emprendimientos</h2>
            {emprendedor.emprendimientos && emprendedor.emprendimientos.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {emprendedor.emprendimientos.map((emp) => (
                  <div key={emp.id} className="p-4 border rounded-lg bg-white dark:bg-gray-800 shadow flex flex-col gap-2">
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
        </div>
        {/* Right column - Map and actions */}
        <div className="space-y-6">
          {/* Map card */}
          <div className="card">
            <h2 className="text-xl font-semibold mb-4">Ubicación</h2>
            <div className="rounded-lg overflow-hidden" style={{ minHeight: '400px', height: '400px', width: '100%' }}>
              {L && markerIcon && ubicacion && (
                <MapContainer
                  center={[ubicacion.lat, ubicacion.lng]}
                  zoom={14}
                  style={{ height: '100%', width: '100%' }}
                >
                  <TileLayer
                    attribution='&copy; OpenStreetMap contributors'
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                  />
                  <Marker position={[ubicacion.lat, ubicacion.lng]} icon={markerIcon}>
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
          {/* Quick actions card */}
          <div className="card">
            <h2 className="text-xl font-semibold mb-4">Acciones Rápidas</h2>
            <div className="space-y-3">
              <button className="btn-primary w-full justify-center">
                <Mail size={18} className="mr-2" />
                Contactar
              </button>
              <button className="btn-outline w-full justify-center">
                <Pencil size={18} className="mr-2" />
                Editar Perfil
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EmprendedorPage;
