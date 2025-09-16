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
    denominacion: '',
    fechaInicio: '',
    inscripcionArca: false, // SIEMPRE presente y por defecto false
    etapa: 'Idea',
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
    fotoPerfil: '', // URL de la imagen subida
  });
  const [file, setFile] = useState(null);
  const [emprendedores, setEmprendedores] = useState([]);

    const [busquedaEmp, setBusquedaEmp] = useState("");

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

    // Filtrar emprendedores por nombre/apellido
    const emprendedoresFiltrados = busquedaEmp.trim() === ""
      ? emprendedores
      : emprendedores.filter(emp =>
          (emp.nombre + " " + emp.apellido).toLowerCase().includes(busquedaEmp.toLowerCase())
        );
  const [ubicacion, setUbicacion] = useState({ lat: -28.47, lng: -65.77 });
  // Importar MapSelector dinámicamente para SSR
  const MapSelector = dynamic(() => import("../../../components/MapSelector"), { ssr: false });
  const [mapMsg, setMapMsg] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e) => {
    const { name, value, type, checked, files } = e.target;
    if (name === "fotoPerfil" && files && files[0]) {
      setFile(files[0]);
      return;
    }
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
    let fotoPerfilUrl = "";
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
          setError(uploadData.error || "Error al subir la imagen");
          setLoading(false);
          return;
        }
      } catch (err) {
        setError("Error de red al subir imagen: " + err.message);
        setLoading(false);
        return;
      }
    }
    try {
      // Solo enviar los campos obligatorios y los que tengan valor
      const camposObligatorios = ["emprendedorId", "denominacion", "etapa", "inscripcionArca"];
      const body = {};
      camposObligatorios.forEach((key) => {
        body[key] = form[key];
      });
      // Si hay foto de perfil, agregarla
      if (fotoPerfilUrl) body.fotoPerfil = fotoPerfilUrl;
      // Agregar solo los campos opcionales que tengan valor (no vacío, no null)
      Object.keys(form).forEach((key) => {
        if (!camposObligatorios.includes(key) && form[key] !== '' && form[key] != null) {
          body[key] = form[key];
        }
      });
      // Procesar arrays separando por coma solo si existen
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
        if (body[key] && typeof body[key] === "string") {
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
      <h2 className="text-xl font-bold mb-4">Nuevo Emprendimiento</h2>

      {/* Selector de emprendedor */}
        <p className="font-semibold">Buscar emprendedor por nombre o apellido <span className="text-red-500">*</span></p>
        <input
          type="text"
          value={busquedaEmp}
          onChange={e => setBusquedaEmp(e.target.value)}
          placeholder="Buscar emprendedor..."
          className="input w-full mb-2 border-red-500 border-2"
          required={!form.emprendedorId}
        />
        {busquedaEmp.trim() !== "" && (
          <ul className=" rounded bg-slate-700 max-h-48 overflow-y-auto mb-2">
            {emprendedoresFiltrados.map((emp) => (
              <li
                key={emp.id}
                className={`px-3 py-2 cursor-pointer hover:bg-blue-700 ${form.emprendedorId === emp.id ? 'bg-blue-700' : ''}`}
                onMouseDown={() => setForm(prev => ({ ...prev, emprendedorId: emp.id }))}
              >
                {emp.nombre} {emp.apellido} (ID: {emp.id})
              </li>
            ))}
            {emprendedoresFiltrados.length === 0 && (
              <li className="px-3 py-2 text-gray-400">No se encontraron emprendedores</li>
            )}
          </ul>
        )}
        {form.emprendedorId && (
          <div className="mb-2 text-sm text-green-700">Seleccionado: {(() => {
            const emp = emprendedores.find(e => e.id === form.emprendedorId);
            return emp ? `${emp.nombre} ${emp.apellido} (ID: ${emp.id})` : form.emprendedorId;
          })()}</div>
        )}
      {/* <p>ID Emprendedor</p> */}
      {/* <input name="emprendedorId" value={form.emprendedorId} onChange={handleChange} placeholder="ID Emprendedor" className="input w-full" /> */}
      <p className="font-semibold">Denominación <span className="text-red-500">*</span></p>
      <input name="denominacion" value={form.denominacion} onChange={handleChange} placeholder="Denominación" className="input w-full border-red-500 border-2" required />
      <p>Fecha Inicio </p>
      <input type="date" name="fechaInicio" value={form.fechaInicio} onChange={handleChange} className="input w-full" />
      <label><input type="checkbox" name="inscripcionArca" checked={form.inscripcionArca} onChange={handleChange} className="mt-4" /> ¿Inscripto en Arca? </label>
      <p>CUIT</p>
      <input name="cuit" value={form.cuit} onChange={handleChange} placeholder="CUIT" className="input w-full" />
      <p>Sector </p>
      <select name="sector" value={form.sector} onChange={handleChange} className="input w-full">
        <option value="">Selecciona sector </option>
        {sectorOptions.map((opt) => (
          <option key={opt} value={opt}>{opt}</option>
        ))}
      </select>
      <p>Actividad Principal </p>
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
      <p>Web (opcional)</p>
      <input name="web" value={form.web} onChange={handleChange} placeholder="Web" className="input w-full" />
      <p>Red Social 1 (opcional)</p>
      <input name="redSocial1" value={form.redSocial1} onChange={handleChange} placeholder="Red Social 1" className="input w-full" />
      <p>Red Social 2 (opcional)</p>
      <input name="redSocial2" value={form.redSocial2} onChange={handleChange} placeholder="Red Social 2" className="input w-full" />
      <label><input type="checkbox" name="tienePersonal" checked={form.tienePersonal} onChange={handleChange} className="mt-4"/> ¿Tiene Personal? </label>
      <p>Cantidad Personal (opcional)</p>
      <input type="number" name="cantidadPersonal" value={form.cantidadPersonal} onChange={handleChange} placeholder="Cantidad Personal" className="input w-full" />
      <p>Modo Incorporación Personal (opcional)</p>
      <input name="modoIncorporacionPersonal" value={form.modoIncorporacionPersonal} onChange={handleChange} placeholder="Modo Incorporación Personal (separado por coma)" className="input w-full" />
      <p>¿Planea Incorporar Personal? (opcional)</p>
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
      <label><input type="checkbox" name="requiereCapacitacion" checked={form.requiereCapacitacion} onChange={handleChange} className="mt-4" /> Requiere Capacitacion</label>
      <p>Tipos Capacitacion (opcional)</p>
      <input name="tiposCapacitacion" value={form.tiposCapacitacion} onChange={handleChange} placeholder="Tipos Capacitacion (separado por coma)" className="input w-full" />
      <p>Otros Tipos Capacitacion (opcional)</p>
      <input name="otrosTiposCapacitacion" value={form.otrosTiposCapacitacion} onChange={handleChange} placeholder="Otros Tipos Capacitacion" className="input w-full" />
      <label><input type="checkbox" name="requiereConsultoria" checked={form.requiereConsultoria} onChange={handleChange} className="mt-4" /> Requiere Consultoria</label>
      <p>Tipos Consultoria (opcional)</p>
      <input name="tiposConsultoria" value={form.tiposConsultoria} onChange={handleChange} placeholder="Tipos Consultoria (separado por coma)" className="input w-full" />
      <p>Otros Tipos Consultoria (opcional)</p>
      <input name="otrosTiposConsultoria" value={form.otrosTiposConsultoria} onChange={handleChange} placeholder="Otros Tipos Consultoria" className="input w-full" />
      <label><input type="checkbox" name="requiereHerramientasTecno" checked={form.requiereHerramientasTecno} onChange={handleChange} className="mt-4" /> Requiere Herramientas Tecno</label>
      <p>Tipos Herramientas Tecno (opcional)</p>
      <input name="tiposHerramientasTecno" value={form.tiposHerramientasTecno} onChange={handleChange} placeholder="Tipos Herramientas Tecno (separado por coma)" className="input w-full" />
      <p>Otras Herramientas Tecno (opcional)</p>
      <input name="otrasHerramientasTecno" value={form.otrasHerramientasTecno} onChange={handleChange} placeholder="Otras Herramientas Tecno" className="input w-full" />
      <label><input type="checkbox" name="usaRedesSociales" checked={form.usaRedesSociales} onChange={handleChange} className="mt-4" /> Usa Redes Sociales</label>
      <input name="tiposRedesSociales" value={form.tiposRedesSociales} onChange={handleChange} placeholder="Tipos Redes Sociales (separado por coma)" className="input w-full" />
      <label><input type="checkbox" name="usaMediosPagoElectronicos" checked={form.usaMediosPagoElectronicos} onChange={handleChange} className="mt-4" /> Usa Medios Pago Electrónicos</label>
      <p>Canales Comercialización (opcional)</p>
      <input name="canalesComercializacion" value={form.canalesComercializacion} onChange={handleChange} placeholder="Canales Comercialización (separado por coma)" className="input w-full" />
      <p>Otros Canales Comercialización (opcional)</p>
      <input name="otrosCanalesComercializacion" value={form.otrosCanalesComercializacion} onChange={handleChange} placeholder="Otros Canales Comercialización" className="input w-full" />
      <label><input type="checkbox" name="poseeSucursales" checked={form.poseeSucursales} onChange={handleChange} className="mt-4" /> Posee Sucursales</label>
      <p>Cantidad Sucursales (opcional)</p>
      <input type="number" name="cantidadSucursales" value={form.cantidadSucursales} onChange={handleChange} placeholder="Cantidad Sucursales" className="input w-full" />
      <p>Ubicación Sucursales (opcional)</p>
      <input name="ubicacionSucursales" value={form.ubicacionSucursales} onChange={handleChange} placeholder="Ubicación Sucursales (separado por coma)" className="input w-full" />
      <label><input type="checkbox" name="planeaAbrirSucursal" checked={form.planeaAbrirSucursal} onChange={handleChange} className="mt-4" /> Planea Abrir Sucursal</label>
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
      {/* Imagen de perfil */}
      <div className="flex flex-col gap-1 mb-2">
        <label htmlFor="fotoPerfil" className="text-xs text-gray-500">Foto de perfil (opcional)</label>
        <input id="fotoPerfil" name="fotoPerfil" type="file" accept="image/*" onChange={handleChange} className="w-full p-2 text-sm border border-gray-300 rounded" />
      </div>
      <button type="submit" className="btn-primary w-full" disabled={loading}>
        {loading ? "Creando..." : "Crear"}
      </button>
      {error && <div className="text-red-500 mt-2">{error}</div>}
    </form>
  );
}

