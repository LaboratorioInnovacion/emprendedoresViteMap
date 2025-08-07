import UbicacionField from "./UbicacionField";

export default function EmprendimientoForm({ emprendimientoForm, handleEmprendimientoChange, setEmprendimientoForm, handleEmprendimientoSubmit, loadingEmprendimiento, editEmprendimientoId }) {
  // Opciones de enums
  const etapaOptions = ["Idea", "EnMarcha", "Consolidado"];
  const tipoEmprendimientoOptions = ["Individual", "Asociativo", "Familiar", "Cooperativo"];
  const sectorOptions = ["ProduccionElaboracion", "Comercio", "Servicios"];
  const actividadOptions = [
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
    "Servicio_Otro",
  ];
  const planeaIncorporarOptions = ["Si", "No", "NoLoSabe"];
  const percepcionPlantaOptions = ["Adecuada", "Mayor", "Menor", "NoLoSabe"];

  return (
    <form className="w-full mt-6" onSubmit={handleEmprendimientoSubmit}>
      <div className="overflow-x-auto">
        <table className="min-w-full border border-gray-300 bg-white dark:bg-gray-800 rounded-lg">
          <tbody>
            <tr>
              <td className="p-2 font-semibold text-gray-700 dark:text-gray-300">Denominación</td>
              <td className="p-2"><input type="text" name="denominacion" value={emprendimientoForm.denominacion || ""} onChange={handleEmprendimientoChange} className="w-full p-2 border border-gray-300 rounded-md dark:bg-gray-700 dark:border-gray-600" /></td>
              <td className="p-2 font-semibold text-gray-700 dark:text-gray-300">Etapa</td>
              <td className="p-2"><select name="etapa" value={emprendimientoForm.etapa || ""} onChange={handleEmprendimientoChange} className="w-full p-2 border border-gray-300 rounded-md dark:bg-gray-700 dark:border-gray-600">{etapaOptions.map(opt => <option key={opt} value={opt}>{opt}</option>)}</select></td>
            </tr>
            <tr>
              <td className="p-2 font-semibold text-gray-700 dark:text-gray-300">Sector</td>
              <td className="p-2"><select name="sector" value={emprendimientoForm.sector || ""} onChange={handleEmprendimientoChange} className="w-full p-2 border border-gray-300 rounded-md dark:bg-gray-700 dark:border-gray-600">{sectorOptions.map(opt => <option key={opt} value={opt}>{opt}</option>)}</select></td>
              <td className="p-2 font-semibold text-gray-700 dark:text-gray-300">Actividad Principal</td>
              <td className="p-2"><select name="actividadPrincipal" value={emprendimientoForm.actividadPrincipal || ""} onChange={handleEmprendimientoChange} className="w-full p-2 border border-gray-300 rounded-md dark:bg-gray-700 dark:border-gray-600">{actividadOptions.map(opt => <option key={opt} value={opt}>{opt.replace(/_/g, " ")}</option>)}</select></td>
            </tr>
            <tr>
              <td className="p-2 font-semibold text-gray-700 dark:text-gray-300">Tipo de Emprendimiento</td>
              <td className="p-2"><select name="tipoEmprendimiento" value={emprendimientoForm.tipoEmprendimiento || ""} onChange={handleEmprendimientoChange} className="w-full p-2 border border-gray-300 rounded-md dark:bg-gray-700 dark:border-gray-600">{tipoEmprendimientoOptions.map(opt => <option key={opt} value={opt}>{opt}</option>)}</select></td>
              <td className="p-2 font-semibold text-gray-700 dark:text-gray-300">Dirección</td>
              <td className="p-2"><input type="text" name="direccion" value={emprendimientoForm.direccion || ""} onChange={handleEmprendimientoChange} className="w-full p-2 border border-gray-300 rounded-md dark:bg-gray-700 dark:border-gray-600" /></td>
            </tr>
            <tr>
              <td className="p-2 font-semibold text-gray-700 dark:text-gray-300">Teléfono</td>
              <td className="p-2"><input type="text" name="telefono" value={emprendimientoForm.telefono || ""} onChange={handleEmprendimientoChange} className="w-full p-2 border border-gray-300 rounded-md dark:bg-gray-700 dark:border-gray-600" /></td>
              <td className="p-2 font-semibold text-gray-700 dark:text-gray-300">Email</td>
              <td className="p-2"><input type="email" name="email" value={emprendimientoForm.email || ""} onChange={handleEmprendimientoChange} className="w-full p-2 border border-gray-300 rounded-md dark:bg-gray-700 dark:border-gray-600" /></td>
            </tr>
            <tr>
              <td className="p-2 font-semibold text-gray-700 dark:text-gray-300">Web</td>
              <td className="p-2"><input type="text" name="web" value={emprendimientoForm.web || ""} onChange={handleEmprendimientoChange} className="w-full p-2 border border-gray-300 rounded-md dark:bg-gray-700 dark:border-gray-600" /></td>
              <td className="p-2 font-semibold text-gray-700 dark:text-gray-300">Red Social 1</td>
              <td className="p-2"><input type="text" name="redSocial1" value={emprendimientoForm.redSocial1 || ""} onChange={handleEmprendimientoChange} className="w-full p-2 border border-gray-300 rounded-md dark:bg-gray-700 dark:border-gray-600" /></td>
            </tr>
            <tr>
              <td className="p-2 font-semibold text-gray-700 dark:text-gray-300">Red Social 2</td>
              <td className="p-2"><input type="text" name="redSocial2" value={emprendimientoForm.redSocial2 || ""} onChange={handleEmprendimientoChange} className="w-full p-2 border border-gray-300 rounded-md dark:bg-gray-700 dark:border-gray-600" /></td>
              <td className="p-2 font-semibold text-gray-700 dark:text-gray-300">Inscripción ARCA</td>
              <td className="p-2"><input type="checkbox" name="inscripcionArca" checked={!!emprendimientoForm.inscripcionArca} onChange={handleEmprendimientoChange} className="form-checkbox h-4 w-4 text-green-600" /></td>
            </tr>
            <tr>
              <td className="p-2 font-semibold text-gray-700 dark:text-gray-300">Cuit</td>
              <td className="p-2"><input type="text" name="cuit" value={emprendimientoForm.cuit || ""} onChange={handleEmprendimientoChange} className="w-full p-2 border border-gray-300 rounded-md dark:bg-gray-700 dark:border-gray-600" /></td>
              <td className="p-2 font-semibold text-gray-700 dark:text-gray-300">Cantidad Personal</td>
              <td className="p-2"><input type="number" name="cantidadPersonal" value={emprendimientoForm.cantidadPersonal || 0} onChange={handleEmprendimientoChange} className="w-full p-2 border border-gray-300 rounded-md dark:bg-gray-700 dark:border-gray-600" min="0" /></td>
            </tr>
            <tr>
              <td className="p-2 font-semibold text-gray-700 dark:text-gray-300">Modo Incorporación Personal</td>
              <td className="p-2"><input type="text" name="modoIncorporacionPersonal" value={emprendimientoForm.modoIncorporacionPersonal || ""} onChange={handleEmprendimientoChange} className="w-full p-2 border border-gray-300 rounded-md dark:bg-gray-700 dark:border-gray-600" /></td>
              <td className="p-2 font-semibold text-gray-700 dark:text-gray-300">Planea Incorporar Personal</td>
              <td className="p-2"><select name="planeaIncorporarPersonal" value={emprendimientoForm.planeaIncorporarPersonal || ""} onChange={handleEmprendimientoChange} className="w-full p-2 border border-gray-300 rounded-md dark:bg-gray-700 dark:border-gray-600">{planeaIncorporarOptions.map(opt => <option key={opt} value={opt}>{opt}</option>)}</select></td>
            </tr>
            <tr>
              <td className="p-2 font-semibold text-gray-700 dark:text-gray-300">Percepción Planta Personal</td>
              <td className="p-2"><select name="percepcionPlantaPersonal" value={emprendimientoForm.percepcionPlantaPersonal || ""} onChange={handleEmprendimientoChange} className="w-full p-2 border border-gray-300 rounded-md dark:bg-gray-700 dark:border-gray-600">{percepcionPlantaOptions.map(opt => <option key={opt} value={opt}>{opt}</option>)}</select></td>
              <td className="p-2 font-semibold text-gray-700 dark:text-gray-300">¿Tiene Personal?</td>
              <td className="p-2"><input type="checkbox" name="tienePersonal" checked={!!emprendimientoForm.tienePersonal} onChange={handleEmprendimientoChange} className="form-checkbox h-4 w-4 text-green-600" /></td>
            </tr>
            <tr>
              <td className="p-2 font-semibold text-gray-700 dark:text-gray-300">¿Requiere Capacitación?</td>
              <td className="p-2"><input type="checkbox" name="requiereCapacitacion" checked={!!emprendimientoForm.requiereCapacitacion} onChange={handleEmprendimientoChange} className="form-checkbox h-4 w-4 text-blue-600" /></td>
              <td className="p-2 font-semibold text-gray-700 dark:text-gray-300">¿Requiere Herramientas Tecno?</td>
              <td className="p-2"><input type="checkbox" name="requiereHerramientasTecno" checked={!!emprendimientoForm.requiereHerramientasTecno} onChange={handleEmprendimientoChange} className="form-checkbox h-4 w-4 text-purple-600" /></td>
            </tr>
            {/* Puedes seguir agregando más campos aquí en el mismo formato */}
          </tbody>
        </table>
      </div>
      <div className="mt-6">
        <UbicacionField
          ubicacion={emprendimientoForm.ubicacion}
          setUbicacion={(ubicacion) => setEmprendimientoForm((prev) => ({ ...prev, ubicacion }))}
        />
      </div>
      <div className="mt-6">
        <button
          type="submit"
          className="w-full py-2 px-4 bg-green-600 text-white rounded-md hover:bg-green-700 focus:ring-2 focus:ring-green-500"
          disabled={loadingEmprendimiento}
        >
          {loadingEmprendimiento ? "Guardando..." : editEmprendimientoId ? "Actualizar Emprendimiento" : "Guardar Emprendimiento"}
        </button>
      </div>
    </form>
  );
}
