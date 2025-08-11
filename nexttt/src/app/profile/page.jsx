"use client";
import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import PerfilForm from "../../components/profile/PerfilForm";
import EmprendimientoForm from "../../components/profile/EmprendimientoForm";
import EmprendimientosList from "../../components/profile/EmprendimientosList";

 function PerfilPage() {
  const { data: session, status } = useSession();
  const [form, setForm] = useState(null);
  const [loading, setLoading] = useState(true);
  const [emprendimientos, setEmprendimientos] = useState([]);
  const [showEmprendimientoForm, setShowEmprendimientoForm] = useState(false);
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

  if (status === "loading" || loading) return <p className="text-center py-8">Cargando...</p>;
  if (!session) return <p className="text-center py-8 text-red-600">No estás logueado</p>;
  if (!form) return <p className="text-center py-8 text-red-600">No se pudo cargar el perfil</p>;

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="w-full max-w-6xl p-6 bg-white dark:bg-gray-800 rounded-lg shadow-lg">
        <h2 className="text-2xl font-bold text-gray-700 dark:text-gray-300 mb-4">Perfil de Usuario</h2>
        <div className="mb-6">
          <p className="text-gray-600 dark:text-gray-400">Email: {session.user.email}</p>
          <p className="text-gray-600 dark:text-gray-400">ID: {session.user.id}</p>
          <p className="text-gray-600 dark:text-gray-400">Rol: {session.user.rol}</p>
        </div>
        {error && <div className="mb-4 p-2 bg-red-100 text-red-700 rounded">{error}</div>}
        {success && <div className="mb-4 p-2 bg-green-100 text-green-700 rounded">{success}</div>}
        {session.user.rol === "EMPRENDEDOR" && (
          <>
            <PerfilForm form={form} handleChange={handleChange} setForm={setForm} handleSubmit={handleSubmit} />
            <div className="col-span-1 md:col-span-2 mt-8">
              <button
                type="button"
                className={`w-full py-2 px-4 rounded-md focus:ring-2 focus:ring-green-500 ${showEmprendimientoForm ? 'bg-gray-400' : 'bg-green-600 text-white hover:bg-green-700'}`}
                onClick={() => setShowEmprendimientoForm((prev) => !prev)}
                disabled={loadingEmprendimiento}
              >
                {showEmprendimientoForm ? "Cancelar" : "Agregar Emprendimiento"}
              </button>
            </div>
            {showEmprendimientoForm && (
              <EmprendimientoForm
                emprendimientoForm={emprendimientoForm}
                handleEmprendimientoChange={handleEmprendimientoChange}
                setEmprendimientoForm={setEmprendimientoForm}
                handleEmprendimientoSubmit={handleEmprendimientoSubmit}
                loadingEmprendimiento={loadingEmprendimiento}
                editEmprendimientoId={editEmprendimientoId}
              />
            )}
            <EmprendimientosList
              emprendimientos={emprendimientos}
              handleEditEmprendimiento={handleEditEmprendimiento}
              handleDeleteEmprendimiento={handleDeleteEmprendimiento}
              loading={loadingEmprendimiento}
            />
          </>
        )}
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