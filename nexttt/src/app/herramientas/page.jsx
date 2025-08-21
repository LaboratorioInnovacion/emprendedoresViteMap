'use client'
import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';


const Page = () => {
  const [herramientas, setHerramientas] = useState([]);
  const [loading, setLoading] = useState(false);
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
  }, []);

  const handleDelete = async (id) => {
    if (!window.confirm('¿Eliminar herramienta?')) return;
    try {
      const res = await fetch('/api/herramienta', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id }),
      });
      if (!res.ok) throw new Error('Error al eliminar');
      fetchHerramientas();
    } catch (err) {
      alert(err.message);
    }
  };

  return (
    <div className="max-w-8xl mx-auto p-4 animate-fadeIn">
      <div className="card mb-8">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-4">
          <h1 className="text-center md:text-left">Herramientas de Apoyo</h1>
          <button className="btn btn-primary" onClick={() => router.push('/herramientas/new')}>Nueva herramienta</button>
        </div>
        <h2 className="mb-4 text-center text-white">Listado de herramientas</h2>
        {loading ? (
          <p className="text-center">Cargando...</p>
        ) : (
          <>
            {/* Desktop: tabla, Mobile: tarjetas */}
            <div className="hidden md:block overflow-x-auto">
              <table className="w-full rounded-lg text-sm border border-gray-200 dark:border-gray-700">
                <thead className="bg-gray-100 dark:bg-gray-800">
                  <tr>
                    <th className="px-2 py-2">ID</th>
                    <th className="px-2 py-2">Nombre</th>
                    <th className="px-2 py-2">Origen Tipo</th>
                    <th className="px-2 py-2">Organismo</th>
                    <th className="px-2 py-2">Tipo Beneficiario</th>
                    <th className="px-2 py-2">Tipo Herr. Emprendimiento</th>
                    <th className="px-2 py-2">Tipo Herr. Emprendedor</th>
                    <th className="px-2 py-2">Monto Total</th>
                    <th className="px-2 py-2">Monto x Beneficiario</th>
                    <th className="px-2 py-2">Vencimiento</th>
                    <th className="px-2 py-2">Inicio Vigencia</th>
                    <th className="px-2 py-2">Fin Vigencia</th>
                    <th className="px-2 py-2">Cupo</th>
                    <th className="px-2 py-2">Observaciones</th>
                    <th className="px-2 py-2">Eliminar</th>
                    <th className="px-2 py-2">Editar</th>
                  </tr>
                </thead>
                <tbody>
                  {herramientas.map((h) => (
                    <tr key={h.id} className="hover:bg-gray-50 dark:hover:bg-gray-900 transition-colors">
                      <td className="px-2 py-2">{h.id}</td>
                      <td className="px-2 py-2">
                        <button
                          className="text-primary-700 underline hover:text-primary-900 font-semibold"
                          style={{ background: 'none', border: 'none', padding: 0, cursor: 'pointer' }}
                          onClick={() => router.push(`/herramientas/${h.id}`)}
                        >
                          {h.nombre}
                        </button>
                      </td>
                      <td className="px-2 py-2">{Array.isArray(h.origenTipo) ? h.origenTipo.join(', ') : h.origenTipo}</td>
                      <td className="px-2 py-2">{h.origenOrganismo}</td>
                      <td className="px-2 py-2">{h.tipoBeneficiario}</td>
                      <td className="px-2 py-2">{Array.isArray(h.tipoHerramientaEmprendimiento) ? h.tipoHerramientaEmprendimiento.join(', ') : h.tipoHerramientaEmprendimiento}</td>
                      <td className="px-2 py-2">{Array.isArray(h.tipoHerramientaEmprendedor) ? h.tipoHerramientaEmprendedor.join(', ') : h.tipoHerramientaEmprendedor}</td>
                      <td className="px-2 py-2">{h.montoTotal ?? '-'}</td>
                      <td className="px-2 py-2">{h.montoPorBeneficiario ?? '-'}</td>
                      <td className="px-2 py-2">{h.poseeVencimiento ? 'Sí' : 'No'}</td>
                      <td className="px-2 py-2">{h.fechaInicioVigencia ? new Date(h.fechaInicioVigencia).toLocaleDateString() : '-'}</td>
                      <td className="px-2 py-2">{h.fechaFinVigencia ? new Date(h.fechaFinVigencia).toLocaleDateString() : '-'}</td>
                      <td className="px-2 py-2">{h.cupo}</td>
                      <td className="px-2 py-2">{h.observaciones ?? '-'}</td>
                      <td className="px-2 py-2">
                        <button onClick={() => handleDelete(h.id)} className="btn btn-error btn-xs">Eliminar</button>
                      </td>
                      <td className="px-2 py-2">
                        <button onClick={() => router.push(`/herramientas/${h.id}/edit`)} className="btn btn-error btn-xs">Editar</button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            {/* Mobile: tarjetas */}
            <div className="md:hidden space-y-4">
              {herramientas.map((h) => (
                <div key={h.id} className="rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 p-4 shadow-card">
                  <div className="flex justify-between items-center mb-2">
                    <span className="font-bold text-primary-700 dark:text-primary-300">{h.nombre}</span>
                    <div className="flex gap-2">
                      <button onClick={() => router.push(`/herramientas/${h.id}/edit`)} className="btn btn-xs btn-primary">Editar</button>
                      <button onClick={() => handleDelete(h.id)} className="btn btn-xs btn-error">Eliminar</button>
                    </div>
                  </div>
                  <div className="text-xs text-gray-600 dark:text-gray-300 mb-1"><b>ID:</b> {h.id}</div>
                  <div className="text-xs text-gray-600 dark:text-gray-300 mb-1"><b>Origen Tipo:</b> {Array.isArray(h.origenTipo) ? h.origenTipo.join(', ') : h.origenTipo}</div>
                  <div className="text-xs text-gray-600 dark:text-gray-300 mb-1"><b>Organismo:</b> {h.origenOrganismo}</div>
                  <div className="text-xs text-gray-600 dark:text-gray-300 mb-1"><b>Tipo Beneficiario:</b> {h.tipoBeneficiario}</div>
                  <div className="text-xs text-gray-600 dark:text-gray-300 mb-1"><b>Tipo Herr. Emprendimiento:</b> {Array.isArray(h.tipoHerramientaEmprendimiento) ? h.tipoHerramientaEmprendimiento.join(', ') : h.tipoHerramientaEmprendimiento}</div>
                  <div className="text-xs text-gray-600 dark:text-gray-300 mb-1"><b>Tipo Herr. Emprendedor:</b> {Array.isArray(h.tipoHerramientaEmprendedor) ? h.tipoHerramientaEmprendedor.join(', ') : h.tipoHerramientaEmprendedor}</div>
                  <div className="text-xs text-gray-600 dark:text-gray-300 mb-1"><b>Monto Total:</b> {h.montoTotal ?? '-'}</div>
                  <div className="text-xs text-gray-600 dark:text-gray-300 mb-1"><b>Monto x Beneficiario:</b> {h.montoPorBeneficiario ?? '-'}</div>
                  <div className="text-xs text-gray-600 dark:text-gray-300 mb-1"><b>Vencimiento:</b> {h.poseeVencimiento ? 'Sí' : 'No'}</div>
                  <div className="text-xs text-gray-600 dark:text-gray-300 mb-1"><b>Inicio Vigencia:</b> {h.fechaInicioVigencia ? new Date(h.fechaInicioVigencia).toLocaleDateString() : '-'}</div>
                  <div className="text-xs text-gray-600 dark:text-gray-300 mb-1"><b>Fin Vigencia:</b> {h.fechaFinVigencia ? new Date(h.fechaFinVigencia).toLocaleDateString() : '-'}</div>
                  <div className="text-xs text-gray-600 dark:text-gray-300 mb-1"><b>Cupo:</b> {h.cupo}</div>
                  <div className="text-xs text-gray-600 dark:text-gray-300 mb-1"><b>Observaciones:</b> {h.observaciones ?? '-'}</div>
                  <button
                    className="text-primary-700 underline hover:text-primary-900 font-semibold mt-2"
                    style={{ background: 'none', border: 'none', padding: 0, cursor: 'pointer' }}
                    onClick={() => router.push(`/herramientas/${h.id}`)}
                  >
                    Ver detalle
                  </button>
                </div>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default Page;