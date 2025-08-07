import UbicacionField from "./UbicacionField";

export default function PerfilForm({
  form,
  handleChange,
  setForm,
  handleSubmit,
}) {
  return (
    <form
      className="grid grid-cols-1 md:grid-cols-2 gap-6"
      onSubmit={handleSubmit}
    >
      {/* ...campos del emprendedor... */}
      {[
        "nombre",
        "apellido",
        "dni",
        "cuil",
        "fechaNacimiento",
        "genero",
        "departamento",
        "telefono",
      ].map((name) => (
        <div key={name}>
          <label className="block text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">
            {name.charAt(0).toUpperCase() + name.slice(1)}
          </label>
          <input
            type={name === "fechaNacimiento" ? "date" : "text"}
            name={name}
            value={
              name === "fechaNacimiento" && form[name]
                ? form[name].slice(0, 10)
                : form[name] || ""
            }
            onChange={handleChange}
            className="w-full p-2 border border-gray-300 rounded-md dark:bg-gray-700 dark:border-gray-600 focus:ring-2 focus:ring-primary-500"
          />
        </div>
      ))}
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
