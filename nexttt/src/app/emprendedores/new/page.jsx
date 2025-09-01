
"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import  BusinessMap  from "../../../components/map/BusinessMap";

const niveles = [
  "SinEscolarizar",
  "PrimarioIncompleto",
  "PrimarioCompleto",
  "SecundarioIncompleto",
  "SecundarioCompleto",
  "TerciarioUniversitarioIncompleto",
  "TerciarioUniversitarioCompleto",
  "Posgrado",
];

const motivaciones = [
  "Pasion",
  "Independencia",
  "Oportunidad",
  "NecesidadEconomica",
  "Otro",
];


export default function CrearEmprendedorPage() {
  const router = useRouter();
    const [form, setForm] = useState({
      nombre: "",
      apellido: "",
      dni: "",
      cuil: "",
      fechaNacimiento: "",
      direccion: "",
      departamento: "",
      telefono: "",
      genero: "Masculino",
      nivelEstudios: "PrimarioCompleto",
      motivacionEmprender: "Pasion",
      tiposSustento: [],
      poseeOtrosSustentos: false,
      tieneDependientesEconomicos: false,
      paisOrigen: "",
      ciudadOrigen: "",
      cantidadEmprendimientos: 1,
      ubicacion: { lat: -28.6037, lng: -65.3816 },
      // fotoDni: "", // Added field for photo DNI
    });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [fieldErrors, setFieldErrors] = useState({});

  // Validación de campos
  const validate = () => {
    const errors = {};
    if (!form.nombre.trim()) errors.nombre = "El nombre es obligatorio";
    if (!form.apellido.trim()) errors.apellido = "El apellido es obligatorio";
    if (!form.dni.trim()) errors.dni = "El DNI es obligatorio";
    else if (!/^\d{7,10}$/.test(form.dni.trim())) errors.dni = "DNI inválido";
    if (form.cuil && !/^\d{11}$/.test(form.cuil.trim())) errors.cuil = "CUIL debe tener 11 dígitos";
    if (form.fechaNacimiento && isNaN(Date.parse(form.fechaNacimiento))) errors.fechaNacimiento = "Fecha inválida";
    if (!form.nivelEstudios) errors.nivelEstudios = "Selecciona un nivel de estudios";
    if (!form.motivacionEmprender) errors.motivacionEmprender = "Selecciona una motivación";
    if (form.cantidadEmprendimientos !== null && form.cantidadEmprendimientos !== undefined && form.cantidadEmprendimientos !== "") {
      if (isNaN(Number(form.cantidadEmprendimientos)) || Number(form.cantidadEmprendimientos) < 0) errors.cantidadEmprendimientos = "Debe ser un número positivo";
    }
    if (!form.ubicacion || typeof form.ubicacion.lat !== "number" || typeof form.ubicacion.lng !== "number") errors.ubicacion = "Selecciona una ubicación válida";
    return errors;
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    if (name === "tiposSustento") {
      setForm((prev) => ({ ...prev, tiposSustento: value.split(",").map((s) => s.trim()).filter(Boolean) }));
      setFieldErrors((prev) => ({ ...prev, tiposSustento: undefined }));
      return;
    }
    setForm((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
    setFieldErrors((prev) => ({ ...prev, [name]: undefined }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    const errors = validate();
    setFieldErrors(errors);
    if (Object.keys(errors).length > 0) return;
    setLoading(true);
    // Adaptar la ubicación y cantidadEmprendimientos
    const adaptedForm = {
      ...form,
      cantidadEmprendimientos: form.cantidadEmprendimientos !== undefined && form.cantidadEmprendimientos !== null && form.cantidadEmprendimientos !== ""
        ? Number(form.cantidadEmprendimientos)
        : null,
      ubicacion: form.ubicacion ? JSON.stringify(form.ubicacion) : null,
    };
    try {
      const res = await fetch("/api/emprendedoresnew", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(adaptedForm),
        credentials: "include", // Esto asegura que la cookie de sesión viaje
      });
      const data = await res.json();
      setLoading(false);
      if (res.ok) {
        setSuccess("Emprendedor creado correctamente");
        setTimeout(() => router.push("/emprendedores"), 1200);
      } else {
        setError(data.error || "Error al crear el emprendedor");
      }
    } catch (err) {
      setError("Error de red: " + err.message);
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 dark:bg-gray-900">
      <div className="w-full max-w-6xl p-4 sm:p-8 bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 flex flex-col gap-8">
        <h2 className="text-2xl font-bold text-center text-primary-700 dark:text-primary-200 mb-4">Crear nuevo emprendedor</h2>
        <form className="space-y-4" onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 sm:gap-4">
            <div className="flex flex-col gap-1">
              <label htmlFor="nombre" className="text-xs text-gray-500">Nombre</label>
              <input id="nombre" className={`w-full p-2 text-sm border rounded dark:bg-gray-900 ${fieldErrors.nombre ? 'border-red-500' : 'border-gray-300 dark:border-gray-700'}`} name="nombre" placeholder="Nombre" value={form.nombre} onChange={handleChange} autoComplete="off" required />
              {fieldErrors.nombre && <span className="text-xs text-red-600">{fieldErrors.nombre}</span>}
            </div>
            <div className="flex flex-col gap-1">
              <label htmlFor="apellido" className="text-xs text-gray-500">Apellido</label>
              <input id="apellido" className={`w-full p-2 text-sm border rounded dark:bg-gray-900 ${fieldErrors.apellido ? 'border-red-500' : 'border-gray-300 dark:border-gray-700'}`} name="apellido" placeholder="Apellido" value={form.apellido} onChange={handleChange} autoComplete="off" required />
              {fieldErrors.apellido && <span className="text-xs text-red-600">{fieldErrors.apellido}</span>}
            </div>
            <div className="flex flex-col gap-1">
              <label htmlFor="dni" className="text-xs text-gray-500">DNI</label>
              <input id="dni" className={`w-full p-2 text-sm border rounded dark:bg-gray-900 ${fieldErrors.dni ? 'border-red-500' : 'border-gray-300 dark:border-gray-700'}`} name="dni" placeholder="DNI" value={form.dni} onChange={handleChange} autoComplete="off" required />
              {fieldErrors.dni && <span className="text-xs text-red-600">{fieldErrors.dni}</span>}
            </div>
            <div className="flex flex-col gap-1">
              <label htmlFor="cuil" className="text-xs text-gray-500">CUIL/CUIT</label>
              <input id="cuil" className={`w-full p-2 text-sm border rounded dark:bg-gray-900 ${fieldErrors.cuil ? 'border-red-500' : 'border-gray-300 dark:border-gray-700'}`} name="cuil" placeholder="CUIL" value={form.cuil} onChange={handleChange} autoComplete="off" />
              {fieldErrors.cuil && <span className="text-xs text-red-600">{fieldErrors.cuil}</span>}
            </div>
            <div className="flex flex-col gap-1">
              <label htmlFor="fechaNacimiento" className="text-xs text-gray-500">Fecha de nacimiento</label>
              <input id="fechaNacimiento" className={`w-full p-2 text-sm border rounded dark:bg-gray-900 ${fieldErrors.fechaNacimiento ? 'border-red-500' : 'border-gray-300 dark:border-gray-700'}`} name="fechaNacimiento" type="date" value={form.fechaNacimiento} onChange={handleChange} />
              {fieldErrors.fechaNacimiento && <span className="text-xs text-red-600">{fieldErrors.fechaNacimiento}</span>}
            </div>
            <div className="flex flex-col gap-1">
              <label htmlFor="genero" className="text-xs text-gray-500">Género</label>
              <select id="genero" className="w-full p-2 text-sm border border-gray-300 rounded dark:bg-gray-900 dark:border-gray-700" name="genero" value={form.genero} onChange={handleChange}>
                <option value="Masculino">Masculino</option>
                <option value="Femenino">Femenino</option>
                <option value="PrefieroNoDecir">Prefiero no decir</option>
              </select>
            </div>
            <div className="flex flex-col gap-1">
              <label htmlFor="paisOrigen" className="text-xs text-gray-500">País de origen</label>
              <input id="paisOrigen" className="w-full p-2 text-sm border border-gray-300 rounded dark:bg-gray-900 dark:border-gray-700" name="paisOrigen" placeholder="País de origen" value={form.paisOrigen} onChange={handleChange} autoComplete="off" />
            </div>
            <div className="flex flex-col gap-1">
              <label htmlFor="ciudadOrigen" className="text-xs text-gray-500">Ciudad de origen</label>
              <input id="ciudadOrigen" className="w-full p-2 text-sm border border-gray-300 rounded dark:bg-gray-900 dark:border-gray-700" name="ciudadOrigen" placeholder="Ciudad de origen" value={form.ciudadOrigen} onChange={handleChange} autoComplete="off" />
            </div>
            <div className="flex flex-col gap-1">
              <label htmlFor="nivelEstudios" className="text-xs text-gray-500">Nivel de estudios</label>
              <select id="nivelEstudios" className={`w-full p-2 text-sm border rounded dark:bg-gray-900 ${fieldErrors.nivelEstudios ? 'border-red-500' : 'border-gray-300 dark:border-gray-700'}`} name="nivelEstudios" value={form.nivelEstudios} onChange={handleChange}>
                {niveles.map((n) => <option key={n} value={n}>{n.replace(/([A-Z])/g, ' $1').trim()}</option>)}
              </select>
              {fieldErrors.nivelEstudios && <span className="text-xs text-red-600">{fieldErrors.nivelEstudios}</span>}
            </div>
            <div className="flex flex-col gap-1">
              <label htmlFor="motivacionEmprender" className="text-xs text-gray-500">Motivación para emprender</label>
              <select id="motivacionEmprender" className={`w-full p-2 text-sm border rounded dark:bg-gray-900 ${fieldErrors.motivacionEmprender ? 'border-red-500' : 'border-gray-300 dark:border-gray-700'}`} name="motivacionEmprender" value={form.motivacionEmprender} onChange={handleChange}>
                {motivaciones.map((m) => <option key={m} value={m}>{m.replace(/([A-Z])/g, ' $1').trim()}</option>)}
              </select>
              {fieldErrors.motivacionEmprender && <span className="text-xs text-red-600">{fieldErrors.motivacionEmprender}</span>}
            </div>
            <div className="flex flex-col gap-1">
              <label htmlFor="departamento" className="text-xs text-gray-500">Departamento/localidad</label>
              <input id="departamento" className="w-full p-2 text-sm border border-gray-300 rounded dark:bg-gray-900 dark:border-gray-700" name="departamento" placeholder="Departamento" value={form.departamento} onChange={handleChange} autoComplete="off" />
            </div>
            <div className="flex flex-col gap-1">
              <label htmlFor="direccion" className="text-xs text-gray-500">Dirección</label>
              <input id="direccion" className="w-full p-2 text-sm border border-gray-300 rounded dark:bg-gray-900 dark:border-gray-700" name="direccion" placeholder="Dirección" value={form.direccion} onChange={handleChange} autoComplete="off" />
            </div>
            <div className="flex flex-col gap-1">
              <label htmlFor="telefono" className="text-xs text-gray-500">Teléfono</label>
              <input id="telefono" className="w-full p-2 text-sm border border-gray-300 rounded dark:bg-gray-900 dark:border-gray-700" name="telefono" placeholder="Teléfono" value={form.telefono} onChange={handleChange} autoComplete="off" />
            </div>
            <div className="flex flex-col gap-1">
              <label htmlFor="cantidadEmprendimientos" className="text-xs text-gray-500">Cantidad de emprendimientos</label>
              <input id="cantidadEmprendimientos" className={`w-full p-2 text-sm border rounded dark:bg-gray-900 ${fieldErrors.cantidadEmprendimientos ? 'border-red-500' : 'border-gray-300 dark:border-gray-700'}`} name="cantidadEmprendimientos" type="number" min="0" value={form.cantidadEmprendimientos} onChange={handleChange} />
              {fieldErrors.cantidadEmprendimientos && <span className="text-xs text-red-600">{fieldErrors.cantidadEmprendimientos}</span>}
            </div>
            <div className="flex items-center gap-2 mt-2">
              <input type="checkbox" id="poseeOtrosSustentos" name="poseeOtrosSustentos" checked={!!form.poseeOtrosSustentos} onChange={handleChange} className="mr-2" />
              <label htmlFor="poseeOtrosSustentos" className="text-xs text-gray-500">¿Posee otros sustentos?</label>
              <span className="text-xs">{form.poseeOtrosSustentos ? "Sí" : "No"}</span>
            </div>
            <div className="flex flex-col gap-1 col-span-1 sm:col-span-2">
              <label htmlFor="tiposSustento" className="text-xs text-gray-500">Tipos de sustento (separados por coma)</label>
              <input id="tiposSustento" className="w-full p-2 text-sm border border-gray-300 rounded dark:bg-gray-900 dark:border-gray-700" name="tiposSustento" placeholder="Ej: Trabajo, Jubilación, Otro" value={form.tiposSustento.join(", ")} onChange={handleChange} />
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
              className={`w-full p-2 border rounded dark:bg-gray-900 text-sm ${fieldErrors.ubicacion ? 'border-red-500' : 'border-primary-300 dark:border-primary-700'}`}
              name="ubicacion"
              placeholder="Latitud, Longitud"
              value={form.ubicacion ? `${form.ubicacion.lat}, ${form.ubicacion.lng}` : ""}
              readOnly
            />
            {fieldErrors.ubicacion && <span className="text-xs text-red-600">{fieldErrors.ubicacion}</span>}
            <div className="h-80 rounded-lg overflow-hidden border border-primary-200 dark:border-primary-700 mt-2">
              <div className="px-3 py-1 text-primary-700 dark:text-primary-200 font-semibold text-sm border-b border-primary-100 dark:border-primary-700 bg-primary-50 dark:bg-primary-900">Selecciona la ubicación en el mapa</div>
              <BusinessMap
                emprendedores={[{
                  id: 0,
                  name: form.nombre || "Ubicación",
                  type: "Emprendedor",
                  address: form.direccion || "",
                  location: form.ubicacion,
                  imageUrl: undefined,
                  status: "active",
                  contact: {},
                  description: `Dirección: ${form.direccion || "No especificada"}\nCoordenadas: ${form.ubicacion ? `${form.ubicacion.lat}, ${form.ubicacion.lng}` : "-"}`,
                  createdAt: null,
                  updatedAt: null,
                }]}
                defaultViewport={{ center: [form.ubicacion?.lat || -28.6037, form.ubicacion?.lng || -65.3816], zoom: 13 }}
                selectionMode={true}
                onLocationSelect={(lat, lng) => {
                  setForm((prev) => ({
                    ...prev,
                    ubicacion: { lat, lng },
                  }));
                  setFieldErrors((prev) => ({ ...prev, ubicacion: undefined }));
                }}
                markerIconColor="primary"
                showMarker={true}
                showPopup={true}
              />
            </div>
          </div>
          <button type="submit" className="w-full py-2 px-4 bg-primary-600 text-white rounded hover:bg-primary-700 transition-all duration-200 flex items-center justify-center shadow text-base font-semibold mt-2">
            {loading ? <span className="animate-spin h-5 w-5 mr-2 border-2 border-white border-t-transparent rounded-full"></span> : null}
            Guardar
          </button>
        </form>
        {error && <div className="mt-4 p-2 bg-red-100 text-red-700 rounded text-center font-semibold shadow">{error}</div>}
        {success && <div className="mt-4 p-2 bg-green-100 text-green-700 rounded text-center font-semibold shadow">{success}</div>}
      </div>
    </div>
  );
}
