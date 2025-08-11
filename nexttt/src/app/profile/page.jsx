"use client";
import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
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
  const [form, setForm] = useState(null);
  const [loading, setLoading] = useState(true);
  const [emprendimientos, setEmprendimientos] = useState([]);
  const [showEmprendimientoForm, setShowEmprendimientoForm] = useState(true);
  const [emprendimientoForm, setEmprendimientoForm] = useState({
    emprendedorId: session?.user?.emprendedorId || 1,
    etapa: "Idea",
    denominacion: "",
    fechaInicio: "", // formato YYYY-MM-DD
    inscripcionArca: false,
    cuit: "",
    sector: "ProduccionElaboracion",
    actividadPrincipal: "Produccion_Alimentos_Artesanal",
    tipoEmprendimiento: "Individual",
    direccion: "",
    ubicacion: { lat: -34.6037, lng: -58.3816 },
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

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
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
    try {
      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(form),
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
          ubicacion: { lat: -34.6037, lng: -58.3816 }, // Siempre valores numéricos
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
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-gray-50 via-white to-primary-50 dark:from-gray-900 dark:via-gray-800 dark:to-primary-900">
      <div className="w-full max-w-5xl p-4 sm:p-6 md:p-8 bg-white dark:bg-gray-800 rounded-2xl shadow-2xl border border-gray-200 dark:border-gray-700">
        <div className="flex flex-col gap-4 md:gap-8 md:flex-row mb-8">
          {/* Panel usuario */}
          <div className="flex-1 flex flex-col items-center md:items-start gap-2 sm:gap-4 p-4 sm:p-6 rounded-xl bg-gradient-to-tr from-primary-100 via-white to-primary-50 dark:from-primary-900 dark:via-gray-800 dark:to-primary-800 shadow">
            <div className="flex flex-col sm:flex-row items-center gap-2 sm:gap-4 w-full">
              <UserCircle2 className="h-14 w-14 sm:h-16 sm:w-16 text-primary-600 dark:text-primary-300" />
              <div className="flex flex-col items-center sm:items-start">
                <h2 className="text-lg sm:text-2xl font-bold text-gray-700 dark:text-gray-200">{form.nombre} {form.apellido}</h2>
                <span className="inline-block px-2 py-1 rounded-full bg-primary-200 dark:bg-primary-800 text-primary-800 dark:text-primary-200 text-xs sm:text-sm font-semibold">{session.user.rol}</span>
              </div>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-1 sm:gap-2 w-full mt-2 sm:mt-4 text-xs sm:text-base">
              <div className="text-gray-600 dark:text-gray-400"><span className="font-semibold">Email:</span> {session.user.email}</div>
              <div className="text-gray-600 dark:text-gray-400"><span className="font-semibold">ID:</span> {session.user.id}</div>
              <div className="text-gray-600 dark:text-gray-400"><span className="font-semibold">Emprendedor ID:</span> {session.user.emprendedorId}</div>
              <div className="text-gray-600 dark:text-gray-400"><span className="font-semibold">Género:</span> {form.genero}</div>
            </div>
          </div>
          {/* Panel edición perfil */}
          <div className="flex-1 p-4 sm:p-6 rounded-xl bg-gray-50 dark:bg-gray-900 shadow flex flex-col justify-center">
            <h3 className="text-lg font-semibold text-primary-700 dark:text-primary-300 mb-2">{form.id ? "Editar" : "Crear"} perfil de emprendedor</h3>
            <form className="space-y-2 sm:space-y-3" onSubmit={handleSubmit}>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 sm:gap-4">
                <input className="w-full p-2 border border-gray-300 rounded-md dark:bg-gray-700 dark:border-gray-600" name="nombre" placeholder="Nombre" value={form.nombre || ""} onChange={handleChange} />
                <input className="w-full p-2 border border-gray-300 rounded-md dark:bg-gray-700 dark:border-gray-600" name="apellido" placeholder="Apellido" value={form.apellido || ""} onChange={handleChange} />
                <input className="w-full p-2 border border-gray-300 rounded-md dark:bg-gray-700 dark:border-gray-600" name="dni" placeholder="DNI" value={form.dni || ""} onChange={handleChange} />
                <input className="w-full p-2 border border-gray-300 rounded-md dark:bg-gray-700 dark:border-gray-600" name="cuil" placeholder="CUIL" value={form.cuil || ""} onChange={handleChange} />
                <input className="w-full p-2 border border-gray-300 rounded-md dark:bg-gray-700 dark:border-gray-600" name="fechaNacimiento" type="date" value={form.fechaNacimiento?.slice(0, 10) || ""} onChange={handleChange} />
                <input className="w-full p-2 border border-gray-300 rounded-md dark:bg-gray-700 dark:border-gray-600" name="genero" placeholder="Género" value={form.genero || ""} onChange={handleChange} />
                <input className="w-full p-2 border border-gray-300 rounded-md dark:bg-gray-700 dark:border-gray-600" name="departamento" placeholder="Departamento" value={form.departamento || ""} onChange={handleChange} />
                <input className="w-full p-2 border border-gray-300 rounded-md dark:bg-gray-700 dark:border-gray-600" name="telefono" placeholder="Teléfono" value={form.telefono || ""} onChange={handleChange} />
              </div>
              {/* Campo y mapa para ubicación mejorado */}
              <div className="mt-4">
                <label className="block text-sm font-semibold text-primary-700 dark:text-primary-300 mb-2">Ubicación en el mapa</label>
                <div className="flex flex-col gap-2 sm:gap-4">
                  <div className="flex items-center gap-2">
                    <input
                      className="flex-1 p-2 border border-primary-300 rounded-md dark:bg-gray-700 dark:border-primary-600 focus:ring-2 focus:ring-primary-500 text-sm"
                      name="ubicacion"
                      placeholder="Latitud, Longitud"
                      value={form.ubicacion ? `${form.ubicacion.lat}, ${form.ubicacion.lng}` : ""}
                      onChange={(e) => {
                        const [lat, lng] = e.target.value.split(",").map((coord) => coord.trim());
                        setForm((prev) => ({
                          ...prev,
                          ubicacion: { lat: parseFloat(lat), lng: parseFloat(lng) },
                        }));
                      }}
                    />
                    <span className="text-xs text-gray-500 dark:text-gray-400">(Haz clic en el mapa para seleccionar)</span>
                  </div>
                  {typeof window !== "undefined" && (
                    <div className="h-64 sm:h-72 rounded-xl overflow-hidden border border-primary-200 dark:border-primary-700 shadow">
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
              </div>
              <button type="submit" className="w-full py-2 px-4 bg-primary-600 text-white rounded-md hover:bg-primary-700 shadow text-base sm:text-lg">{form.id ? "Actualizar" : "Guardar"}</button>
            </form>
            {error && <div className="mt-4 p-2 bg-red-100 text-red-700 rounded">{error}</div>}
            {success && <div className="mt-4 p-2 bg-green-100 text-green-700 rounded">{success}</div>}
          </div>
        </div>
        {/* Panel emprendimientos */}
        <div className="mt-6 sm:mt-8">
          <h3 className="text-lg sm:text-xl font-semibold text-gray-700 dark:text-gray-300 mb-2 sm:mb-4 flex items-center gap-2"><Activity size={18} className="text-primary-600" /> Mis Emprendimientos</h3>
          {emprendimientos.length === 0 ? (
            <div className="text-gray-500 py-6 sm:py-8 text-center">No tienes emprendimientos registrados.</div>
          ) : (
            <ul className="divide-y divide-gray-200 dark:divide-gray-700">
              {emprendimientos.map((emp) => (
                <li key={emp.id} className="py-3 sm:py-4 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                  <div className="flex items-center gap-2 sm:gap-3">
                    <div className="h-8 w-8 sm:h-10 sm:w-10 rounded-lg bg-primary-100 dark:bg-primary-900 flex items-center justify-center text-primary-600 dark:text-primary-400 text-base sm:text-lg font-bold">
                      {emp.nombre?.charAt(0) || emp.denominacion?.charAt(0) || "E"}
                    </div>
                    <div>
                      <span className="font-medium text-gray-800 dark:text-gray-200 text-sm sm:text-base">{emp.nombre || emp.denominacion}</span>
                      <span className={`ml-2 px-2 py-1 rounded text-xs font-semibold ${getStatusBadgeClass(emp.estado)}`}>{emp.estado}</span>
                      <span className="ml-2 text-xs text-gray-500 dark:text-gray-400">{emp.rubro || emp.sector || "Sin rubro"}</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-1 sm:gap-2">
                    <MapPin size={14} className="text-primary-500 mr-1" />
                    <span className="text-xs text-gray-600 dark:text-gray-400">{emp.direccion || "Sin dirección"}</span>
                  </div>
                  <Link href={`/emprendimientos/${emp.id}`} className="text-primary-600 hover:underline font-medium text-xs sm:text-sm">Ver detalles</Link>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
}

export default PerfilPage;
// "use client";
// import { useSession } from "next-auth/react";
// import { useState, useEffect } from "react";
// import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";

// export default function Perfil() {
//   const { data: session, status } = useSession();
//   const [form, setForm] = useState(null);
//   const [loading, setLoading] = useState(true);

//   useEffect(() => {
//     if (session?.user?.id) {
//       // if (session?.user?.rol === "EMPRENDEDOR") {
//       fetch(`/api/emprendedores/${session.user.emprendedorId}`)
//         .then((res) => res.json())
//         .then((data) => {
//           if (data.error) {
//             console.error(data.error);
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
//             });
//           } else {
//             setForm(data);
//           }
//           setLoading(false);
//         });
//       // console.error("datos", session);
//     }
//   }, [session]);

//   const handleChange = (e) => {
//     const { name, value, type, checked } = e.target;
//     setForm((prev) => ({
//       ...prev,
//       [name]: type === "checkbox" ? checked : value,
//     }));
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     const method = form?.id ? "PUT" : "POST";
//     const res = await fetch("/api/emprendedores", {
//       method,
//       headers: { "Content-Type": "application/json" },
//       credentials: "include",
//       body: JSON.stringify(form),
//     });

//     const data = await res.json();
//     if (res.ok) {
//       alert("Perfil actualizado");
//     } else {
//       alert("Error: " + data.error);
//     }
//   };

//   if (status === "loading" || loading) return <p>Cargando...</p>;
//   if (!session) return <p>No estás logueado</p>;
//   if (!form) return <p>No se pudo cargar el perfil</p>;

//   return (
//     <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50 dark:bg-gray-900">
//       <div className="w-full max-w-4xl p-6 bg-white dark:bg-gray-800 rounded-lg shadow-lg">
//         <h2 className="text-2xl font-bold text-gray-700 dark:text-gray-300 mb-4">
//           Perfil de Usuario
//         </h2>
//         <div className="mb-6">
//           <p className="text-gray-600 dark:text-gray-400">
//             Email: {session.user.email}
//           </p>
//           <p className="text-gray-600 dark:text-gray-400">ID: {session.user.id}</p>
//           <p className="text-gray-600 dark:text-gray-400">Rol: {session.user.rol}</p>
//         </div>
//         <h3 className="text-xl font-semibold text-gray-700 dark:text-gray-300 mb-4">
//           {form.id ? "Editar" : "Crear"} perfil de emprendedor
//         </h3>
//         <p className="text-gray-600 dark:text-gray-400 mb-6">
//           Emprendedor ID: {session.user.emprendedorId}
//         </p>
//         {session.user.rol === "EMPRENDEDOR" && (
//           <form
//             className="grid grid-cols-1 md:grid-cols-2 gap-6"
//             onSubmit={handleSubmit}
//           >
//             <div>
//               <label className="block text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">
//                 Nombre
//               </label>
//               <input
//                 className="w-full p-2 border border-gray-300 rounded-md dark:bg-gray-700 dark:border-gray-600 focus:ring-2 focus:ring-primary-500"
//                 name="nombre"
//                 placeholder="Nombre"
//                 value={form.nombre}
//                 onChange={handleChange}
//               />
//             </div>
//             <div>
//               <label className="block text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">
//                 Apellido
//               </label>
//               <input
//                 className="w-full p-2 border border-gray-300 rounded-md dark:bg-gray-700 dark:border-gray-600 focus:ring-2 focus:ring-primary-500"
//                 name="apellido"
//                 placeholder="Apellido"
//                 value={form.apellido}
//                 onChange={handleChange}
//               />
//             </div>
//             <div>
//               <label className="block text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">
//                 DNI
//               </label>
//               <input
//                 className="w-full p-2 border border-gray-300 rounded-md dark:bg-gray-700 dark:border-gray-600 focus:ring-2 focus:ring-primary-500"
//                 name="dni"
//                 placeholder="DNI"
//                 value={form.dni}
//                 onChange={handleChange}
//               />
//             </div>
//             <div>
//               <label className="block text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">
//                 CUIL
//               </label>
//               <input
//                 className="w-full p-2 border border-gray-300 rounded-md dark:bg-gray-700 dark:border-gray-600 focus:ring-2 focus:ring-primary-500"
//                 name="cuil"
//                 placeholder="CUIL"
//                 value={form.cuil}
//                 onChange={handleChange}
//               />
//             </div>
//             <div>
//               <label className="block text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">
//                 Fecha de Nacimiento
//               </label>
//               <input
//                 className="w-full p-2 border border-gray-300 rounded-md dark:bg-gray-700 dark:border-gray-600 focus:ring-2 focus:ring-primary-500"
//                 name="fechaNacimiento"
//                 type="date"
//                 value={form.fechaNacimiento?.slice(0, 10)}
//                 onChange={handleChange}
//               />
//             </div>
//             <div>
//               <label className="block text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">
//                 Género
//               </label>
//               <input
//                 className="w-full p-2 border border-gray-300 rounded-md dark:bg-gray-700 dark:border-gray-600 focus:ring-2 focus:ring-primary-500"
//                 name="genero"
//                 placeholder="Género"
//                 value={form.genero}
//                 onChange={handleChange}
//               />
//             </div>
//             <div>
//               <label className="block text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">
//                 Departamento
//               </label>
//               <input
//                 className="w-full p-2 border border-gray-300 rounded-md dark:bg-gray-700 dark:border-gray-600 focus:ring-2 focus:ring-primary-500"
//                 name="departamento"
//                 placeholder="Departamento"
//                 value={form.departamento}
//                 onChange={handleChange}
//               />
//             </div>
//             <div>
//               <label className="block text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">
//                 Teléfono
//               </label>
//               <input
//                 className="w-full p-2 border border-gray-300 rounded-md dark:bg-gray-700 dark:border-gray-600 focus:ring-2 focus:ring-primary-500"
//                 name="telefono"
//                 placeholder="Teléfono"
//                 value={form.telefono}
//                 onChange={handleChange}
//               />
//             </div>
//             <div className="col-span-1 md:col-span-2">
//               <label className="block text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">
//                 Ubicación
//               </label>
//               <div className="flex flex-col gap-4">
//                 <input
//                   className="w-full p-2 border border-gray-300 rounded-md dark:bg-gray-700 dark:border-gray-600 focus:ring-2 focus:ring-primary-500"
//                   name="ubicacion"
//                   placeholder="Latitud, Longitud"
//                   value={form.ubicacion ? `${form.ubicacion.lat}, ${form.ubicacion.lng}` : ""}
//                   onChange={(e) => {
//                     const [lat, lng] = e.target.value
//                       .split(",")
//                       .map((coord) => coord.trim());
//                     setForm((prev) => ({
//                       ...prev,
//                       ubicacion: { lat: parseFloat(lat), lng: parseFloat(lng) },
//                     }));
//                   }}
//                 />
//                 {typeof window !== "undefined" && (
//                   <div className="h-64 rounded-lg overflow-hidden">
//                     <MapContainer
//                       center={form.ubicacion || { lat: -34.6037, lng: -58.3816 }}
//                       zoom={12}
//                       style={{ height: "100%", width: "100%" }}
//                       zoomControl={false}
//                       whenCreated={(map) => {
//                         // Geolocalización del dispositivo
//                         if (navigator.geolocation) {
//                           navigator.geolocation.getCurrentPosition(
//                             (position) => {
//                               const { latitude, longitude } = position.coords;
//                               map.setView([latitude, longitude], 12);
//                               setForm((prev) => ({
//                                 ...prev,
//                                 ubicacion: { lat: latitude, lng: longitude },
//                               }));
//                             },
//                             (error) => {
//                               console.error("Error al obtener la ubicación del dispositivo:", error);
//                               alert("No se pudo obtener la ubicación. Por favor, verifica los permisos de tu navegador.");
//                             },
//                             { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 }
//                           );
//                         } else {
//                           console.error("Geolocalización no soportada por el navegador");
//                           alert("Tu navegador no soporta geolocalización.");
//                         }

//                         // Selección de ubicación en el mapa
//                         map.on("click", (e) => {
//                           const { lat, lng } = e.latlng;
//                           setForm((prev) => ({
//                             ...prev,
//                             ubicacion: { lat, lng },
//                           }));
//                         });
//                       }}
//                     >
//                       <TileLayer
//                         attribution=""
//                         url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
//                       />
//                       {form.ubicacion && (
//                         <Marker position={[form.ubicacion.lat, form.ubicacion.lng]}>
//                           <Popup>Ubicación seleccionada</Popup>
//                         </Marker>
//                       )}
//                     </MapContainer>
//                   </div>
//                 )}
//               </div>
//             </div>
//             <div className="col-span-1 md:col-span-2">
//               <button
//                 type="submit"
//                 className="w-full py-2 px-4 bg-primary-600 text-white rounded-md hover:bg-primary-700 focus:ring-2 focus:ring-primary-500"
//               >
//                 {form.id ? "Actualizar" : "Guardar"}
//               </button>
//             </div>
//           </form>
//         )}
//       </div>
//     </div>
//   );
// }

// // 'use client';
// // import { useSession } from "next-auth/react";
// // import { useState } from "react";

// // export default function Perfil() {
// //   const { data: session, status } = useSession();
// //   const [form, setForm] = useState({
// //     nombre: "",
// //     apellido: "",
// //     dni: "",
// //     cuil: "",
// //     fechaNacimiento: "",
// //     direccion: "",
// //     departamento: "",
// //     telefono: "",
// //     genero: "Masculino", // ejemplo
// //     nivelEstudios: "SinEscolarizar",
// //     motivacionEmprender: "Pasion",
// //     tiposSustento: [],
// //     poseeOtrosSustentos: false,
// //     tieneDependientesEconomicos: false,
// //   });

// //   const handleChange = (e) => {
// //     const { name, value, type, checked } = e.target;
// //     setForm((prev) => ({
// //       ...prev,
// //       [name]: type === "checkbox" ? checked : value,
// //     }));
// //   };

// //   const handleSubmit = async (e) => {
// //     e.preventDefault();
// //     const res = await fetch("/api/emprendedores", {
// //       method: "POST",
// //       headers: { "Content-Type": "application/json" },
// //       credentials: "include",
// //       body: JSON.stringify(form),
// //     });

// //     const data = await res.json();
// //     if (res.ok) {
// //       alert("Perfil de emprendedor creado");
// //     } else {
// //       alert("Error: " + data.error);
// //     }
// //   };

// //   if (status === "loading") return <p>Cargando...</p>;
// //   if (!session) return <p>No estás logueado</p>;

// //   return (
// //     <div>
// //       <h2>Perfil de usuario</h2>
// //       <p>Email: {session.user.email}</p>
// //       <p>ID: {session.user.id}</p>
// //       <p>Rol: {session.user.rol}</p>

// //       {session.user.rol === "EMPRENDEDOR" && (
// //         <form onSubmit={handleSubmit}>
// //           <h3>Crear perfil de emprendedor</h3>
// //           <input name="nombre" placeholder="Nombre" value={form.nombre} onChange={handleChange} />
// //           <input name="apellido" placeholder="Apellido" value={form.apellido} onChange={handleChange} />
// //           <input name="dni" placeholder="DNI" value={form.dni} onChange={handleChange} />
// //           <input name="cuil" placeholder="CUIL" value={form.cuil} onChange={handleChange} />
// //             <input name="fechaNacimiento" type="date" value={form.fechaNacimiento} onChange={handleChange} />
// //           <input name="direccion" placeholder="Dirección" value={form.direccion} onChange={handleChange} />
// //           <input name="departamento" placeholder="Departamento" value={form.departamento} onChange={handleChange} />
// //           <input name="telefono" placeholder="Teléfono" value={form.telefono} onChange={handleChange} />
// //           {/* Agregá más campos según tu modelo */}
// //           <button type="submit">Guardar</button>
// //         </form>
// //       )}
// //     </div>
// //   );
// // }

// // // 'use client';
// // // import { useSession } from "next-auth/react";

// // // export default function Perfil() {
// // //   const { data: session, status } = useSession();

// // //   if (status === "loading") return <p>Cargando...</p>;
// // //   if (!session) return <p>No estás logueado</p>;

// // //   return (
// // //     <div>
// // //       <h2>Perfil de usuario</h2>
// // //       <p>Email: {session.user.email}</p>
// // //       <p>ID: {session.user.id}</p>
// // //       <p>Rol: {session.user.rol}</p> {/* Asegurate de tener esto */}
// // //     </div>
// // //   );
// // // }

// // // 'use client';
// // // import { useAuth } from "../../context/AuthContext";
// // // export default function Dashboard() {
// // //   const { isAuthenticated, role, user, status } = useAuth();

// // //   if (status === "loading") return <p>Cargando...</p>;
// // //   if (!isAuthenticated) return <p>No estás logueado</p>;

// // //   return (
// // //     <div>
// // //       <h2>Hola {user.name}</h2>
// // //       <h2>{user.role}</h2>
// // //       {role === "ADMIN" && <p>Bienvenido al panel de administración</p>}
// // //       {role === "EMPRENDEDOR" && <p>Panel exclusivo para emprendedores</p>}
// // //       {role === "SUPERUSUARIO" && <p>Panel exclusivo para superusuario</p>}
// // //     </div>
// // //   );
// // // }

// // // 'use client';
// // // import { useEffect, useState } from 'react';
// // // import { useAuth } from '@/context/AuthContext'; // o desde la ruta correcta
// // // import { useRouter } from 'next/navigation';

// // // export default function PerfilPage() {
// // //   const { user, isLoggedIn, isEmprendedor } = useAuth();
// // //   const router = useRouter();

// // //   const [form, setForm] = useState({
// // //     nombre: '',
// // //     apellido: '',
// // //     dni: '',
// // //     cuil: '',
// // //     direccion: '',
// // //     telefono: '',
// // //     genero: '',
// // //   });

// // //   const [loading, setLoading] = useState(false);

// // //   useEffect(() => {
// // //     if (!isLoggedIn) return router.push('/auth/login');
// // //     if (!isEmprendedor) return router.push('/403');
// // //     if (user?.emprendedorId) return router.push('/');
// // //   }, [isLoggedIn, isEmprendedor, user]);

// // //   const handleChange = (e) => {
// // //     const { name, value } = e.target;
// // //     setForm((prev) => ({ ...prev, [name]: value }));
// // //   };

// // //   const handleSubmit = async (e) => {
// // //     e.preventDefault();
// // //     setLoading(true);

// // //     try {
// // //       const res = await fetch('/api/emprendedores', {
// // //         method: 'POST',
// // //         headers: {
// // //           'Content-Type': 'application/json',
// // //         },
// // //         body: JSON.stringify(form),
// // //       });

// // //       if (!res.ok) throw new Error('Error al crear el perfil');

// // //       router.push('/');
// // //     } catch (err) {
// // //       alert(err.message);
// // //     } finally {
// // //       setLoading(false);
// // //     }
// // //   };

// // //   if (!isLoggedIn || !isEmprendedor || user?.emprendedorId) return null;

// // //   return (
// // //     <div className="max-w-xl mx-auto p-6">
// // //       <h1 className="text-2xl font-bold mb-4">Mi Perfil</h1>

// // //       <p><strong>Email:</strong> {user?.email}</p>
// // //       <p><strong>Rol:</strong> {user?.rol}</p>

// // //       <hr className="my-6" />

// // //       <h2 className="text-xl font-semibold mb-2">Completa tu perfil como emprendedor</h2>

// // //       <form onSubmit={handleSubmit} className="space-y-4">
// // //         <input
// // //           type="text"
// // //           name="nombre"
// // //           placeholder="Nombre"
// // //           value={form.nombre}
// // //           onChange={handleChange}
// // //           className="w-full p-2 border rounded"
// // //           required
// // //         />
// // //         <input
// // //           type="text"
// // //           name="apellido"
// // //           placeholder="Apellido"
// // //           value={form.apellido}
// // //           onChange={handleChange}
// // //           className="w-full p-2 border rounded"
// // //           required
// // //         />
// // //         <input
// // //           type="text"
// // //           name="dni"
// // //           placeholder="DNI"
// // //           value={form.dni}
// // //           onChange={handleChange}
// // //           className="w-full p-2 border rounded"
// // //           required
// // //         />
// // //         <input
// // //           type="text"
// // //           name="cuil"
// // //           placeholder="CUIL"
// // //           value={form.cuil}
// // //           onChange={handleChange}
// // //           className="w-full p-2 border rounded"
// // //           required
// // //         />
// // //         <input
// // //           type="text"
// // //           name="telefono"
// // //           placeholder="Teléfono"
// // //           value={form.telefono}
// // //           onChange={handleChange}
// // //           className="w-full p-2 border rounded"
// // //           required
// // //         />
// // //         <input
// // //           type="text"
// // //           name="direccion"
// // //           placeholder="Dirección"
// // //           value={form.direccion}
// // //           onChange={handleChange}
// // //           className="w-full p-2 border rounded"
// // //           required
// // //         />
// // //         <select
// // //           name="genero"
// // //           value={form.genero}
// // //           onChange={handleChange}
// // //           className="w-full p-2 border rounded"
// // //         >
// // //           <option value="Masculino">Masculino</option>
// // //           <option value="Femenino">Femenino</option>
// // //           <option value="PrefieroNoDecir">Prefiero no decir</option>
// // //         </select>

// // //         <button
// // //           type="submit"
// // //           className="w-full bg-blue-600 text-white p-2 rounded disabled:opacity-50"
// // //           disabled={loading}
// // //         >
// // //           {loading ? 'Guardando...' : 'Guardar perfil'}
// // //         </button>
// // //       </form>
// // //     </div>
// // //   );
// // // }


// // // 'use client';
// // // import { useEffect, useState } from 'react';
// // // import { useAuth } from '@/context/AuthContext';
// // // import { useRouter } from 'next/navigation';

// // // export default function PerfilPage() {
// // //   const { user, isLoggedIn, isEmprendedor } = useAuth();
// // //   const router = useRouter();

// // //   const [form, setForm] = useState({
// // //     nombre: '',
// // //     apellido: '',
// // //     dni: '',
// // //     cuil: '',
// // //     direccion: '',
// // //     telefono: '',
// // //     genero: '',
// // //   });

// // //   const [loading, setLoading] = useState(false);

// // //   useEffect(() => {
// // //     if (!isLoggedIn) return router.push('/auth/login');
// // //     if (!isEmprendedor) return router.push('/403');
// // //     if (user?.emprendedorId) return router.push('/');
// // //   }, [isLoggedIn, isEmprendedor, user]);

// // //   const handleChange = (e) => {
// // //     const { name, value } = e.target;
// // //     setForm((prev) => ({ ...prev, [name]: value }));
// // //   };

// // //   const handleSubmit = async (e) => {
// // //     e.preventDefault();
// // //     setLoading(true);

// // //     try {
// // //       const res = await fetch('/api/emprendedores', {
// // //         method: 'POST',
// // //         headers: {
// // //           'Content-Type': 'application/json',
// // //         },
// // //         body: JSON.stringify(form),
// // //       });

// // //       if (!res.ok) throw new Error('Error al crear el perfil');

// // //       router.push('/');
// // //     } catch (err) {
// // //       alert(err.message);
// // //     } finally {
// // //       setLoading(false);
// // //     }
// // //   };

// // //   if (!isLoggedIn || !isEmprendedor || user?.emprendedorId) return null;

// // //   return (
// // //     <div className="max-w-xl mx-auto p-6">
// // //       <h1 className="text-2xl font-bold mb-4">Mi Perfil</h1>

// // //       <p><strong>Email:</strong> {user?.email}</p>
// // //       <p><strong>Rol:</strong> {user?.rol}</p>

// // //       <hr className="my-6" />

// // //       <h2 className="text-xl font-semibold mb-2">Completa tu perfil como emprendedor</h2>

// // //       <form onSubmit={handleSubmit} className="space-y-4">
// // //         <input
// // //           type="text"
// // //           name="nombre"
// // //           placeholder="Nombre"
// // //           value={form.nombre}
// // //           onChange={handleChange}
// // //           className="w-full p-2 border rounded"
// // //           required
// // //         />
// // //         <input
// // //           type="text"
// // //           name="apellido"
// // //           placeholder="Apellido"
// // //           value={form.apellido}
// // //           onChange={handleChange}
// // //           className="w-full p-2 border rounded"
// // //           required
// // //         />
// // //         <input
// // //           type="text"
// // //           name="dni"
// // //           placeholder="DNI"
// // //           value={form.dni}
// // //           onChange={handleChange}
// // //           className="w-full p-2 border rounded"
// // //           required
// // //         />
// // //         <input
// // //           type="text"
// // //           name="cuil"
// // //           placeholder="CUIL"
// // //           value={form.cuil}
// // //           onChange={handleChange}
// // //           className="w-full p-2 border rounded"
// // //           required
// // //         />
// // //         <input
// // //           type="text"
// // //           name="telefono"
// // //           placeholder="Teléfono"
// // //           value={form.telefono}
// // //           onChange={handleChange}
// // //           className="w-full p-2 border rounded"
// // //           required
// // //         />
// // //         <input
// // //           type="text"
// // //           name="direccion"
// // //           placeholder="Dirección"
// // //           value={form.direccion}
// // //           onChange={handleChange}
// // //           className="w-full p-2 border rounded"
// // //           required
// // //         />
// // //         <select
// // //           name="genero"
// // //           value={form.genero}
// // //           onChange={handleChange}
// // //           className="w-full p-2 border rounded"
// // //         >
// // //           <option value="Masculino">Masculino</option>
// // //           <option value="Femenino">Femenino</option>
// // //           <option value="PrefieroNoDecir">Prefiero no decir</option>
// // //         </select>

// // //         <button
// // //           type="submit"
// // //           className="w-full bg-blue-600 text-white p-2 rounded disabled:opacity-50"
// // //           disabled={loading}
// // //         >
// // //           {loading ? 'Guardando...' : 'Guardar perfil'}
// // //         </button>
// // //       </form>
// // //     </div>
// // //   );
// // // }


// // // 'use client';
// // // import { useEffect, useState } from 'react';
// // // import { useAuth } from '@/context/AuthContext';
// // // import { useRouter } from 'next/navigation';

// // // export default function PerfilPage() {
// // //   const { user, isLoggedIn, isEmprendedor } = useAuth();
// // //   const router = useRouter();

// // //   const [form, setForm] = useState({
// // //     nombre: '',
// // //     apellido: '',
// // //     dni: '',
// // //     cuil: '',
// // //     direccion: '',
// // //     telefono: '',
// // //     genero: '',
// // //   });

// // //   const [loading, setLoading] = useState(false);

// // //   useEffect(() => {
// // //     if (!isLoggedIn) return router.push('/auth/login');
// // //     if (!isEmprendedor) return router.push('/403');
// // //     if (user?.emprendedorId) return router.push('/');
// // //   }, [isLoggedIn, isEmprendedor, user]);

// // //   const handleChange = (e) => {
// // //     const { name, value } = e.target;
// // //     setForm((prev) => ({ ...prev, [name]: value }));
// // //   };

// // //   const handleSubmit = async (e) => {
// // //     e.preventDefault();
// // //     setLoading(true);

// // //     try {
// // //       const res = await fetch('/api/emprendedores', {
// // //         method: 'POST',
// // //         headers: {
// // //           'Content-Type': 'application/json',
// // //         },
// // //         body: JSON.stringify(form),
// // //       });

// // //       if (!res.ok) throw new Error('Error al crear el perfil');

// // //       router.push('/');
// // //     } catch (err) {
// // //       alert(err.message);
// // //     } finally {
// // //       setLoading(false);
// // //     }
// // //   };

// // //   if (!isLoggedIn || !isEmprendedor || user?.emprendedorId) return null;

// // //   return (
// // //     <div className="max-w-xl mx-auto p-6">
// // //       <h1 className="text-2xl font-bold mb-4">Mi Perfil</h1>

// // //       <p><strong>Email:</strong> {user?.email}</p>
// // //       <p><strong>Rol:</strong> {user?.rol}</p>

// // //       <hr className="my-6" />

// // //       <h2 className="text-xl font-semibold mb-2">Completa tu perfil como emprendedor</h2>

// // //       <form onSubmit={handleSubmit} className="space-y-4">
// // //         <input
// // //           type="text"
// // //           name="nombre"
// // //           placeholder="Nombre"
// // //           value={form.nombre}
// // //           onChange={handleChange}
// // //           className="w-full p-2 border rounded"
// // //           required
// // //         />
// // //         <input
// // //           type="text"
// // //           name="apellido"
// // //           placeholder="Apellido"
// // //           value={form.apellido}
// // //           onChange={handleChange}
// // //           className="w-full p-2 border rounded"
// // //           required
// // //         />
// // //         <input
// // //           type="text"
// // //           name="dni"
// // //           placeholder="DNI"
// // //           value={form.dni}
// // //           onChange={handleChange}
// // //           className="w-full p-2 border rounded"
// // //           required
// // //         />
// // //         <input
// // //           type="text"
// // //           name="cuil"
// // //           placeholder="CUIL"
// // //           value={form.cuil}
// // //           onChange={handleChange}
// // //           className="w-full p-2 border rounded"
// // //           required
// // //         />
// // //         <input
// // //           type="text"
// // //           name="telefono"
// // //           placeholder="Teléfono"
// // //           value={form.telefono}
// // //           onChange={handleChange}
// // //           className="w-full p-2 border rounded"
// // //           required
// // //         />
// // //         <input
// // //           type="text"
// // //           name="direccion"
// // //           placeholder="Dirección"
// // //           value={form.direccion}
// // //           onChange={handleChange}
// // //           className="w-full p-2 border rounded"
// // //           required
// // //         />
// // //         <select
// // //           name="genero"
// // //           value={form.genero}
// // //           onChange={handleChange}
// // //           className="w-full p-2 border rounded"
// // //         >
// // //           <option value="Masculino">Masculino</option>
// // //           <option value="Femenino">Femenino</option>
// // //           <option value="PrefieroNoDecir">Prefiero no decir</option>
// // //         </select>

// // //         <button
// // //           type="submit"
// // //           className="w-full bg-blue-600 text-white p-2 rounded disabled:opacity-50"
// // //           disabled={loading}
// // //         >
// // //           {loading ? 'Guardando...' : 'Guardar perfil'}
// // //         </button>
// // //       </form>
// // //     </div>
// // //   );
// // // }


// // // 'use client';
// // // import { useEffect, useState } from 'react';
// // // import { useAuth } from '@/context/AuthContext';
// // // import { useRouter } from 'next/navigation';

// // // export default function PerfilPage() {
// // //   const { user, isLoggedIn, isEmprendedor } = useAuth();
// // //   const router = useRouter();

// // //   const [form, setForm] = useState({
// // //     nombre: '',
// // //     apellido: '',
// // //     dni: '',
// // //     cuil: '',
// // //     direccion: '',
// // //     telefono: '',
// // //     genero: '',
// // //   });

// // //   const [loading, setLoading] = useState(false);

// // //   useEffect(() => {
// // //     if (!isLoggedIn) return router.push('/auth/login');
// // //     if (!isEmprendedor) return router.push('/403');
// // //     if (user?.emprendedorId) return router.push('/');
// // //   }, [isLoggedIn, isEmprendedor, user]);

// // //   const handleChange = (e) => {
// // //     const { name, value } = e.target;
// // //     setForm((prev) => ({ ...prev, [name]: value }));
// // //   };

// // //   const handleSubmit = async (e) => {
// // //     e.preventDefault();
// // //     setLoading(true);

// // //     try {
// // //       const res = await fetch('/api/emprendedores', {
// // //         method: 'POST',
// // //         headers: {
// // //           'Content-Type': 'application/json',
// // //         },
// // //         body: JSON.stringify(form),
// // //       });

// // //       if (!res.ok) throw new Error('Error al crear el perfil');

// // //       router.push('/');
// // //     } catch (err) {
// // //       alert(err.message);
// // //     } finally {
// // //       setLoading(false);
// // //     }
// // //   };

// // //   if (!isLoggedIn || !isEmprendedor || user?.emprendedorId) return null;

// // //   return (
// // //     <div className="max-w-xl mx-auto p-6">
// // //       <h1 className="text-2xl font-bold mb-4">Mi Perfil</h1>

// // //       <p><strong>Email:</strong> {user?.email}</p>
// // //       <p><strong>Rol:</strong> {user?.rol}</p>

// // //       <hr className="my-6" />

// // //       <h2 className="text-xl font-semibold mb-2">Completa tu perfil como emprendedor</h2>

// // //       <form onSubmit={handleSubmit} className="space-y-4">
// // //         <input
// // //           type="text"
// // //           name="nombre"
// // //           placeholder="Nombre"
// // //           value={form.nombre}
// // //           onChange={handleChange}
// // //           className="w-full p-2 border rounded"
// // //           required
// // //         />
// // //         <input
// // //           type="text"
// // //           name="apellido"
// // //           placeholder="Apellido"
// // //           value={form.apellido}
// // //           onChange={handleChange}
// // //           className="w-full p-2 border rounded"
// // //           required
// // //         />
// // //         <input
// // //           type="text"
// // //           name="dni"
// // //           placeholder="DNI"
// // //           value={form.dni}
// // //           onChange={handleChange}
// // //           className="w-full p-2 border rounded"
// // //           required
// // //         />
// // //         <input
// // //           type="text"
// // //           name="cuil"
// // //           placeholder="CUIL"
// // //           value={form.cuil}
// // //           onChange={handleChange}
// // //           className="w-full p-2 border rounded"
// // //           required
// // //         />
// // //         <input
// // //           type="text"
// // //           name="telefono"
// // //           placeholder="Teléfono"
// // //           value={form.telefono}
// // //           onChange={handleChange}
// // //           className="w-full p-2 border rounded"
// // //           required
// // //         />
// // //         <input
// // //           type="text"
// // //           name="direccion"
// // //           placeholder="Dirección"
// // //           value={form.direccion}
// // //           onChange={handleChange}
// // //           className="w-full p-2 border rounded"
// // //           required
// // //         />
// // //         <select
// // //           name="genero"
// // //           value={form.genero}
// // //           onChange={handleChange}
// // //           className="w-full p-2 border rounded"
// // //         >
// // //           <option value="Masculino">Masculino</option>
// // //           <option value="Femenino">Femenino</option>
// // //           <option value="PrefieroNoDecir">Prefiero no decir</option>
// // //         </select>

// // //         <button
// // //           type="submit"
// // //           className="w-full bg-blue-600 text-white p-2 rounded disabled:opacity-50"
// // //           disabled={loading}
// // //         >
// // //           {loading ? 'Guardando...' : 'Guardar perfil'}
// // //         </button>
// // //       </form>
// // //     </div>
// // //   );
// // // }


// // // 'use client';
// // // import { useEffect, useState } from 'react';
// // // import { useAuth } from '@/context/AuthContext';
// // // import { useRouter } from 'next/navigation';

// // // export default function PerfilPage() {
// // //   const { user, isLoggedIn, isEmprendedor } = useAuth();
// // //   const router = useRouter();

// // //   const [form, setForm] = useState({
// // //     nombre: '',
// // //     apellido: '',
// // //     dni: '',
// // //     cuil: '',
// // //     direccion: '',
// // //     telefono: '',
// // //     genero: '',
// // //   });

// // //   const [loading, setLoading] = useState(false);

// // //   useEffect(() => {
// // //     if (!isLoggedIn) return router.push('/auth/login');
// // //     if (!isEmprendedor) return router.push('/403');
// // //     if (user?.emprendedorId) return router.push('/');
// // //   }, [isLoggedIn, isEmprendedor, user]);

// // //   const handleChange = (e) => {
// // //     const { name, value } = e.target;
// // //     setForm((prev) => ({ ...prev, [name]: value }));
// // //   };

// // //   const handleSubmit = async (e) => {
// // //     e.preventDefault();
// // //     setLoading(true);

// // //     try {
// // //       const res = await fetch('/api/emprendedores', {
// // //         method: 'POST',
// // //         headers: {
// // //           'Content-Type': 'application/json',
// // //         },
// // //         body: JSON.stringify(form),
// // //       });

// // //       if (!res.ok) throw new Error('Error al crear el perfil');

// // //       router.push('/');
// // //     } catch (err) {
// // //       alert(err.message);
// // //     } finally {
// // //       setLoading(false);
// // //     }
// // //   };

// // //   if (!isLoggedIn || !isEmprendedor || user?.emprendedorId) return null;

// // //   return (
// // //     <div className="max-w-xl mx-auto p-6">
// // //       <h1 className="text-2xl font-bold mb-4">Mi Perfil</h1>

// // //       <p><strong>Email:</strong> {user?.email}</p>
// // //       <p><strong>Rol:</strong> {user?.rol}</p>

// // //       <hr className="my-6" />

// // //       <h2 className="text-xl font-semibold mb-2">Completa tu perfil como emprendedor</h2>

// // //       <form onSubmit={handleSubmit} className="space-y-4">
// // //         <input
// // //           type="text"
// // //           name="nombre"
// // //           placeholder="Nombre"
// // //           value={form.nombre}
// // //           onChange={handleChange}
// // //           className="w-full p-2 border rounded"
// // //           required
// // //         />
// // //         <input
// // //           type="text"
// // //           name="apellido"
// // //           placeholder="Apellido"
// // //           value={form.apellido}
// // //           onChange={handleChange}
// // //           className="w-full p-2 border rounded"
// // //           required
// // //         />
// // //         <input
// // //           type="text"
// // //           name="dni"
// // //           placeholder="DNI"
// // //           value={form.dni}
// // //           onChange={handleChange}
// // //           className="w-full p-2 border rounded"
// // //           required
// // //         />
// // //         <input
// // //           type="text"
// // //           name="cuil"
// // //           placeholder="CUIL"
// // //           value={form.cuil}
// // //           onChange={handleChange}
// // //           className="w-full p-2 border rounded"
// // //           required
// // //         />
// // //         <input
// // //           type="text"
// // //           name="telefono"
// // //           placeholder="Teléfono"
// // //           value={form.telefono}
// // //           onChange={handleChange}
// // //           className="w-full p-2 border rounded"
// // //           required
// // //         />
// // //         <input
// // //           type="text"
// // //           name="direccion"
// // //           placeholder="Dirección"
// // //           value={form.direccion}
// // //           onChange={handleChange}
// // //           className="w-full p-2 border rounded"
// // //           required
// // //         />
// // //         <select
// // //           name="genero"
// // //           value={form.genero}
// // //           onChange={handleChange}
// // //           className="w-full p-2 border rounded"
// // //         >
// // //           <option value="Masculino">Masculino</option>
// // //           <option value="Femenino">Femenino</option>
// // //           <option value="PrefieroNoDecir">Prefiero no decir</option>
// // //         </select>

// // //         <button
// // //           type="submit"
// // //           className="w-full bg-blue-600 text-white p-2 rounded disabled:opacity-50"
// // //           disabled={loading}
// // //         >
// // //           {loading ? 'Guardando...' : 'Guardar perfil'}
// // //         </button>
// // //       </form>
// // //     </div>
// // //   );
// // // }


// // // 'use client';
// // // import { useEffect, useState } from 'react';
// // // import { useAuth } from '@/context/AuthContext';
// // // import { useRouter } from 'next/navigation';

// // // export default function PerfilPage() {
// // //   const { user, isLoggedIn, isEmprendedor } = useAuth();
// // //   const router = useRouter();

// // //   const [form, setForm] = useState({
// // //     nombre: '',
// // //     apellido: '',
// // //     dni: '',
// // //     cuil: '',
// // //     direccion: '',
// // //     telefono: '',
// // //     genero: '',
// // //   });

// // //   const [loading, setLoading] = useState(false);

// // //   useEffect(() => {
// // //     if (!isLoggedIn) return router.push('/auth/login');
// // //     if (!isEmprendedor) return router.push('/403');
// // //     if (user?.emprendedorId) return router.push('/');
// // //   }, [isLoggedIn, isEmprendedor, user]);

// // //   const handleChange = (e) => {
// // //     const { name, value } = e.target;
// // //     setForm((prev) => ({ ...prev, [name]: value }));
// // //   };

// // //   const handleSubmit = async (e) => {
// // //     e.preventDefault();
// // //     setLoading(true);

// // //     try {
// // //       const res = await fetch('/api/emprendedores', {
// // //         method: 'POST',
// // //         headers: {
// // //           'Content-Type': 'application/json',
// // //         },
// // //         body: JSON.stringify(form),
// // //       });

// // //       if (!res.ok) throw new Error('Error al crear el perfil');

// // //       router.push('/');
// // //     } catch (err) {
// // //       alert(err.message);
// // //     } finally {
// // //       setLoading(false);
// // //     }
// // //   };

// // //   if (!isLoggedIn || !isEmprendedor || user?.emprendedorId) return null;

// // //   return (
// // //     <div className="max-w-xl mx-auto p-6">
// // //       <h1 className="text-2xl font-bold mb-4">Mi Perfil</h1>

// // //       <p><strong>Email:</strong> {user?.email}</p>
// // //       <p><strong>Rol:</strong> {user?.rol}</p>

// // //       <hr className="my-6" />

// // //       <h2 className="text-xl font-semibold mb-2">Completa tu perfil como emprendedor</h2>

// // //       <form onSubmit={handleSubmit} className="space-y-4">
// // //         <input
// // //           type="text"
// // //           name="nombre"
// // //           placeholder="Nombre"
// // //           value={form.nombre}
// // //           onChange={handleChange}
// // //           className="w-full p-2 border rounded"
// // //           required
// // //         />
// // //         <input
// // //           type="text"
// // //           name="apellido"
// // //           placeholder="Apellido"
// // //           value={form.apellido}
// // //           onChange={handleChange}
// // //           className="w-full p-2 border rounded"
// // //           required
// // //         />
// // //         <input
// // //           type="text"
// // //           name="dni"
// // //           placeholder="DNI"
// // //           value={form.dni}
// // //           onChange={handleChange}
// // //           className="w-full p-2 border rounded"
// // //           required
// // //         />
// // //         <input
// // //           type="text"
// // //           name="cuil"
// // //           placeholder="CUIL"
// // //           value={form.cuil}
// // //           onChange={handleChange}
// // //           className="w-full p-2 border rounded"
// // //           required
// // //         />
// // //         <input
// // //           type="text"
// // //           name="telefono"
// // //           placeholder="Teléfono"
// // //           value={form.telefono}
// // //           onChange={handleChange}
// // //           className="w-full p-2 border rounded"
// // //           required
// // //         />
// // //         <input
// // //           type="text"
// // //           name="direccion"
// // //           placeholder="Dirección"
// // //           value={form.direccion}
// // //           onChange={handleChange}
// // //           className="w-full p-2 border rounded"
// // //           required
// // //         />
// // //         <select
// // //           name="genero"
// // //           value={form.genero}
// // //           onChange={handleChange}
// // //           className="w-full p-2 border rounded"
// // //         >
// // //           <option value="Masculino">Masculino</option>
// // //           <option value="Femenino">Femenino</option>
// // //           <option value="PrefieroNoDecir">Prefiero no decir</option>
// // //         </select>

// // //         <button
// // //           type="submit"
// // //           className="w-full bg-blue-600 text-white p-2 rounded disabled:opacity-50"
// // //           disabled={loading}
// // //         >
// // //           {loading ? 'Guardando...' : 'Guardar perfil'}
// // //         </button>
// // //       </form>
// // //     </div>
// // //   );
// // // }


// // // 'use client';
// // // import { useEffect, useState } from 'react';
// // // import { useAuth } from '@/context/AuthContext';
// // // import { useRouter } from 'next/navigation';

// // // export default function PerfilPage() {
// // //   const { user, isLoggedIn, isEmprendedor } = useAuth();
// // //   const router = useRouter();

// // //   const [form, setForm] = useState({
// // //     nombre: '',
// // //     apellido: '',
// // //     dni: '',
// // //     cuil: '',
// // //     direccion: '',
// // //     telefono: '',
// // //     genero: '',
// // //   });

// // //   const [loading, setLoading] = useState(false);

// // //   useEffect(() => {
// // //     if (!isLoggedIn) return router.push('/auth/login');
// // //     if (!isEmprendedor) return router.push('/403');
// // //     if (user?.emprendedorId) return router.push('/');
// // //   }, [isLoggedIn, isEmprendedor, user]);

// // //   const handleChange = (e) => {
// // //     const { name, value } = e.target;
// // //     setForm((prev) => ({ ...prev, [name]: value }));
// // //   };

// // //   const handleSubmit = async (e) => {
// // //     e.preventDefault();
// // //     setLoading(true);

// // //     try {
// // //       const res = await fetch('/api/emprendedores', {
// // //         method: 'POST',
// // //         headers: {
// // //           'Content-Type': 'application/json',
// // //         },
// // //         body: JSON.stringify(form),
// // //       });

// // //       if (!res.ok) throw new Error('Error al crear el perfil');

// // //       router.push('/');
// // //     } catch (err) {
// // //       alert(err.message);
// // //     } finally {
// // //       setLoading(false);
// // //     }
// // //   };

// // //   if (!isLoggedIn || !isEmprendedor || user?.emprendedorId) return null;

// // //   return (
// // //     <div className="max-w-xl mx-auto p-6">
// // //       <h1 className="text-2xl font-bold mb-4">Mi Perfil</h1>

// // //       <p><strong>Email:</strong> {user?.email}</p>
// // //       <p><strong>Rol:</strong> {user?.rol}</p>

// // //       <hr className="my-6" />

// // //       <h2 className="text-xl font-semibold mb-2">Completa tu perfil como emprendedor</h2>

// // //       <form onSubmit={handleSubmit} className="space-y-4">
// // //         <input
// // //           type="text"
// // //           name="nombre"
// // //           placeholder="Nombre"
// // //           value={form.nombre}
// // //           onChange={handleChange}
// // //           className="w-full p-2 border rounded"
// // //           required
// // //         />
// // //         <input
// // //           type="text"
// // //           name="apellido"
// // //           placeholder="Apellido"
// // //           value={form.apellido}
// // //           onChange={handleChange}
// // //           className="w-full p-2 border rounded"
// // //           required
// // //         />
// // //         <input
// // //           type="text"
// // //           name="dni"
// // //           placeholder="DNI"
// // //           value={form.dni}
// // //           onChange={handleChange}
// // //           className="w-full p-2 border rounded"
// // //           required
// // //         />
// // //         <input
// // //           type="text"
// // //           name="cuil"
// // //           placeholder="CUIL"
// // //           value={form.cuil}
// // //           onChange={handleChange}
// // //           className="w-full p-2 border rounded"
// // //           required
// // //         />
// // //         <input
// // //           type="text"
// // //           name="telefono"
// // //           placeholder="Teléfono"
// // //           value={form.telefono}
// // //           onChange={handleChange}
// // //           className="w-full p-2 border rounded"
// // //           required
// // //         />
// // //         <input
// // //           type="text"
// // //           name="direccion"
// // //           placeholder="Dirección"
// // //           value={form.direccion}
// // //           onChange={handleChange}
// // //           className="w-full p-2 border rounded"
// // //           required
// // //         />
// // //         <select
// // //           name="genero"
// // //           value={form.genero}
// // //           onChange={handleChange}
// // //           className="w-full p-2 border rounded"
// // //         >
// // //           <option value="Masculino">Masculino</option>
// // //           <option value="Femenino">Femenino</option>
// // //           <option value="PrefieroNoDecir">Prefiero no decir</option>
// // //         </select>

// // //         <button
// // //           type="submit"
// // //           className="w-full bg-blue-600 text-white p-2 rounded disabled:opacity-50"
// // //           disabled={loading}
// // //         >
// // //           {loading ? 'Guardando...' : 'Guardar perfil'}
// // //         </button>
// // //       </form>
// // //     </div>
// // //   );
// // // }


// // // 'use client';
// // // import { useEffect, useState } from 'react';
// // // import { useAuth } from '@/context/AuthContext';
// // // import { useRouter } from 'next/navigation';

// // // export default function PerfilPage() {
// // //   const { user, isLoggedIn, isEmprendedor } = useAuth();
// // //   const router = useRouter();

// // //   const [form, setForm] = useState({
// // //     nombre: '',
// // //     apellido: '',
// // //     dni: '',
// // //     cuil: '',
// // //     direccion: '',
// // //     telefono: '',
// // //     genero: '',
// // //   });

// // //   const [loading, setLoading] = useState(false);

// // //   useEffect(() => {
// // //     if (!isLoggedIn) return router.push('/auth/login');
// // //     if (!isEmprendedor) return router.push('/403');
// // //     if (user?.emprendedorId) return router.push('/');
// // //   }, [isLoggedIn, isEmprendedor, user]);

// // //   const handleChange = (e) => {
// // //     const { name, value } = e.target;
// // //     setForm((prev) => ({ ...prev, [name]: value }));
// // //   };

// // //   const handleSubmit = async (e) => {
// // //     e.preventDefault();
// // //     setLoading(true);

// // //     try {
// // //       const res = await fetch('/api/emprendedores', {
// // //         method: 'POST',
// // //         headers: {
// // //           'Content-Type': 'application/json',
// // //         },
// // //         body: JSON.stringify(form),
// // //       });

// // //       if (!res.ok) throw new Error('Error al crear el perfil');

// // //       router.push('/');
// // //     } catch (err) {
// // //       alert(err.message);
// // //     } finally {
// // //       setLoading(false);
// // //     }
// // //   };

// // //   if (!isLoggedIn || !isEmprendedor || user?.emprendedorId) return null;

// // //   return (
// // //     <div className="max-w-xl mx-auto p-6">
// // //       <h1 className="text-2xl font-bold mb-4">Mi Perfil</h1>

// // //       <p><strong>Email:</strong> {user?.email}</p>
// // //       <p><strong>Rol:</strong> {user?.rol}</p>

// // //       <hr className="my-6" />

// // //       <h2 className="text-xl font-semibold mb-2">Completa tu perfil como emprendedor</h2>

// // //       <form onSubmit={handleSubmit} className="space-y-4">
// // //         <input
// // //           type="text"
// // //           name="nombre"
// // //           placeholder="Nombre"
// // //           value={form.nombre}
// // //           onChange={handleChange}
// // //           className="w-full p-2 border rounded"
// // //           required
// // //         />
// // //         <input
// // //           type="text"
// // //           name="apellido"
// // //           placeholder="Apellido"
// // //           value={form.apellido}
// // //           onChange={handleChange}
// // //           className="w-full p-2 border rounded"
// // //           required
// // //         />
// // //         <input
// // //           type="text"
// // //           name="dni"
// // //           placeholder="DNI"
// // //           value={form.dni}
// // //           onChange={handleChange}
// // //           className="w-full p-2 border rounded"
// // //           required
// // //         />
// // //         <input
// // //           type="text"
// // //           name="cuil"
// // //           placeholder="CUIL"
// // //           value={form.cuil}
// // //           onChange={handleChange}
// // //           className="w-full p-2 border rounded"
// // //           required
// // //         />
// // //         <input
// // //           type="text"
// // //           name="telefono"
// // //           placeholder="Teléfono"
// // //           value={form.telefono}
// // //           onChange={handleChange}
// // //           className="w-full p-2 border rounded"
// // //           required
// // //         />
// // //         <input
// // //           type="text"
// // //           name="direccion"
// // //           placeholder="Dirección"
// // //           value={form.direccion}
 // //           onChange={handleChange}
 // //           className="w-full p-2 border rounded"
 // //           required
 // //         />
 // //         <select
 // //           name="genero"
 // //           value={form.genero}
 // //           onChange={handleChange}
 // //           className="w-full p-2 border rounded"
 // //         >
 // //           <option value="Masculino">Masculino</option>
 // //           <option value="Femenino">Femenino</option>
 // //           <option value="PrefieroNoDecir">Prefiero no decir</option>
 // //         </select>
 // //         <button
 // //           type="submit"
 // //           className="w-full bg-blue-600 text-white p-2 rounded disabled:opacity-50"
 // //           disabled={loading}
 // //         >
 // //           {loading ? 'Guardando...' : 'Guardar perfil'}
 // //         </button>
 // //       </form>
 // //     </div>
 // //   );
 // // }