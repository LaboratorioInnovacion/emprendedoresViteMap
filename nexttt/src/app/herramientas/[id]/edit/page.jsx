'use client';
import React, { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';

// Opciones para selects
const tipoBeneficiarioOptions = [
  { value: '', label: 'Seleccionar tipo' },
  { value: 'Emprendedor', label: 'Emprendedor' },
  { value: 'Emprendimiento', label: 'Emprendimiento' },
];
const origenTipoOptions = [
  { value: 'Nacional', label: 'Nacional' },
  { value: 'Provincial', label: 'Provincial' },
  { value: 'Municipal', label: 'Municipal' },
  { value: 'Privado', label: 'Privado' },
  { value: 'Otro', label: 'Otro' },
];
const tipoHerramientaEmprendimientoOptions = [
  { value: 'Financiamiento', label: 'Financiamiento' },
  { value: 'Capacitación', label: 'Capacitación' },
  { value: 'Asistencia Técnica', label: 'Asistencia Técnica' },
  { value: 'Infraestructura', label: 'Infraestructura' },
  { value: 'Redes', label: 'Redes' },
  { value: 'Otro', label: 'Otro' },
];
const tipoHerramientaEmprendedorOptions = [
  { value: 'Beca', label: 'Beca' },
  { value: 'Subsidio', label: 'Subsidio' },
  { value: 'Crédito', label: 'Crédito' },
  { value: 'Premio', label: 'Premio' },
  { value: 'Otro', label: 'Otro' },
];

const initialState = {
  nombre: '',
  origenTipo: [],
  origenOrganismo: '',
  tipoBeneficiario: '',
  tipoHerramientaEmprendimiento: [],
  tipoHerramientaEmprendedor: [],
  montoTotal: '',
  montoPorBeneficiario: '',
  poseeVencimiento: false,
  fechaInicioVigencia: '',
  fechaFinVigencia: '',
  cupo: '',
  observaciones: '',
};

const Page = () => {
  const params = useParams();
  const router = useRouter();
  const [form, setForm] = useState(initialState);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    const fetchHerramienta = async () => {
      setLoading(true);
      try {
        const res = await fetch(`/api/herramienta/${params.id}`);
        const data = await res.json();
        if (res.ok) {
          setForm({
            ...data,
            origenTipo: data.origenTipo || [],
            tipoHerramientaEmprendimiento: data.tipoHerramientaEmprendimiento || [],
            tipoHerramientaEmprendedor: data.tipoHerramientaEmprendedor || [],
            fechaInicioVigencia: data.fechaInicioVigencia ? data.fechaInicioVigencia.slice(0, 10) : '',
            fechaFinVigencia: data.fechaFinVigencia ? data.fechaFinVigencia.slice(0, 10) : '',
          });
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

  const handleChange = (e) => {
    const { name, value, type, checked, multiple, options } = e.target;
    if (multiple) {
      const values = Array.from(options).filter(o => o.selected).map(o => o.value);
      setForm((prev) => ({ ...prev, [name]: values }));
    } else {
      setForm((prev) => ({
        ...prev,
        [name]: type === 'checkbox' ? checked : value,
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    const payload = {
      ...form,
      origenTipo: form.origenTipo,
      tipoHerramientaEmprendimiento: form.tipoHerramientaEmprendimiento,
      tipoHerramientaEmprendedor: form.tipoHerramientaEmprendedor,
      montoTotal: form.montoTotal ? parseFloat(form.montoTotal) : null,
      montoPorBeneficiario: form.montoPorBeneficiario ? parseFloat(form.montoPorBeneficiario) : null,
      cupo: form.cupo ? parseInt(form.cupo) : 0,
      fechaInicioVigencia: form.fechaInicioVigencia ? new Date(form.fechaInicioVigencia) : null,
      fechaFinVigencia: form.fechaFinVigencia ? new Date(form.fechaFinVigencia) : null,
    };
    try {
      const res = await fetch(`/api/herramienta/${params.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      if (!res.ok) throw new Error('Error al actualizar herramienta');
      setSuccess('Herramienta actualizada correctamente');
    } catch (err) {
      setError(err.message);
    }
  };

  if (loading) {
    return <div className="max-w-xl mx-auto p-8 card text-center">Cargando...</div>;
  }
  if (error) {
    return <div className="max-w-xl mx-auto p-8 card text-center text-red-600">{error}</div>;
  }

  return (
    <div className="max-w-2xl mx-auto p-6 animate-fadeIn">
      <div className="card">
        <h1 className="mb-4 text-center">Editar Herramienta</h1>
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <input name="nombre" value={form.nombre} onChange={handleChange} placeholder="Nombre" required className="input w-full" />

          <label className="flex flex-col">
            <span className="mb-1">Origen Tipo (puedes seleccionar varios):</span>
            <select name="origenTipo" multiple value={form.origenTipo} onChange={handleChange} className="input w-full h-28">
              {origenTipoOptions.map(opt => (
                <option key={opt.value} value={opt.value}>{opt.label}</option>
              ))}
            </select>
          </label>

          <input name="origenOrganismo" value={form.origenOrganismo} onChange={handleChange} placeholder="Origen Organismo" className="input w-full" />

          <label className="flex flex-col">
            <span className="mb-1">Tipo Beneficiario:</span>
            <select name="tipoBeneficiario" value={form.tipoBeneficiario} onChange={handleChange} required className="input w-full">
              {tipoBeneficiarioOptions.map(opt => (
                <option key={opt.value} value={opt.value}>{opt.label}</option>
              ))}
            </select>
          </label>

          <label className="flex flex-col">
            <span className="mb-1">Tipo Herramienta Emprendimiento (puedes seleccionar varios):</span>
            <select name="tipoHerramientaEmprendimiento" multiple value={form.tipoHerramientaEmprendimiento} onChange={handleChange} className="input w-full h-28">
              {tipoHerramientaEmprendimientoOptions.map(opt => (
                <option key={opt.value} value={opt.value}>{opt.label}</option>
              ))}
            </select>
          </label>

          <label className="flex flex-col">
            <span className="mb-1">Tipo Herramienta Emprendedor (puedes seleccionar varios):</span>
            <select name="tipoHerramientaEmprendedor" multiple value={form.tipoHerramientaEmprendedor} onChange={handleChange} className="input w-full h-28">
              {tipoHerramientaEmprendedorOptions.map(opt => (
                <option key={opt.value} value={opt.value}>{opt.label}</option>
              ))}
            </select>
          </label>

          <div className="flex gap-4">
            <input name="montoTotal" value={form.montoTotal} onChange={handleChange} placeholder="Monto Total" type="number" step="any" className="input w-full" />
            <input name="montoPorBeneficiario" value={form.montoPorBeneficiario} onChange={handleChange} placeholder="Monto por Beneficiario" type="number" step="any" className="input w-full" />
          </div>

          <label className="inline-flex items-center gap-2">
            <input name="poseeVencimiento" type="checkbox" checked={form.poseeVencimiento} onChange={handleChange} className="checkbox" />
            Posee Vencimiento
          </label>

          <div className="flex gap-4">
            <input name="fechaInicioVigencia" value={form.fechaInicioVigencia} onChange={handleChange} placeholder="Fecha Inicio Vigencia" type="date" className="input w-full" />
            <input name="fechaFinVigencia" value={form.fechaFinVigencia} onChange={handleChange} placeholder="Fecha Fin Vigencia" type="date" className="input w-full" />
          </div>

          <input name="cupo" value={form.cupo} onChange={handleChange} placeholder="Cupo" type="number" className="input w-full" />
          <input name="observaciones" value={form.observaciones} onChange={handleChange} placeholder="Observaciones" className="input w-full" />
          <button type="submit" className="btn btn-primary w-full mt-2">Guardar cambios</button>
          {success && <div className="text-green-600 font-semibold text-center mt-2">{success}</div>}
          {error && <div className="text-red-600 font-semibold text-center mt-2">{error}</div>}
        </form>
        <div className="flex justify-end mt-6">
          <button className="btn btn-outline" onClick={() => router.back()}>Volver</button>
        </div>
      </div>
    </div>
  );
};

export default Page;