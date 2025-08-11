
'use client';

import React, { useState, useEffect } from "react";
import { MapPin } from "lucide-react";

const EmprendedorPage = ({ params }) => {
  const resolvedParams = React.use(params);
  const [emprendedor, setEmprendedor] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchEmprendedor = async () => {
      setLoading(true);
      try {
        const res = await fetch(`/api/emprendedores/${resolvedParams.id}`);
        const data = await res.json();
        if (res.ok) {
          setEmprendedor(data);
        } else {
          setError(data.error || "Error al cargar el emprendedor");
        }
      } catch (err) {
        setError("Error de red");
      }
      setLoading(false);
    };
    fetchEmprendedor();
  }, [resolvedParams.id]);

  if (loading) return <div className="text-center py-8 text-gray-500 dark:text-gray-400">Cargando...</div>;
  if (error) return <div className="text-center py-8 text-red-500">{error}</div>;
  if (!emprendedor) return <div className="text-center py-8 text-gray-500 dark:text-gray-400">No se encontró el emprendedor.</div>;

  return (
    <div className="space-y-6 max-w-3xl mx-auto p-6">
      <h2 className="text-2xl font-bold mb-2">{emprendedor.nombre} {emprendedor.apellido}</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <p><strong>Departamento:</strong> {emprendedor.departamento}</p>
          <p><strong>Dirección:</strong> {emprendedor.direccion}</p>
          <p><strong>Teléfono:</strong> {emprendedor.telefono}</p>
          <p><strong>Género:</strong> {emprendedor.genero}</p>
          <p><strong>Nivel de estudios:</strong> {emprendedor.nivelEstudios}</p>
          <p><strong>Fecha de nacimiento:</strong> {emprendedor.fechaNacimiento ? new Date(emprendedor.fechaNacimiento).toLocaleDateString() : '-'}</p>
        </div>
        <div>
          <p><strong>Motivación para emprender:</strong> {emprendedor.motivacionEmprender}</p>
          <p><strong>Otros sustentos:</strong> {emprendedor.poseeOtrosSustentos ? 'Sí' : 'No'}</p>
          <p><strong>Dependientes económicos:</strong> {emprendedor.tieneDependientesEconomicos ? 'Sí' : 'No'}</p>
        </div>
      </div>
      <div className="mt-8">
        <h3 className="text-xl font-semibold mb-2">Emprendimientos</h3>
        {emprendedor.emprendimientos && emprendedor.emprendimientos.length > 0 ? (
          <div className="space-y-4">
            {emprendedor.emprendimientos.map((emp) => (
              <div key={emp.id} className="p-4 border rounded-lg bg-white dark:bg-gray-800 shadow">
                <h4 className="font-bold text-lg mb-1">{emp.denominacion}</h4>
                <p><strong>Etapa:</strong> {emp.etapa}</p>
                <p><strong>Dirección:</strong> {emp.direccion}</p>
                <p><strong>Teléfono:</strong> {emp.telefono}</p>
                <p><strong>Fecha inicio:</strong> {emp.fechaInicio ? new Date(emp.fechaInicio).toLocaleDateString() : '-'}</p>
                <div className="flex items-center mt-2">
                  <MapPin size={16} className="mr-1" />
                  <span>{emp.direccion}</span>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-gray-500">No tiene emprendimientos registrados.</p>
        )}
      </div>
    </div>
  );
};

export default EmprendedorPage;
