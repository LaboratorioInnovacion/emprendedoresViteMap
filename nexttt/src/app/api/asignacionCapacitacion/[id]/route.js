import { PrismaClient } from '@prisma/client';
import { registrarLogAccionDesdeRequest } from "../../../lib/logAccion";

const prisma = new PrismaClient();

// GET: Obtener una asignación de capacitación por ID
export async function GET(request, { params }) {
  const { id } = params;
  try {
    const asignacion = await prisma.asignacionCapacitacion.findUnique({
      where: { id: Number(id) },
      include: {
        capacitacion: true,
        emprendedor: true,
        emprendimiento: true,
      },
    });
    if (!asignacion) {
      return new Response(JSON.stringify({ error: 'No encontrada' }), { status: 404 });
    }
    return new Response(JSON.stringify(asignacion), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), { status: 500 });
  }
}

// PUT: Editar una asignación de capacitación por ID
export async function PUT(request, { params }) {
  const { id } = params;
  try {
    const data = await request.json();
    const updated = await prisma.asignacionCapacitacion.update({
      where: { id: Number(id) },
      data: {
        ...data,
        capacitacionId: data.capacitacionId ? Number(data.capacitacionId) : undefined,
        emprendedorId: data.emprendedorId ? Number(data.emprendedorId) : null,
        emprendimientoId: data.emprendimientoId ? Number(data.emprendimientoId) : null,
      },
    });

    // Registrar log de actualización
    await registrarLogAccionDesdeRequest(
      request,
      updated,
      "AsignacionCapacitacion",
      "ACTUALIZAR",
      `Actualización de asignación de capacitación (ID: ${updated.id})`
    );

    return new Response(JSON.stringify(updated), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), { status: 400 });
  }
}

// DELETE: Eliminar una asignación de capacitación por ID
export async function DELETE(request, { params }) {
  const { id } = params;
  try {
    // Obtener el objeto antes de eliminar para loguear
    const eliminada = await prisma.asignacionCapacitacion.findUnique({ where: { id: Number(id) } });
    await prisma.asignacionCapacitacion.delete({ where: { id: Number(id) } });

    // Registrar log de eliminación
    if (eliminada) {
      await registrarLogAccionDesdeRequest(
        request,
        eliminada,
        "AsignacionCapacitacion",
        "ELIMINAR",
        `Eliminación de asignación de capacitación (ID: ${eliminada.id})`
      );
    }

    return new Response(null, { status: 204 });
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), { status: 400 });
  }
}
