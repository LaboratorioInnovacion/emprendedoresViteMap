import { NextResponse } from 'next/server';
import prisma from '../../../../lib/prisma';
import { registrarLogAccionDesdeRequest } from "../../../../lib/logAccion";

// Eliminar una asignación por id
export async function DELETE(request, context) {
  const { id } = context.params;
  if (!id) {
    return NextResponse.json({ error: 'ID requerido' }, { status: 400 });
  }
  try {
    // Obtener el objeto antes de eliminar para loguear
    const eliminada = await prisma.asignacion.findUnique({ where: { id: Number(id) } });
    await prisma.asignacion.delete({ where: { id: Number(id) } });

    // Registrar log de eliminación
    if (eliminada) {
      await registrarLogAccionDesdeRequest(
        request,
        eliminada,
        "Asignacion",
        "ELIMINAR",
        `Eliminación de asignación (ID: ${eliminada.id})`
      );
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: 'No se pudo eliminar' }, { status: 500 });
  }
}
