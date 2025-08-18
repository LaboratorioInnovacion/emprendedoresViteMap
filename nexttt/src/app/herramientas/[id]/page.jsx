
'use client';
import React, { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';

const Page = () => {
  const params = useParams();
  const router = useRouter();
  const [herramienta, setHerramienta] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchHerramienta = async () => {
      setLoading(true);
      try {
        const res = await fetch(`/api/herramienta/${params.id}`);
        const data = await res.json();
        if (res.ok) {
          setHerramienta(data);
        } else {
          setError(data.error || 'No encontrada');
        }
      } catch (err) {
        setError('Error al cargar la herramienta');
      }
      setLoading(false);
    };
    if (params.id) fetchHerramienta();
  }, [params.id]);

  if (loading) {
    return <div className="max-w-xl mx-auto p-8 card text-center">Cargando...</div>;
  }
  if (error) {
    return <div className="max-w-xl mx-auto p-8 card text-center text-red-600">{error}</div>;
  }
  if (!herramienta) {
    return null;
  }

  return (
    <div className="max-w-7xl mx-auto p-6 animate-fadeIn">
      <div className="card">
        <h1 className="mb-4 text-center">Detalle de Herramienta</h1>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <span className="font-semibold">ID:</span> {herramienta.id}
          </div>
          <div>
            <span className="font-semibold">Nombre:</span> {herramienta.nombre}
          </div>
          <div>
            <span className="font-semibold">Origen Tipo:</span> {Array.isArray(herramienta.origenTipo) ? herramienta.origenTipo.join(', ') : herramienta.origenTipo}
          </div>
          <div>
            <span className="font-semibold">Origen Organismo:</span> {herramienta.origenOrganismo}
          </div>
          <div>
            <span className="font-semibold">Tipo Beneficiario:</span> {herramienta.tipoBeneficiario}
          </div>
          <div>
            <span className="font-semibold">Tipo Herramienta Emprendimiento:</span> {Array.isArray(herramienta.tipoHerramientaEmprendimiento) ? herramienta.tipoHerramientaEmprendimiento.join(', ') : herramienta.tipoHerramientaEmprendimiento}
          </div>
          <div>
            <span className="font-semibold">Tipo Herramienta Emprendedor:</span> {Array.isArray(herramienta.tipoHerramientaEmprendedor) ? herramienta.tipoHerramientaEmprendedor.join(', ') : herramienta.tipoHerramientaEmprendedor}
          </div>
          <div>
            <span className="font-semibold">Monto Total:</span> {herramienta.montoTotal ?? '-'}
          </div>
          <div>
            <span className="font-semibold">Monto por Beneficiario:</span> {herramienta.montoPorBeneficiario ?? '-'}
          </div>
          <div>
            <span className="font-semibold">Posee Vencimiento:</span> {herramienta.poseeVencimiento ? 'Sí' : 'No'}
          </div>
          <div>
            <span className="font-semibold">Fecha Inicio Vigencia:</span> {herramienta.fechaInicioVigencia ? new Date(herramienta.fechaInicioVigencia).toLocaleDateString() : '-'}
          </div>
          <div>
            <span className="font-semibold">Fecha Fin Vigencia:</span> {herramienta.fechaFinVigencia ? new Date(herramienta.fechaFinVigencia).toLocaleDateString() : '-'}
          </div>
          <div>
            <span className="font-semibold">Cupo:</span> {herramienta.cupo}
          </div>
          <div className="md:col-span-2">
            <span className="font-semibold">Observaciones:</span> {herramienta.observaciones ?? '-'}
          </div>
        </div>
        <div className="flex justify-end mt-6">
          <button className="btn btn-outline" onClick={() => router.back()}>Volver</button>
        </div>
      </div>
    </div>
  );
};

export default Page;