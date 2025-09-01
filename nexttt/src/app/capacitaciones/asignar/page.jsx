
"use client";
import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

const Page = () => {
	const [capacitaciones, setCapacitaciones] = useState([]);
	const [loading, setLoading] = useState(false);
	const [form, setForm] = useState({ capacitacionId: '', beneficiarioTipo: 'Emprendedor', beneficiarioId: '' });
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
		const res = await fetch('/api/asignacionCapacitacion');
		const data = await res.json();
		setAsignaciones(data);
		setLoadingAsignaciones(false);
	};

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
			capacitacionId: Number(form.capacitacionId),
			beneficiarioTipo: form.beneficiarioTipo,
			...(form.beneficiarioTipo === 'Emprendedor'
				? { emprendedorId: Number(form.beneficiarioId) }
				: { emprendimientoId: Number(form.beneficiarioId) })
		};
		try {
			const res = await fetch('/api/asignacionCapacitacion', {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify(body),
			});
			if (!res.ok) throw new Error('Error al asignar capacitación');
			setMensaje('¡Capacitación asignada correctamente!');
			setForm({ capacitacionId: '', beneficiarioTipo: 'Emprendedor', beneficiarioId: '' });
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
				<h1 className="text-center mb-4 text-lg sm:text-2xl font-semibold">Asignar Capacitación</h1>
				<form onSubmit={handleSubmit} className="space-y-3 sm:space-y-4">
					<div className="flex flex-col gap-1">
						<label className="text-sm font-medium">Capacitación</label>
						<select
							name="capacitacionId"
							value={form.capacitacionId}
							onChange={handleChange}
							className="input input-bordered w-full text-sm"
							required
						>
							<option value="">Seleccione una capacitación</option>
							{capacitaciones.map((c) => (
								<option key={c.id} value={c.id}>{c.nombre}</option>
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
						{asignando ? 'Asignando...' : 'Asignar capacitación'}
					</button>
					{mensaje && <div className="text-center mt-2 text-info text-sm">{mensaje}</div>}
				</form>
			</div>

			{/* Tabla de capacitaciones */}
			<div className="card mb-6 sm:mb-8 p-2 sm:p-4 shadow-lg">
				<h2 className="mb-3 sm:mb-4 text-center text-white text-base sm:text-xl font-semibold">Listado de capacitaciones</h2>
				{loading ? <p className="text-center">Cargando...</p> : (
					<div className="overflow-x-auto">
						<table className="min-w-full text-xs sm:text-sm rounded-lg border border-gray-200 dark:border-gray-700">
							<thead className="bg-gray-100 dark:bg-gray-800">
								<tr>
									<th className="px-1 py-2 sm:px-2">ID</th>
									<th className="px-1 py-2 sm:px-2">Nombre</th>
									<th className="px-1 py-2 sm:px-2">Organismo</th>
									<th className="px-1 py-2 sm:px-2">Cupo</th>
								</tr>
							</thead>
							<tbody>
								{capacitaciones.map((c) => (
									<tr key={c.id} className="hover:bg-gray-50 dark:hover:bg-gray-900 transition-colors">
										<td className="px-1 py-2 sm:px-2">{c.id}</td>
										<td className="px-1 py-2 sm:px-2">{c.nombre}</td>
										<td className="px-1 py-2 sm:px-2">{c.organismo}</td>
										<td className="px-1 py-2 sm:px-2">{c.cupo}</td>
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
									<th className="px-1 py-2 sm:px-2">Capacitación</th>
									<th className="px-1 py-2 sm:px-2">Tipo Beneficiario</th>
									<th className="px-1 py-2 sm:px-2">Beneficiario</th>
									<th className="px-1 py-2 sm:px-2">Fecha</th>
								</tr>
							</thead>
							<tbody>
								{asignaciones.map((a) => (
									<tr key={a.id} className="hover:bg-gray-50 dark:hover:bg-gray-900 transition-colors">
										<td className="px-1 py-2 sm:px-2">{a.id}</td>
										<td className="px-1 py-2 sm:px-2">{a.capacitacion?.nombre ?? '-'}</td>
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
