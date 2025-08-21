
import UbicacionField from "./UbicacionField";

const GENEROS = [
  { value: "MASCULINO", label: "Masculino" },
  { value: "FEMENINO", label: "Femenino" },
  { value: "OTRO", label: "Otro" },
];
const NIVELES_ESTUDIOS = [
  { value: "PRIMARIO", label: "Primario" },
  { value: "SECUNDARIO", label: "Secundario" },
  { value: "TERCIARIO", label: "Terciario" },
  { value: "UNIVERSITARIO", label: "Universitario" },
  { value: "POSGRADO", label: "Posgrado" },
];
const MOTIVACIONES = [
  { value: "INDEPENDENCIA", label: "Independencia" },
  { value: "NECESIDAD", label: "Necesidad" },
  { value: "OPORTUNIDAD", label: "Oportunidad" },
  { value: "OTRO", label: "Otro" },
];
const TIPOS_SUSTENTO = [
  "Trabajo en relación de dependencia",
  "Jubilación/Pensión",
  "Ayuda familiar",
  "Subsidio estatal",
  "Otro",
];

export default function PerfilForm({
  form,
  handleChange,
  setForm,
  handleSubmit,
}) {
  // Handler para checkboxes de tiposSustento
  const handleTiposSustento = (e) => {
    const { value, checked } = e.target;
    setForm((prev) => ({
      ...prev,
      tiposSustento: checked
        ? [...(prev.tiposSustento || []), value]
        : (prev.tiposSustento || []).filter((v) => v !== value),
    }));
  };

  return (
    <form
      className="grid grid-cols-1 md:grid-cols-2 gap-6"
      onSubmit={handleSubmit}
    >
      {/* Campos básicos */}
      <div>
        <label className="block text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">Nombre</label>
        <input type="text" name="nombre" value={form.nombre || ""} onChange={handleChange} className="w-full p-2 border border-gray-300 rounded-md dark:bg-gray-700 dark:border-gray-600 focus:ring-2 focus:ring-primary-500" />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">Apellido</label>
        <input type="text" name="apellido" value={form.apellido || ""} onChange={handleChange} className="w-full p-2 border border-gray-300 rounded-md dark:bg-gray-700 dark:border-gray-600 focus:ring-2 focus:ring-primary-500" />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">DNI</label>
        <input type="text" name="dni" value={form.dni || ""} onChange={handleChange} className="w-full p-2 border border-gray-300 rounded-md dark:bg-gray-700 dark:border-gray-600 focus:ring-2 focus:ring-primary-500" />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">CUIL</label>
        <input type="text" name="cuil" value={form.cuil || ""} onChange={handleChange} className="w-full p-2 border border-gray-300 rounded-md dark:bg-gray-700 dark:border-gray-600 focus:ring-2 focus:ring-primary-500" />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">Fecha de Nacimiento</label>
        <input type="date" name="fechaNacimiento" value={form.fechaNacimiento ? form.fechaNacimiento.slice(0,10) : ""} onChange={handleChange} className="w-full p-2 border border-gray-300 rounded-md dark:bg-gray-700 dark:border-gray-600 focus:ring-2 focus:ring-primary-500" />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">Género</label>
        <select name="genero" value={form.genero || ""} onChange={handleChange} className="w-full p-2 border border-gray-300 rounded-md dark:bg-gray-700 dark:border-gray-600">
          <option value="">Seleccionar</option>
          {GENEROS.map((g) => <option key={g.value} value={g.value}>{g.label}</option>)}
        </select>
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">País de Origen</label>
        <input type="text" name="paisOrigen" value={form.paisOrigen || ""} onChange={handleChange} className="w-full p-2 border border-gray-300 rounded-md dark:bg-gray-700 dark:border-gray-600" />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">Ciudad de Origen</label>
        <input type="text" name="ciudadOrigen" value={form.ciudadOrigen || ""} onChange={handleChange} className="w-full p-2 border border-gray-300 rounded-md dark:bg-gray-700 dark:border-gray-600" />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">Departamento</label>
        <input type="text" name="departamento" value={form.departamento || ""} onChange={handleChange} className="w-full p-2 border border-gray-300 rounded-md dark:bg-gray-700 dark:border-gray-600" />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">Dirección</label>
        <input type="text" name="direccion" value={form.direccion || ""} onChange={handleChange} className="w-full p-2 border border-gray-300 rounded-md dark:bg-gray-700 dark:border-gray-600" />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">Nivel de Estudios</label>
        <select name="nivelEstudios" value={form.nivelEstudios || ""} onChange={handleChange} className="w-full p-2 border border-gray-300 rounded-md dark:bg-gray-700 dark:border-gray-600">
          <option value="">Seleccionar</option>
          {NIVELES_ESTUDIOS.map((n) => <option key={n.value} value={n.value}>{n.label}</option>)}
        </select>
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">Motivación para Emprender</label>
        <select name="motivacionEmprender" value={form.motivacionEmprender || ""} onChange={handleChange} className="w-full p-2 border border-gray-300 rounded-md dark:bg-gray-700 dark:border-gray-600">
          <option value="">Seleccionar</option>
          {MOTIVACIONES.map((m) => <option key={m.value} value={m.value}>{m.label}</option>)}
        </select>
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">Cantidad de Emprendimientos</label>
        <input type="number" name="cantidadEmprendimientos" value={form.cantidadEmprendimientos || ""} onChange={handleChange} className="w-full p-2 border border-gray-300 rounded-md dark:bg-gray-700 dark:border-gray-600" />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">¿Posee otros sustentos?</label>
        <input type="checkbox" name="poseeOtrosSustentos" checked={!!form.poseeOtrosSustentos} onChange={handleChange} className="mr-2" />
      </div>
      <div className="md:col-span-2">
        <label className="block text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">Tipos de Sustento</label>
        <div className="flex flex-wrap gap-2">
          {TIPOS_SUSTENTO.map((tipo) => (
            <label key={tipo} className="flex items-center gap-1">
              <input
                type="checkbox"
                value={tipo}
                checked={form.tiposSustento?.includes(tipo) || false}
                onChange={handleTiposSustento}
              />
              <span className="text-xs">{tipo}</span>
            </label>
          ))}
        </div>
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">¿Tiene dependientes económicos?</label>
        <input type="checkbox" name="tieneDependientesEconomicos" checked={!!form.tieneDependientesEconomicos} onChange={handleChange} className="mr-2" />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">Teléfono</label>
        <input type="text" name="telefono" value={form.telefono || ""} onChange={handleChange} className="w-full p-2 border border-gray-300 rounded-md dark:bg-gray-700 dark:border-gray-600" />
      </div>
      {/* Foto DNI (url simple) */}
      <div className="md:col-span-2">
        <label className="block text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">Foto DNI (URL)</label>
        <input type="text" name="fotoDni" value={form.fotoDni || ""} onChange={handleChange} className="w-full p-2 border border-gray-300 rounded-md dark:bg-gray-700 dark:border-gray-600" />
        {form.fotoDni && (
          <img src={form.fotoDni} alt="Foto DNI" className="mt-2 max-h-32 rounded" />
        )}
      </div>
      {/* Ubicación (mapa) */}
      <UbicacionField
        ubicacion={form.ubicacion}
        setUbicacion={(ubicacion) =>
          setForm((prev) => ({ ...prev, ubicacion }))
        }
      />
      <div className="col-span-1 md:col-span-2">
        <button
          type="submit"
          className="w-full py-2 px-4 bg-primary-600 text-white rounded-md hover:bg-primary-700 focus:ring-2 focus:ring-primary-500"
        >
          {form.id ? "Actualizar" : "Guardar"}
        </button>
      </div>
    </form>
  );
}
