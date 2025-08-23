"use client";
import { useSession } from "next-auth/react";
import { useEffect, useState, useRef } from "react";
import { driver } from "driver.js";
import "driver.js/dist/driver.css";
import { Activity, MapPin, UserCircle2 } from "lucide-react";
import PerfilForm from "../../components/profile/PerfilForm";
import EmprendimientoForm from "../../components/profile/EmprendimientoForm";
import EmprendimientosList from "../../components/profile/EmprendimientosList";
import BusinessMap from "../../components/map/BusinessMap";
import Link from "next/link";

// Función para obtener la clase de badge según el estado
const getStatusBadgeClass = (status) => {
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

function PerfilPage() {
  const { data: session, status } = useSession();
  // Estado para asignaciones
  const [asignaciones, setAsignaciones] = useState([]);

  useEffect(() => {
    if (!session || !session.user?.emprendedorId) return;
    fetch(`/api/emprendedores/${session.user.emprendedorId}`)
      .then((res) => res.json())
      .then((data) => {
        if (data && Array.isArray(data.asignaciones)) {
          setAsignaciones(data.asignaciones);
        }
      });
  }, [session?.user?.emprendedorId]);
  const perfilRef = useRef(null);
  // Tour de Driver.js para el perfil
  useEffect(() => {
    if (perfilRef.current && !localStorage.getItem("tour_perfil_done")) {
      const tour = driver({
        steps: [
          {
            element: perfilRef.current,
            popover: {
              title: "Completa tu perfil",
              description: "Aquí puedes editar tus datos personales y guardar los cambios.",
              position: "bottom"
            }
          }
        ],
        allowClose: false,
        doneBtnText: 'Entendido',
        nextBtnText: 'Siguiente',
        prevBtnText: 'Anterior',
        closeBtnText: 'Cerrar',
      });
      setTimeout(() => {
        tour.drive();
        localStorage.setItem("tour_perfil_done", "1");
      }, 800);
    }
  }, []);
  const [form, setForm] = useState(null);
  const [loading, setLoading] = useState(true);
  const [emprendimientos, setEmprendimientos] = useState([]);
  const [showEmprendimientoForm, setShowEmprendimientoForm] = useState(true);
  const [emprendimientoForm, setEmprendimientoForm] = useState({
    emprendedorId: undefined,
    etapa: "Idea",
    denominacion: "",
    fechaInicio: "", // formato YYYY-MM-DD
    inscripcionArca: false,
    cuit: "",
    sector: "ProduccionElaboracion",
    actividadPrincipal: "Produccion_Alimentos_Artesanal",
    tipoEmprendimiento: "Individual",
    direccion: "",
    ubicacion: { lat: -28.6037, lng: -65.3816 },
    telefono: "",
    email: "",
    web: "",
    redSocial1: "",
    redSocial2: "",
    tienePersonal: false,
    cantidadPersonal: 0,
    modoIncorporacionPersonal: [],
    planeaIncorporarPersonal: null,
    percepcionPlantaPersonal: null,
    requiereCapacitacion: false,
    tiposCapacitacion: [],
    otrosTiposCapacitacion: "",
    requiereConsultoria: false,
    tiposConsultoria: [],
    otrosTiposConsultoria: "",
    requiereHerramientasTecno: false,
    tiposHerramientasTecno: [],
    otrasHerramientasTecno: "",
    usaRedesSociales: false,
    tiposRedesSociales: [],
    usaMediosPagoElectronicos: false,
    canalesComercializacion: [],
    otrosCanalesComercializacion: "",
    poseeSucursales: false,
    cantidadSucursales: 0,
    ubicacionSucursales: [],
    planeaAbrirSucursal: false,
  });
  const [loadingEmprendimiento, setLoadingEmprendimiento] = useState(false);
  const [editEmprendimientoId, setEditEmprendimientoId] = useState(null);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  useEffect(() => {
    if (session?.user?.emprendedorId) {
      setLoading(true);
      fetch(`/api/emprendedores/${session.user.emprendedorId}`)
        .then((res) => res.json())
        .then((data) => {
          if (data.error) {
            setError(data.error);
            setForm({
              nombre: "",
              apellido: "",
              dni: "",
              cuil: "",
              fechaNacimiento: "",
              direccion: "",
              departamento: "",
              telefono: "",
              genero: "MASCULINO",
              nivelEstudios: "PRIMARIO",
              motivacionEmprender: "INDEPENDENCIA",
              tiposSustento: [],
              poseeOtrosSustentos: false,
              tieneDependientesEconomicos: false,
              ubicacion: null,
            });
          } else {
            setForm(data);
          }
          setLoading(false);
        })
        .catch((err) => {
          setError("Error de red: " + err.message);
          setLoading(false);
        });
    } else if (session) {
      // Si hay sesión pero no emprendedorId, dejar de cargar y mostrar mensaje
      setLoading(false);
    }
  }, [session]);

  useEffect(() => {
    if (session?.user?.emprendedorId) {
      fetch(`/api/emprendimientos?emprendedorId=${session.user.emprendedorId}`)
        .then((res) => res.json())
        .then((data) => {
          if (Array.isArray(data)) setEmprendimientos(data);
        })
        .catch((err) => setError("Error cargando emprendimientos: " + err.message));
    }
  }, [session, showEmprendimientoForm, loadingEmprendimiento]);

  // Adaptar el cambio para el campo ubicacion
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    if (name === "ubicacion") {
      // Solo permitir edición por el mapa, el input es solo display
      return;
    }
    setForm((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    const method = form?.id ? "PUT" : "POST";
    const url = form?.id ? `/api/emprendedores/${form.id}` : "/api/emprendedores";
    // Adaptar la ubicación para Prisma (Bytes) y convertir cantidadEmprendimientos a número
    const adaptedForm = {
      ...form,
      cantidadEmprendimientos: form.cantidadEmprendimientos !== undefined && form.cantidadEmprendimientos !== null && form.cantidadEmprendimientos !== ""
        ? Number(form.cantidadEmprendimientos)
        : null,
      ubicacion: form.ubicacion ? JSON.stringify(form.ubicacion) : null,
    };
    try {
      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(adaptedForm),
      });
      const data = await res.json();
      if (res.ok) {
        setSuccess("Perfil actualizado correctamente");
      } else {
        setError(data.error || "Error al actualizar el perfil");
      }
    } catch (err) {
      setError("Error de red: " + err.message);
    }
  };

  const handleEmprendimientoChange = (e) => {
    const { name, value, type, checked } = e.target;
    setEmprendimientoForm((prev) => {
      // Si el campo es modoIncorporacionPersonal y el input es select-multiple
      if (name === "modoIncorporacionPersonal" && e.target.multiple) {
        const selected = Array.from(e.target.selectedOptions).map((opt) => opt.value);
        return { ...prev, [name]: selected };
      }
      // Si el campo es modoIncorporacionPersonal y no es múltiple
      if (name === "modoIncorporacionPersonal") {
        return { ...prev, [name]: Array.isArray(value) ? value : [value] };
      }
      return {
        ...prev,
        [name]: type === "checkbox" ? checked : value,
      };
    });
  };

  const handleEditEmprendimiento = (emprendimiento) => {
    setShowEmprendimientoForm(true);
    setEditEmprendimientoId(emprendimiento.id);
    setEmprendimientoForm({ ...emprendimiento });
  };

  const handleDeleteEmprendimiento = async (id) => {
    if (!window.confirm('¿Seguro que deseas eliminar este emprendimiento?')) return;
    setError("");
    setSuccess("");
    try {
      const res = await fetch(`/api/emprendimientos?id=${id}`, {
        method: 'DELETE',
        credentials: 'include',
      });
      const data = await res.json();
      if (res.ok && data.ok) {
        setEmprendimientos((prev) => prev.filter((e) => e.id !== id));
        setSuccess('Emprendimiento eliminado correctamente');
      } else {
        setError(data.error || 'Error al eliminar el emprendimiento');
      }
    } catch (err) {
      setError('Error de red: ' + err.message);
    }
  };

  // Función para adaptar el formulario antes de enviar
  const adaptEmprendimientoForm = (form) => ({
    ...form,
    fechaInicio: form.fechaInicio ? new Date(form.fechaInicio) : null,
    ubicacion: form.ubicacion
      ? Buffer.from(JSON.stringify(form.ubicacion)).toString("base64")
      : null,
    cantidadPersonal: form.cantidadPersonal || 0,
    modoIncorporacionPersonal: Array.isArray(form.modoIncorporacionPersonal)
      ? form.modoIncorporacionPersonal
      : form.modoIncorporacionPersonal
        ? [form.modoIncorporacionPersonal]
        : [],
    tiposCapacitacion: form.tiposCapacitacion || [],
    tiposConsultoria: form.tiposConsultoria || [],
    tiposHerramientasTecno: form.tiposHerramientasTecno || [],
    tiposRedesSociales: form.tiposRedesSociales || [],
    canalesComercializacion: form.canalesComercializacion || [],
    ubicacionSucursales: form.ubicacionSucursales || [],
    cantidadSucursales: form.cantidadSucursales || 0,
  });

  const handleEmprendimientoSubmit = async (e) => {
    e.preventDefault();
    setLoadingEmprendimiento(true);
    setError("");
    setSuccess("");
    const method = editEmprendimientoId ? 'PUT' : 'POST';
    const url = editEmprendimientoId ? `/api/emprendimientos/${editEmprendimientoId}` : '/api/emprendimientos';
    const adaptedForm = adaptEmprendimientoForm(emprendimientoForm);
    try {
      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify(adaptedForm),
      });
      const data = await res.json();
      setLoadingEmprendimiento(false);
      if (res.ok) {
        setShowEmprendimientoForm(false);
        setEditEmprendimientoId(null);
        setEmprendimientoForm({
          emprendedorId: session?.user?.emprendedorId || 1,
          etapa: "Idea",
          denominacion: "",
          fechaInicio: "",
          inscripcionArca: false,
          cuit: "",
          sector: "ProduccionElaboracion",
          actividadPrincipal: "Produccion_Alimentos_Artesanal",
          tipoEmprendimiento: "Individual",
          direccion: "",
          ubicacion: { lat: -28.6037, lng: -65.3816 }, // Siempre valores numéricos
          telefono: "",
          email: "",
          web: "",
          redSocial1: "",
          redSocial2: "",
          tienePersonal: false,
          cantidadPersonal: 0,
          modoIncorporacionPersonal: [],
          planeaIncorporarPersonal: null,
          percepcionPlantaPersonal: null,
          requiereCapacitacion: false,
          tiposCapacitacion: [],
          otrosTiposCapacitacion: "",
          requiereConsultoria: false,
          tiposConsultoria: [],
          otrosTiposConsultoria: "",
          requiereHerramientasTecno: false,
          tiposHerramientasTecno: [],
          otrasHerramientasTecno: "",
          usaRedesSociales: false,
          tiposRedesSociales: [],
          usaMediosPagoElectronicos: false,
          canalesComercializacion: [],
          otrosCanalesComercializacion: "",
          poseeSucursales: false,
          cantidadSucursales: 0,
          ubicacionSucursales: [],
          planeaAbrirSucursal: false,
        });
        // Actualizar lista
        fetch(`/api/emprendimientos?emprendedorId=${session.user.emprendedorId}`)
          .then((res) => res.json())
          .then((data) => {
            if (Array.isArray(data)) setEmprendimientos(data);
          });
        setSuccess(editEmprendimientoId ? 'Emprendimiento actualizado correctamente' : 'Emprendimiento creado correctamente');
      } else {
        setError(data.error || 'Error al guardar el emprendimiento');
      }
    } catch (err) {
      setError('Error de red: ' + err.message);
      setLoadingEmprendimiento(false);
    }
  };

  if (status === "loading" || loading) return <div className="flex items-center justify-center min-h-screen"><span className="animate-spin h-8 w-8 mr-3 border-4 border-primary-600 border-t-transparent rounded-full"></span> <span>Cargando...</span></div>;
  if (!session) return <p className="text-center py-8 text-red-600">No estás logueado</p>;
  if (!form) return <p className="text-center py-8 text-red-600">No se pudo cargar el perfil</p>;

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 dark:bg-gray-900">
      <div className="w-full max-w-8xl p-4 sm:p-8 bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 flex flex-col gap-8">
  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Panel usuario compacto */}
          <div className="flex flex-col items-center justify-center gap-4 p-6 rounded-lg bg-gray-50 dark:bg-gray-900 shadow border border-gray-200 dark:border-gray-800">
            <img src={form.fotoDni || "/default-avatar.png"} alt="Avatar" className="h-16 w-16 rounded-full border border-gray-300 object-cover bg-white" />
            <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-100 text-center">{form.nombre} {form.apellido}</h2>
            <div className="flex flex-col gap-1 text-base text-gray-700 dark:text-gray-300 text-center">
              <span><b>Email:</b> {session.user.email}</span>
              <span><b>ID:</b> {session.user.id}</span>
              <span><b>Emprendedor ID:</b> {session.user.emprendedorId}</span>
              <span><b>Género:</b> {form.genero}</span>
              <span><b>País de Origen:</b> {form.paisOrigen || "-"}</span>
              <span><b>Ciudad de Origen:</b> {form.ciudadOrigen || "-"}</span>
              <span><b>Cantidad de Emprendimientos:</b> {form.cantidadEmprendimientos ?? "-"}</span>
              <span><b>Posee otros sustentos:</b> {form.poseeOtrosSustentos ? "Sí" : "No"}</span>
              <span><b>Tipos de Sustento:</b> {Array.isArray(form.tiposSustento) ? form.tiposSustento.join(", ") : "-"}</span>
              <span><b>Tiene dependientes económicos:</b> {form.tieneDependientesEconomicos ? "Sí" : "No"}</span>
            </div>
          </div>
          {/* Panel edición perfil mejorado */}
          <div className="flex flex-col gap-6 p-6 rounded-lg bg-white dark:bg-gray-800 shadow border border-gray-200 dark:border-gray-700 justify-center">
            <h3 ref={perfilRef} className="text-xl font-semibold text-primary-700 dark:text-primary-200 mb-2 text-center">{form.id ? "Editar" : "Crear"} perfil de emprendedor</h3>
            <form className="space-y-4" onSubmit={handleSubmit}>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 sm:gap-4">
                <div className="flex flex-col gap-1">
                  <label htmlFor="nombre" className="text-xs text-gray-500">Nombre</label>
                  <input id="nombre" className="w-full p-2 text-sm border border-gray-300 rounded dark:bg-gray-900 dark:border-gray-700" name="nombre" placeholder="Nombre" value={form.nombre || ""} onChange={handleChange} autoComplete="off" />
                </div>
                <div className="flex flex-col gap-1">
                  <label htmlFor="apellido" className="text-xs text-gray-500">Apellido</label>
                  <input id="apellido" className="w-full p-2 text-sm border border-gray-300 rounded dark:bg-gray-900 dark:border-gray-700" name="apellido" placeholder="Apellido" value={form.apellido || ""} onChange={handleChange} autoComplete="off" />
                </div>
                <div className="flex flex-col gap-1">
                  <label htmlFor="dni" className="text-xs text-gray-500">DNI</label>
                  <input id="dni" className="w-full p-2 text-sm border border-gray-300 rounded dark:bg-gray-900 dark:border-gray-700" name="dni" placeholder="DNI" value={form.dni || ""} onChange={handleChange} autoComplete="off" />
                </div>
                <div className="flex flex-col gap-1">
                  <label htmlFor="cuil" className="text-xs text-gray-500">CUIL/CUIT</label>
                  <input id="cuil" className="w-full p-2 text-sm border border-gray-300 rounded dark:bg-gray-900 dark:border-gray-700" name="cuil" placeholder="CUIL" value={form.cuil || ""} onChange={handleChange} autoComplete="off" />
                </div>
                <div className="flex flex-col gap-1">
                  <label htmlFor="fechaNacimiento" className="text-xs text-gray-500">Fecha de nacimiento</label>
                  <input id="fechaNacimiento" className="w-full p-2 text-sm border border-gray-300 rounded dark:bg-gray-900 dark:border-gray-700" name="fechaNacimiento" type="date" value={form.fechaNacimiento?.slice(0, 10) || ""} onChange={handleChange} />
                </div>
                <div className="flex flex-col gap-1">
                  <label htmlFor="genero" className="text-xs text-gray-500">Género</label>
                  <select
                    id="genero"
                    className="w-full p-2 text-sm border border-gray-300 rounded dark:bg-gray-900 dark:border-gray-700"
                    name="genero"
                    value={form.genero || ""}
                    onChange={handleChange}
                  >
                    <option value="">Selecciona...</option>
                    <option value="Masculino">Masculino</option>
                    <option value="Femenino">Femenino</option>
                    <option value="PrefieroNoDecir">Prefiero no decir</option>
                  </select>
                </div>
                <div className="flex flex-col gap-1">
                  <label htmlFor="paisOrigen" className="text-xs text-gray-500">País de origen</label>
                  <input id="paisOrigen" className="w-full p-2 text-sm border border-gray-300 rounded dark:bg-gray-900 dark:border-gray-700" name="paisOrigen" placeholder="País de origen" value={form.paisOrigen || ""} onChange={handleChange} autoComplete="off" />
                </div>
                <div className="flex flex-col gap-1">
                  <label htmlFor="ciudadOrigen" className="text-xs text-gray-500">Ciudad de origen</label>
                  <input id="ciudadOrigen" className="w-full p-2 text-sm border border-gray-300 rounded dark:bg-gray-900 dark:border-gray-700" name="ciudadOrigen" placeholder="Ciudad de origen" value={form.ciudadOrigen || ""} onChange={handleChange} autoComplete="off" />
                </div>
                <div className="flex flex-col gap-1">
                  <label htmlFor="nivelEstudios" className="text-xs text-gray-500">Nivel de estudios</label>
                  <select
                    id="nivelEstudios"
                    className="w-full p-2 text-sm border border-gray-300 rounded dark:bg-gray-900 dark:border-gray-700"
                    name="nivelEstudios"
                    value={form.nivelEstudios || ""}
                    onChange={handleChange}
                  >
                    <option value="">Selecciona...</option>
                    <option value="SinEscolarizar">Sin escolarizar</option>
                    <option value="PrimarioIncompleto">Primario incompleto</option>
                    <option value="PrimarioCompleto">Primario completo</option>
                    <option value="SecundarioIncompleto">Secundario incompleto</option>
                    <option value="SecundarioCompleto">Secundario completo</option>
                    <option value="TerciarioUniversitarioIncompleto">Terciario/Universitario incompleto</option>
                    <option value="TerciarioUniversitarioCompleto">Terciario/Universitario completo</option>
                    <option value="Posgrado">Posgrado</option>
                  </select>
                </div>
                <div className="flex flex-col gap-1">
                  <label htmlFor="motivacionEmprender" className="text-xs text-gray-500">Motivación para emprender</label>
                  <select
                    id="motivacionEmprender"
                    className="w-full p-2 text-sm border border-gray-300 rounded dark:bg-gray-900 dark:border-gray-700"
                    name="motivacionEmprender"
                    value={form.motivacionEmprender || ""}
                    onChange={handleChange}
                  >
                    <option value="">Selecciona...</option>
                    <option value="Pasion">Pasión</option>
                    <option value="Independencia">Independencia</option>
                    <option value="Oportunidad">Oportunidad</option>
                    <option value="NecesidadEconomica">Necesidad económica</option>
                    <option value="Otro">Otro</option>
                  </select>
                </div>
                <div className="flex flex-col gap-1">
                  <label htmlFor="departamento" className="text-xs text-gray-500">Departamento/localidad</label>
                  <input id="departamento" className="w-full p-2 text-sm border border-gray-300 rounded dark:bg-gray-900 dark:border-gray-700" name="departamento" placeholder="Departamento" value={form.departamento || ""} onChange={handleChange} autoComplete="off" />
                </div>
                <div className="flex flex-col gap-1">
                  <label htmlFor="cantidadEmprendimientos" className="text-xs text-gray-500">Cantidad de emprendimientos</label>
                  <input id="cantidadEmprendimientos" className="w-full p-2 text-sm border border-gray-300 rounded dark:bg-gray-900 dark:border-gray-700" name="cantidadEmprendimientos" type="number" min="0" value={form.cantidadEmprendimientos ?? ""} onChange={handleChange} />
                </div>
                <div className="flex items-center gap-2 mt-2">
                  <input type="checkbox" id="poseeOtrosSustentos" name="poseeOtrosSustentos" checked={!!form.poseeOtrosSustentos} onChange={handleChange} className="mr-2" />
                  <label htmlFor="poseeOtrosSustentos" className="text-xs text-gray-500">¿Posee otros sustentos?</label>
                  <span className="text-xs">{form.poseeOtrosSustentos ? "Sí" : "No"}</span>
                </div>
                <div className="flex flex-col gap-1 col-span-1 sm:col-span-2">
                  <label htmlFor="tiposSustento" className="text-xs text-gray-500">Tipos de sustento (separados por coma)</label>
                  <input id="tiposSustento" className="w-full p-2 text-sm border border-gray-300 rounded dark:bg-gray-900 dark:border-gray-700" name="tiposSustento" placeholder="Ej: Trabajo, Jubilación, Otro" value={Array.isArray(form.tiposSustento) ? form.tiposSustento.join(", ") : ""} onChange={e => setForm(prev => ({ ...prev, tiposSustento: e.target.value.split(",").map(s => s.trim()).filter(Boolean) }))} />
                </div>
                <div className="flex items-center gap-2 mt-2">
                  <input type="checkbox" id="tieneDependientesEconomicos" name="tieneDependientesEconomicos" checked={!!form.tieneDependientesEconomicos} onChange={handleChange} className="mr-2" />
                  <label htmlFor="tieneDependientesEconomicos" className="text-xs text-gray-500">¿Tiene dependientes económicos?</label>
                  <span className="text-xs">{form.tieneDependientesEconomicos ? "Sí" : "No"}</span>
                </div>
              </div>
              {/* Ubicación */}
              <div className="flex flex-col gap-2 mt-2">
                <label className="text-sm font-semibold text-primary-700 dark:text-primary-300">Ubicación</label>
                <input
                  className="w-full p-2 border border-primary-300 rounded dark:bg-gray-900 dark:border-primary-700 text-sm"
                  name="ubicacion"
                  placeholder="Latitud, Longitud"
                  value={form.ubicacion ? `${form.ubicacion.lat}, ${form.ubicacion.lng}` : ""}
                  readOnly
                />
                {typeof window !== "undefined" && (
                  <div className="h-96 rounded-lg overflow-hidden border border-primary-200 dark:border-primary-700 mt-2">
                    <div className="px-3 py-1 text-primary-700 dark:text-primary-200 font-semibold text-sm border-b border-primary-100 dark:border-primary-700 bg-primary-50 dark:bg-primary-900">Selecciona tu ubicación en el mapa</div>
                    <BusinessMap
                      emprendedores={[{
                        id: form.id || 0,
                        name: form.nombre || "Ubicación",
                        type: "Emprendedor",
                        address: form.direccion || "",
                        location: form.ubicacion || { lat: -34.6037, lng: -58.3816 },
                        imageUrl: form.fotoDni,
                        status: "active",
                        contact: {},
                        description: `Dirección: ${form.direccion || "No especificada"}\nCoordenadas: ${form.ubicacion ? `${form.ubicacion.lat}, ${form.ubicacion.lng}` : "-"}`,
                        createdAt: form.createdAt || null,
                        updatedAt: form.updatedAt || null,
                      }]}
                      defaultViewport={{ center: [form.ubicacion?.lat || -34.6037, form.ubicacion?.lng || -58.3816], zoom: 13 }}
                      selectionMode={true}
                      onLocationSelect={(lat, lng) => {
                        setForm((prev) => ({
                          ...prev,
                          ubicacion: { lat, lng },
                        }));
                      }}
                      markerIconColor="primary"
                      showMarker={true}
                      showPopup={true}
                    />
                  </div>
                )}
              </div>
              <button type="submit" className="w-full py-2 px-4 bg-primary-600 text-white rounded hover:bg-primary-700 transition-all duration-200 flex items-center justify-center shadow text-base font-semibold mt-2">
                {loading ? <span className="animate-spin h-5 w-5 mr-2 border-2 border-white border-t-transparent rounded-full"></span> : null}
                {form.id ? "Actualizar" : "Guardar"}
              </button>
            </form>
            {error && <div className="mt-4 p-2 bg-red-100 text-red-700 rounded text-center font-semibold shadow">{error}</div>}
            {success && <div className="mt-4 p-2 bg-green-100 text-green-700 rounded text-center font-semibold shadow">{success}</div>}
          </div>
        </div>
        {/* Panel asignaciones y herramientas */}
        <div className="mt-8">
          <h3 className="text-xl font-semibold text-primary-700 dark:text-primary-200 mb-4 flex items-center gap-2">Herramientas y asignaciones</h3>
          {asignaciones.length === 0 ? (
            <div className="text-gray-500 py-4 text-center">No tienes herramientas asignadas.</div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full rounded-lg text-sm border border-gray-200 dark:border-gray-700">
                <thead className="bg-gray-100 dark:bg-gray-800">
                  <tr>
                    <th className="px-2 py-2">Herramienta</th>
                    <th className="px-2 py-2">Tipo</th>
                    <th className="px-2 py-2">Monto</th>
                    <th className="px-2 py-2">Fecha asignación</th>
                    <th className="px-2 py-2">Observaciones</th>
                  </tr>
                </thead>
                <tbody>
                  {asignaciones.map((a) => (
                    <tr key={a.id} className="hover:bg-gray-50 dark:hover:bg-gray-900 transition-colors">
                      <td className="px-2 py-2">{a.herramienta?.nombre ?? '-'}</td>
                      <td className="px-2 py-2">{a.herramienta?.tipoHerramientaEmprendedor?.join(', ') ?? '-'}</td>
                      <td className="px-2 py-2">{a.herramienta?.montoPorBeneficiario ?? '-'}</td>
                      <td className="px-2 py-2">{a.fechaAsignacion ? new Date(a.fechaAsignacion).toLocaleDateString() : '-'}</td>
                      <td className="px-2 py-2">{a.observaciones ?? '-'}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Panel emprendimientos en tarjetas */}
        <div className="mt-8">
          <h3 className="text-xl font-semibold text-primary-700 dark:text-primary-200 mb-4 flex items-center gap-2"><Activity size={20} className="text-primary-600" /> Mis Emprendimientos</h3>
          {emprendimientos.length === 0 ? (
            <div className="text-gray-500 py-8 text-center">No tienes emprendimientos registrados.</div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {emprendimientos.map((emp) => (
                <div key={emp.id} className="bg-white dark:bg-gray-800 rounded-lg shadow hover:shadow-lg transition-all duration-200 p-4 flex flex-col gap-2 border border-gray-100 dark:border-gray-700">
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded-lg bg-primary-100 dark:bg-primary-900 flex items-center justify-center text-primary-600 dark:text-primary-400 text-lg font-bold">
                      {emp.nombre?.charAt(0) || emp.denominacion?.charAt(0) || "E"}
                    </div>
                    <div>
                      <span className="font-medium text-gray-800 dark:text-gray-200 text-base">{emp.nombre || emp.denominacion}</span>
                      <span className={`ml-2 px-2 py-1 rounded text-xs font-semibold ${getStatusBadgeClass(emp.estado)}`}>{emp.estado}</span>
                      <span className="ml-2 text-xs text-gray-500 dark:text-gray-400">{emp.rubro || emp.sector || "Sin rubro"}</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <MapPin size={16} className="text-primary-500 mr-1" />
                    <span className="text-xs text-gray-600 dark:text-gray-400">{emp.direccion || "Sin dirección"}</span>
                  </div>
                  <Link href={`/emprendimientos/${emp.id}`} className="text-primary-600 hover:underline font-medium text-sm mt-2">Ver detalles</Link>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default PerfilPage;



////////////////////////////////////////////////
// "use client";
// import { useSession } from "next-auth/react";
// import { useEffect, useState, useRef } from "react";
// import { driver } from "driver.js";
// import "driver.js/dist/driver.css";
// import { Activity, MapPin, UserCircle2 } from "lucide-react";
// import PerfilForm from "../../components/profile/PerfilForm";
// import EmprendimientoForm from "../../components/profile/EmprendimientoForm";
// import EmprendimientosList from "../../components/profile/EmprendimientosList";
// import BusinessMap from "../../components/map/BusinessMap";
// import Link from "next/link";

// // Función para obtener la clase de badge según el estado
// const getStatusBadgeClass = (status) => {
//   switch (status) {
//     case "active":
//       return "bg-success-100 text-success-700 dark:bg-success-900/30 dark:text-success-500";
//     case "inactive":
//       return "bg-error-100 text-error-700 dark:bg-error-900/30 dark:text-error-500";
//     case "pending":
//       return "bg-warning-100 text-warning-700 dark:bg-warning-900/30 dark:text-warning-500";
//     default:
//       return "bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300";
//   }
// };

// function PerfilPage() {
//   const perfilRef = useRef(null);
//   // Tour de Driver.js para el perfil
//   useEffect(() => {
//     if (perfilRef.current && !localStorage.getItem("tour_perfil_done")) {
//       const tour = driver({
//         steps: [
//           {
//             element: perfilRef.current,
//             popover: {
//               title: "Completa tu perfil",
//               description: "Aquí puedes editar tus datos personales y guardar los cambios.",
//               position: "bottom"
//             }
//           }
//         ],
//         allowClose: false,
//         doneBtnText: 'Entendido',
//         nextBtnText: 'Siguiente',
//         prevBtnText: 'Anterior',
//         closeBtnText: 'Cerrar',
//       });
//       setTimeout(() => {
//         tour.drive();
//         localStorage.setItem("tour_perfil_done", "1");
//       }, 800);
//     }
//   }, []);
//   const { data: session, status } = useSession();
//   const [form, setForm] = useState(null);
//   const [loading, setLoading] = useState(true);
//   const [emprendimientos, setEmprendimientos] = useState([]);
//   const [showEmprendimientoForm, setShowEmprendimientoForm] = useState(true);
//   const [emprendimientoForm, setEmprendimientoForm] = useState({
//     emprendedorId: session?.user?.emprendedorId || 1,
//     etapa: "Idea",
//     denominacion: "",
//     fechaInicio: "", // formato YYYY-MM-DD
//     inscripcionArca: false,
//     cuit: "",
//     sector: "ProduccionElaboracion",
//     actividadPrincipal: "Produccion_Alimentos_Artesanal",
//     tipoEmprendimiento: "Individual",
//     direccion: "",
//     ubicacion: { lat: -28.6037, lng: -65.3816 },
//     telefono: "",
//     email: "",
//     web: "",
//     redSocial1: "",
//     redSocial2: "",
//     tienePersonal: false,
//     cantidadPersonal: 0,
//     modoIncorporacionPersonal: [],
//     planeaIncorporarPersonal: null,
//     percepcionPlantaPersonal: null,
//     requiereCapacitacion: false,
//     tiposCapacitacion: [],
//     otrosTiposCapacitacion: "",
//     requiereConsultoria: false,
//     tiposConsultoria: [],
//     otrosTiposConsultoria: "",
//     requiereHerramientasTecno: false,
//     tiposHerramientasTecno: [],
//     otrasHerramientasTecno: "",
//     usaRedesSociales: false,
//     tiposRedesSociales: [],
//     usaMediosPagoElectronicos: false,
//     canalesComercializacion: [],
//     otrosCanalesComercializacion: "",
//     poseeSucursales: false,
//     cantidadSucursales: 0,
//     ubicacionSucursales: [],
//     planeaAbrirSucursal: false,
//   });
//   const [loadingEmprendimiento, setLoadingEmprendimiento] = useState(false);
//   const [editEmprendimientoId, setEditEmprendimientoId] = useState(null);
//   const [error, setError] = useState("");
//   const [success, setSuccess] = useState("");

//   useEffect(() => {
//     if (session?.user?.emprendedorId) {
//       setLoading(true);
//       fetch(`/api/emprendedores/${session.user.emprendedorId}`)
//         .then((res) => res.json())
//         .then((data) => {
//           if (data.error) {
//             setError(data.error);
//             setForm({
//               nombre: "",
//               apellido: "",
//               dni: "",
//               cuil: "",
//               fechaNacimiento: "",
//               direccion: "",
//               departamento: "",
//               telefono: "",
//               genero: "MASCULINO",
//               nivelEstudios: "PRIMARIO",
//               motivacionEmprender: "INDEPENDENCIA",
//               tiposSustento: [],
//               poseeOtrosSustentos: false,
//               tieneDependientesEconomicos: false,
//               ubicacion: null,
//             });
//           } else {
//             setForm(data);
//           }
//           setLoading(false);
//         })
//         .catch((err) => {
//           setError("Error de red: " + err.message);
//           setLoading(false);
//         });
//     } else if (session) {
//       // Si hay sesión pero no emprendedorId, dejar de cargar y mostrar mensaje
//       setLoading(false);
//     }
//   }, [session]);

//   useEffect(() => {
//     if (session?.user?.emprendedorId) {
//       fetch(`/api/emprendimientos?emprendedorId=${session.user.emprendedorId}`)
//         .then((res) => res.json())
//         .then((data) => {
//           if (Array.isArray(data)) setEmprendimientos(data);
//         })
//         .catch((err) => setError("Error cargando emprendimientos: " + err.message));
//     }
//   }, [session, showEmprendimientoForm, loadingEmprendimiento]);

//   // Adaptar el cambio para el campo ubicacion
//   const handleChange = (e) => {
//     const { name, value, type, checked } = e.target;
//     if (name === "ubicacion") {
//       // Solo permitir edición por el mapa, el input es solo display
//       return;
//     }
//     setForm((prev) => ({
//       ...prev,
//       [name]: type === "checkbox" ? checked : value,
//     }));
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     setError("");
//     setSuccess("");
//     const method = form?.id ? "PUT" : "POST";
//     const url = form?.id ? `/api/emprendedores/${form.id}` : "/api/emprendedores";
//     // Adaptar la ubicación para Prisma (Bytes) y convertir cantidadEmprendimientos a número
//     const adaptedForm = {
//       ...form,
//       cantidadEmprendimientos: form.cantidadEmprendimientos !== undefined && form.cantidadEmprendimientos !== null && form.cantidadEmprendimientos !== ""
//         ? Number(form.cantidadEmprendimientos)
//         : null,
//       ubicacion: form.ubicacion ? JSON.stringify(form.ubicacion) : null,
//     };
//     try {
//       const res = await fetch(url, {
//         method,
//         headers: { "Content-Type": "application/json" },
//         credentials: "include",
//         body: JSON.stringify(adaptedForm),
//       });
//       const data = await res.json();
//       if (res.ok) {
//         setSuccess("Perfil actualizado correctamente");
//       } else {
//         setError(data.error || "Error al actualizar el perfil");
//       }
//     } catch (err) {
//       setError("Error de red: " + err.message);
//     }
//   };

//   const handleEmprendimientoChange = (e) => {
//     const { name, value, type, checked } = e.target;
//     setEmprendimientoForm((prev) => {
//       // Si el campo es modoIncorporacionPersonal y el input es select-multiple
//       if (name === "modoIncorporacionPersonal" && e.target.multiple) {
//         const selected = Array.from(e.target.selectedOptions).map((opt) => opt.value);
//         return { ...prev, [name]: selected };
//       }
//       // Si el campo es modoIncorporacionPersonal y no es múltiple
//       if (name === "modoIncorporacionPersonal") {
//         return { ...prev, [name]: Array.isArray(value) ? value : [value] };
//       }
//       return {
//         ...prev,
//         [name]: type === "checkbox" ? checked : value,
//       };
//     });
//   };

//   const handleEditEmprendimiento = (emprendimiento) => {
//     setShowEmprendimientoForm(true);
//     setEditEmprendimientoId(emprendimiento.id);
//     setEmprendimientoForm({ ...emprendimiento });
//   };

//   const handleDeleteEmprendimiento = async (id) => {
//     if (!window.confirm('¿Seguro que deseas eliminar este emprendimiento?')) return;
//     setError("");
//     setSuccess("");
//     try {
//       const res = await fetch(`/api/emprendimientos?id=${id}`, {
//         method: 'DELETE',
//         credentials: 'include',
//       });
//       const data = await res.json();
//       if (res.ok && data.ok) {
//         setEmprendimientos((prev) => prev.filter((e) => e.id !== id));
//         setSuccess('Emprendimiento eliminado correctamente');
//       } else {
//         setError(data.error || 'Error al eliminar el emprendimiento');
//       }
//     } catch (err) {
//       setError('Error de red: ' + err.message);
//     }
//   };

//   // Función para adaptar el formulario antes de enviar
//   const adaptEmprendimientoForm = (form) => ({
//     ...form,
//     fechaInicio: form.fechaInicio ? new Date(form.fechaInicio) : null,
//     ubicacion: form.ubicacion
//       ? Buffer.from(JSON.stringify(form.ubicacion)).toString("base64")
//       : null,
//     cantidadPersonal: form.cantidadPersonal || 0,
//     modoIncorporacionPersonal: Array.isArray(form.modoIncorporacionPersonal)
//       ? form.modoIncorporacionPersonal
//       : form.modoIncorporacionPersonal
//         ? [form.modoIncorporacionPersonal]
//         : [],
//     tiposCapacitacion: form.tiposCapacitacion || [],
//     tiposConsultoria: form.tiposConsultoria || [],
//     tiposHerramientasTecno: form.tiposHerramientasTecno || [],
//     tiposRedesSociales: form.tiposRedesSociales || [],
//     canalesComercializacion: form.canalesComercializacion || [],
//     ubicacionSucursales: form.ubicacionSucursales || [],
//     cantidadSucursales: form.cantidadSucursales || 0,
//   });

//   const handleEmprendimientoSubmit = async (e) => {
//     e.preventDefault();
//     setLoadingEmprendimiento(true);
//     setError("");
//     setSuccess("");
//     const method = editEmprendimientoId ? 'PUT' : 'POST';
//     const url = editEmprendimientoId ? `/api/emprendimientos/${editEmprendimientoId}` : '/api/emprendimientos';
//     const adaptedForm = adaptEmprendimientoForm(emprendimientoForm);
//     try {
//       const res = await fetch(url, {
//         method,
//         headers: { 'Content-Type': 'application/json' },
//         credentials: 'include',
//         body: JSON.stringify(adaptedForm),
//       });
//       const data = await res.json();
//       setLoadingEmprendimiento(false);
//       if (res.ok) {
//         setShowEmprendimientoForm(false);
//         setEditEmprendimientoId(null);
//         setEmprendimientoForm({
//           emprendedorId: session?.user?.emprendedorId || 1,
//           etapa: "Idea",
//           denominacion: "",
//           fechaInicio: "",
//           inscripcionArca: false,
//           cuit: "",
//           sector: "ProduccionElaboracion",
//           actividadPrincipal: "Produccion_Alimentos_Artesanal",
//           tipoEmprendimiento: "Individual",
//           direccion: "",
//           ubicacion: { lat: -28.6037, lng: -65.3816 }, // Siempre valores numéricos
//           telefono: "",
//           email: "",
//           web: "",
//           redSocial1: "",
//           redSocial2: "",
//           tienePersonal: false,
//           cantidadPersonal: 0,
//           modoIncorporacionPersonal: [],
//           planeaIncorporarPersonal: null,
//           percepcionPlantaPersonal: null,
//           requiereCapacitacion: false,
//           tiposCapacitacion: [],
//           otrosTiposCapacitacion: "",
//           requiereConsultoria: false,
//           tiposConsultoria: [],
//           otrosTiposConsultoria: "",
//           requiereHerramientasTecno: false,
//           tiposHerramientasTecno: [],
//           otrasHerramientasTecno: "",
//           usaRedesSociales: false,
//           tiposRedesSociales: [],
//           usaMediosPagoElectronicos: false,
//           canalesComercializacion: [],
//           otrosCanalesComercializacion: "",
//           poseeSucursales: false,
//           cantidadSucursales: 0,
//           ubicacionSucursales: [],
//           planeaAbrirSucursal: false,
//         });
//         // Actualizar lista
//         fetch(`/api/emprendimientos?emprendedorId=${session.user.emprendedorId}`)
//           .then((res) => res.json())
//           .then((data) => {
//             if (Array.isArray(data)) setEmprendimientos(data);
//           });
//         setSuccess(editEmprendimientoId ? 'Emprendimiento actualizado correctamente' : 'Emprendimiento creado correctamente');
//       } else {
//         setError(data.error || 'Error al guardar el emprendimiento');
//       }
//     } catch (err) {
//       setError('Error de red: ' + err.message);
//       setLoadingEmprendimiento(false);
//     }
//   };

//   if (status === "loading" || loading) return <div className="flex items-center justify-center min-h-screen"><span className="animate-spin h-8 w-8 mr-3 border-4 border-primary-600 border-t-transparent rounded-full"></span> <span>Cargando...</span></div>;
//   if (!session) return <p className="text-center py-8 text-red-600">No estás logueado</p>;
//   if (!form) return <p className="text-center py-8 text-red-600">No se pudo cargar el perfil</p>;

//   return (
//     <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 dark:bg-gray-900">
//       <div className="w-full max-w-8xl p-4 sm:p-8 bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 flex flex-col gap-8">
//         <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
//           {/* Panel usuario compacto */}
//           <div className="flex flex-col items-center justify-center gap-4 p-6 rounded-lg bg-gray-50 dark:bg-gray-900 shadow border border-gray-200 dark:border-gray-800">
//             <img src={form.fotoDni || "/default-avatar.png"} alt="Avatar" className="h-16 w-16 rounded-full border border-gray-300 object-cover bg-white" />
//             <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-100 text-center">{form.nombre} {form.apellido}</h2>
//             <div className="flex flex-col gap-1 text-base text-gray-700 dark:text-gray-300 text-center">
//               <span><b>Email:</b> {session.user.email}</span>
//               <span><b>ID:</b> {session.user.id}</span>
//               <span><b>Emprendedor ID:</b> {session.user.emprendedorId}</span>
//               <span><b>Género:</b> {form.genero}</span>
//               <span><b>País de Origen:</b> {form.paisOrigen || "-"}</span>
//               <span><b>Ciudad de Origen:</b> {form.ciudadOrigen || "-"}</span>
//               <span><b>Cantidad de Emprendimientos:</b> {form.cantidadEmprendimientos ?? "-"}</span>
//               <span><b>Posee otros sustentos:</b> {form.poseeOtrosSustentos ? "Sí" : "No"}</span>
//               <span><b>Tipos de Sustento:</b> {Array.isArray(form.tiposSustento) ? form.tiposSustento.join(", ") : "-"}</span>
//               <span><b>Tiene dependientes económicos:</b> {form.tieneDependientesEconomicos ? "Sí" : "No"}</span>
//             </div>
//           </div>
//           {/* Panel edición perfil mejorado */}
//           <div className="flex flex-col gap-6 p-6 rounded-lg bg-white dark:bg-gray-800 shadow border border-gray-200 dark:border-gray-700 justify-center">
//             <h3 ref={perfilRef} className="text-xl font-semibold text-primary-700 dark:text-primary-200 mb-2 text-center">{form.id ? "Editar" : "Crear"} perfil de emprendedor</h3>
//             <form className="space-y-4" onSubmit={handleSubmit}>
//               <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 sm:gap-4">
//                 <div className="flex flex-col gap-1">
//                   <label htmlFor="nombre" className="text-xs text-gray-500">Nombre</label>
//                   <input id="nombre" className="w-full p-2 text-sm border border-gray-300 rounded dark:bg-gray-900 dark:border-gray-700" name="nombre" placeholder="Nombre" value={form.nombre || ""} onChange={handleChange} autoComplete="off" />
//                 </div>
//                 <div className="flex flex-col gap-1">
//                   <label htmlFor="apellido" className="text-xs text-gray-500">Apellido</label>
//                   <input id="apellido" className="w-full p-2 text-sm border border-gray-300 rounded dark:bg-gray-900 dark:border-gray-700" name="apellido" placeholder="Apellido" value={form.apellido || ""} onChange={handleChange} autoComplete="off" />
//                 </div>
//                 <div className="flex flex-col gap-1">
//                   <label htmlFor="dni" className="text-xs text-gray-500">DNI</label>
//                   <input id="dni" className="w-full p-2 text-sm border border-gray-300 rounded dark:bg-gray-900 dark:border-gray-700" name="dni" placeholder="DNI" value={form.dni || ""} onChange={handleChange} autoComplete="off" />
//                 </div>
//                 <div className="flex flex-col gap-1">
//                   <label htmlFor="cuil" className="text-xs text-gray-500">CUIL/CUIT</label>
//                   <input id="cuil" className="w-full p-2 text-sm border border-gray-300 rounded dark:bg-gray-900 dark:border-gray-700" name="cuil" placeholder="CUIL" value={form.cuil || ""} onChange={handleChange} autoComplete="off" />
//                 </div>
//                 <div className="flex flex-col gap-1">
//                   <label htmlFor="fechaNacimiento" className="text-xs text-gray-500">Fecha de nacimiento</label>
//                   <input id="fechaNacimiento" className="w-full p-2 text-sm border border-gray-300 rounded dark:bg-gray-900 dark:border-gray-700" name="fechaNacimiento" type="date" value={form.fechaNacimiento?.slice(0, 10) || ""} onChange={handleChange} />
//                 </div>
//                 <div className="flex flex-col gap-1">
//                   <label htmlFor="genero" className="text-xs text-gray-500">Género</label>
//                   <select
//                     id="genero"
//                     className="w-full p-2 text-sm border border-gray-300 rounded dark:bg-gray-900 dark:border-gray-700"
//                     name="genero"
//                     value={form.genero || ""}
//                     onChange={handleChange}
//                   >
//                     <option value="">Selecciona...</option>
//                     <option value="Masculino">Masculino</option>
//                     <option value="Femenino">Femenino</option>
//                     <option value="PrefieroNoDecir">Prefiero no decir</option>
//                   </select>
//                 </div>
//                 <div className="flex flex-col gap-1">
//                   <label htmlFor="paisOrigen" className="text-xs text-gray-500">País de origen</label>
//                   <input id="paisOrigen" className="w-full p-2 text-sm border border-gray-300 rounded dark:bg-gray-900 dark:border-gray-700" name="paisOrigen" placeholder="País de origen" value={form.paisOrigen || ""} onChange={handleChange} autoComplete="off" />
//                 </div>
//                 <div className="flex flex-col gap-1">
//                   <label htmlFor="ciudadOrigen" className="text-xs text-gray-500">Ciudad de origen</label>
//                   <input id="ciudadOrigen" className="w-full p-2 text-sm border border-gray-300 rounded dark:bg-gray-900 dark:border-gray-700" name="ciudadOrigen" placeholder="Ciudad de origen" value={form.ciudadOrigen || ""} onChange={handleChange} autoComplete="off" />
//                 </div>
//                 <div className="flex flex-col gap-1">
//                   <label htmlFor="nivelEstudios" className="text-xs text-gray-500">Nivel de estudios</label>
//                   <select
//                     id="nivelEstudios"
//                     className="w-full p-2 text-sm border border-gray-300 rounded dark:bg-gray-900 dark:border-gray-700"
//                     name="nivelEstudios"
//                     value={form.nivelEstudios || ""}
//                     onChange={handleChange}
//                   >
//                     <option value="">Selecciona...</option>
//                     <option value="SinEscolarizar">Sin escolarizar</option>
//                     <option value="PrimarioIncompleto">Primario incompleto</option>
//                     <option value="PrimarioCompleto">Primario completo</option>
//                     <option value="SecundarioIncompleto">Secundario incompleto</option>
//                     <option value="SecundarioCompleto">Secundario completo</option>
//                     <option value="TerciarioUniversitarioIncompleto">Terciario/Universitario incompleto</option>
//                     <option value="TerciarioUniversitarioCompleto">Terciario/Universitario completo</option>
//                     <option value="Posgrado">Posgrado</option>
//                   </select>
//                 </div>
//                 <div className="flex flex-col gap-1">
//                   <label htmlFor="motivacionEmprender" className="text-xs text-gray-500">Motivación para emprender</label>
//                   <select
//                     id="motivacionEmprender"
//                     className="w-full p-2 text-sm border border-gray-300 rounded dark:bg-gray-900 dark:border-gray-700"
//                     name="motivacionEmprender"
//                     value={form.motivacionEmprender || ""}
//                     onChange={handleChange}
//                   >
//                     <option value="">Selecciona...</option>
//                     <option value="Pasion">Pasión</option>
//                     <option value="Independencia">Independencia</option>
//                     <option value="Oportunidad">Oportunidad</option>
//                     <option value="NecesidadEconomica">Necesidad económica</option>
//                     <option value="Otro">Otro</option>
//                   </select>
//                 </div>
//                 <div className="flex flex-col gap-1">
//                   <label htmlFor="departamento" className="text-xs text-gray-500">Departamento/localidad</label>
//                   <input id="departamento" className="w-full p-2 text-sm border border-gray-300 rounded dark:bg-gray-900 dark:border-gray-700" name="departamento" placeholder="Departamento" value={form.departamento || ""} onChange={handleChange} autoComplete="off" />
//                 </div>
//                 <div className="flex flex-col gap-1">
//                   <label htmlFor="cantidadEmprendimientos" className="text-xs text-gray-500">Cantidad de emprendimientos</label>
//                   <input id="cantidadEmprendimientos" className="w-full p-2 text-sm border border-gray-300 rounded dark:bg-gray-900 dark:border-gray-700" name="cantidadEmprendimientos" type="number" min="0" value={form.cantidadEmprendimientos ?? ""} onChange={handleChange} />
//                 </div>
//                 <div className="flex items-center gap-2 mt-2">
//                   <input type="checkbox" id="poseeOtrosSustentos" name="poseeOtrosSustentos" checked={!!form.poseeOtrosSustentos} onChange={handleChange} className="mr-2" />
//                   <label htmlFor="poseeOtrosSustentos" className="text-xs text-gray-500">¿Posee otros sustentos?</label>
//                   <span className="text-xs">{form.poseeOtrosSustentos ? "Sí" : "No"}</span>
//                 </div>
//                 <div className="flex flex-col gap-1 col-span-1 sm:col-span-2">
//                   <label htmlFor="tiposSustento" className="text-xs text-gray-500">Tipos de sustento (separados por coma)</label>
//                   <input id="tiposSustento" className="w-full p-2 text-sm border border-gray-300 rounded dark:bg-gray-900 dark:border-gray-700" name="tiposSustento" placeholder="Ej: Trabajo, Jubilación, Otro" value={Array.isArray(form.tiposSustento) ? form.tiposSustento.join(", ") : ""} onChange={e => setForm(prev => ({ ...prev, tiposSustento: e.target.value.split(",").map(s => s.trim()).filter(Boolean) }))} />
//                 </div>
//                 <div className="flex items-center gap-2 mt-2">
//                   <input type="checkbox" id="tieneDependientesEconomicos" name="tieneDependientesEconomicos" checked={!!form.tieneDependientesEconomicos} onChange={handleChange} className="mr-2" />
//                   <label htmlFor="tieneDependientesEconomicos" className="text-xs text-gray-500">¿Tiene dependientes económicos?</label>
//                   <span className="text-xs">{form.tieneDependientesEconomicos ? "Sí" : "No"}</span>
//                 </div>
//               </div>
//               {/* Ubicación */}
//               <div className="flex flex-col gap-2 mt-2">
//                 <label className="text-sm font-semibold text-primary-700 dark:text-primary-300">Ubicación</label>
//                 <input
//                   className="w-full p-2 border border-primary-300 rounded dark:bg-gray-900 dark:border-primary-700 text-sm"
//                   name="ubicacion"
//                   placeholder="Latitud, Longitud"
//                   value={form.ubicacion ? `${form.ubicacion.lat}, ${form.ubicacion.lng}` : ""}
//                   readOnly
//                 />
//                 {typeof window !== "undefined" && (
//                   <div className="h-96 rounded-lg overflow-hidden border border-primary-200 dark:border-primary-700 mt-2">
//                     <div className="px-3 py-1 text-primary-700 dark:text-primary-200 font-semibold text-sm border-b border-primary-100 dark:border-primary-700 bg-primary-50 dark:bg-primary-900">Selecciona tu ubicación en el mapa</div>
//                     <BusinessMap
//                       emprendedores={[{
//                         id: form.id || 0,
//                         name: form.nombre || "Ubicación",
//                         type: "Emprendedor",
//                         address: form.direccion || "",
//                         location: form.ubicacion || { lat: -34.6037, lng: -58.3816 },
//                         imageUrl: form.fotoDni,
//                         status: "active",
//                         contact: {},
//                         description: `Dirección: ${form.direccion || "No especificada"}\nCoordenadas: ${form.ubicacion ? `${form.ubicacion.lat}, ${form.ubicacion.lng}` : "-"}`,
//                         createdAt: form.createdAt || null,
//                         updatedAt: form.updatedAt || null,
//                       }]}
//                       defaultViewport={{ center: [form.ubicacion?.lat || -34.6037, form.ubicacion?.lng || -58.3816], zoom: 13 }}
//                       selectionMode={true}
//                       onLocationSelect={(lat, lng) => {
//                         setForm((prev) => ({
//                           ...prev,
//                           ubicacion: { lat, lng },
//                         }));
//                       }}
//                       markerIconColor="primary"
//                       showMarker={true}
//                       showPopup={true}
//                     />
//                   </div>
//                 )}
//               </div>
//               <button type="submit" className="w-full py-2 px-4 bg-primary-600 text-white rounded hover:bg-primary-700 transition-all duration-200 flex items-center justify-center shadow text-base font-semibold mt-2">
//                 {loading ? <span className="animate-spin h-5 w-5 mr-2 border-2 border-white border-t-transparent rounded-full"></span> : null}
//                 {form.id ? "Actualizar" : "Guardar"}
//               </button>
//             </form>
//             {error && <div className="mt-4 p-2 bg-red-100 text-red-700 rounded text-center font-semibold shadow">{error}</div>}
//             {success && <div className="mt-4 p-2 bg-green-100 text-green-700 rounded text-center font-semibold shadow">{success}</div>}
//           </div>
//         </div>
//         {/* Panel emprendimientos en tarjetas */}
//         <div className="mt-8">
//           <h3 className="text-xl font-semibold text-primary-700 dark:text-primary-200 mb-4 flex items-center gap-2"><Activity size={20} className="text-primary-600" /> Mis Emprendimientos</h3>
//           {emprendimientos.length === 0 ? (
//             <div className="text-gray-500 py-8 text-center">No tienes emprendimientos registrados.</div>
//           ) : (
//             <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
//               {emprendimientos.map((emp) => (
//                 <div key={emp.id} className="bg-white dark:bg-gray-800 rounded-lg shadow hover:shadow-lg transition-all duration-200 p-4 flex flex-col gap-2 border border-gray-100 dark:border-gray-700">
//                   <div className="flex items-center gap-3">
//                     <div className="h-10 w-10 rounded-lg bg-primary-100 dark:bg-primary-900 flex items-center justify-center text-primary-600 dark:text-primary-400 text-lg font-bold">
//                       {emp.nombre?.charAt(0) || emp.denominacion?.charAt(0) || "E"}
//                     </div>
//                     <div>
//                       <span className="font-medium text-gray-800 dark:text-gray-200 text-base">{emp.nombre || emp.denominacion}</span>
//                       <span className={`ml-2 px-2 py-1 rounded text-xs font-semibold ${getStatusBadgeClass(emp.estado)}`}>{emp.estado}</span>
//                       <span className="ml-2 text-xs text-gray-500 dark:text-gray-400">{emp.rubro || emp.sector || "Sin rubro"}</span>
//                     </div>
//                   </div>
//                   <div className="flex items-center gap-2">
//                     <MapPin size={16} className="text-primary-500 mr-1" />
//                     <span className="text-xs text-gray-600 dark:text-gray-400">{emp.direccion || "Sin dirección"}</span>
//                   </div>
//                   <Link href={`/emprendimientos/${emp.id}`} className="text-primary-600 hover:underline font-medium text-sm mt-2">Ver detalles</Link>
//                 </div>
//               ))}
//             </div>
//           )}
//         </div>
//       </div>
//     </div>
//   );
// }

// export default PerfilPage;
