"use client";
import React, { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";

const Page = () => {
  const params = useParams();
  const router = useRouter();
  const [capacitacion, setCapacitacion] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchCapacitacion = async () => {
      try {
        const res = await fetch(`/api/capacitaciones/${params.id}`);
        if (!res.ok) throw new Error("No encontrada");
        const data = await res.json();
        setCapacitacion(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    if (params.id) fetchCapacitacion();
  }, [params.id]);

  if (loading) return <div className="p-8 text-center text-lg">Cargando...</div>;
  if (error) return <div className="p-8 text-center text-red-600">{error}</div>;
  if (!capacitacion) return <div className="p-8 text-center">No encontrada</div>;

  return (
    <div className="max-w-2xl mx-auto p-4 animate-fadeIn">
      <div className="card shadow-lg border border-gray-200 dark:border-gray-700 p-6">
        <h1 className="text-2xl font-bold mb-4 text-primary-700 dark:text-primary-300">{capacitacion.nombre}</h1>
        <div className="mb-2"><b>Tipo:</b> {Array.isArray(capacitacion.tipo) ? capacitacion.tipo.join(", ") : capacitacion.tipo}</div>
        <div className="mb-2"><b>Organismo:</b> {capacitacion.organismo}</div>
        <div className="mb-2"><b>Modalidad:</b> {capacitacion.modalidad ?? '-'}</div>
        <div className="mb-2"><b>Descripción:</b> {capacitacion.descripcion ?? '-'}</div>
        <div className="mb-2"><b>Fecha Inicio:</b> {capacitacion.fechaInicio ? new Date(capacitacion.fechaInicio).toLocaleDateString() : '-'}</div>
        <div className="mb-2"><b>Fecha Fin:</b> {capacitacion.fechaFin ? new Date(capacitacion.fechaFin).toLocaleDateString() : '-'}</div>
        <div className="mb-2"><b>Cupo:</b> {capacitacion.cupo ?? '-'}</div>
        <div className="mb-2"><b>Observaciones:</b> {capacitacion.observaciones ?? '-'}</div>
        <div className="flex gap-2 mt-6 justify-end">
          <button className="btn btn-secondary" onClick={() => router.push('/capacitaciones')}>Volver</button>
          <button className="btn btn-primary" onClick={() => router.push(`/capacitaciones/${capacitacion.id}/edit`)}>Editar</button>
        </div>
      </div>
    </div>
  );
};

export default Page;