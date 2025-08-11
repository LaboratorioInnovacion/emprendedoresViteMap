

'use client';
import { useParams, useRouter } from 'next/navigation';
import { Building2, MapPin, Phone, Mail, Globe, Calendar, Clock, ChevronLeft, Activity, Pencil, Trash2, Star } from 'lucide-react';
import dynamic from 'next/dynamic';
import React, { useMemo, useState, useEffect } from 'react';

const MapContainer = dynamic(() => import('react-leaflet').then(mod => mod.MapContainer), { ssr: false });
const TileLayer = dynamic(() => import('react-leaflet').then(mod => mod.TileLayer), { ssr: false });
const Marker = dynamic(() => import('react-leaflet').then(mod => mod.Marker), { ssr: false });
const Popup = dynamic(() => import('react-leaflet').then(mod => mod.Popup), { ssr: false });
import 'leaflet/dist/leaflet.css';

const EmprendimientoPage = () => {
  const params = useParams();
  const router = useRouter();
  const id = params.id;
  const [emprendimiento, setEmprendimiento] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [L, setL] = useState(null);
  const [markerIcon, setMarkerIcon] = useState(null);

  useEffect(() => {
    const fetchEmprendimiento = async () => {
      setLoading(true);
      try {
        const res = await fetch(`/api/emprendimientos/${id}`);
        const data = await res.json();
        if (res.ok) {
          setEmprendimiento(data);
        } else {
          setError(data.error || "Error al cargar el emprendimiento");
        }
      } catch (err) {
        setError("Error de red");
      }
      setLoading(false);
    };
    fetchEmprendimiento();
  }, [id]);

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

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <p>Cargando datos...</p>
      </div>
    );
  }

  if (!emprendimiento) {
    return (
      <div className="flex flex-col items-center justify-center py-12">
        <Building2 size={48} className="text-gray-400 mb-4" />
        <h2 className="text-2xl font-bold mb-2">No se encontró Emprendedor</h2>
        <p className="text-gray-600 dark:text-gray-400 mb-6">
          El negocio que estás buscando no existe o ha sido eliminado.
        </p>
        <button onClick={() => router.push('/businesses')} className="btn-primary">
          Volver a Lista de Emprendedores
        </button>
      </div>
    );
  }

  const getStatusBadgeClass = () => {
    switch (emprendimiento.estado || emprendimiento.status) {
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
            onClick={() => router.back()}
            className="mr-3 p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
          >
            <ChevronLeft size={20} className="text-gray-600 dark:text-gray-400" />
          </button>
          <div>
            <h1 className="text-2xl font-bold">{emprendimiento.denominacion || emprendimiento.name}</h1>
            <div className="flex items-center mt-1">
              <span className="badge badge-secondary capitalize mr-2">
                {emprendimiento.rubro || emprendimiento.type}
              </span>
              <span className={`badge ${getStatusBadgeClass()} flex items-center`}>
                <Activity size={12} className="mr-1" />
                {(emprendimiento.estado || emprendimiento.status || "Activo").charAt(0).toUpperCase() + (emprendimiento.estado || emprendimiento.status || "Activo").slice(1)}
              </span>
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
      {/* Business details */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left column - Business info */}
        <div className="lg:col-span-2 space-y-6">
          {/* Main info card */}
          <div className="card">
            <div className="flex flex-col md:flex-row gap-6">
              {emprendimiento.imageUrl && (
                <div className="md:w-1/3">
                  <img
                    src={emprendimiento.imageUrl}
                    alt={emprendimiento.denominacion || emprendimiento.name}
                    className="w-full h-48 md:h-full object-cover rounded-lg"
                  />
                </div>
              )}
              <div className={emprendimiento.imageUrl ? "md:w-2/3" : "w-full"}>
                <h2 className="text-xl font-semibold mb-4">Información de Negocio</h2>
                <p className="text-gray-600 dark:text-gray-400 mb-4">{emprendimiento.descripcion || emprendimiento.description}</p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-3">
                    <div className="flex items-start">
                      <MapPin size={18} className="text-gray-500 mt-0.5 mr-2 flex-shrink-0" />
                      <div>
                        <p className="text-sm font-medium text-gray-700 dark:text-gray-300">Dirección</p>
                        <p className="text-sm text-gray-600 dark:text-gray-400">{emprendimiento.direccion || emprendimiento.address}</p>
                      </div>
                    </div>
                    <div className="flex items-start">
                      <Phone size={18} className="text-gray-500 mt-0.5 mr-2 flex-shrink-0" />
                      <div>
                        <p className="text-sm font-medium text-gray-700 dark:text-gray-300">Teléfono</p>
                        <p className="text-sm text-gray-600 dark:text-gray-400">{emprendimiento.telefono || (emprendimiento.contact && emprendimiento.contact.phone)}</p>
                      </div>
                    </div>
                    <div className="flex items-start">
                      <Mail size={18} className="text-gray-500 mt-0.5 mr-2 flex-shrink-0" />
                      <div>
                        <p className="text-sm font-medium text-gray-700 dark:text-gray-300">Email</p>
                        <p className="text-sm text-gray-600 dark:text-gray-400">{emprendimiento.email || (emprendimiento.contact && emprendimiento.contact.email)}</p>
                      </div>
                    </div>
                  </div>
                  <div className="space-y-3">
                    {emprendimiento.web || (emprendimiento.contact && emprendimiento.contact.website) ? (
                      <div className="flex items-start">
                        <Globe size={18} className="text-gray-500 mt-0.5 mr-2 flex-shrink-0" />
                        <div>
                          <p className="text-sm font-medium text-gray-700 dark:text-gray-300">Sitio Web</p>
                          <a
                            href={emprendimiento.web || (emprendimiento.contact && emprendimiento.contact.website)}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-sm text-primary-600 dark:text-primary-400 hover:underline"
                          >
                            {(emprendimiento.web || (emprendimiento.contact && emprendimiento.contact.website) || "").replace(/^https?:\/\//, "")}
                          </a>
                        </div>
                      </div>
                    ) : null}
                    <div className="flex items-start">
                      <Calendar size={18} className="text-gray-500 mt-0.5 mr-2 flex-shrink-0" />
                      <div>
                        <p className="text-sm font-medium text-gray-700 dark:text-gray-300">Creado</p>
                        <p className="text-sm text-gray-600 dark:text-gray-400">{emprendimiento.createdAt ? new Date(emprendimiento.createdAt).toLocaleDateString() : '-'}</p>
                      </div>
                    </div>
                    <div className="flex items-start">
                      <Clock size={18} className="text-gray-500 mt-0.5 mr-2 flex-shrink-0" />
                      <div>
                        <p className="text-sm font-medium text-gray-700 dark:text-gray-300">Última Actualización</p>
                        <p className="text-sm text-gray-600 dark:text-gray-400">{emprendimiento.updatedAt ? new Date(emprendimiento.updatedAt).toLocaleDateString() : '-'}</p>
                      </div>
                    </div>
                    <div className="flex items-start">
                      <Star size={18} className="text-gray-500 mt-0.5 mr-2 flex-shrink-0" />
                      <div>
                        <p className="text-sm font-medium text-gray-700 dark:text-gray-300">Puntuación</p>
                        <p className="text-sm text-gray-600 dark:text-gray-400">{emprendimiento.score || '-'}</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        {/* Right column - Map and actions */}
        <div className="space-y-6">
          {/* Map card */}
          <div className="card">
            <h2 className="text-xl font-semibold mb-4">Ubicación</h2>
            <div className="h-64 rounded-lg overflow-hidden">
              {L && markerIcon && emprendimiento.ubicacion && (
                <MapContainer
                  center={[emprendimiento.ubicacion.lat, emprendimiento.ubicacion.lng]}
                  zoom={14}
                  style={{ height: "100%", width: "100%" }}
                >
                  <TileLayer
                    attribution='&copy; <a>OpenStreetMap</a>'
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                  />
                  <Marker position={[emprendimiento.ubicacion.lat, emprendimiento.ubicacion.lng]} icon={markerIcon}>
                    <Popup>{emprendimiento.denominacion || emprendimiento.name}</Popup>
                  </Marker>
                </MapContainer>
              )}
            </div>
            {emprendimiento.ubicacion && (
              <div className="mt-4">
                <a
                  href={`https://www.google.com/maps/search/?api=1&query=${emprendimiento.ubicacion.lat},${emprendimiento.ubicacion.lng}`}
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
                Contacto del Negocio
              </button>
              <button className="btn-outline w-full justify-center">
                <Pencil size={18} className="mr-2" />
                Editar Detalles
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EmprendimientoPage;
