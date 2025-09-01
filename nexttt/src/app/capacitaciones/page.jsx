"use client"
import React, { useEffect, useState } from 'react';
import { FaTrash, FaEdit, FaPlus, FaUserPlus } from 'react-icons/fa';
import { useRouter } from 'next/navigation';

const Page = () => {
  const [capacitaciones, setCapacitaciones] = useState([]);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const fetchCapacitaciones = async () => {
    setLoading(true);
    const res = await fetch('/api/capacitaciones');
    const data = await res.json();
    setCapacitaciones(data);
    setLoading(false);
  };

  useEffect(() => {
    fetchCapacitaciones();
  }, []);

  const handleDelete = async (id) => {
    if (!window.confirm('¿Eliminar capacitación?')) return;
    try {
      const res = await fetch(`/api/capacitaciones/${id}`, {
        method: 'DELETE',
      });
      if (!res.ok) throw new Error('Error al eliminar');
      fetchCapacitaciones();
    } catch (err) {
      alert(err.message);
    }
  };

  return (
    <div className="max-w-8xl mx-auto p-4 animate-fadeIn">
      <div className="card mb-8 shadow-lg border border-gray-200 dark:border-gray-700">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
          <h1 className="text-center md:text-left text-3xl font-bold tracking-tight text-primary-700 dark:text-primary-300">Capacitaciones</h1>
          <div className="flex gap-2 justify-center md:justify-end">
            <button className="btn btn-primary flex items-center gap-2" onClick={() => router.push('/capacitaciones/new')}>
              <FaPlus className="text-white" /> Nueva capacitación
            </button>
            <button className="btn btn-primary flex items-center gap-2" onClick={() => router.push('/capacitaciones/asignar')}>
              <FaUserPlus className="text-white" /> Asignar capacitación
            </button>
          </div>
        </div>
        <h2 className="mb-6 text-center text-xl font-semibold text-gray-800 dark:text-white">Listado de capacitaciones</h2>
        {loading ? (
          <p className="text-center text-lg text-gray-500">Cargando...</p>
        ) : (
          <>
            {/* Desktop: tabla, Mobile: tarjetas */}
            <div className="hidden md:block overflow-x-auto animate-fadeIn">
              <table className="w-full rounded-lg text-sm border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900">
                <thead className="bg-gray-100 dark:bg-gray-800">
                  <tr>
                    <th className="px-2 py-2">ID</th>
                    <th className="px-2 py-2">Nombre</th>
                    <th className="px-2 py-2">Tipo</th>
                    <th className="px-2 py-2">Organismo</th>
                    <th className="px-2 py-2">Modalidad</th>
                    <th className="px-2 py-2">Descripción</th>
                    <th className="px-2 py-2">Inicio</th>
                    <th className="px-2 py-2">Fin</th>
                    <th className="px-2 py-2">Cupo</th>
                    <th className="px-2 py-2">Observaciones</th>
                    <th className="px-2 py-2">Eliminar</th>
                    <th className="px-2 py-2">Editar</th>
                  </tr>
                </thead>
                <tbody>
                  {capacitaciones.map((c, idx) => (
                    <tr key={c.id} className={`transition-colors ${idx % 2 === 0 ? 'bg-gray-50 dark:bg-gray-900' : 'bg-white dark:bg-gray-800'} hover:bg-primary-50 dark:hover:bg-primary-900`}>
                      <td className="px-2 py-2 font-mono text-xs text-gray-500">{c.id}</td>
                      <td className="px-2 py-2">
                        <button
                          className="text-primary-700 underline hover:text-primary-900 font-semibold"
                          style={{ background: 'none', border: 'none', padding: 0, cursor: 'pointer' }}
                          onClick={() => router.push(`/capacitaciones/${c.id}`)}
                        >
                          {c.nombre}
                        </button>
                      </td>
                      <td className="px-2 py-2">{Array.isArray(c.tipo) ? c.tipo.join(', ') : c.tipo}</td>
                      <td className="px-2 py-2">{c.organismo}</td>
                      <td className="px-2 py-2">{c.modalidad ?? '-'}</td>
                      <td className="px-2 py-2">{c.descripcion ?? '-'}</td>
                      <td className="px-2 py-2">{c.fechaInicio ? new Date(c.fechaInicio).toLocaleDateString() : '-'}</td>
                      <td className="px-2 py-2">{c.fechaFin ? new Date(c.fechaFin).toLocaleDateString() : '-'}</td>
                      <td className="px-2 py-2">{c.cupo ?? '-'}</td>
                      <td className="px-2 py-2">{c.observaciones ?? '-'}</td>
                      <td className="px-2 py-2">
                        <button onClick={() => handleDelete(c.id)} className="btn btn-error btn-xs flex items-center gap-1" title="Eliminar">
                          <FaTrash />
                        </button>
                      </td>
                      <td className="px-2 py-2">
                        <button onClick={() => router.push(`/capacitaciones/${c.id}/edit`)} className="btn btn-primary btn-xs flex items-center gap-1" title="Editar">
                          <FaEdit />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            {/* Mobile: tarjetas */}
            <div className="md:hidden space-y-6 animate-fadeIn">
              {capacitaciones.map((c) => (
                <div key={c.id} className="rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 p-5 shadow-lg transition-transform hover:scale-[1.01]">
                  <div className="flex justify-between items-center mb-2">
                    <span className="font-bold text-primary-700 dark:text-primary-300 text-lg">{c.nombre}</span>
                    <div className="flex gap-2">
                      <button onClick={() => router.push(`/capacitaciones/${c.id}/edit`)} className="btn btn-xs btn-primary flex items-center gap-1" title="Editar">
                        <FaEdit />
                      </button>
                      <button onClick={() => handleDelete(c.id)} className="btn btn-xs btn-error flex items-center gap-1" title="Eliminar">
                        <FaTrash />
                      </button>
                    </div>
                  </div>
                  <div className="text-xs text-gray-600 dark:text-gray-300 mb-1"><b>ID:</b> {c.id}</div>
                  <div className="text-xs text-gray-600 dark:text-gray-300 mb-1"><b>Tipo:</b> {Array.isArray(c.tipo) ? c.tipo.join(', ') : c.tipo}</div>
                  <div className="text-xs text-gray-600 dark:text-gray-300 mb-1"><b>Organismo:</b> {c.organismo}</div>
                  <div className="text-xs text-gray-600 dark:text-gray-300 mb-1"><b>Modalidad:</b> {c.modalidad ?? '-'}</div>
                  <div className="text-xs text-gray-600 dark:text-gray-300 mb-1"><b>Descripción:</b> {c.descripcion ?? '-'}</div>
                  <div className="text-xs text-gray-600 dark:text-gray-300 mb-1"><b>Inicio:</b> {c.fechaInicio ? new Date(c.fechaInicio).toLocaleDateString() : '-'}</div>
                  <div className="text-xs text-gray-600 dark:text-gray-300 mb-1"><b>Fin:</b> {c.fechaFin ? new Date(c.fechaFin).toLocaleDateString() : '-'}</div>
                  <div className="text-xs text-gray-600 dark:text-gray-300 mb-1"><b>Cupo:</b> {c.cupo ?? '-'}</div>
                  <div className="text-xs text-gray-600 dark:text-gray-300 mb-1"><b>Observaciones:</b> {c.observaciones ?? '-'}</div>
                  <button
                    className="text-primary-700 underline hover:text-primary-900 font-semibold mt-2"
                    style={{ background: 'none', border: 'none', padding: 0, cursor: 'pointer' }}
                    onClick={() => router.push(`/capacitaciones/${c.id}`)}
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