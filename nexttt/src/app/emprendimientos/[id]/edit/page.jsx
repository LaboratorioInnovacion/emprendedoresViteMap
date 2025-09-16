
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
  // Opciones enums
  const etapaOptions = ["Idea", "EnMarcha", "Consolidado"];
  const sectorOptions = ["ProduccionElaboracion", "Comercio", "Servicios"];
  const tipoEmprendimientoOptions = ["Individual", "Asociativo", "Familiar", "Cooperativo"];
  const actividadPrincipalOptions = [
    "Produccion_Alimentos_Artesanal",
    "Produccion_Alimentos_Industrial",
    "Produccion_Articulos_Hogar",
    "Produccion_Indumentaria",
    "Produccion_Quimicos_Hogar",
    "Produccion_Belleza",
    "Produccion_Grafica",
    "Produccion_Vivero",
    "Produccion_Otro",
    "Comercio_Indumentaria",
    "Comercio_Alimentos",
    "Comercio_Articulos_Hogar",
    "Comercio_Libreria",
    "Comercio_Informatica",
    "Comercio_Belleza",
    "Comercio_Mascotas",
    "Comercio_Regional",
    "Comercio_Construccion",
    "Comercio_Vivero",
    "Comercio_Otro",
    "Servicio_Profesionales",
    "Servicio_Salud",
    "Servicio_Educativos",
    "Servicio_Turisticos",
    "Servicio_Reparacion_Electro",
    "Servicio_Reparacion_Vehiculos",
    "Servicio_Construccion",
    "Servicio_Gastronomicos",
    "Servicio_Otro"
  ];
  const planeaIncorporarOptions = ["Si", "No", "NoLoSabe"];
  const percepcionPlantaOptions = ["Adecuada", "Mayor", "Menor", "NoLoSabe"];
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
  const [missingFields, setMissingFields] = useState([]);
  const [editUbicacion, setEditUbicacion] = useState(null);
  const [file, setFile] = useState(null);

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
  <div className="max-w-7xl mx-auto p-4 sm:p-6">
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
          setMissingFields([]);
          let fotoPerfilUrl = emprendimiento.fotoPerfil || "";
          if (file) {
            const formData = new FormData();
            formData.append("file", file);
            try {
              const uploadRes = await fetch("/api/upload", {
                method: "POST",
                body: formData,
              });
              const uploadData = await uploadRes.json();
              if (uploadRes.ok && uploadData.url) {
                fotoPerfilUrl = uploadData.url;
              } else {
                setEditError(uploadData.error || "Error al subir la imagen");
                setEditLoading(false);
                return;
              }
            } catch (err) {
              setEditError("Error de red al subir imagen: " + err.message);
              setEditLoading(false);
              return;
            }
          }
          try {
            const formEl = e.target;
            const formData = new FormData(formEl);
            const validFields = [
              "denominacion", "fechaInicio", "inscripcionArca", "cuit", "sector", "actividadPrincipal", "tipoEmprendimiento", "direccion", "telefono", "email", "web", "redSocial1", "redSocial2", "tienePersonal", "cantidadPersonal", "modoIncorporacionPersonal", "planeaIncorporarPersonal", "percepcionPlantaPersonal", "requiereCapacitacion", "tiposCapacitacion", "otrosTiposCapacitacion", "requiereConsultoria", "tiposConsultoria", "otrosTiposConsultoria", "requiereHerramientasTecno", "tiposHerramientasTecno", "otrasHerramientasTecno", "usaRedesSociales", "tiposRedesSociales", "usaMediosPagoElectronicos", "canalesComercializacion", "otrosCanalesComercializacion", "poseeSucursales", "cantidadSucursales", "ubicacionSucursales", "planeaAbrirSucursal"
            ];
            const body = { fotoPerfil: fotoPerfilUrl };
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
                    .map((v) => v.trim())
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
            // Validar enums
            if (body.planeaIncorporarPersonal && !planeaIncorporarOptions.includes(body.planeaIncorporarPersonal)) {
              body.planeaIncorporarPersonal = null;
            }
            if (body.percepcionPlantaPersonal && !percepcionPlantaOptions.includes(body.percepcionPlantaPersonal)) {
              body.percepcionPlantaPersonal = null;
            }
            if (editUbicacion && editUbicacion.lat !== undefined && editUbicacion.lng !== undefined) {
              body.ubicacion = { lat: editUbicacion.lat, lng: editUbicacion.lng };
            }
            // Validación de campos obligatorios y formato
            const requiredFields = [
              { key: "denominacion", label: "Denominación" },
              { key: "fechaInicio", label: "Fecha Inicio" },
              { key: "sector", label: "Sector" },
              { key: "actividadPrincipal", label: "Actividad Principal" },
              { key: "tipoEmprendimiento", label: "Tipo Emprendimiento" },
              { key: "direccion", label: "Dirección" },
              { key: "telefono", label: "Teléfono" },
              { key: "email", label: "Email" },
            ];
            const missing = [];
            requiredFields.forEach(({ key, label }) => {
              if (!body[key] || body[key].toString().trim() === "") {
                missing.push(label);
              }
            });
            // Validar sector
            if (body.sector && !sectorOptions.includes(body.sector)) {
              missing.push("Sector (debe ser: " + sectorOptions.join(", ") + ")");
            }
            // Validar actividadPrincipal
            if (body.actividadPrincipal && !actividadPrincipalOptions.includes(body.actividadPrincipal)) {
              missing.push("Actividad Principal (debe ser: " + actividadPrincipalOptions.join(", ") + ")");
            }
            // Validar tipoEmprendimiento
            if (body.tipoEmprendimiento && !tipoEmprendimientoOptions.includes(body.tipoEmprendimiento)) {
              missing.push("Tipo Emprendimiento (debe ser: " + tipoEmprendimientoOptions.join(", ") + ")");
            }
            // Validar email formato
            if (body.email && !/^\S+@\S+\.\S+$/.test(body.email)) {
              missing.push("Email (formato inválido)");
            }
            // Validar ubicación
            if (!body.ubicacion || body.ubicacion.lat === undefined || body.ubicacion.lng === undefined) {
              missing.push("Ubicación en el mapa");
            }
            if (missing.length > 0) {
              setMissingFields(missing);
              setEditLoading(false);
              return;
            }
            // ...continúa el envío normal
            const res = await fetch(`/api/emprendimientos/${id}`, {
              method: "PUT",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify(body),
            });
            const data = await res.json();
            if (res.ok) {
              setEmprendimiento({ ...emprendimiento, ...body, ubicacion: body.ubicacion });
              setMissingFields([]);
            } else {
              setEditError(data.error || "Error al editar");
            }
          } catch (err) {
            setEditError("Error de red");
          }
          setEditLoading(false);
        }}
      >
  <div className="grid grid-cols-1 gap-y-4 md:grid-cols-2 md:gap-4">
          {/* Imagen de perfil */}
          <div className="block col-span-2">
            <span className="text-xs text-gray-500">Foto de perfil (opcional)</span>
            <input id="fotoPerfil" name="fotoPerfil" type="file" accept="image/*" onChange={e => setFile(e.target.files?.[0] || null)} className="w-full p-2 text-sm border border-gray-300 rounded" />
            {emprendimiento.fotoPerfil && (
              <div className="mt-1"><img src={emprendimiento.fotoPerfil} alt="Foto perfil" className="h-24 rounded border" /></div>
            )}
          </div>
          <label className="block mb-2"><span className="text-sm font-medium mb-1 block">Denominación</span><input name="denominacion" defaultValue={emprendimiento.denominacion || ""} className="input w-full px-3 py-2 text-base mt-1" /></label>
          <label className="block mb-2"><span className="text-sm font-medium mb-1 block">Fecha Inicio</span><input type="date" name="fechaInicio" defaultValue={emprendimiento.fechaInicio ? new Date(emprendimiento.fechaInicio).toISOString().split('T')[0] : ""} className="input w-full px-3 py-2 text-base mt-1" /></label>
          <label className="block mb-2"><span className="text-sm font-medium mb-1 block">Inscripción Arca</span><input type="checkbox" name="inscripcionArca" defaultChecked={emprendimiento.inscripcionArca || false} className="mr-2 mt-1" /></label>
          <label className="block mb-2"><span className="text-sm font-medium mb-1 block">CUIT</span><input name="cuit" defaultValue={emprendimiento.cuit || ""} className="input w-full px-3 py-2 text-base mt-1" /></label>
          <label className="block mb-2"><span className="text-sm font-medium mb-1 block">Sector</span>
            <select name="sector" defaultValue={emprendimiento.sector || ""} className="input w-full px-3 py-2 text-base">
              <option value="">Selecciona sector</option>
              {sectorOptions.map((opt) => (
                <option key={opt} value={opt}>{opt}</option>
              ))}
            </select>
          </label>
          <label className="block mb-2"><span className="text-sm font-medium mb-1 block">Actividad Principal</span>
            <select name="actividadPrincipal" defaultValue={emprendimiento.actividadPrincipal || ""} className="input w-full px-3 py-2 text-base">
              <option value="">Selecciona actividad</option>
              {actividadPrincipalOptions.map((opt) => (
                <option key={opt} value={opt}>{opt}</option>
              ))}
            </select>
          </label>
          <label className="block mb-2"><span className="text-sm font-medium mb-1 block">Tipo Emprendimiento</span>
            <select name="tipoEmprendimiento" defaultValue={emprendimiento.tipoEmprendimiento || ""} className="input w-full px-3 py-2 text-base">
              <option value="">Selecciona tipo</option>
              {tipoEmprendimientoOptions.map((opt) => (
                <option key={opt} value={opt}>{opt}</option>
              ))}
            </select>
          </label>
          <label className="block mb-2"><span className="text-sm font-medium mb-1 block">Dirección</span><input name="direccion" defaultValue={emprendimiento.direccion || ""} className="input w-full px-3 py-2 text-base mt-1" /></label>
          <label className="block mb-2"><span className="text-sm font-medium mb-1 block">Teléfono</span><input name="telefono" defaultValue={emprendimiento.telefono || ""} className="input w-full px-3 py-2 text-base mt-1" /></label>
          <label className="block mb-2"><span className="text-sm font-medium mb-1 block">Email</span><input name="email" defaultValue={emprendimiento.email || ""} className="input w-full px-3 py-2 text-base mt-1" /></label>
          <label className="block mb-2"><span className="text-sm font-medium mb-1 block">Web</span><input name="web" defaultValue={emprendimiento.web || ""} className="input w-full px-3 py-2 text-base mt-1" /></label>
          <label className="block mb-2"><span className="text-sm font-medium mb-1 block">Red Social 1</span><input name="redSocial1" defaultValue={emprendimiento.redSocial1 || ""} className="input w-full px-3 py-2 text-base mt-1" /></label>
          <label className="block mb-2"><span className="text-sm font-medium mb-1 block">Red Social 2</span><input name="redSocial2" defaultValue={emprendimiento.redSocial2 || ""} className="input w-full px-3 py-2 text-base mt-1" /></label>
          <label className="block mb-2"><span className="text-sm font-medium mb-1 block">Tiene Personal</span><input type="checkbox" name="tienePersonal" defaultChecked={emprendimiento.tienePersonal || false} className="mr-2 mt-1" /></label>
          <label className="block mb-2"><span className="text-sm font-medium mb-1 block">Cantidad Personal</span><input type="number" name="cantidadPersonal" defaultValue={emprendimiento.cantidadPersonal || 0} className="input w-full px-3 py-2 text-base mt-1" /></label>
          <label className="block mb-2"><span className="text-sm font-medium mb-1 block">Modo Incorporación Personal (separado por coma)</span><input name="modoIncorporacionPersonal" defaultValue={Array.isArray(emprendimiento.modoIncorporacionPersonal) ? emprendimiento.modoIncorporacionPersonal.join(",") : ""} className="input w-full px-3 py-2 text-base mt-1" /></label>
          <label className="block mb-2"><span className="text-sm font-medium mb-1 block">Planea Incorporar Personal</span>
            <select name="planeaIncorporarPersonal" defaultValue={emprendimiento.planeaIncorporarPersonal || ""} className="input w-full px-3 py-2 text-base">
              <option value="">Selecciona opción</option>
              {planeaIncorporarOptions.map((opt) => (
                <option key={opt} value={opt}>{opt}</option>
              ))}
            </select>
          </label>
          <label className="block mb-2"><span className="text-sm font-medium mb-1 block">Percepción Planta Personal</span>
            <select name="percepcionPlantaPersonal" defaultValue={emprendimiento.percepcionPlantaPersonal || ""} className="input w-full px-3 py-2 text-base">
              <option value="">Selecciona opción</option>
              {percepcionPlantaOptions.map((opt) => (
                <option key={opt} value={opt}>{opt}</option>
              ))}
            </select>
          </label>
          <label className="block mb-2"><span className="text-sm font-medium mb-1 block">Requiere Capacitacion</span><input type="checkbox" name="requiereCapacitacion" defaultChecked={emprendimiento.requiereCapacitacion || false} className="mr-2 mt-1" /></label>
          <label className="block mb-2"><span className="text-sm font-medium mb-1 block">Tipos Capacitacion (separado por coma)</span><input name="tiposCapacitacion" defaultValue={Array.isArray(emprendimiento.tiposCapacitacion) ? emprendimiento.tiposCapacitacion.join(",") : ""} className="input w-full px-3 py-2 text-base mt-1" /></label>
          <label className="block mb-2"><span className="text-sm font-medium mb-1 block">Otros Tipos Capacitacion</span><input name="otrosTiposCapacitacion" defaultValue={emprendimiento.otrosTiposCapacitacion || ""} className="input w-full px-3 py-2 text-base mt-1" /></label>
          <label className="block mb-2"><span className="text-sm font-medium mb-1 block">Requiere Consultoria</span><input type="checkbox" name="requiereConsultoria" defaultChecked={emprendimiento.requiereConsultoria || false} className="mr-2 mt-1" /></label>
          <label className="block mb-2"><span className="text-sm font-medium mb-1 block">Tipos Consultoria (separado por coma)</span><input name="tiposConsultoria" defaultValue={Array.isArray(emprendimiento.tiposConsultoria) ? emprendimiento.tiposConsultoria.join(",") : ""} className="input w-full px-3 py-2 text-base mt-1" /></label>
          <label className="block mb-2"><span className="text-sm font-medium mb-1 block">Otros Tipos Consultoria</span><input name="otrosTiposConsultoria" defaultValue={emprendimiento.otrosTiposConsultoria || ""} className="input w-full px-3 py-2 text-base mt-1" /></label>
          <label className="block mb-2"><span className="text-sm font-medium mb-1 block">Requiere Herramientas Tecno</span><input type="checkbox" name="requiereHerramientasTecno" defaultChecked={emprendimiento.requiereHerramientasTecno || false} className="mr-2 mt-1" /></label>
          <label className="block mb-2"><span className="text-sm font-medium mb-1 block">Tipos Herramientas Tecno (separado por coma)</span><input name="tiposHerramientasTecno" defaultValue={Array.isArray(emprendimiento.tiposHerramientasTecno) ? emprendimiento.tiposHerramientasTecno.join(",") : ""} className="input w-full px-3 py-2 text-base mt-1" /></label>
          <label className="block mb-2"><span className="text-sm font-medium mb-1 block">Otras Herramientas Tecno</span><input name="otrasHerramientasTecno" defaultValue={emprendimiento.otrasHerramientasTecno || ""} className="input w-full px-3 py-2 text-base mt-1" /></label>
          <label className="block mb-2"><span className="text-sm font-medium mb-1 block">Usa Redes Sociales</span><input type="checkbox" name="usaRedesSociales" defaultChecked={emprendimiento.usaRedesSociales || false} className="mr-2 mt-1" /></label>
          <label className="block mb-2"><span className="text-sm font-medium mb-1 block">Tipos Redes Sociales (separado por coma)</span><input name="tiposRedesSociales" defaultValue={Array.isArray(emprendimiento.tiposRedesSociales) ? emprendimiento.tiposRedesSociales.join(",") : ""} className="input w-full px-3 py-2 text-base mt-1" /></label>
          <label className="block mb-2"><span className="text-sm font-medium mb-1 block">Usa Medios Pago Electrónicos</span><input type="checkbox" name="usaMediosPagoElectronicos" defaultChecked={emprendimiento.usaMediosPagoElectronicos || false} className="mr-2 mt-1" /></label>
          <label className="block mb-2"><span className="text-sm font-medium mb-1 block">Canales Comercialización (separado por coma)</span><input name="canalesComercializacion" defaultValue={Array.isArray(emprendimiento.canalesComercializacion) ? emprendimiento.canalesComercializacion.join(",") : ""} className="input w-full px-3 py-2 text-base mt-1" /></label>
          <label className="block mb-2"><span className="text-sm font-medium mb-1 block">Otros Canales Comercialización</span><input name="otrosCanalesComercializacion" defaultValue={emprendimiento.otrosCanalesComercializacion || ""} className="input w-full px-3 py-2 text-base mt-1" /></label>
          <label className="block mb-2"><span className="text-sm font-medium mb-1 block">Posee Sucursales</span><input type="checkbox" name="poseeSucursales" defaultChecked={emprendimiento.poseeSucursales || false} className="mr-2 mt-1" /></label>
          <label className="block mb-2"><span className="text-sm font-medium mb-1 block">Cantidad Sucursales</span><input type="number" name="cantidadSucursales" defaultValue={emprendimiento.cantidadSucursales || 0} className="input w-full px-3 py-2 text-base mt-1" /></label>
          <label className="block mb-2"><span className="text-sm font-medium mb-1 block">Ubicación Sucursales (separado por coma)</span><input name="ubicacionSucursales" defaultValue={Array.isArray(emprendimiento.ubicacionSucursales) ? emprendimiento.ubicacionSucursales.join(",") : ""} className="input w-full px-3 py-2 text-base mt-1" /></label>
          <label className="block mb-2"><span className="text-sm font-medium mb-1 block">Planea Abrir Sucursal</span><input type="checkbox" name="planeaAbrirSucursal" defaultChecked={emprendimiento.planeaAbrirSucursal || false} className="mr-2 mt-1" /></label>
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
        {missingFields.length > 0 && (
          <div className="text-red-500 mt-2">
            <b>Faltan completar o corregir los siguientes campos:</b>
            <ul className="list-disc ml-6">
              {missingFields.map((f, i) => (
                <li key={i}>{f}</li>
              ))}
            </ul>
          </div>
        )}
        {editError && <div className="text-red-500 mt-2">{editError}</div>}
        <div className="flex flex-col gap-2 mt-6 md:flex-row md:justify-end">
          <button type="submit" className="btn-primary w-full md:w-auto" disabled={editLoading}>{editLoading ? "Guardando..." : "Guardar Cambios"}</button>
        </div>
      </form>
    </div>
  );
};

export default EditEmprendimientoPage;
