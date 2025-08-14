
"use client";
import { useParams, useRouter } from "next/navigation";
import React, { useMemo, useState, useEffect } from "react";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import {
  Building2,
  ChevronLeft,
  Activity,
  Pencil,
  Trash2,
  Mail,
} from "lucide-react";

const EditEmprendimientoPage = () => {
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

  // Inicializar editUbicacion con la ubicación real del emprendimiento al cargar los datos
  useEffect(() => {
    if (emprendimiento?.ubicacion && emprendimiento.ubicacion.lat !== undefined && emprendimiento.ubicacion.lng !== undefined) {
      setEditUbicacion({ lat: emprendimiento.ubicacion.lat, lng: emprendimiento.ubicacion.lng });
    } else if (emprendimiento) {
      setEditUbicacion({ lat: -28.61, lng: -65.38 });
    }
  }, [emprendimiento]);

  useEffect(() => {
    const fetchEmprendimiento = async () => {
      setLoading(true);
      try {
        const res = await fetch(`/api/emprendimientos/${id}`);
        const data = await res.json();
        if (res.ok) {
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
      const icon = new L.Icon({
        iconUrl: "https://unpkg.com/leaflet@1.9.3/dist/images/marker-icon.png",
        iconSize: [25, 41],
        iconAnchor: [12, 41],
        popupAnchor: [1, -34],
        shadowUrl: "https://unpkg.com/leaflet@1.9.3/dist/images/marker-shadow.png",
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
        <h2 className="text-2xl font-bold mb-2">No se encontró Emprendimiento</h2>
        <p className="text-gray-600 dark:text-gray-400 mb-6">
          El emprendimiento que estás buscando no existe o ha sido eliminado.
        </p>
        <button
          onClick={() => router.push("/emprendimientos")}
          className="btn-primary"
        >
          Volver a Lista de Emprendimientos
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
    <div className="max-w-3xl mx-auto p-6">
      <button
        onClick={() => router.back()}
        className="mb-6 p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
      >
        <ChevronLeft size={20} className="text-gray-600 dark:text-gray-400" /> Volver
      </button>
      <h1 className="text-2xl font-bold mb-6">Editar Emprendimiento</h1>
      <form
        onSubmit={async (e) => {
          e.preventDefault();
          setEditLoading(true);
          setEditError("");
          try {
            const form = e.target as HTMLFormElement;
            const formData = new FormData(form);
            const validFields = [
              "denominacion", "fechaInicio", "inscripcionArca", "cuit", "sector", "actividadPrincipal", "tipoEmprendimiento", "direccion", "telefono", "email", "web", "redSocial1", "redSocial2", "tienePersonal", "cantidadPersonal", "modoIncorporacionPersonal", "planeaIncorporarPersonal", "percepcionPlantaPersonal", "requiereCapacitacion", "tiposCapacitacion", "otrosTiposCapacitacion", "requiereConsultoria", "tiposConsultoria", "otrosTiposConsultoria", "requiereHerramientasTecno", "tiposHerramientasTecno", "otrasHerramientasTecno", "usaRedesSociales", "tiposRedesSociales", "usaMediosPagoElectronicos", "canalesComercializacion", "otrosCanalesComercializacion", "poseeSucursales", "cantidadSucursales", "ubicacionSucursales", "planeaAbrirSucursal"
            ];
            const body: any = {};
            formData.forEach((value, key) => {
              if (validFields.includes(key)) {
                if (["inscripcionArca","tienePersonal","requiereCapacitacion","requiereConsultoria","requiereHerramientasTecno","usaRedesSociales","usaMediosPagoElectronicos","poseeSucursales","planeaAbrirSucursal"].includes(key)) {
                  body[key] = value === "on" ? true : false;
                } else {
                  body[key] = value;
                }
              }
            });
            [
              "modoIncorporacionPersonal",
              "tiposCapacitacion",
              "tiposConsultoria",
              "tiposHerramientasTecno",
              "tiposRedesSociales",
              "canalesComercializacion",
              "ubicacionSucursales",
            ].forEach((key) => {
              if (typeof body[key] === "string") {
                if (body[key].trim() === "") {
                  body[key] = [];
                } else {
                  body[key] = body[key]
                    .split(",")
                    .map((v: string) => v.trim())
                    .filter(Boolean);
                }
              } else if (!body[key]) {
                body[key] = [];
              }
            });
            // Convertir campos numéricos a número
            if (body.cantidadPersonal !== undefined && body.cantidadPersonal !== "") {
              body.cantidadPersonal = Number(body.cantidadPersonal);
            }
            if (body.cantidadSucursales !== undefined && body.cantidadSucursales !== "") {
              body.cantidadSucursales = Number(body.cantidadSucursales);
            }
            // Validar enum planeaIncorporarPersonal
            const planeaEnum = ["Si", "No", "NoLoSabe"];
            if (!planeaEnum.includes(body.planeaIncorporarPersonal)) {
              body.planeaIncorporarPersonal = null;
            }
            // Validar enum percepcionPlantaPersonal
            const percepcionEnum = ["Adecuada", "Mayor", "Menor", "NoLoSabe"];
            if (!percepcionEnum.includes(body.percepcionPlantaPersonal)) {
              body.percepcionPlantaPersonal = null;
            }
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
              setEmprendimiento({ ...emprendimiento, ...body, ubicacion: body.ubicacion });
            } else {
              setEditError(data.error || "Error al editar");
            }
          } catch (err) {
            setEditError("Error de red");
          }
          setEditLoading(false);
        }}
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
        </div>
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
                position={editUbicacion ? [editUbicacion.lat, editUbicacion.lng] : [-28.61, -65.38]}
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
        {editError && <div className="text-red-500 mt-2">{editError}</div>}
        <div className="flex justify-end gap-2 mt-6">
          <button type="submit" className="btn-primary" disabled={editLoading}>{editLoading ? "Guardando..." : "Guardar Cambios"}</button>
        </div>
      </form>
    </div>
  );
};

export default EditEmprendimientoPage;
