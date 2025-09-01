
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// PUT: Actualizar una capacitación por ID
export async function PUT(request, { params }) {
	const { id } = params;
	try {
		const data = await request.json();
		const updated = await prisma.capacitacion.update({
			where: { id: Number(id) },
			data,
		});
		return new Response(JSON.stringify(updated), {
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
		await prisma.capacitacion.delete({ where: { id: Number(id) } });
		return new Response(null, { status: 204 });
	} catch (error) {
		return new Response(JSON.stringify({ error: error.message }), { status: 400 });
	}
}