export default NuevoEmprendimientoPage;



//////////////////////codigo anterior
// "use client";
// import React, { useEffect, useState } from "react";
// import { useRouter } from "next/navigation";
// import dynamic from "next/dynamic";
// import { useAuth } from "../../../context/AuthContext";

// const MapContainer = dynamic(() => import("react-leaflet").then(mod => mod.MapContainer), { ssr: false });
// const TileLayer = dynamic(() => import("react-leaflet").then(mod => mod.TileLayer), { ssr: false });
// const Marker = dynamic(() => import("react-leaflet").then(mod => mod.Marker), { ssr: false });
// const Popup = dynamic(() => import("react-leaflet").then(mod => mod.Popup), { ssr: false });

// function NuevoEmprendimientoPage() {
//   const { user } = useAuth();
//   const router = useRouter();
//   const [form, setForm] = useState({
//     emprendedorId: '',
//     etapa: '',
//     denominacion: '',
//     fechaInicio: '',
//     inscripcionArca: false,
//     cuit: '',
//     sector: '',
//     actividadPrincipal: '',
//     tipoEmprendimiento: '',
//     direccion: '',
//     telefono: '',
//     email: '',
//     web: '',
//     redSocial1: '',
//     redSocial2: '',
//     tienePersonal: false,
//     cantidadPersonal: '',
//     modoIncorporacionPersonal: '',
//     planeaIncorporarPersonal: '',
//     percepcionPlantaPersonal: '',
//     requiereCapacitacion: false,
//     tiposCapacitacion: '',
//     otrosTiposCapacitacion: '',
//     requiereConsultoria: false,
//     tiposConsultoria: '',
//     otrosTiposConsultoria: '',
//     requiereHerramientasTecno: false,
//     tiposHerramientasTecno: '',
//     otrasHerramientasTecno: '',
//     usaRedesSociales: false,
//     tiposRedesSociales: '',
//     usaMediosPagoElectronicos: false,
//     canalesComercializacion: '',
//     otrosCanalesComercializacion: '',
//     poseeSucursales: false,
//     cantidadSucursales: '',
//     ubicacionSucursales: '',
//     planeaAbrirSucursal: false,
//     fotoPerfil: '', // URL de la imagen subida
//   });
//   const [file, setFile] = useState(null);
//   const [emprendedores, setEmprendedores] = useState([]);

