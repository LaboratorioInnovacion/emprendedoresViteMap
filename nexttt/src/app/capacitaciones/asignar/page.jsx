"use client";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

const Page = () => {
  const [capacitaciones, setCapacitaciones] = useState([]);
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    capacitacionId: "",
    beneficiarioTipo: "Emprendedor",
    beneficiarioId: "",
  });
  const [asignando, setAsignando] = useState(false);
  const [mensaje, setMensaje] = useState("");
  const [asignaciones, setAsignaciones] = useState([]);
  const [loadingAsignaciones, setLoadingAsignaciones] = useState(false);
  const [emprendedores, setEmprendedores] = useState([]);
  const [emprendimientos, setEmprendimientos] = useState([]);
  const [emprendedoresOtros, setEmprendedoresOtros] = useState([]);
  const [loadingBenef, setLoadingBenef] = useState(false);
  const [busquedaBenef, setBusquedaBenef] = useState("");
  const [showListaBenef, setShowListaBenef] = useState(false);

  // Eliminar asignación
  const handleEliminarAsignacion = async (id) => {
    if (!window.confirm("¿Seguro que deseas eliminar esta asignación?")) return;
    try {
      const res = await fetch(`/api/asignacionCapacitacion/${id}`, {
        method: "DELETE",
      });
      if (!res.ok) throw new Error("Error al eliminar asignación");
      setMensaje("Asignación eliminada correctamente");
      await fetchAsignaciones();
    } catch (err) {
      setMensaje(err.message);
    }
  };

  // Cargar emprendedores y emprendimientos
  const fetchBeneficiarios = async () => {
    setLoadingBenef(true);
    const [resEmpre, resEmprend, resEmpreOtros] = await Promise.all([
      fetch("/api/emprendedores"),
      fetch("/api/emprendimientos"),
      fetch("/api/emprendedoresotros"),
    ]);
    const emprendedores = await resEmpre.json();
    const emprendimientos = await resEmprend.json();
    const emprendedoresOtros = await resEmpreOtros.json();
    setEmprendedores(emprendedores);
    setEmprendimientos(emprendimientos);
    setEmprendedoresOtros(emprendedoresOtros);
    setLoadingBenef(false);
  };

  const fetchAsignaciones = async () => {
    setLoadingAsignaciones(true);
    const res = await fetch("/api/asignacionCapacitacion");
    const data = await res.json();
    setAsignaciones(data);
    setLoadingAsignaciones(false);
  };

  const router = useRouter();

  const fetchCapacitaciones = async () => {
    setLoading(true);
    const res = await fetch("/api/capacitaciones");
    const data = await res.json();
    setCapacitaciones(data);
    setLoading(false);
  };

  useEffect(() => {
    fetchCapacitaciones();
    fetchAsignaciones();
    fetchBeneficiarios();
  }, []);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setAsignando(true);
    setMensaje("");
    // Construir el body según el tipo de beneficiario
    let body = {
      capacitacionId: Number(form.capacitacionId),
      beneficiarioTipo: form.beneficiarioTipo,
    };
    if (form.beneficiarioTipo === "Emprendedor") {
      body.emprendedorId = Number(form.beneficiarioId);
    } else if (form.beneficiarioTipo === "EmprendedorOtros") {
      body.emprendedorOtrosId = Number(form.beneficiarioId);
    } else if (form.beneficiarioTipo === "Emprendimiento") {
      body.emprendimientoId = Number(form.beneficiarioId);
    }
    try {
      const res = await fetch("/api/asignacionCapacitacion", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      if (!res.ok) throw new Error("Error al asignar capacitación");
      setMensaje("¡Capacitación asignada correctamente!");
      setForm({
        capacitacionId: "",
        beneficiarioTipo: "Emprendedor",
        beneficiarioId: "",
      });
      await fetchAsignaciones();
    } catch (err) {
      setMensaje(err.message);
    }
    setAsignando(false);
  };

  const beneficiariosFiltrados =
    form.beneficiarioTipo === "Emprendedor"
      ? busquedaBenef.trim() === ""
        ? emprendedores
        : emprendedores.filter((e) =>
            `${e.nombre} ${e.apellido}`
              .toLowerCase()
              .includes(busquedaBenef.toLowerCase())
          )
      : form.beneficiarioTipo === "EmprendedorOtros"
      ? busquedaBenef.trim() === ""
        ? emprendedoresOtros
        : emprendedoresOtros.filter((e) =>
            `${e.nombre} ${e.apellido}`
              .toLowerCase()
              .includes(busquedaBenef.toLowerCase())
          )
      : busquedaBenef.trim() === ""
      ? emprendimientos
      : emprendimientos.filter((e) =>
          (e.denominacion || "")
            .toLowerCase()
            .includes(busquedaBenef.toLowerCase())
        );

  return (
    <div className="max-w-6xl mx-auto p-2 sm:p-4 animate-fadeIn">
      {/* Formulario de asignación */}
      <div className="card mb-6 sm:mb-8 p-3 sm:p-6 shadow-lg">
        <h1 className="text-center mb-4 text-lg sm:text-2xl font-semibold">
          Asignar Capacitación
        </h1>
        <form onSubmit={handleSubmit} className="space-y-3 sm:space-y-4">
          <div className="flex flex-col gap-1">
            <label className="text-sm font-medium">Capacitación</label>
            <select
              name="capacitacionId"
              value={form.capacitacionId}
              onChange={handleChange}
              className="input input-bordered w-full text-sm"
              required
            >
              <option value="">Seleccione una capacitación</option>
              {capacitaciones.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.nombre}
                </option>
              ))}
            </select>
          </div>
          <div className="flex flex-col gap-1">
            <label className="text-sm font-medium">Tipo de beneficiario</label>
            <select
              name="beneficiarioTipo"
              value={form.beneficiarioTipo}
              onChange={handleChange}
              className="input input-bordered w-full text-sm"
              required
            >
              <option value="Emprendedor">Emprendedor</option>
              <option value="EmprendedorOtros">EmprendedorOtros</option>
              <option value="Emprendimiento">Emprendimiento</option>
            </select>
          </div>
          <div className="flex flex-col gap-1">
            <label className="text-sm font-medium">
              {form.beneficiarioTipo === "Emprendedor"
                ? "Emprendedor"
                : form.beneficiarioTipo === "EmprendedorOtros"
                ? "EmprendedorOtros"
                : "Emprendimiento"}
            </label>
            <div className="relative">
              <input
                type="text"
                value={busquedaBenef}
                onFocus={() => setShowListaBenef(true)}
                onChange={(e) => {
                  setBusquedaBenef(e.target.value);
                  setShowListaBenef(true);
                }}
                placeholder={
                  form.beneficiarioTipo === "Emprendedor"
                    ? "Buscar emprendedor..."
                    : form.beneficiarioTipo === "EmprendedorOtros"
                    ? "Buscar emprendedor otros..."
                    : "Buscar emprendimiento..."
                }
                className={`input input-bordered w-full text-sm mb-2 ${
                  form.beneficiarioId
                    ? "border-green-500 ring-2 ring-green-400"
                    : ""
                }`}
                disabled={loadingBenef}
                autoComplete="off"
              />
              {form.beneficiarioId && (
                <div className="mb-2 text-xs text-green-700 font-semibold flex items-center gap-2">
                  <span className="inline-block w-2 h-2 rounded-full bg-green-500"></span>
                  Seleccionado: {(() => {
                    if (form.beneficiarioTipo === "Emprendedor") {
                      const emp = emprendedores.find(
                        (e) => e.id === form.beneficiarioId
                      );
                      return emp
                        ? `${emp.nombre} ${emp.apellido} (ID: ${emp.id})`
                        : form.beneficiarioId;
                    } else if (form.beneficiarioTipo === "EmprendedorOtros") {
                      const emp = emprendedoresOtros.find(
                        (e) => e.id === form.beneficiarioId
                      );
                      return emp
                        ? `${emp.nombre} ${emp.apellido} (ID: ${emp.id})`
                        : form.beneficiarioId;
                    } else {
                      const emp = emprendimientos.find(
                        (e) => e.id === form.beneficiarioId
                      );
                      return emp
                        ? `${emp.denominacion} (ID: ${emp.id})`
                        : form.beneficiarioId;
                    }
                  })()}
                </div>
              )}
              {showListaBenef && (
                <ul className="absolute left-0 right-0 rounded bg-slate-700 max-h-48 overflow-y-auto mb-2 z-10">
                  {(() => {
                    let lista = [];
                    if (form.beneficiarioTipo === "Emprendedor") {
                      lista =
                        busquedaBenef.trim() === ""
                          ? emprendedores
                          : emprendedores.filter((e) =>
                              `${e.nombre} ${e.apellido}`
                                .toLowerCase()
                                .includes(busquedaBenef.toLowerCase())
                            );
                    } else if (form.beneficiarioTipo === "EmprendedorOtros") {
                      lista =
                        busquedaBenef.trim() === ""
                          ? emprendedoresOtros
                          : emprendedoresOtros.filter((e) =>
                              `${e.nombre} ${e.apellido}`
                                .toLowerCase()
                                .includes(busquedaBenef.toLowerCase())
                            );
                    } else {
                      lista =
                        busquedaBenef.trim() === ""
                          ? emprendimientos
                          : emprendimientos.filter((e) =>
                              (e.denominacion || "")
                                .toLowerCase()
                                .includes(busquedaBenef.toLowerCase())
                            );
                    }
                    return lista.length > 0 ? (
                      lista.map((e) => (
                        <li
                          key={e.id}
                          className={`px-3 py-2 cursor-pointer hover:bg-blue-700 ${
                            form.beneficiarioId === e.id
                              ? "bg-green-700 text-white font-bold"
                              : ""
                          }`}
                          onMouseDown={() => {
                            setForm((prev) => ({
                              ...prev,
                              beneficiarioId: e.id,
                            }));
                            setShowListaBenef(false);
                          }}
                        >
                          {form.beneficiarioTipo === "Emprendedor" ||
                          form.beneficiarioTipo === "EmprendedorOtros"
                            ? `${e.nombre} ${e.apellido} (ID: ${e.id})`
                            : `${e.denominacion} (ID: ${e.id})`}
                        </li>
                      ))
                    ) : (
                      <li className="px-3 py-2 text-gray-400">
                        {form.beneficiarioTipo === "Emprendedor"
                          ? "No se encontraron emprendedores"
                          : form.beneficiarioTipo === "EmprendedorOtros"
                          ? "No se encontraron emprendedores otros"
                          : "No se encontraron emprendimientos"}
                      </li>
                    );
                  })()}
                </ul>
              )}
            </div>
          </div>
          <button
            type="submit"
            className="btn btn-primary w-full text-base sm:text-lg"
            disabled={asignando}
          >
            {asignando ? "Asignando..." : "Asignar capacitación"}
          </button>
          {mensaje && (
            <div className="text-center mt-2 text-info text-sm">{mensaje}</div>
          )}
        </form>
      </div>

      {/* Tabla de capacitaciones */}
      <div className="card mb-6 sm:mb-8 p-2 sm:p-4 shadow-lg">
        <h2 className="mb-3 sm:mb-4 text-center text-white text-base sm:text-xl font-semibold">
          Listado de capacitaciones
        </h2>
        {loading ? (
          <p className="text-center">Cargando...</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full text-xs sm:text-sm rounded-lg border border-gray-200 dark:border-gray-700">
              <thead className="bg-gray-100 dark:bg-gray-800">
                <tr>
                  <th className="px-1 py-2 sm:px-2">ID</th>
                  <th className="px-1 py-2 sm:px-2">Nombre</th>
                  <th className="px-1 py-2 sm:px-2">Organismo</th>
                  <th className="px-1 py-2 sm:px-2">Cupo</th>
                </tr>
              </thead>
              <tbody>
                {capacitaciones.map((c) => (
                  <tr
                    key={c.id}
                    className="hover:bg-gray-50 dark:hover:bg-gray-900 transition-colors"
                  >
                    <td className="px-1 py-2 sm:px-2">{c.id}</td>
                    <td className="px-1 py-2 sm:px-2">{c.nombre}</td>
                    <td className="px-1 py-2 sm:px-2">{c.organismo}</td>
                    <td className="px-1 py-2 sm:px-2">{c.cupo}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Tabla de asignaciones */}
      <div className="card p-2 sm:p-4 shadow-lg">
        <h2 className="mb-3 sm:mb-4 text-center text-white text-base sm:text-xl font-semibold">
          Asignaciones recientes
        </h2>
        {loadingAsignaciones ? (
          <p className="text-center">Cargando...</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full text-xs sm:text-sm rounded-lg border border-gray-200 dark:border-gray-700">
              <thead className="bg-gray-100 dark:bg-gray-800">
                <tr>
                  <th className="px-1 py-2 sm:px-2">ID</th>
                  <th className="px-1 py-2 sm:px-2">Capacitación</th>
                  <th className="px-1 py-2 sm:px-2">Tipo Beneficiario</th>
                  <th className="px-1 py-2 sm:px-2">Beneficiario</th>
                  <th className="px-1 py-2 sm:px-2">Fecha</th>
                  <th className="px-1 py-2 sm:px-2">Eliminar</th>
                </tr>
              </thead>
              <tbody>
                {asignaciones.map((a) => (
                  <tr
                    key={a.id}
                    className="hover:bg-gray-50 dark:hover:bg-gray-900 transition-colors"
                  >
                    <td className="px-1 py-2 sm:px-2">{a.id}</td>
                    <td className="px-1 py-2 sm:px-2">
                      {a.capacitacion?.nombre ?? "-"}
                    </td>
                    <td className="px-1 py-2 sm:px-2">{a.beneficiarioTipo}</td>
                    <td className="px-1 py-2 sm:px-2">
                      {a.beneficiarioTipo === "Emprendedor"
                        ? a.emprendedor?.nombre
                          ? `${a.emprendedor.nombre} ${a.emprendedor.apellido}`
                          : a.emprendedorId
                        : a.beneficiarioTipo === "EmprendedorOtros"
                        ? a.emprendedorOtros?.nombre
                          ? `${a.emprendedorOtros.nombre} ${a.emprendedorOtros.apellido}`
                          : a.emprendedorOtrosId
                        : a.emprendimiento?.denominacion ?? a.emprendimientoId}
                    </td>
                    <td className="px-1 py-2 sm:px-2">
                      {a.createdAt
                        ? new Date(a.createdAt).toLocaleDateString()
                        : "-"}
                    </td>
                    <td className="px-1 py-2 sm:px-2">
                      <button
                        className="btn btn-xs btn-error"
                        title="Eliminar asignación"
                        onClick={() => handleEliminarAsignacion(a.id)}
                      >
                        Eliminar
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default Page;
