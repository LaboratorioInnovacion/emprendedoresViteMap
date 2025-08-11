"use client";
import { useParams, useRouter } from "next/navigation";
import {
  Building2,
  MapPin,
  Phone,
  Mail,
  Globe,
  Calendar,
  Clock,
  ChevronLeft,
  Activity,
  Pencil,
  Trash2,
  Star,
} from "lucide-react";
import dynamic from "next/dynamic";
import BusinessMap from "../../../components/map/BusinessMap";
import React, { useMemo, useState, useEffect } from "react";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";

const EmprendimientoPage = () => {
  const params = useParams();
  const router = useRouter();
  const id = params.id;
  const [emprendimiento, setEmprendimiento] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [markerIcon, setMarkerIcon] = useState(null);
  const [showEdit, setShowEdit] = useState(false);
  const [editLoading, setEditLoading] = useState(false);
  const [editError, setEditError] = useState("");
  const [editUbicacion, setEditUbicacion] = useState(null);

  // Inicializa editUbicacion al abrir el modal
  useEffect(() => {
    if (showEdit) {
      if (
        emprendimiento?.ubicacion &&
        emprendimiento.ubicacion.lat !== undefined &&
        emprendimiento.ubicacion.lng !== undefined
      ) {
        setEditUbicacion({
          lat: emprendimiento.ubicacion.lat,
          lng: emprendimiento.ubicacion.lng,
        });
      } else {
        setEditUbicacion({ lat: -34.61, lng: -58.38 }); // Buenos Aires por defecto
      }
    }
  }, [showEdit, emprendimiento]);

  useEffect(() => {
    const fetchEmprendimiento = async () => {
      setLoading(true);
      try {
        const res = await fetch(`/api/emprendimientos/${id}`);
        const data = await res.json();
        if (res.ok) {
          // Si la ubicación viene como string, decodificar
          let ubicacion = data.ubicacion;
          if (ubicacion && typeof ubicacion === "string") {
            try {
              ubicacion = JSON.parse(ubicacion);
            } catch {}
          }
          setEmprendimiento({ ...data, ubicacion });
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
      const svgIcon = `<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 32 32' width='24' height='24'><circle cx='16' cy='16' r='10' fill='#2563eb' stroke='white' stroke-width='2'/></svg>`;
      const iconUrl = `data:image/svg+xml;utf8,${encodeURIComponent(svgIcon)}`;
      const icon = new L.Icon({
        iconUrl: "https://unpkg.com/leaflet@1.9.3/dist/images/marker-icon.png",
        iconSize: [25, 41],
        iconAnchor: [12, 41],
        popupAnchor: [1, -34],
        shadowUrl:
          "https://unpkg.com/leaflet@1.9.3/dist/images/marker-shadow.png",
        shadowSize: [41, 41],
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
        <button
          onClick={() => router.push("/businesses")}
          className="btn-primary"
        >
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
            <ChevronLeft
              size={20}
              className="text-gray-600 dark:text-gray-400"
            />
          </button>
          <div>
            <h1 className="text-2xl font-bold">
              {emprendimiento.denominacion || emprendimiento.name}
            </h1>
            <div className="flex items-center mt-1">
              <span className="badge badge-secondary capitalize mr-2">
                {emprendimiento.rubro || emprendimiento.type}
              </span>
              <span
                className={`badge ${getStatusBadgeClass()} flex items-center`}
              >
                <Activity size={12} className="mr-1" />
                {(emprendimiento.estado || emprendimiento.status || "Activo")
                  .charAt(0)
                  .toUpperCase() +
                  (
                    emprendimiento.estado ||
                    emprendimiento.status ||
                    "Activo"
                  ).slice(1)}
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
          <button
            className="btn bg-error-600 text-white hover:bg-error-700 focus:ring-error-500"
            onClick={async () => {
              if (
                !window.confirm(
                  "¿Seguro que quieres borrar este emprendimiento?"
                )
              )
                return;
              try {
                const res = await fetch(`/api/emprendimientos?id=${id}`, {
                  method: "DELETE",
                });
                const data = await res.json();
                if (res.ok && data.ok) {
                  router.push("/emprendimientos");
                } else {
                  alert(data.error || "Error al borrar");
                }
              } catch (err) {
                alert("Error de red");
              }
            }}
          >
            <Trash2 size={18} className="mr-1" />
            Borrar Definitivo
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
                <h2 className="text-xl font-semibold mb-4">
                  Información de Negocio
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <p>
                      <b>Denominación:</b> {emprendimiento.denominacion}
                    </p>
                    <p>
                      <b>Fecha Inicio:</b>{" "}
                      {emprendimiento.fechaInicio
                        ? new Date(emprendimiento.fechaInicio).toLocaleDateString()
                        : "-"}
                    </p>
                    <p>
                      <b>Inscripción Arca:</b>{" "}
                      {emprendimiento.inscripcionArca ? "Sí" : "No"}
                    </p>
                    <p>
                      <b>CUIT:</b> {emprendimiento.cuit}
                    </p>
                    <p>
                      <b>Sector:</b> {emprendimiento.sector}
                    </p>
                    <p>
                      <b>Actividad Principal:</b> {emprendimiento.actividadPrincipal}
                    </p>
                    <p>
                      <b>Tipo Emprendimiento:</b> {emprendimiento.tipoEmprendimiento}
                    </p>
                    <p>
                      <b>Dirección:</b> {emprendimiento.direccion}
                    </p>
                    <p>
                      <b>Teléfono:</b> {emprendimiento.telefono}
                    </p>
                    <p>
                      <b>Email:</b> {emprendimiento.email}
                    </p>
                    <p>
                      <b>Web:</b> {emprendimiento.web}
                    </p>
                    <p>
                      <b>Red Social 1:</b> {emprendimiento.redSocial1}
                    </p>
                    <p>
                      <b>Red Social 2:</b> {emprendimiento.redSocial2}
                    </p>
                    <p>
                      <b>Tiene Personal:</b> {emprendimiento.tienePersonal ? "Sí" : "No"}
                    </p>
                    <p>
                      <b>Cantidad Personal:</b> {emprendimiento.cantidadPersonal}
                    </p>
                    <p>
                      <b>Modo Incorporación Personal:</b>{" "}
                      {Array.isArray(emprendimiento.modoIncorporacionPersonal)
                        ? emprendimiento.modoIncorporacionPersonal.join(", ")
                        : emprendimiento.modoIncorporacionPersonal}
                    </p>
                    <p>
                      <b>Planea Incorporar Personal:</b> {emprendimiento.planeaIncorporarPersonal}
                    </p>
                    <p>
                      <b>Percepción Planta Personal:</b> {emprendimiento.percepcionPlantaPersonal}
                    </p>
                    <p>
                      <b>Requiere Capacitacion:</b> {emprendimiento.requiereCapacitacion ? "Sí" : "No"}
                    </p>
                    <p>
                      <b>Tipos Capacitacion:</b>{" "}
                      {Array.isArray(emprendimiento.tiposCapacitacion)
                        ? emprendimiento.tiposCapacitacion.join(", ")
                        : emprendimiento.tiposCapacitacion}
                    </p>
                    <p>
                      <b>Otros Tipos Capacitacion:</b> {emprendimiento.otrosTiposCapacitacion}
                    </p>
                    <p>
                      <b>Requiere Consultoria:</b> {emprendimiento.requiereConsultoria ? "Sí" : "No"}
                    </p>
                    <p>
                      <b>Tipos Consultoria:</b>{" "}
                      {Array.isArray(emprendimiento.tiposConsultoria)
                        ? emprendimiento.tiposConsultoria.join(", ")
                        : emprendimiento.tiposConsultoria}
                    </p>
                    <p>
                      <b>Otros Tipos Consultoria:</b> {emprendimiento.otrosTiposConsultoria}
                    </p>
                    <p>
                      <b>Requiere Herramientas Tecno:</b> {emprendimiento.requiereHerramientasTecno ? "Sí" : "No"}
                    </p>
                    <p>
                      <b>Tipos Herramientas Tecno:</b>{" "}
                      {Array.isArray(emprendimiento.tiposHerramientasTecno)
                        ? emprendimiento.tiposHerramientasTecno.join(", ")
                        : emprendimiento.tiposHerramientasTecno}
                    </p>
                    <p>
                      <b>Otras Herramientas Tecno:</b> {emprendimiento.otrasHerramientasTecno}
                    </p>
                    <p>
                      <b>Usa Redes Sociales:</b> {emprendimiento.usaRedesSociales ? "Sí" : "No"}
                    </p>
                    <p>
                      <b>Tipos Redes Sociales:</b>{" "}
                      {Array.isArray(emprendimiento.tiposRedesSociales)
                        ? emprendimiento.tiposRedesSociales.join(", ")
                        : emprendimiento.tiposRedesSociales}
                    </p>
                    <p>
                      <b>Usa Medios Pago Electrónicos:</b> {emprendimiento.usaMediosPagoElectronicos ? "Sí" : "No"}
                    </p>
                    <p>
                      <b>Canales Comercialización:</b>{" "}
                      {Array.isArray(emprendimiento.canalesComercializacion)
                        ? emprendimiento.canalesComercializacion.join(", ")
                        : emprendimiento.canalesComercializacion}
                    </p>
                    <p>
                      <b>Otros Canales Comercialización:</b> {emprendimiento.otrosCanalesComercializacion}
                    </p>
                    <p>
                      <b>Posee Sucursales:</b> {emprendimiento.poseeSucursales ? "Sí" : "No"}
                    </p>
                    <p>
                      <b>Cantidad Sucursales:</b> {emprendimiento.cantidadSucursales}
                    </p>
                    <p>
                      <b>Ubicación Sucursales:</b>{" "}
                      {Array.isArray(emprendimiento.ubicacionSucursales)
                        ? emprendimiento.ubicacionSucursales.join(", ")
                        : emprendimiento.ubicacionSucursales}
                    </p>
                    <p>
                      <b>Planea Abrir Sucursal:</b> {emprendimiento.planeaAbrirSucursal ? "Sí" : "No"}
                    </p>
                    <p>
                      <b>Creado:</b>{" "}
                      {emprendimiento.createdAt
                        ? new Date(emprendimiento.createdAt).toLocaleDateString()
                        : "-"}
                    </p>
                    <p>
                      <b>Actualizado:</b>{" "}
                      {emprendimiento.updatedAt
                        ? new Date(emprendimiento.updatedAt).toLocaleDateString()
                        : "-"}
                    </p>
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
              <MapContainer
                center={
                  emprendimiento.ubicacion &&
                  emprendimiento.ubicacion.lat !== undefined &&
                  emprendimiento.ubicacion.lng !== undefined
                    ? [
                        emprendimiento.ubicacion.lat,
                        emprendimiento.ubicacion.lng,
                      ]
                    : [-34.61, -58.38]
                }
                zoom={14}
                style={{ height: "100%", width: "100%" }}
                scrollWheelZoom={true}
              >
                <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
                {emprendimiento.ubicacion &&
                  emprendimiento.ubicacion.lat !== undefined &&
                  emprendimiento.ubicacion.lng !== undefined && (
                    <Marker
                      position={[
                        emprendimiento.ubicacion.lat,
                        emprendimiento.ubicacion.lng,
                      ]}
                      icon={markerIcon}
                    >
                      <Popup>Ubicación del emprendimiento</Popup>
                    </Marker>
                  )}
              </MapContainer>
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
              <button
                className="btn-outline w-full justify-center"
                onClick={() => setShowEdit(true)}
              >
                <Pencil size={18} className="mr-2" />
                Editar Detalles
              </button>
              {/* Modal de edición */}
              {showEdit && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40 overflow-auto">
                  <div className="bg-white dark:bg-gray-900 rounded-lg p-6 w-full max-w-lg shadow-lg max-h-[90vh] overflow-y-auto">
                    <h2 className="text-xl font-semibold mb-4">Editar Emprendimiento</h2>
                    <form
                      onSubmit={async (e) => {
                        e.preventDefault();
                        setEditLoading(true);
                        setEditError("");
                        try {
                          const form = e.target as HTMLFormElement;
                          const formData = new FormData(form);
                          // Solo campos válidos del modelo
                          const validFields = [
                            "denominacion", "fechaInicio", "inscripcionArca", "cuit", "sector", "actividadPrincipal", "tipoEmprendimiento", "direccion", "telefono", "email", "web", "redSocial1", "redSocial2", "tienePersonal", "cantidadPersonal", "modoIncorporacionPersonal", "planeaIncorporarPersonal", "percepcionPlantaPersonal", "requiereCapacitacion", "tiposCapacitacion", "otrosTiposCapacitacion", "requiereConsultoria", "tiposConsultoria", "otrosTiposConsultoria", "requiereHerramientasTecno", "tiposHerramientasTecno", "otrasHerramientasTecno", "usaRedesSociales", "tiposRedesSociales", "usaMediosPagoElectronicos", "canalesComercializacion", "otrosCanalesComercializacion", "poseeSucursales", "cantidadSucursales", "ubicacionSucursales", "planeaAbrirSucursal"
                          ];
                          const body: any = {};
                          formData.forEach((value, key) => {
                            if (validFields.includes(key)) {
                              body[key] = value;
                            }
                          });
                          // Si hay ubicacion seleccionada en el mapa, usarla
                          if (editUbicacion && editUbicacion.lat !== undefined && editUbicacion.lng !== undefined) {
                            body.ubicacion = { lat: editUbicacion.lat, lng: editUbicacion.lng };
                          }
                          const res = await fetch(`/api/emprendimientos/${id}`, {
                            method: "PUT",
                            headers: { "Content-Type": "application/json" },
                            body: JSON.stringify(body),
                          });
                          const data = await res.json();
                          if (res.ok) {
                            setEmprendimiento({ ...emprendimiento, ...body });
                            setShowEdit(false);
                          } else {
                            setEditError(data.error || "Error al editar");
                          }
                        } catch (err) {
                          setEditError("Error de red");
                        }
                        setEditLoading(false);
                      }}
                    >
                      <div className="space-y-3">
                        <label className="block"><span className="text-sm font-medium">Denominación</span><input name="denominacion" defaultValue={emprendimiento.denominacion || ""} className="input w-full" /></label>
                        <label className="block"><span className="text-sm font-medium">Fecha Inicio</span><input type="date" name="fechaInicio" defaultValue={emprendimiento.fechaInicio ? new Date(emprendimiento.fechaInicio).toISOString().split('T')[0] : ""} className="input w-full" /></label>
                        <label className="block"><span className="text-sm font-medium">Inscripción Arca</span><input type="checkbox" name="inscripcionArca" defaultChecked={emprendimiento.inscripcionArca || false} /></label>
                        <label className="block"><span className="text-sm font-medium">CUIT</span><input name="cuit" defaultValue={emprendimiento.cuit || ""} className="input w-full" /></label>
                        <label className="block"><span className="text-sm font-medium">Sector</span><input name="sector" defaultValue={emprendimiento.sector || ""} className="input w-full" /></label>
                        <label className="block"><span className="text-sm font-medium">Actividad Principal</span><input name="actividadPrincipal" defaultValue={emprendimiento.actividadPrincipal || ""} className="input w-full" /></label>
                        <label className="block"><span className="text-sm font-medium">Tipo Emprendimiento</span><input name="tipoEmprendimiento" defaultValue={emprendimiento.tipoEmprendimiento || ""} className="input w-full" /></label>
                        <label className="block"><span className="text-sm font-medium">Dirección</span><input name="direccion" defaultValue={emprendimiento.direccion || ""} className="input w-full" /></label>
                        <label className="block"><span className="text-sm font-medium">Teléfono</span><input name="telefono" defaultValue={emprendimiento.telefono || ""} className="input w-full" /></label>
                        <label className="block"><span className="text-sm font-medium">Email</span><input name="email" defaultValue={emprendimiento.email || ""} className="input w-full" /></label>
                        <label className="block"><span className="text-sm font-medium">Web</span><input name="web" defaultValue={emprendimiento.web || ""} className="input w-full" /></label>
                        <label className="block"><span className="text-sm font-medium">Red Social 1</span><input name="redSocial1" defaultValue={emprendimiento.redSocial1 || ""} className="input w-full" /></label>
                        <label className="block"><span className="text-sm font-medium">Red Social 2</span><input name="redSocial2" defaultValue={emprendimiento.redSocial2 || ""} className="input w-full" /></label>
                        <label className="block"><span className="text-sm font-medium">Tiene Personal</span><input type="checkbox" name="tienePersonal" defaultChecked={emprendimiento.tienePersonal || false} /></label>
                        <label className="block"><span className="text-sm font-medium">Cantidad Personal</span><input type="number" name="cantidadPersonal" defaultValue={emprendimiento.cantidadPersonal || 0} className="input w-full" /></label>
                        <label className="block"><span className="text-sm font-medium">Modo Incorporación Personal (separado por coma)</span><input name="modoIncorporacionPersonal" defaultValue={Array.isArray(emprendimiento.modoIncorporacionPersonal) ? emprendimiento.modoIncorporacionPersonal.join(",") : ""} className="input w-full" /></label>
                        <label className="block"><span className="text-sm font-medium">Planea Incorporar Personal</span><input name="planeaIncorporarPersonal" defaultValue={emprendimiento.planeaIncorporarPersonal || ""} className="input w-full" /></label>
                        <label className="block"><span className="text-sm font-medium">Percepción Planta Personal</span><input name="percepcionPlantaPersonal" defaultValue={emprendimiento.percepcionPlantaPersonal || ""} className="input w-full" /></label>
                        <label className="block"><span className="text-sm font-medium">Requiere Capacitacion</span><input type="checkbox" name="requiereCapacitacion" defaultChecked={emprendimiento.requiereCapacitacion || false} /></label>
                        <label className="block"><span className="text-sm font-medium">Tipos Capacitacion (separado por coma)</span><input name="tiposCapacitacion" defaultValue={Array.isArray(emprendimiento.tiposCapacitacion) ? emprendimiento.tiposCapacitacion.join(",") : ""} className="input w-full" /></label>
                        <label className="block"><span className="text-sm font-medium">Otros Tipos Capacitacion</span><input name="otrosTiposCapacitacion" defaultValue={emprendimiento.otrosTiposCapacitacion || ""} className="input w-full" /></label>
                        <label className="block"><span className="text-sm font-medium">Requiere Consultoria</span><input type="checkbox" name="requiereConsultoria" defaultChecked={emprendimiento.requiereConsultoria || false} /></label>
                        <label className="block"><span className="text-sm font-medium">Tipos Consultoria (separado por coma)</span><input name="tiposConsultoria" defaultValue={Array.isArray(emprendimiento.tiposConsultoria) ? emprendimiento.tiposConsultoria.join(",") : ""} className="input w-full" /></label>
                        <label className="block"><span className="text-sm font-medium">Otros Tipos Consultoria</span><input name="otrosTiposConsultoria" defaultValue={emprendimiento.otrosTiposConsultoria || ""} className="input w-full" /></label>
                        <label className="block"><span className="text-sm font-medium">Requiere Herramientas Tecno</span><input type="checkbox" name="requiereHerramientasTecno" defaultChecked={emprendimiento.requiereHerramientasTecno || false} /></label>
                        <label className="block"><span className="text-sm font-medium">Tipos Herramientas Tecno (separado por coma)</span><input name="tiposHerramientasTecno" defaultValue={Array.isArray(emprendimiento.tiposHerramientasTecno) ? emprendimiento.tiposHerramientasTecno.join(",") : ""} className="input w-full" /></label>
                        <label className="block"><span className="text-sm font-medium">Otras Herramientas Tecno</span><input name="otrasHerramientasTecno" defaultValue={emprendimiento.otrasHerramientasTecno || ""} className="input w-full" /></label>
                        <label className="block"><span className="text-sm font-medium">Usa Redes Sociales</span><input type="checkbox" name="usaRedesSociales" defaultChecked={emprendimiento.usaRedesSociales || false} /></label>
                        <label className="block"><span className="text-sm font-medium">Tipos Redes Sociales (separado por coma)</span><input name="tiposRedesSociales" defaultValue={Array.isArray(emprendimiento.tiposRedesSociales) ? emprendimiento.tiposRedesSociales.join(",") : ""} className="input w-full" /></label>
                        <label className="block"><span className="text-sm font-medium">Usa Medios Pago Electrónicos</span><input type="checkbox" name="usaMediosPagoElectronicos" defaultChecked={emprendimiento.usaMediosPagoElectronicos || false} /></label>
                        <label className="block"><span className="text-sm font-medium">Canales Comercialización (separado por coma)</span><input name="canalesComercializacion" defaultValue={Array.isArray(emprendimiento.canalesComercializacion) ? emprendimiento.canalesComercializacion.join(",") : ""} className="input w-full" /></label>
                        <label className="block"><span className="text-sm font-medium">Otros Canales Comercialización</span><input name="otrosCanalesComercializacion" defaultValue={emprendimiento.otrosCanalesComercializacion || ""} className="input w-full" /></label>
                        <label className="block"><span className="text-sm font-medium">Posee Sucursales</span><input type="checkbox" name="poseeSucursales" defaultChecked={emprendimiento.poseeSucursales || false} /></label>
                        <label className="block"><span className="text-sm font-medium">Cantidad Sucursales</span><input type="number" name="cantidadSucursales" defaultValue={emprendimiento.cantidadSucursales || 0} className="input w-full" /></label>
                        <label className="block"><span className="text-sm font-medium">Ubicación Sucursales (separado por coma)</span><input name="ubicacionSucursales" defaultValue={Array.isArray(emprendimiento.ubicacionSucursales) ? emprendimiento.ubicacionSucursales.join(",") : ""} className="input w-full" /></label>
                        <label className="block"><span className="text-sm font-medium">Planea Abrir Sucursal</span><input type="checkbox" name="planeaAbrirSucursal" defaultChecked={emprendimiento.planeaAbrirSucursal || false} /></label>
                        {/* Mapa para seleccionar ubicación */}
                        <div className="mt-4">
                          <span className="text-sm font-medium mb-2 block">Selecciona la ubicación en el mapa</span>
                          <div className="h-64 rounded-lg overflow-hidden bg-gray-100 flex items-center justify-center">
                            <MapContainer
                              center={editUbicacion ? [editUbicacion.lat, editUbicacion.lng] : [-34.61, -58.38]}
                              zoom={14}
                              style={{ height: "100%", width: "100%" }}
                              scrollWheelZoom={true}
                            >
                              <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
                              <Marker
                                position={editUbicacion ? [editUbicacion.lat, editUbicacion.lng] : [-34.61, -58.38]}
                                draggable={true}
                                icon={markerIcon}
                                eventHandlers={{
                                  dragend: (e) => {
                                    const marker = e.target;
                                    const pos = marker.getLatLng();
                                    setEditUbicacion({ lat: pos.lat, lng: pos.lng });
                                  },
                                }}
                              >
                                <Popup>Arrastra el marcador para seleccionar la ubicación</Popup>
                              </Marker>
                            </MapContainer>
                          </div>
                          <div className="mt-2 text-xs text-gray-500">
                            {editUbicacion
                              ? <>Lat: {editUbicacion.lat.toFixed(6)}, Lng: {editUbicacion.lng.toFixed(6)}</>
                              : <>No hay ubicación seleccionada</>
                            }
                          </div>
                        </div>
                      </div>
                      {editError && <div className="text-red-500 mt-2">{editError}</div>}
                      <div className="flex justify-end gap-2 mt-6">
                        <button type="button" className="btn-outline" onClick={() => setShowEdit(false)} disabled={editLoading}>Cancelar</button>
                        <button type="submit" className="btn-primary" disabled={editLoading}>{editLoading ? "Guardando..." : "Guardar Cambios"}</button>
                      </div>
                    </form>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EmprendimientoPage;