//     const [busquedaEmp, setBusquedaEmp] = useState("");

//   // Obtener lista de emprendedores para el select
//   useEffect(() => {
//     const fetchEmprendedores = async () => {
//       try {
//         const res = await fetch("/api/emprendedores");
//         const data = await res.json();
//         setEmprendedores(data);
//       } catch (err) {
//         setEmprendedores([]);
//       }
//     };
//     fetchEmprendedores();
//   }, []);

//     // Filtrar emprendedores por nombre/apellido
//     const emprendedoresFiltrados = busquedaEmp.trim() === ""
//       ? emprendedores
//       : emprendedores.filter(emp =>
//           (emp.nombre + " " + emp.apellido).toLowerCase().includes(busquedaEmp.toLowerCase())
//         );
//   const [ubicacion, setUbicacion] = useState({ lat: -34.61, lng: -58.38 });
//   // Importar MapSelector dinámicamente para SSR
//   const MapSelector = dynamic(() => import("../../../components/MapSelector"), { ssr: false });
//   const [mapMsg, setMapMsg] = useState("");
//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState("");

//   const handleChange = (e) => {
//     const { name, value, type, checked, files } = e.target;
//     if (name === "fotoPerfil" && files && files[0]) {
//       setFile(files[0]);
//       return;
//     }
//     setForm((prev) => ({
//       ...prev,
//       [name]: type === "checkbox" ? checked : value,
//     }));
//   };
//   // Eliminar el efecto que forzaba el emprendedorId del usuario

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     setLoading(true);
//     setError("");
//     let fotoPerfilUrl = "";
//     if (file) {
//       const formData = new FormData();
//       formData.append("file", file);
//       try {
//         const uploadRes = await fetch("/api/upload", {
//           method: "POST",
//           body: formData,
//         });
//         const uploadData = await uploadRes.json();
//         if (uploadRes.ok && uploadData.url) {
//           fotoPerfilUrl = uploadData.url;
//         } else {
//           setError(uploadData.error || "Error al subir la imagen");
//           setLoading(false);
//           return;
//         }
//       } catch (err) {
//         setError("Error de red al subir imagen: " + err.message);
//         setLoading(false);
//         return;
//       }
//     }
//     try {
//       // Procesar arrays separando por coma
//       const body = { ...form, fotoPerfil: fotoPerfilUrl };
//       const arrayFields = [
//         "modoIncorporacionPersonal",
//         "tiposCapacitacion",
//         "tiposConsultoria",
//         "tiposHerramientasTecno",
//         "tiposRedesSociales",
//         "canalesComercializacion",
//         "ubicacionSucursales",
//       ];

