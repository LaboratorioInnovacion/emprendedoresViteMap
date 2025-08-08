import React, { createContext, useContext, useState } from "react";

const EmpreContext = createContext();

export function EmpreProvider({ children }) {
	const [emprendedores, setEmprendedores] = useState([]);
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState(null);

	// Obtener todos los emprendedores
	const fetchEmprendedores = async () => {
		setLoading(true);
		setError(null);
		try {
			const res = await fetch("/api/emprendedores");
			const data = await res.json();
			setEmprendedores(data);
		} catch (err) {
			setError("Error al obtener emprendedores");
		} finally {
			setLoading(false);
		}
	};

	// Obtener emprendedor por id
	const fetchEmprendedorById = async (id) => {
		setLoading(true);
		setError(null);
		try {
			const res = await fetch(`/api/emprendedores/${id}`);
			const data = await res.json();
			return data;
		} catch (err) {
			setError("Error al obtener emprendedor");
			return null;
		} finally {
			setLoading(false);
		}
	};

	// Crear emprendedor
	const createEmprendedor = async (emprendedor) => {
		setLoading(true);
		setError(null);
		try {
			const res = await fetch("/api/emprendedores", {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify(emprendedor),
			});
			const data = await res.json();
			await fetchEmprendedores();
			return data;
		} catch (err) {
			setError("Error al crear emprendedor");
			return null;
		} finally {
			setLoading(false);
		}
	};

	// Actualizar emprendedor
	const updateEmprendedor = async (id, emprendedor) => {
		setLoading(true);
		setError(null);
		try {
			const res = await fetch(`/api/emprendedores/${id}`, {
				method: "PUT",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify(emprendedor),
			});
			const data = await res.json();
			await fetchEmprendedores();
			return data;
		} catch (err) {
			setError("Error al actualizar emprendedor");
			return null;
		} finally {
			setLoading(false);
		}
	};

	// Eliminar emprendedor
	const deleteEmprendedor = async (id) => {
		setLoading(true);
		setError(null);
		try {
			await fetch(`/api/emprendedores/${id}`, {
				method: "DELETE",
			});
			await fetchEmprendedores();
			return true;
		} catch (err) {
			setError("Error al eliminar emprendedor");
			return false;
		} finally {
			setLoading(false);
		}
	};

	return (
		<EmpreContext.Provider
			value={{
				emprendedores,
				loading,
				error,
				fetchEmprendedores,
				fetchEmprendedorById,
				createEmprendedor,
				updateEmprendedor,
				deleteEmprendedor,
			}}
		>
			{children}
		</EmpreContext.Provider>
	);
}

export function useEmpre() {
	return useContext(EmpreContext);
}
