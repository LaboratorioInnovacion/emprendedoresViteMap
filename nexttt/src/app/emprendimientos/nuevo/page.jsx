"use client";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import dynamic from "next/dynamic";
import { useAuth } from "../../../context/AuthContext";

const MapContainer = dynamic(() => import("react-leaflet").then(mod => mod.MapContainer), { ssr: false });
const TileLayer = dynamic(() => import("react-leaflet").then(mod => mod.TileLayer), { ssr: false });
const Marker = dynamic(() => import("react-leaflet").then(mod => mod.Marker), { ssr: false });
const Popup = dynamic(() => import("react-leaflet").then(mod => mod.Popup), { ssr: false });

function NuevoEmprendimientoPage() {
  const { user } = useAuth();
  const router = useRouter();
  const [form, setForm] = useState({
    emprendedorId: '',
    etapa: '',
    denominacion: '',
    fechaInicio: '',
    inscripcionArca: false,
    cuit: '',
    sector: '',
    actividadPrincipal: '',
    tipoEmprendimiento: '',
    direccion: '',
    telefono: '',
    email: '',
    web: '',
    redSocial1: '',
    redSocial2: '',
    tienePersonal: false,
    cantidadPersonal: '',
    modoIncorporacionPersonal: '',
    planeaIncorporarPersonal: '',
    percepcionPlantaPersonal: '',
    requiereCapacitacion: false,
    tiposCapacitacion: '',
    otrosTiposCapacitacion: '',
    requiereConsultoria: false,
    tiposConsultoria: '',
    otrosTiposConsultoria: '',
    requiereHerramientasTecno: false,
    tiposHerramientasTecno: '',
    otrasHerramientasTecno: '',
    usaRedesSociales: false,
    tiposRedesSociales: '',
    usaMediosPagoElectronicos: false,
    canalesComercializacion: '',
    otrosCanalesComercializacion: '',
    poseeSucursales: false,
    cantidadSucursales: '',
    ubicacionSucursales: '',
    planeaAbrirSucursal: false,
  });
  const [emprendedores, setEmprendedores] = useState([]);

  // Obtener lista de emprendedores para el select
  useEffect(() => {
    const fetchEmprendedores = async () => {
      try {
        const res = await fetch("/api/emprendedores");
        const data = await res.json();
        setEmprendedores(data);
      } catch (err) {
        setEmprendedores([]);
      }
    };
    fetchEmprendedores();
  }, []);
  const [ubicacion, setUbicacion] = useState({ lat: -34.61, lng: -58.38 });
  // Importar MapSelector dinámicamente para SSR
  const MapSelector = dynamic(() => import("../../../components/MapSelector"), { ssr: false });
  const [mapMsg, setMapMsg] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };
  // Eliminar el efecto que forzaba el emprendedorId del usuario

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      // Procesar arrays separando por coma
      const body = { ...form };
      const arrayFields = [
        "modoIncorporacionPersonal",
        "tiposCapacitacion",
        "tiposConsultoria",
        "tiposHerramientasTecno",
        "tiposRedesSociales",
        "canalesComercializacion",
        "ubicacionSucursales",
      ];

      arrayFields.forEach((key) => {
        if (!body[key] || (Array.isArray(body[key]) && body[key].length === 0)) {
          body[key] = [];
        } else if (typeof body[key] === "string") {
          body[key] = body[key].split(",").map((v) => v.trim()).filter(Boolean);
        }
      });
      
      if (ubicacion && ubicacion.lat && ubicacion.lng) {
        body.ubicacion = { lat: ubicacion.lat, lng: ubicacion.lng };
      }
      if (body.fechaInicio) {
        body.fechaInicio = new Date(body.fechaInicio).toISOString();
      }
      // Asegurar que emprendedorId sea número
      if (body.emprendedorId) {
        body.emprendedorId = Number(body.emprendedorId);
      }
      const res = await fetch("/api/emprendimientos", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      const data = await res.json();
      if (res.ok) {
        router.push("/emprendimientos");
      } else {
        setError(data.error || "Error al crear");
      }
    } catch (err) {
      setError("Error de red");
    }
    setLoading(false);
  };

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


  if (!user) {
    return <div className="text-center py-8">Cargando usuario...</div>;
  }

  return (
    <form onSubmit={handleSubmit} className="max-w-6xl mx-auto p-6 space-y-4">
      {/* Selector de emprendedor */}
      <p>Emprendedor</p>
      <select
        name="emprendedorId"
        value={form.emprendedorId}
        onChange={handleChange}
        className="input w-full"
        required
      >
        <option value="">Selecciona un emprendedor</option>
        {emprendedores.map((emp) => (
          <option key={emp.id} value={emp.id}>
            {emp.nombre} {emp.apellido} (ID: {emp.id})
          </option>
        ))}
      </select>
      <h2 className="text-xl font-bold mb-4">Nuevo Emprendimiento</h2>
      {/* <p>ID Emprendedor</p> */}
      {/* <input name="emprendedorId" value={form.emprendedorId} onChange={handleChange} placeholder="ID Emprendedor" className="input w-full" /> */}
      <p>Etapa</p>
      <select name="etapa" value={form.etapa} onChange={handleChange} className="input w-full">
        <option value="">Selecciona etapa</option>
        {etapaOptions.map((opt) => (
          <option key={opt} value={opt}>{opt}</option>
        ))}
      </select>
      <p>Denominación</p>
      <input name="denominacion" value={form.denominacion} onChange={handleChange} placeholder="Denominación" className="input w-full" />
      <p>Fecha Inicio</p>
      <input type="date" name="fechaInicio" value={form.fechaInicio} onChange={handleChange} className="input w-full" />
      <label><input type="checkbox" name="inscripcionArca" checked={form.inscripcionArca} onChange={handleChange} /> Inscripción Arca</label>
      <p>CUIT</p>
      <input name="cuit" value={form.cuit} onChange={handleChange} placeholder="CUIT" className="input w-full" />
      <p>Sector</p>
      <select name="sector" value={form.sector} onChange={handleChange} className="input w-full">
        <option value="">Selecciona sector</option>
        {sectorOptions.map((opt) => (
          <option key={opt} value={opt}>{opt}</option>
        ))}
      </select>
      <p>Actividad Principal</p>
      <select name="actividadPrincipal" value={form.actividadPrincipal} onChange={handleChange} className="input w-full">
        <option value="">Selecciona actividad</option>
        {actividadPrincipalOptions.map((opt) => (
          <option key={opt} value={opt}>{opt}</option>
        ))}
      </select>
      <p>Tipo Emprendimiento</p>
      <select name="tipoEmprendimiento" value={form.tipoEmprendimiento} onChange={handleChange} className="input w-full">
        <option value="">Selecciona tipo</option>
        {tipoEmprendimientoOptions.map((opt) => (
          <option key={opt} value={opt}>{opt}</option>
        ))}
      </select>
      <p>Dirección</p>
      <input name="direccion" value={form.direccion} onChange={handleChange} placeholder="Dirección" className="input w-full" />
      <p>Teléfono</p>
      <input name="telefono" value={form.telefono} onChange={handleChange} placeholder="Teléfono" className="input w-full" />
      <p>Email</p>
      <input name="email" value={form.email} onChange={handleChange} placeholder="Email" className="input w-full" />
      <p>Web</p>
      <input name="web" value={form.web} onChange={handleChange} placeholder="Web" className="input w-full" />
      <p>Red Social 1</p>
      <input name="redSocial1" value={form.redSocial1} onChange={handleChange} placeholder="Red Social 1" className="input w-full" />
      <p>Red Social 2</p>
      <input name="redSocial2" value={form.redSocial2} onChange={handleChange} placeholder="Red Social 2" className="input w-full" />
      <label><input type="checkbox" name="tienePersonal" checked={form.tienePersonal} onChange={handleChange} /> Tiene Personal</label>
      <p>Cantidad Personal</p>
      <input type="number" name="cantidadPersonal" value={form.cantidadPersonal} onChange={handleChange} placeholder="Cantidad Personal" className="input w-full" />
      <p>Modo Incorporación Personal</p>
      <input name="modoIncorporacionPersonal" value={form.modoIncorporacionPersonal} onChange={handleChange} placeholder="Modo Incorporación Personal (separado por coma)" className="input w-full" />
      <p>Planea Incorporar Personal</p>
      <select name="planeaIncorporarPersonal" value={form.planeaIncorporarPersonal} onChange={handleChange} className="input w-full">
        <option value="">Selecciona opción</option>
        {planeaIncorporarOptions.map((opt) => (
          <option key={opt} value={opt}>{opt}</option>
        ))}
      </select>
      <p>Percepción Planta Personal</p>
      <select name="percepcionPlantaPersonal" value={form.percepcionPlantaPersonal} onChange={handleChange} className="input w-full">
        <option value="">Selecciona opción</option>
        {percepcionPlantaOptions.map((opt) => (
          <option key={opt} value={opt}>{opt}</option>
        ))}
      </select>
      <label><input type="checkbox" name="requiereCapacitacion" checked={form.requiereCapacitacion} onChange={handleChange} /> Requiere Capacitacion</label>
      <p>Tipos Capacitacion</p>
      <input name="tiposCapacitacion" value={form.tiposCapacitacion} onChange={handleChange} placeholder="Tipos Capacitacion (separado por coma)" className="input w-full" />
      <p>Otros Tipos Capacitacion</p>
      <input name="otrosTiposCapacitacion" value={form.otrosTiposCapacitacion} onChange={handleChange} placeholder="Otros Tipos Capacitacion" className="input w-full" />
      <label><input type="checkbox" name="requiereConsultoria" checked={form.requiereConsultoria} onChange={handleChange} /> Requiere Consultoria</label>
      <p>Tipos Consultoria</p>
      <input name="tiposConsultoria" value={form.tiposConsultoria} onChange={handleChange} placeholder="Tipos Consultoria (separado por coma)" className="input w-full" />
      <p>Otros Tipos Consultoria</p>
      <input name="otrosTiposConsultoria" value={form.otrosTiposConsultoria} onChange={handleChange} placeholder="Otros Tipos Consultoria" className="input w-full" />
      <label><input type="checkbox" name="requiereHerramientasTecno" checked={form.requiereHerramientasTecno} onChange={handleChange} /> Requiere Herramientas Tecno</label>
      <p>Tipos Herramientas Tecno</p>
      <input name="tiposHerramientasTecno" value={form.tiposHerramientasTecno} onChange={handleChange} placeholder="Tipos Herramientas Tecno (separado por coma)" className="input w-full" />
      <p>Otras Herramientas Tecno</p>
      <input name="otrasHerramientasTecno" value={form.otrasHerramientasTecno} onChange={handleChange} placeholder="Otras Herramientas Tecno" className="input w-full" />
      <label><input type="checkbox" name="usaRedesSociales" checked={form.usaRedesSociales} onChange={handleChange} /> Usa Redes Sociales</label>
      <input name="tiposRedesSociales" value={form.tiposRedesSociales} onChange={handleChange} placeholder="Tipos Redes Sociales (separado por coma)" className="input w-full" />
      <label><input type="checkbox" name="usaMediosPagoElectronicos" checked={form.usaMediosPagoElectronicos} onChange={handleChange} /> Usa Medios Pago Electrónicos</label>
      <p>Canales Comercialización</p>
      <input name="canalesComercializacion" value={form.canalesComercializacion} onChange={handleChange} placeholder="Canales Comercialización (separado por coma)" className="input w-full" />
      <p>Otros Canales Comercialización</p>
      <input name="otrosCanalesComercializacion" value={form.otrosCanalesComercializacion} onChange={handleChange} placeholder="Otros Canales Comercialización" className="input w-full" />
      <label><input type="checkbox" name="poseeSucursales" checked={form.poseeSucursales} onChange={handleChange} /> Posee Sucursales</label>
      <p>Cantidad Sucursales</p>
      <input type="number" name="cantidadSucursales" value={form.cantidadSucursales} onChange={handleChange} placeholder="Cantidad Sucursales" className="input w-full" />
      <p>Ubicación Sucursales</p>
      <input name="ubicacionSucursales" value={form.ubicacionSucursales} onChange={handleChange} placeholder="Ubicación Sucursales (separado por coma)" className="input w-full" />
      <label><input type="checkbox" name="planeaAbrirSucursal" checked={form.planeaAbrirSucursal} onChange={handleChange} /> Planea Abrir Sucursal</label>
      {/* Mapa para seleccionar ubicación */}
      <div className="mt-4">
        <span className="text-sm font-medium mb-2 block">Selecciona la ubicación en el mapa</span>
        <div className="h-64 rounded-lg overflow-hidden bg-gray-100 flex items-center justify-center">
          <MapSelector ubicacion={ubicacion} onSelect={setUbicacion} />
        </div>
        <div className="mt-2 text-xs text-gray-500">
          {ubicacion
            ? <>Lat: {ubicacion.lat.toFixed(6)}, Lng: {ubicacion.lng.toFixed(6)}</>
            : <>No hay ubicación seleccionada</>}
        </div>
      </div>
      <button type="submit" className="btn-primary w-full" disabled={loading}>
        {loading ? "Creando..." : "Crear"}
      </button>
      {error && <div className="text-red-500 mt-2">{error}</div>}
    </form>
  );
}

export default NuevoEmprendimientoPage;