//       arrayFields.forEach((key) => {
//         if (!body[key] || (Array.isArray(body[key]) && body[key].length === 0)) {
//           body[key] = [];
//         } else if (typeof body[key] === "string") {
//           body[key] = body[key].split(",").map((v) => v.trim()).filter(Boolean);
//         }
//       });
      
//       if (ubicacion && ubicacion.lat && ubicacion.lng) {
//         body.ubicacion = { lat: ubicacion.lat, lng: ubicacion.lng };
//       }
//       if (body.fechaInicio) {
//         body.fechaInicio = new Date(body.fechaInicio).toISOString();
//       }
//       // Asegurar que emprendedorId sea número
//       if (body.emprendedorId) {
//         body.emprendedorId = Number(body.emprendedorId);
//       }
//       const res = await fetch("/api/emprendimientos", {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify(body),
//       });
//       const data = await res.json();
//       if (res.ok) {
//         router.push("/emprendimientos");
//       } else {
//         setError(data.error || "Error al crear");
//       }
//     } catch (err) {
//       setError("Error de red");
//     }
//     setLoading(false);
//   };

//   // Opciones enums
//   const etapaOptions = ["Idea", "EnMarcha", "Consolidado"];
//   const sectorOptions = ["ProduccionElaboracion", "Comercio", "Servicios"];
//   const tipoEmprendimientoOptions = ["Individual", "Asociativo", "Familiar", "Cooperativo"];
//   const actividadPrincipalOptions = [
//     "Produccion_Alimentos_Artesanal",
//     "Produccion_Alimentos_Industrial",
//     "Produccion_Articulos_Hogar",
//     "Produccion_Indumentaria",
//     "Produccion_Quimicos_Hogar",
//     "Produccion_Belleza",
//     "Produccion_Grafica",
//     "Produccion_Vivero",
//     "Produccion_Otro",
//     "Comercio_Indumentaria",
//     "Comercio_Alimentos",
//     "Comercio_Articulos_Hogar",
//     "Comercio_Libreria",
//     "Comercio_Informatica",
//     "Comercio_Belleza",
//     "Comercio_Mascotas",
//     "Comercio_Regional",
//     "Comercio_Construccion",
//     "Comercio_Vivero",
//     "Comercio_Otro",
//     "Servicio_Profesionales",
//     "Servicio_Salud",
//     "Servicio_Educativos",
//     "Servicio_Turisticos",
//     "Servicio_Reparacion_Electro",
//     "Servicio_Reparacion_Vehiculos",
//     "Servicio_Construccion",
//     "Servicio_Gastronomicos",
//     "Servicio_Otro"
//   ];
//   const planeaIncorporarOptions = ["Si", "No", "NoLoSabe"];
//   const percepcionPlantaOptions = ["Adecuada", "Mayor", "Menor", "NoLoSabe"];


