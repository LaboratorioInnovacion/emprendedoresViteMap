'use client'
import React, { useEffect, useState } from 'react';

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
  origenTipo: '',
  origenOrganismo: '',
  tipoBeneficiario: '',
  tipoHerramientaEmprendimiento: '',
  tipoHerramientaEmprendedor: '',
  montoTotal: '',
  montoPorBeneficiario: '',
  poseeVencimiento: false,
  fechaInicioVigencia: '',
  fechaFinVigencia: '',
  cupo: '',
  observaciones: '',
};


// Hook para detectar si es mobile
function useIsMobile(breakpoint = 768) {
  const [isMobile, setIsMobile] = useState(false);
  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < breakpoint);
    check();
    window.addEventListener('resize', check);
    return () => window.removeEventListener('resize', check);
  }, [breakpoint]);
  return isMobile;
}

function HerramientasDesktop({ form, handleChange, handleSubmit, error, origenTipoOptions, tipoBeneficiarioOptions, tipoHerramientaEmprendimientoOptions, tipoHerramientaEmprendedorOptions, herramientas, loading, handleDelete }) {
  return (
    <div className="max-w-7xl mx-auto p-4 animate-fadeIn">
      <div className="mb-8 card">
        <h1 className="mb-2 text-center">Herramientas de Apoyo</h1>
        <h2 className="mb-4 text-center text-gray-700">Agregar nueva herramienta</h2>
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <label className="flex flex-col">
            <span className="mb-1">Nombre:</span>
            <input name="nombre" value={form.nombre} onChange={handleChange} placeholder="Nombre" required className="input w-full" />
          </label>
          <label className="flex flex-col">
            <span className="mb-1">Origen Tipo:</span>
            <select name="origenTipo" value={form.origenTipo} onChange={handleChange} className="input w-full">
              <option value="">Seleccionar tipo</option>
              {origenTipoOptions.map(opt => (
                <option key={opt.value} value={opt.value}>{opt.label}</option>
              ))}
            </select>
          </label>
          <label className="flex flex-col">
            <span className="mb-1">Origen Organismo:</span>
            <input name="origenOrganismo" value={form.origenOrganismo} onChange={handleChange} placeholder="Origen Organismo" className="input w-full" />
          </label>
          <label className="flex flex-col">
            <span className="mb-1">Tipo Beneficiario:</span>
            <select name="tipoBeneficiario" value={form.tipoBeneficiario} onChange={handleChange} required className="input w-full">
              {tipoBeneficiarioOptions.map(opt => (
                <option key={opt.value} value={opt.value}>{opt.label}</option>
              ))}
            </select>
          </label>
          <label className="flex flex-col">
            <span className="mb-1">Tipo Herramienta Emprendimiento:</span>
            <select name="tipoHerramientaEmprendimiento" value={form.tipoHerramientaEmprendimiento} onChange={handleChange} className="input w-full">
              <option value="">Seleccionar tipo</option>
              {tipoHerramientaEmprendimientoOptions.map(opt => (
                <option key={opt.value} value={opt.value}>{opt.label}</option>
              ))}
            </select>
          </label>
          <label className="flex flex-col">
            <span className="mb-1">Tipo Herramienta Emprendedor:</span>
            <select name="tipoHerramientaEmprendedor" value={form.tipoHerramientaEmprendedor} onChange={handleChange} className="input w-full">
              <option value="">Seleccionar tipo</option>
              {tipoHerramientaEmprendedorOptions.map(opt => (
                <option key={opt.value} value={opt.value}>{opt.label}</option>
              ))}
            </select>
          </label>
          <div className="flex gap-4">
            <label className="flex flex-col w-full">
              <span className="mb-1">Monto Total:</span>
              <input name="montoTotal" value={form.montoTotal} onChange={handleChange} placeholder="Monto Total" type="number" step="any" className="input w-full" />
            </label>
            <label className="flex flex-col w-full">
              <span className="mb-1">Monto por Beneficiario:</span>
              <input name="montoPorBeneficiario" value={form.montoPorBeneficiario} onChange={handleChange} placeholder="Monto por Beneficiario" type="number" step="any" className="input w-full" />
            </label>
          </div>
          <label className="inline-flex items-center gap-2">
            <input name="poseeVencimiento" type="checkbox" checked={form.poseeVencimiento} onChange={handleChange} className="checkbox" />
            Posee Vencimiento
          </label>
          <div className="flex gap-4">
            <label className="flex flex-col w-full">
              <span className="mb-1">Fecha Inicio Vigencia:</span>
              <input name="fechaInicioVigencia" value={form.fechaInicioVigencia} onChange={handleChange} placeholder="Fecha Inicio Vigencia" type="date" className="input w-full" />
            </label>
            <label className="flex flex-col w-full">
              <span className="mb-1">Fecha Fin Vigencia:</span>
              <input name="fechaFinVigencia" value={form.fechaFinVigencia} onChange={handleChange} placeholder="Fecha Fin Vigencia" type="date" className="input w-full" />
            </label>
          </div>
          <label className="flex flex-col">
            <span className="mb-1">Cupo:</span>
            <input name="cupo" value={form.cupo} onChange={handleChange} placeholder="Cupo" type="number" className="input w-full" />
          </label>
          <label className="flex flex-col">
            <span className="mb-1">Observaciones:</span>
            <input name="observaciones" value={form.observaciones} onChange={handleChange} placeholder="Observaciones" className="input w-full" />
          </label>
          <button type="submit" className="btn btn-primary w-full mt-2">Agregar</button>
          {error && <div className="text-red-600 font-semibold text-center mt-2">{error}</div>}
        </form>
      </div>
      <div className="card">
        <h2 className="mb-4 text-center text-gray-700">Herramientas registradas</h2>
        {loading ? <p className="text-center">Cargando...</p> : (
          <div className="overflow-x-auto">
            <table className="w-full rounded-lg">
              <thead className="bg-gray-700">
                <tr>
                  <th>ID</th>
                  <th>Nombre</th>
                  <th>Origen Tipo</th>
                  <th>Organismo</th>
                  <th>Tipo Beneficiario</th>
                  <th>Cupo</th>
                  <th>Acciones</th>
                </tr>
              </thead>
              <tbody>
                {herramientas.map((h) => (
                  <tr key={h.id} className="">
                    <td>{h.id}</td>
                    <td>{h.nombre}</td>
                    <td>{Array.isArray(h.origenTipo) ? h.origenTipo.join(', ') : h.origenTipo}</td>
                    <td>{h.origenOrganismo}</td>
                    <td>{h.tipoBeneficiario}</td>
                    <td>{h.cupo}</td>
                    <td>
                      <button onClick={() => handleDelete(h.id)} className="btn btn-error btn-xs">Eliminar</button>
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
}

function HerramientasMobile({ form, handleChange, handleSubmit, error, origenTipoOptions, tipoBeneficiarioOptions, tipoHerramientaEmprendimientoOptions, tipoHerramientaEmprendedorOptions, herramientas, loading, handleDelete }) {
  return (
    <div className="max-w-full mx-auto animate-fadeIn">
      <div className="mb-4 card">
        <h1 className="mb-2 text-center text-lg">Herramientas de Apoyo</h1>
        <h2 className="mb-4 text-center text-gray-700 text-base">Agregar nueva herramienta</h2>
        <form onSubmit={handleSubmit} className="flex flex-col gap-2">
          <label className="flex flex-col">
            <span className="mb-1 text-xs">Nombre:</span>
            <input name="nombre" value={form.nombre} onChange={handleChange} placeholder="Nombre" required className="input w-full text-sm" />
          </label>
          <label className="flex flex-col">
            <span className="mb-1 text-xs">Origen Tipo:</span>
            <select name="origenTipo" value={form.origenTipo} onChange={handleChange} className="input w-full text-xs">
              <option value="">Selecciona una opción</option>
              {origenTipoOptions.map(opt => (
                <option key={opt.value} value={opt.value}>{opt.label}</option>
              ))}
            </select>
          </label>
          <label className="flex flex-col">
            <span className="mb-1 text-xs">Origen Organismo:</span>
            <input name="origenOrganismo" value={form.origenOrganismo} onChange={handleChange} placeholder="Origen Organismo" className="input w-full text-sm" />
          </label>
          <label className="flex flex-col">
            <span className="mb-1 text-xs">Tipo Beneficiario:</span>
            <select name="tipoBeneficiario" value={form.tipoBeneficiario} onChange={handleChange} required className="input w-full text-xs">
              {tipoBeneficiarioOptions.map(opt => (
                <option key={opt.value} value={opt.value}>{opt.label}</option>
              ))}
            </select>
          </label>
          <label className="flex flex-col">
            <span className="mb-1 text-xs">Tipo Herramienta Emprendimiento:</span>
            <select name="tipoHerramientaEmprendimiento" value={form.tipoHerramientaEmprendimiento} onChange={handleChange} className="input w-full text-xs">
              <option value="">Selecciona una opción</option>
              {tipoHerramientaEmprendimientoOptions.map(opt => (
                <option key={opt.value} value={opt.value}>{opt.label}</option>
              ))}
            </select>
          </label>
          <label className="flex flex-col">
            <span className="mb-1 text-xs">Tipo Herramienta Emprendedor:</span>
            <select name="tipoHerramientaEmprendedor" value={form.tipoHerramientaEmprendedor} onChange={handleChange} className="input w-full text-xs">
              <option value="">Selecciona una opción</option>
              {tipoHerramientaEmprendedorOptions.map(opt => (
                <option key={opt.value} value={opt.value}>{opt.label}</option>
              ))}
            </select>
          </label>
          <label className="flex flex-col">
            <span className="mb-1 text-xs">Monto Total:</span>
            <input name="montoTotal" value={form.montoTotal} onChange={handleChange} placeholder="Monto Total" type="number" step="any" className="input w-full text-sm" />
          </label>
          <label className="flex flex-col">
            <span className="mb-1 text-xs">Monto por Beneficiario:</span>
            <input name="montoPorBeneficiario" value={form.montoPorBeneficiario} onChange={handleChange} placeholder="Monto por Beneficiario" type="number" step="any" className="input w-full text-sm" />
          </label>
          <label className="inline-flex items-center gap-2 text-xs">
            <input name="poseeVencimiento" type="checkbox" checked={form.poseeVencimiento} onChange={handleChange} className="checkbox" />
            Posee Vencimiento
          </label>
          <label className="flex flex-col">
            <span className="mb-1 text-xs">Fecha Inicio Vigencia:</span>
            <input name="fechaInicioVigencia" value={form.fechaInicioVigencia} onChange={handleChange} placeholder="Fecha Inicio Vigencia" type="date" className="input w-full text-sm" />
          </label>
          <label className="flex flex-col">
            <span className="mb-1 text-xs">Fecha Fin Vigencia:</span>
            <input name="fechaFinVigencia" value={form.fechaFinVigencia} onChange={handleChange} placeholder="Fecha Fin Vigencia" type="date" className="input w-full text-sm" />
          </label>
          <label className="flex flex-col">
            <span className="mb-1 text-xs">Cupo:</span>
            <input name="cupo" value={form.cupo} onChange={handleChange} placeholder="Cupo" type="number" className="input w-full text-sm" />
          </label>
          <label className="flex flex-col">
            <span className="mb-1 text-xs">Observaciones:</span>
            <input name="observaciones" value={form.observaciones} onChange={handleChange} placeholder="Observaciones" className="input w-full text-sm" />
          </label>
          <button type="submit" className="btn btn-primary w-full mt-2 text-sm">Agregar</button>
          {error && <div className="text-red-600 font-semibold text-center mt-2 text-xs">{error}</div>}
        </form>
      </div>
      <div className="card">
        <h2 className="mb-2 text-center text-gray-700 text-base">Herramientas registradas</h2>
        {loading ? <p className="text-center text-sm">Cargando...</p> : (
          <div>
            {herramientas.map((h) => (
              <div key={h.id} className="mb-2 p-2 border-b last:border-b-0 flex flex-col gap-1">
                <div className="flex justify-between text-xs font-semibold"><span>ID:</span> <span>{h.id}</span></div>
                <div className="flex justify-between text-xs"><span>Nombre:</span> <span>{h.nombre}</span></div>
                <div className="flex justify-between text-xs"><span>Origen Tipo:</span> <span>{Array.isArray(h.origenTipo) ? h.origenTipo.join(', ') : h.origenTipo}</span></div>
                <div className="flex justify-between text-xs"><span>Organismo:</span> <span>{h.origenOrganismo}</span></div>
                <div className="flex justify-between text-xs"><span>Tipo Beneficiario:</span> <span>{h.tipoBeneficiario}</span></div>
                <div className="flex justify-between text-xs"><span>Cupo:</span> <span>{h.cupo}</span></div>
                <button onClick={() => handleDelete(h.id)} className="btn btn-error btn-xs mt-1 self-end">Eliminar</button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

const Page = () => {
  const [form, setForm] = useState(initialState);
  const [herramientas, setHerramientas] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const isMobile = useIsMobile();

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

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
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
      const res = await fetch('/api/herramienta', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      if (!res.ok) throw new Error('Error al agregar herramienta');
      setForm(initialState);
      fetchHerramientas();
    } catch (err) {
      setError(err.message);
    }
  };

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

  const sharedProps = {
    form,
    handleChange,
    handleSubmit,
    error,
    origenTipoOptions,
    tipoBeneficiarioOptions,
    tipoHerramientaEmprendimientoOptions,
    tipoHerramientaEmprendedorOptions,
    herramientas,
    loading,
    handleDelete,
  };

  return isMobile ? <HerramientasMobile {...sharedProps} /> : <HerramientasDesktop {...sharedProps} />;
};

export default Page;