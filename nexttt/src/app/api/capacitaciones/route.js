
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// GET: Listar todas las capacitaciones
export async function GET(request) {
	try {
		const capacitaciones = await prisma.capacitacion.findMany();
		return new Response(JSON.stringify(capacitaciones), {
			status: 200,
			headers: { 'Content-Type': 'application/json' },
		});
	} catch (error) {
		return new Response(JSON.stringify({ error: error.message }), { status: 500 });
	}
}

// POST: Crear una nueva capacitación
export async function POST(request) {
	try {
		const data = await request.json();
		const nueva = await prisma.capacitacion.create({ data });
		return new Response(JSON.stringify(nueva), {
			status: 201,
			headers: { 'Content-Type': 'application/json' },
		});
	} catch (error) {
		return new Response(JSON.stringify({ error: error.message }), { status: 400 });
	}
}

// Puedes agregar PUT y DELETE para manejo individual por id en archivos separados ([id]/route.js)
