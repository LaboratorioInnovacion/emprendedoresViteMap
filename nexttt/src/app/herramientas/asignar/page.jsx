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
  const [loadingBenef, setLoadingBenef] = useState(false);
  // Cargar emprendedores y emprendimientos
  const fetchBeneficiarios = async () => {
    setLoadingBenef(true);
    const [resEmpre, resEmprend] = await Promise.all([
      fetch('/api/emprendedores'),
      fetch('/api/emprendimientos')
    ]);
    const emprendedores = await resEmpre.json();
    const emprendimientos = await resEmprend.json();
    setEmprendedores(emprendedores);
    setEmprendimientos(emprendimientos);
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
    // Construir el body según el tipo de beneficiario
    const body = {
      herramientaId: Number(form.herramientaId),
      beneficiarioTipo: form.beneficiarioTipo,
      // Solo uno de los dos:
      ...(form.beneficiarioTipo === 'Emprendedor'
        ? { emprendedorId: Number(form.beneficiarioId) }
        : { emprendimientoId: Number(form.beneficiarioId) })
    };
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
              <option value="Emprendimiento">Emprendimiento</option>
            </select>
          </div>
          <div className="flex flex-col gap-1">
            <label className="text-sm font-medium">
              {form.beneficiarioTipo === 'Emprendedor' ? 'Emprendedor' : 'Emprendimiento'}
            </label>
            {form.beneficiarioTipo === 'Emprendedor' ? (
              <select
                name="beneficiarioId"
                value={form.beneficiarioId}
                onChange={handleChange}
                className="input input-bordered w-full text-sm"
                required
                disabled={loadingBenef}
              >
                <option value="">Seleccione un emprendedor</option>
                {emprendedores.map((e) => (
                  <option key={e.id} value={e.id}>{e.nombre} {e.apellido} (ID: {e.id})</option>
                ))}
              </select>
            ) : (
              <select
                name="beneficiarioId"
                value={form.beneficiarioId}
                onChange={handleChange}
                className="input input-bordered w-full text-sm"
                required
                disabled={loadingBenef}
              >
                <option value="">Seleccione un emprendimiento</option>
                {emprendimientos.map((e) => (
                  <option key={e.id} value={e.id}>{e.denominacion} (ID: {e.id})</option>
                ))}
              </select>
            )}
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
                        : (a.emprendimiento?.denominacion ?? a.emprendimientoId)}
                    </td>
                    <td className="px-1 py-2 sm:px-2">{a.createdAt ? new Date(a.createdAt).toLocaleDateString() : '-'}</td>
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