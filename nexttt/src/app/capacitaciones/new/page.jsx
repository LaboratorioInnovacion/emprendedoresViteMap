"use client";
import React, { useState } from "react";
import { useRouter } from "next/navigation";

const initialState = {
  nombre: "",
  tipo: "",
  organismo: "",
  modalidad: "",
  descripcion: "",
  fechaInicio: "",
  fechaFin: "",
  cupo: "",
  observaciones: "",
};

const Page = () => {
  const [form, setForm] = useState(initialState);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      // tipo es array
      const payload = {
        ...form,
        tipo: form.tipo.split(",").map((t) => t.trim()).filter(Boolean),
        cupo: form.cupo ? Number(form.cupo) : null,
        fechaInicio: form.fechaInicio ? new Date(form.fechaInicio) : null,
        fechaFin: form.fechaFin ? new Date(form.fechaFin) : null,
      };
      const res = await fetch("/api/capacitaciones", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (!res.ok) throw new Error("Error al crear capacitación");
      router.push("/capacitaciones");
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-4 animate-fadeIn">
      <div className="card shadow-lg border border-gray-200 dark:border-gray-700 p-6">
        <h1 className="text-2xl font-bold mb-6 text-primary-700 dark:text-primary-300">Nueva Capacitación</h1>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block font-semibold mb-1">Nombre *</label>
            <input type="text" name="nombre" value={form.nombre} onChange={handleChange} required className="input input-bordered w-full" />
          </div>
          <div>
            <label className="block font-semibold mb-1">Tipo <span className="text-xs">(separa por coma)</span></label>
            <input type="text" name="tipo" value={form.tipo} onChange={handleChange} placeholder="Ej: Taller, Curso, Seminario" className="input input-bordered w-full" />
          </div>
          <div>
            <label className="block font-semibold mb-1">Organismo *</label>
            <input type="text" name="organismo" value={form.organismo} onChange={handleChange} required className="input input-bordered w-full" />
          </div>
          <div>
            <label className="block font-semibold mb-1">Modalidad</label>
            <input type="text" name="modalidad" value={form.modalidad} onChange={handleChange} placeholder="Presencial, Virtual, Mixta..." className="input input-bordered w-full" />
          </div>
          <div>
            <label className="block font-semibold mb-1">Descripción</label>
            <textarea name="descripcion" value={form.descripcion} onChange={handleChange} className="textarea textarea-bordered w-full" />
          </div>
          <div className="flex gap-4">
            <div className="flex-1">
              <label className="block font-semibold mb-1">Fecha Inicio</label>
              <input type="date" name="fechaInicio" value={form.fechaInicio} onChange={handleChange} className="input input-bordered w-full" />
            </div>
            <div className="flex-1">
              <label className="block font-semibold mb-1">Fecha Fin</label>
              <input type="date" name="fechaFin" value={form.fechaFin} onChange={handleChange} className="input input-bordered w-full" />
            </div>
          </div>
          <div>
            <label className="block font-semibold mb-1">Cupo</label>
            <input type="number" name="cupo" value={form.cupo} onChange={handleChange} min="0" className="input input-bordered w-full" />
          </div>
          <div>
            <label className="block font-semibold mb-1">Observaciones</label>
            <textarea name="observaciones" value={form.observaciones} onChange={handleChange} className="textarea textarea-bordered w-full" />
          </div>
          {error && <div className="text-red-600 font-semibold">{error}</div>}
          <div className="flex gap-2 justify-end mt-4">
            <button type="button" className="btn btn-secondary" onClick={() => router.push('/capacitaciones')}>Cancelar</button>
            <button type="submit" className="btn btn-primary" disabled={loading}>{loading ? 'Guardando...' : 'Crear'}</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Page;