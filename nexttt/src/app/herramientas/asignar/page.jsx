'use client'

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

const Page = () => {
  const [herramientas, setHerramientas] = useState([]);
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({ herramientaId: '', beneficiarioTipo: 'Emprendedor', beneficiarioId: '' });
  const [asignando, setAsignando] = useState(false);
  const [mensaje, setMensaje] = useState('');
  const [asignaciones, setAsignaciones] = useState([]);
  const [loadingAsignaciones, setLoadingAsignaciones] = useState(false);
  const [emprendedores, setEmprendedores] = useState([]);
  const [emprendimientos, setEmprendimientos] = useState([]);
  const [emprendedoresOtros, setEmprendedoresOtros] = useState([]);
  const [loadingBenef, setLoadingBenef] = useState(false);
  const [searchBenef, setSearchBenef] = useState('');

  // Eliminar asignación
  const handleEliminarAsignacion = async (id) => {
    if (!window.confirm('¿Seguro que deseas eliminar esta asignación?')) return;
    try {
      const res = await fetch(`/api/asignacion/${id}`, {
        method: 'DELETE',
      });
      if (!res.ok) throw new Error('Error al eliminar asignación');
      setMensaje('Asignación eliminada correctamente');
      await fetchAsignaciones();
    } catch (err) {
      setMensaje(err.message);
    }
  };
  // Cargar emprendedores y emprendimientos
  const fetchBeneficiarios = async () => {
    setLoadingBenef(true);
    const [resEmpre, resEmprend, resEmpreOtros] = await Promise.all([
      fetch('/api/emprendedores'),
      fetch('/api/emprendimientos'),
      fetch('/api/emprendedoresotros')
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
    const res = await fetch('/api/asignacion');
    const data = await res.json();
    setAsignaciones(data);
    setLoadingAsignaciones(false);
  };
  const router = useRouter();

  const fetchHerramientas = async () => {
    setLoading(true);
    const res = await fetch('/api/herramienta');
    const data = await res.json();
    setHerramientas(data);
    setLoading(false);
  };

  useEffect(() => {
    fetchHerramientas();
    fetchAsignaciones();
    fetchBeneficiarios();
  }, []);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setAsignando(true);
    setMensaje('');
    // Validar si ya está asignada la herramienta al beneficiario y tipo
    const yaAsignado = asignaciones.some(a =>
      a.herramientaId == form.herramientaId &&
      a.beneficiarioTipo === form.beneficiarioTipo &&
      ((form.beneficiarioTipo === 'Emprendedor' && a.emprendedorId == form.beneficiarioId) ||
       (form.beneficiarioTipo === 'EmprendedorOtros' && a.emprendedorOtrosId == form.beneficiarioId) ||
       (form.beneficiarioTipo === 'Emprendimiento' && a.emprendimientoId == form.beneficiarioId))
    );
    if (yaAsignado) {
      setMensaje('Este beneficiario ya tiene asignada esta herramienta.');
      setAsignando(false);
      return;
    }
    // Construir el body según el tipo de beneficiario
    let body = {
      herramientaId: Number(form.herramientaId),
      beneficiarioTipo: form.beneficiarioTipo,
    };
    if (form.beneficiarioTipo === 'Emprendedor') {
      body.emprendedorId = Number(form.beneficiarioId);
    } else if (form.beneficiarioTipo === 'EmprendedorOtros') {
      body.emprendedorOtrosId = Number(form.beneficiarioId);
    } else if (form.beneficiarioTipo === 'Emprendimiento') {
      body.emprendimientoId = Number(form.beneficiarioId);
    }
    try {
      const res = await fetch('/api/asignacion', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });
      if (!res.ok) throw new Error('Error al asignar herramienta');
      setMensaje('¡Herramienta asignada correctamente!');
      setForm({ herramientaId: '', beneficiarioTipo: 'Emprendedor', beneficiarioId: '' });
      await fetchAsignaciones();
    } catch (err) {
      setMensaje(err.message);
    }
    setAsignando(false);
  };

  return (
    <div className="max-w-6xl mx-auto p-2 sm:p-4 animate-fadeIn">
      {/* Formulario de asignación */}
      <div className="card mb-6 sm:mb-8 p-3 sm:p-6 shadow-lg">
        <h1 className="text-center mb-4 text-lg sm:text-2xl font-semibold">Asignar Herramienta</h1>
        <form onSubmit={handleSubmit} className="space-y-3 sm:space-y-4">
          <div className="flex flex-col gap-1">
            <label className="text-sm font-medium">Herramienta</label>
            <select
              name="herramientaId"
              value={form.herramientaId}
              onChange={handleChange}
              className="input input-bordered w-full text-sm"
              required
            >
              <option value="">Seleccione una herramienta</option>
              {herramientas.map((h) => (
                <option key={h.id} value={h.id}>{h.nombre}</option>
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
              {form.beneficiarioTipo === 'Emprendedor'
                ? 'Emprendedor'
                : form.beneficiarioTipo === 'EmprendedorOtros'
                ? 'EmprendedorOtros'
                : 'Emprendimiento'}
            </label>
            {/* Search input y dropdown para seleccionar beneficiario */}
            <div className="relative">
              <input
                type="text"
                className="input input-bordered w-full text-sm"
                placeholder={
                  form.beneficiarioTipo === 'Emprendedor'
                    ? 'Buscar emprendedor...'
                    : form.beneficiarioTipo === 'EmprendedorOtros'
                    ? 'Buscar emprendedor otros...'
                    : 'Buscar emprendimiento...'
                }
                value={searchBenef !== ''
                  ? searchBenef
                  : (
                      form.beneficiarioTipo === 'Emprendedor'
                        ? (emprendedores.find(e => e.id == form.beneficiarioId) ? `${emprendedores.find(e => e.id == form.beneficiarioId).nombre} ${emprendedores.find(e => e.id == form.beneficiarioId).apellido}` : '')
                        : form.beneficiarioTipo === 'EmprendedorOtros'
                        ? (emprendedoresOtros.find(e => e.id == form.beneficiarioId) ? `${emprendedoresOtros.find(e => e.id == form.beneficiarioId).nombre} ${emprendedoresOtros.find(e => e.id == form.beneficiarioId).apellido}` : '')
                        : (emprendimientos.find(e => e.id == form.beneficiarioId)?.denominacion || '')
                    )
                }
                onChange={e => {
                  setSearchBenef(e.target.value);
                  setForm({ ...form, beneficiarioId: '' });
                }}
                disabled={loadingBenef}
                required
                autoComplete="off"
              />
              {/* Dropdown de resultados filtrados */}
              {searchBenef && !form.beneficiarioId && (
                <div className="absolute z-10 w-full bg-slate-700 border border-gray-200 rounded shadow max-h-56 overflow-y-auto">
                  {(form.beneficiarioTipo === 'Emprendedor'
                    ? emprendedores.filter(e =>
                        (`${e.nombre} ${e.apellido} ${e.id}`.toLowerCase().includes(searchBenef.toLowerCase()))
                      )
                    : form.beneficiarioTipo === 'EmprendedorOtros'
                    ? emprendedoresOtros.filter(e =>
                        (`${e.nombre} ${e.apellido} ${e.id}`.toLowerCase().includes(searchBenef.toLowerCase()))
                      )
                    : emprendimientos.filter(e =>
                        (`${e.denominacion} ${e.id}`.toLowerCase().includes(searchBenef.toLowerCase()))
                      )
                  ).map(e => (
                    <div
                      key={e.id}
                      className="px-3 py-2 cursor-pointer hover:bg-gray-500 text-sm"
                      onClick={() => {
                        setForm({ ...form, beneficiarioId: e.id });
                        setSearchBenef('');
                      }}
                    >
                      {form.beneficiarioTipo === 'Emprendedor' || form.beneficiarioTipo === 'EmprendedorOtros'
                        ? `${e.nombre} ${e.apellido} (ID: ${e.id})`
                        : `${e.denominacion} (ID: ${e.id})`}
                    </div>
                  ))}
                  {((form.beneficiarioTipo === 'Emprendedor'
                    ? emprendedores.filter(e =>
                        (`${e.nombre} ${e.apellido} ${e.id}`.toLowerCase().includes(searchBenef.toLowerCase()))
                      )
                    : form.beneficiarioTipo === 'EmprendedorOtros'
                    ? emprendedoresOtros.filter(e =>
                        (`${e.nombre} ${e.apellido} ${e.id}`.toLowerCase().includes(searchBenef.toLowerCase()))
                      )
                    : emprendimientos.filter(e =>
                        (`${e.denominacion} ${e.id}`.toLowerCase().includes(searchBenef.toLowerCase()))
                      )
                  ).length === 0) && (
                    <div className="px-3 py-2 text-gray-400 text-sm">Sin resultados</div>
                  )}
                </div>
              )}
            </div>
            {/* Oculto el input real para enviar el id seleccionado */}
            <input type="hidden" name="beneficiarioId" value={form.beneficiarioId} required />
          </div>
          <button type="submit" className="btn btn-primary w-full text-base sm:text-lg" disabled={asignando}>
            {asignando ? 'Asignando...' : 'Asignar herramienta'}
          </button>
          {mensaje && <div className="text-center mt-2 text-info text-sm">{mensaje}</div>}
        </form>
      </div>

      {/* Tabla de herramientas */}
      <div className="card mb-6 sm:mb-8 p-2 sm:p-4 shadow-lg">
        <h2 className="mb-3 sm:mb-4 text-center text-white text-base sm:text-xl font-semibold">Listado de herramientas</h2>
        {loading ? <p className="text-center">Cargando...</p> : (
          <div className="overflow-x-auto">
            <table className="min-w-full text-xs sm:text-sm rounded-lg border border-gray-200 dark:border-gray-700">
              <thead className="bg-gray-100 dark:bg-gray-800">
                <tr>
                  <th className="px-1 py-2 sm:px-2">ID</th>
                  <th className="px-1 py-2 sm:px-2">Nombre</th>
                  <th className="px-1 py-2 sm:px-2">Tipo Beneficiario</th>
                  <th className="px-1 py-2 sm:px-2">Cupo</th>
                </tr>
              </thead>
              <tbody>
                {herramientas.map((h) => (
                  <tr key={h.id} className="hover:bg-gray-50 dark:hover:bg-gray-900 transition-colors">
                    <td className="px-1 py-2 sm:px-2">{h.id}</td>
                    <td className="px-1 py-2 sm:px-2">{h.nombre}</td>
                    <td className="px-1 py-2 sm:px-2">{h.tipoBeneficiario}</td>
                    <td className="px-1 py-2 sm:px-2">{h.cupo}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Tabla de asignaciones */}
      <div className="card p-2 sm:p-4 shadow-lg">
        <h2 className="mb-3 sm:mb-4 text-center text-white text-base sm:text-xl font-semibold">Asignaciones recientes</h2>
        {loadingAsignaciones ? <p className="text-center">Cargando...</p> : (
          <div className="overflow-x-auto">
            <table className="min-w-full text-xs sm:text-sm rounded-lg border border-gray-200 dark:border-gray-700">
              <thead className="bg-gray-100 dark:bg-gray-800">
                <tr>
                  <th className="px-1 py-2 sm:px-2">ID</th>
                  <th className="px-1 py-2 sm:px-2">Herramienta</th>
                  <th className="px-1 py-2 sm:px-2">Tipo Beneficiario</th>
                  <th className="px-1 py-2 sm:px-2">Beneficiario</th>
                  <th className="px-1 py-2 sm:px-2">Fecha</th>
                  <th className="px-1 py-2 sm:px-2">Eliminar</th>
                </tr>
              </thead>
              <tbody>
                {asignaciones.map((a) => (
                  <tr key={a.id} className="hover:bg-gray-50 dark:hover:bg-gray-900 transition-colors">
                    <td className="px-1 py-2 sm:px-2">{a.id}</td>
                    <td className="px-1 py-2 sm:px-2">{a.herramienta?.nombre ?? '-'}</td>
                    <td className="px-1 py-2 sm:px-2">{a.beneficiarioTipo}</td>
                    <td className="px-1 py-2 sm:px-2">
                      {a.beneficiarioTipo === 'Emprendedor'
                        ? (a.emprendedor?.nombre ? `${a.emprendedor.nombre} ${a.emprendedor.apellido}` : a.emprendedorId)
                        : a.beneficiarioTipo === 'EmprendedorOtros'
                        ? (a.emprendedorOtros?.nombre ? `${a.emprendedorOtros.nombre} ${a.emprendedorOtros.apellido}` : a.emprendedorOtrosId)
                        : (a.emprendimiento?.denominacion ?? a.emprendimientoId)}
                    </td>
                    <td className="px-1 py-2 sm:px-2">{a.createdAt ? new Date(a.createdAt).toLocaleDateString() : '-'}</td>
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