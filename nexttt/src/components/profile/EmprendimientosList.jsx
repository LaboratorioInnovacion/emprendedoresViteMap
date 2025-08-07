import { useState } from "react";

function EmprendimientoDetails({ emp }) {
  // Muestra todos los campos del emprendimiento en formato tabla
  return (
    <div className="mt-4 p-4 bg-white dark:bg-gray-800 rounded shadow border border-gray-200 dark:border-gray-700">
      <table className="w-full text-sm">
        <tbody>
          {Object.entries(emp).map(([key, value]) => (
            <tr key={key}>
              <td className="font-semibold text-gray-600 dark:text-gray-300 pr-2 align-top">{key}</td>
              <td className="text-gray-700 dark:text-gray-200 break-all">{typeof value === "object" ? JSON.stringify(value) : String(value)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default function EmprendimientosList({ emprendimientos, handleEditEmprendimiento, handleDeleteEmprendimiento }) {
  const [openId, setOpenId] = useState(null);
  return (
    <div className="col-span-1 md:col-span-2 mt-10">
      <h3 className="text-xl font-bold text-gray-700 dark:text-gray-300 mb-4">Mis Emprendimientos</h3>
      {emprendimientos.length === 0 ? (
        <p className="text-gray-500">No tienes emprendimientos registrados.</p>
      ) : (
        <ul className="space-y-4">
          {emprendimientos.map((emp) => {
            const isOpen = openId === emp.id;
            return (
              <li key={emp.id} className="p-4 bg-gray-100 dark:bg-gray-700 rounded-md shadow">
                <div className="flex flex-col md:flex-row md:items-center md:justify-between">
                  <div>
                    <button
                      className="font-semibold text-left text-lg text-primary-700 dark:text-primary-300 focus:outline-none"
                      onClick={() => setOpenId(isOpen ? null : emp.id)}
                    >
                      {emp.denominacion} <span className="text-sm text-gray-500">({emp.etapa})</span>
                    </button>
                    <div className="text-sm text-gray-600 dark:text-gray-300">{emp.sector} - {emp.actividadPrincipal}</div>
                    <div className="text-xs text-gray-400">{emp.direccion}</div>
                  </div>
                  <div className="flex gap-2 mt-2 md:mt-0">
                    <button className="px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600" onClick={() => handleEditEmprendimiento(emp)}>Editar</button>
                    <button className="px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600" onClick={() => handleDeleteEmprendimiento(emp.id)}>Eliminar</button>
                  </div>
                </div>
                {isOpen && <EmprendimientoDetails emp={emp} />}
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}
