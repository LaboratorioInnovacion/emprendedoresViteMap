import React, { createContext, useContext, useEffect, useState } from "react";
import { set } from "react-hook-form";

const EmprendimientosContext = createContext();

export function EmprendimientosProvider({ children }) {
	const [emprendimientos, setEmprendimientos] = useState([]);
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState(null);
	const [allemprendimientos, setAllemprendimientos] = useState([]);

		useEffect(() => {
			fetchemprendimientosall();
		}, []);

		useEffect(() => {
			console.log("EMPRENDIMIENTOS actualizado", allemprendimientos);
		}, [allemprendimientos]);

	// Obtener todos los emprendimientos de el usuario
	const fetchEmprendimientos = async (emprendedorId = null) => {
		setLoading(true);
		setError(null);
		try {
			let url = "/api/emprendimientos";
			if (emprendedorId) url += `?emprendedorId=${emprendedorId}`;
			const res = await fetch(url);
			const data = await res.json();
			setEmprendimientos(data);
		} catch (err) {
			setError("Error al obtener emprendimientos");
		} finally {
			setLoading(false);
		}
	};

	const fetchemprendimientosall = async () => {
		setLoading(true);
		setError(null);
		try {
			const res = await fetch("/api/emprendimientos");
			const data = await res.json();
			console.log("data",data)
			setAllemprendimientos(data);
		} catch (err) {
			setError("Error al obtener todos los emprendimientos");
		} finally {
			setLoading(false);
		}
	};

	// Obtener emprendimiento por id
	const fetchEmprendimientoById = async (id) => {
		setLoading(true);
		setError(null);
		try {
			const res = await fetch(`/api/emprendimientos?id=${id}`);
			const data = await res.json();
			return data;
		} catch (err) {
			setError("Error al obtener emprendimiento");
			return null;
		} finally {
			setLoading(false);
		}
	};

	// Crear emprendimiento
	const createEmprendimiento = async (emprendimiento) => {
		setLoading(true);
		setError(null);
		try {
			const res = await fetch("/api/emprendimientos", {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify(emprendimiento),
			});
			const data = await res.json();
			await fetchEmprendimientos();
			return data;
		} catch (err) {
			setError("Error al crear emprendimiento");
			return null;
		} finally {
			setLoading(false);
		}
	};

	// Actualizar emprendimiento
	const updateEmprendimiento = async (emprendimiento) => {
		setLoading(true);
		setError(null);
		try {
			const res = await fetch(`/api/emprendimientos`, {
				method: "PUT",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify(emprendimiento),
			});
			const data = await res.json();
			await fetchEmprendimientos();
			return data;
		} catch (err) {
			setError("Error al actualizar emprendimiento");
			return null;
		} finally {
			setLoading(false);
		}
	};

	// Eliminar emprendimiento
	const deleteEmprendimiento = async (id) => {
		setLoading(true);
		setError(null);
		try {
			await fetch(`/api/emprendimientos?id=${id}`, {
				method: "DELETE",
			});
			await fetchEmprendimientos();
			return true;
		} catch (err) {
			setError("Error al eliminar emprendimiento");
			return false;
		} finally {
			setLoading(false);
		}
	};

	return (
		<EmprendimientosContext.Provider
			value={{
				emprendimientos,
				loading,
				error,
				fetchEmprendimientos,
				fetchEmprendimientoById,
				createEmprendimiento,
				updateEmprendimiento,
				deleteEmprendimiento,
				fetchemprendimientosall,
			}}
		>
			{children}
		</EmprendimientosContext.Provider>
	);
}

export function useEmprendimientos() {
	return useContext(EmprendimientosContext);
}
