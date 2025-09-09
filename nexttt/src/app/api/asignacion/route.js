import { NextResponse } from 'next/server';
import prisma from '../../../lib/prisma';
import { registrarLogAccionDesdeRequest } from "../../../lib/logAccion";

// Listar todas las asignaciones
export async function GET() {
  const asignaciones = await prisma.asignacion.findMany({
    include: {
      herramienta: true,
      emprendedor: true,
      emprendimiento: true,
      emprendedorOtros: true
    }
  });
  return NextResponse.json(asignaciones);
}

// Crear una nueva asignación
export async function POST(req) {
  const body = await req.json();
  // Si no viene fechaAsignacion, la ponemos a ahora
  if (!body.fechaAsignacion) {
    body.fechaAsignacion = new Date();
  }
  try {
    const nueva = await prisma.asignacion.create({
      data: body,
      include: {
        herramienta: true,
        emprendedor: true,
        emprendimiento: true,
        emprendedorOtros: true
      }
    });

    // Registrar log de creación
    await registrarLogAccionDesdeRequest(
      req,
      nueva,
      "Asignacion",
      "CREAR",
      `Creación de asignación (ID: ${nueva.id})`
    );

    return NextResponse.json(nueva);
  } catch (error) {
    // Prisma error
    if (error instanceof Error && error.meta) {
      return NextResponse.json({ error: error.message, meta: error.meta }, { status: 400 });
    }
    // Otros errores
    return NextResponse.json({ error: error.message ?? String(error) }, { status: 400 });
  }
}

// Eliminar una asignación por id
export async function DELETE(req) {
  const { id } = await req.json();
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
        req,
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