//   if (!user) {
//     return <div className="text-center py-8">Cargando usuario...</div>;
//   }

//   return (
//     <form onSubmit={handleSubmit} className="max-w-6xl mx-auto p-6 space-y-4">
//       <h2 className="text-xl font-bold mb-4">Nuevo Emprendimiento</h2>

//       {/* Selector de emprendedor */}
//         <p>Buscar emprendedor por nombre o apellido</p>
//         <input
//           type="text"
//           value={busquedaEmp}
//           onChange={e => setBusquedaEmp(e.target.value)}
//           placeholder="Buscar emprendedor..."
//           className="input w-full mb-2"
//         />
//         {busquedaEmp.trim() !== "" && (
//           <ul className=" rounded bg-slate-700 max-h-48 overflow-y-auto mb-2">
//             {emprendedoresFiltrados.map((emp) => (
//               <li
//                 key={emp.id}
//                 className={`px-3 py-2 cursor-pointer hover:bg-blue-700 ${form.emprendedorId === emp.id ? 'bg-blue-700' : ''}`}
//                 onMouseDown={() => setForm(prev => ({ ...prev, emprendedorId: emp.id }))}
//               >
//                 {emp.nombre} {emp.apellido} (ID: {emp.id})
//               </li>
//             ))}
//             {emprendedoresFiltrados.length === 0 && (
//               <li className="px-3 py-2 text-gray-400">No se encontraron emprendedores</li>
//             )}
//           </ul>
//         )}
//         {form.emprendedorId && (
//           <div className="mb-2 text-sm text-green-700">Seleccionado: {(() => {
//             const emp = emprendedores.find(e => e.id === form.emprendedorId);
//             return emp ? `${emp.nombre} ${emp.apellido} (ID: ${emp.id})` : form.emprendedorId;
//           })()}</div>
//         )}
//       {/* <p>ID Emprendedor</p> */}
//       {/* <input name="emprendedorId" value={form.emprendedorId} onChange={handleChange} placeholder="ID Emprendedor" className="input w-full" /> */}
//       <p>Etapa de el Emprendimiento</p>
//       <select name="etapa" value={form.etapa} onChange={handleChange} className="input w-full">
//         <option value="">Selecciona la etapa de el Emprendimiento</option>
//         {etapaOptions.map((opt) => (
//           <option key={opt} value={opt}>{opt}</option>
//         ))}
//       </select>
//       <p>Denominación</p>
//       <input name="denominacion" value={form.denominacion} onChange={handleChange} placeholder="Denominación" className="input w-full" />
//       <p>Fecha Inicio </p>
//       <input type="date" name="fechaInicio" value={form.fechaInicio} onChange={handleChange} className="input w-full" />
//       <label><input type="checkbox" name="inscripcionArca" checked={form.inscripcionArca} onChange={handleChange} className="mt-4" /> ¿Inscripto en Arca? </label>
//       <p>CUIT</p>
//       <input name="cuit" value={form.cuit} onChange={handleChange} placeholder="CUIT" className="input w-full" />
//       <p>Sector </p>
//       <select name="sector" value={form.sector} onChange={handleChange} className="input w-full">
//         <option value="">Selecciona sector </option>
//         {sectorOptions.map((opt) => (
//           <option key={opt} value={opt}>{opt}</option>
//         ))}
//       </select>
//       <p>Actividad Principal </p>
//       <select name="actividadPrincipal" value={form.actividadPrincipal} onChange={handleChange} className="input w-full">
//         <option value="">Selecciona actividad</option>
//         {actividadPrincipalOptions.map((opt) => (
//           <option key={opt} value={opt}>{opt}</option>
//         ))}
//       </select>
//       <p>Tipo Emprendimiento</p>
//       <select name="tipoEmprendimiento" value={form.tipoEmprendimiento} onChange={handleChange} className="input w-full">
//         <option value="">Selecciona tipo</option>
//         {tipoEmprendimientoOptions.map((opt) => (
//           <option key={opt} value={opt}>{opt}</option>
//         ))}
//       </select>
//       <p>Dirección</p>
//       <input name="direccion" value={form.direccion} onChange={handleChange} placeholder="Dirección" className="input w-full" />
//       <p>Teléfono</p>
//       <input name="telefono" value={form.telefono} onChange={handleChange} placeholder="Teléfono" className="input w-full" />
//       <p>Email</p>
//       <input name="email" value={form.email} onChange={handleChange} placeholder="Email" className="input w-full" />
//       <p>Web (opcional)</p>
//       <input name="web" value={form.web} onChange={handleChange} placeholder="Web" className="input w-full" />
//       <p>Red Social 1 (opcional)</p>
//       <input name="redSocial1" value={form.redSocial1} onChange={handleChange} placeholder="Red Social 1" className="input w-full" />
//       <p>Red Social 2 (opcional)</p>
//       <input name="redSocial2" value={form.redSocial2} onChange={handleChange} placeholder="Red Social 2" className="input w-full" />
//       <label><input type="checkbox" name="tienePersonal" checked={form.tienePersonal} onChange={handleChange} className="mt-4"/> ¿Tiene Personal? </label>
//       <p>Cantidad Personal (opcional)</p>
//       <input type="number" name="cantidadPersonal" value={form.cantidadPersonal} onChange={handleChange} placeholder="Cantidad Personal" className="input w-full" />
//       <p>Modo Incorporación Personal (opcional)</p>
//       <input name="modoIncorporacionPersonal" value={form.modoIncorporacionPersonal} onChange={handleChange} placeholder="Modo Incorporación Personal (separado por coma)" className="input w-full" />
//       <p>¿Planea Incorporar Personal? (opcional)</p>
//       <select name="planeaIncorporarPersonal" value={form.planeaIncorporarPersonal} onChange={handleChange} className="input w-full">
//         <option value="">Selecciona opción</option>
//         {planeaIncorporarOptions.map((opt) => (
//           <option key={opt} value={opt}>{opt}</option>
//         ))}
//       </select>
//       <p>Percepción Planta Personal</p>
//       <select name="percepcionPlantaPersonal" value={form.percepcionPlantaPersonal} onChange={handleChange} className="input w-full">
//         <option value="">Selecciona opción</option>
//         {percepcionPlantaOptions.map((opt) => (
//           <option key={opt} value={opt}>{opt}</option>
//         ))}
//       </select>
//       <label><input type="checkbox" name="requiereCapacitacion" checked={form.requiereCapacitacion} onChange={handleChange} className="mt-4" /> Requiere Capacitacion</label>
//       <p>Tipos Capacitacion (opcional)</p>
//       <input name="tiposCapacitacion" value={form.tiposCapacitacion} onChange={handleChange} placeholder="Tipos Capacitacion (separado por coma)" className="input w-full" />
//       <p>Otros Tipos Capacitacion (opcional)</p>
//       <input name="otrosTiposCapacitacion" value={form.otrosTiposCapacitacion} onChange={handleChange} placeholder="Otros Tipos Capacitacion" className="input w-full" />
//       <label><input type="checkbox" name="requiereConsultoria" checked={form.requiereConsultoria} onChange={handleChange} className="mt-4" /> Requiere Consultoria</label>
//       <p>Tipos Consultoria (opcional)</p>
//       <input name="tiposConsultoria" value={form.tiposConsultoria} onChange={handleChange} placeholder="Tipos Consultoria (separado por coma)" className="input w-full" />
//       <p>Otros Tipos Consultoria (opcional)</p>
//       <input name="otrosTiposConsultoria" value={form.otrosTiposConsultoria} onChange={handleChange} placeholder="Otros Tipos Consultoria" className="input w-full" />
//       <label><input type="checkbox" name="requiereHerramientasTecno" checked={form.requiereHerramientasTecno} onChange={handleChange} className="mt-4" /> Requiere Herramientas Tecno</label>
//       <p>Tipos Herramientas Tecno (opcional)</p>
//       <input name="tiposHerramientasTecno" value={form.tiposHerramientasTecno} onChange={handleChange} placeholder="Tipos Herramientas Tecno (separado por coma)" className="input w-full" />
//       <p>Otras Herramientas Tecno (opcional)</p>
//       <input name="otrasHerramientasTecno" value={form.otrasHerramientasTecno} onChange={handleChange} placeholder="Otras Herramientas Tecno" className="input w-full" />
//       <label><input type="checkbox" name="usaRedesSociales" checked={form.usaRedesSociales} onChange={handleChange} className="mt-4" /> Usa Redes Sociales</label>
//       <input name="tiposRedesSociales" value={form.tiposRedesSociales} onChange={handleChange} placeholder="Tipos Redes Sociales (separado por coma)" className="input w-full" />
//       <label><input type="checkbox" name="usaMediosPagoElectronicos" checked={form.usaMediosPagoElectronicos} onChange={handleChange} className="mt-4" /> Usa Medios Pago Electrónicos</label>
//       <p>Canales Comercialización (opcional)</p>
//       <input name="canalesComercializacion" value={form.canalesComercializacion} onChange={handleChange} placeholder="Canales Comercialización (separado por coma)" className="input w-full" />
//       <p>Otros Canales Comercialización (opcional)</p>
//       <input name="otrosCanalesComercializacion" value={form.otrosCanalesComercializacion} onChange={handleChange} placeholder="Otros Canales Comercialización" className="input w-full" />
//       <label><input type="checkbox" name="poseeSucursales" checked={form.poseeSucursales} onChange={handleChange} className="mt-4" /> Posee Sucursales</label>
//       <p>Cantidad Sucursales (opcional)</p>
//       <input type="number" name="cantidadSucursales" value={form.cantidadSucursales} onChange={handleChange} placeholder="Cantidad Sucursales" className="input w-full" />
//       <p>Ubicación Sucursales (opcional)</p>
//       <input name="ubicacionSucursales" value={form.ubicacionSucursales} onChange={handleChange} placeholder="Ubicación Sucursales (separado por coma)" className="input w-full" />
//       <label><input type="checkbox" name="planeaAbrirSucursal" checked={form.planeaAbrirSucursal} onChange={handleChange} className="mt-4" /> Planea Abrir Sucursal</label>
//       {/* Mapa para seleccionar ubicación */}
//       <div className="mt-4">
//         <span className="text-sm font-medium mb-2 block">Selecciona la ubicación en el mapa</span>
//         <div className="h-64 rounded-lg overflow-hidden bg-gray-100 flex items-center justify-center">
//           <MapSelector ubicacion={ubicacion} onSelect={setUbicacion} />
//         </div>
//         <div className="mt-2 text-xs text-gray-500">
//           {ubicacion
//             ? <>Lat: {ubicacion.lat.toFixed(6)}, Lng: {ubicacion.lng.toFixed(6)}</>
//             : <>No hay ubicación seleccionada</>}
//         </div>
//       </div>
//       {/* Imagen de perfil */}
//       <div className="flex flex-col gap-1 mb-2">
//         <label htmlFor="fotoPerfil" className="text-xs text-gray-500">Foto de perfil (opcional)</label>
//         <input id="fotoPerfil" name="fotoPerfil" type="file" accept="image/*" onChange={handleChange} className="w-full p-2 text-sm border border-gray-300 rounded" />
//       </div>
//       <button type="submit" className="btn-primary w-full" disabled={loading}>
//         {loading ? "Creando..." : "Crear"}
//       </button>
//       {error && <div className="text-red-500 mt-2">{error}</div>}
//     </form>
//   );
// }

// export default NuevoEmprendimientoPage;
