import { PrismaClient } from '@prisma/client';
import { registrarLogAccionDesdeRequest } from "../../../lib/logAccion";

const prisma = new PrismaClient();

// GET: Listar todas las asignaciones de capacitaciones
export async function GET() {
  try {
    const asignaciones = await prisma.asignacionCapacitacion.findMany({
      include: {
        capacitacion: true,
        emprendedor: true,
        emprendimiento: true,
        emprendedorOtros: true
      },
      orderBy: { createdAt: 'desc' },
    });
    return new Response(JSON.stringify(asignaciones), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), { status: 500 });
  }
}

// POST: Crear una nueva asignación de capacitación
export async function POST(request) {
  try {
    const data = await request.json();
    const { capacitacionId, beneficiarioTipo, emprendedorId, emprendimientoId, emprendedorOtrosId } = data;
    if (!capacitacionId || !beneficiarioTipo || (!emprendedorId && !emprendimientoId && !emprendedorOtrosId)) {
      return new Response(JSON.stringify({ error: 'Datos incompletos' }), { status: 400 });
    }
    const nueva = await prisma.asignacionCapacitacion.create({
      data: {
        capacitacionId: Number(capacitacionId),
        beneficiarioTipo,
        emprendedorId: emprendedorId ? Number(emprendedorId) : null,
        emprendimientoId: emprendimientoId ? Number(emprendimientoId) : null,
        emprendedorOtrosId: emprendedorOtrosId ? Number(emprendedorOtrosId) : null,
        fechaAsignacion: new Date(),
      },
      include: {
        capacitacion: true,
        emprendedor: true,
        emprendimiento: true,
        emprendedorOtros: true
      }
    });

    // Registrar log de creación
    await registrarLogAccionDesdeRequest(
      request,
      nueva,
      "AsignacionCapacitacion",
      "CREAR",
      `Creación de asignación de capacitación (ID: ${nueva.id})`
    );

    return new Response(JSON.stringify(nueva), {
      status: 201,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), { status: 400 });
  }
}
