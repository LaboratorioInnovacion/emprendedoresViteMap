
import prisma from "../../../../lib/prisma";
import { registrarLogAccionDesdeRequest } from "../../../../lib/logAccion";

// ...eliminado: instancia local de PrismaClient...

// PUT: Actualizar una capacitación por ID
export async function PUT(request, { params }) {
	const { id } = params;
	try {
		const data = await request.json();
		const updated = await prisma.Capacitacion.update({
			where: { id: Number(id) },
			data,
		});

		// Registrar log de actualización
		await registrarLogAccionDesdeRequest(
			request,
			updated,
			"Capacitacion",
			"ACTUALIZAR",
			`Actualización de capacitación (ID: ${updated.id})`
		);

		return new Response(JSON.stringify(updated), {
			status: 200,
			headers: { 'Content-Type': 'application/json' },
		});
	} catch (error) {
		return new Response(JSON.stringify({ error: error.message }), { status: 400 });
	}
}

// GET: Obtener una capacitación por ID
export async function GET(request, { params }) {
	const { id } = params;
	try {
		const capacitacion = await prisma.Capacitacion.findUnique({
			where: { id: Number(id) }
		});
		if (!capacitacion) {
			return new Response(JSON.stringify({ error: 'No encontrada' }), { status: 404 });
		}
		return new Response(JSON.stringify(capacitacion), {
			status: 200,
			headers: { 'Content-Type': 'application/json' },
		});
	} catch (error) {
		return new Response(JSON.stringify({ error: error.message }), { status: 400 });
	}
}

// DELETE: Eliminar una capacitación por ID
export async function DELETE(request, { params }) {
	const { id } = params;
	try {
		// Obtener el objeto antes de eliminar para loguear
		const eliminada = await prisma.capacitacion.findUnique({ where: { id: Number(id) } });
		await prisma.capacitacion.delete({ where: { id: Number(id) } });

		// Registrar log de eliminación
		if (eliminada) {
			await registrarLogAccionDesdeRequest(
				request,
				eliminada,
				"Capacitacion",
				"ELIMINAR",
				`Eliminación de capacitación (ID: ${eliminada.id})`
			);
		}

		return new Response(null, { status: 204 });
	} catch (error) {
		return new Response(JSON.stringify({ error: error.message }), { status: 400 });
	}
}
