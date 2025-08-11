
'use client';
import React, { useState, useEffect } from "react";
import { MapPin } from "lucide-react";

const EmprendimientoPage = ({ params }) => {
  const resolvedParams = React.use(params) as { id: string };
  const [emprendimiento, setEmprendimiento] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchEmprendimiento = async () => {
      setLoading(true);
      try {
        const res = await fetch(`/api/emprendimientos/${resolvedParams.id}`);
        const data = await res.json();
        if (res.ok) {
          setEmprendimiento(data);
        } else {
          setError(data.error || "Error al cargar el emprendimiento");
        }
      } catch (err) {
        setError("Error de red");
      }
      setLoading(false);
    };
    fetchEmprendimiento();
  }, [resolvedParams.id]);

  if (loading) return <div className="text-center py-8 text-gray-500 dark:text-gray-400">Cargando...</div>;
  if (error) return <div className="text-center py-8 text-red-500">{error}</div>;
  if (!emprendimiento) return <div className="text-center py-8 text-gray-500 dark:text-gray-400">No se encontró el emprendimiento.</div>;

  return (
    <div className="space-y-6 max-w-3xl mx-auto p-6">
      <h2 className="text-2xl font-bold mb-2">{emprendimiento.denominacion}</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <p><strong>Etapa:</strong> {emprendimiento.etapa}</p>
          <p><strong>Dirección:</strong> {emprendimiento.direccion}</p>
          <p><strong>Teléfono:</strong> {emprendimiento.telefono}</p>
          <p><strong>Fecha de inicio:</strong> {emprendimiento.fechaInicio ? new Date(emprendimiento.fechaInicio).toLocaleDateString() : '-'}</p>
        </div>
        <div>
          <p><strong>Emprendedor:</strong> {emprendimiento.emprendedor?.nombre} {emprendimiento.emprendedor?.apellido}</p>
          <p><strong>Departamento:</strong> {emprendimiento.emprendedor?.departamento}</p>
          <p><strong>Email:</strong> {emprendimiento.email}</p>
        </div>
      </div>
      <div className="mt-8">
        <h3 className="text-xl font-semibold mb-2">Ubicación</h3>
        <div className="flex items-center">
          <MapPin size={16} className="mr-1" />
          <span>{emprendimiento.direccion}</span>
        </div>
      </div>
    </div>
  );
};

export default EmprendimientoPage;
