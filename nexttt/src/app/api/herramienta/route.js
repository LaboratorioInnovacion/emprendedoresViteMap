import { NextResponse } from 'next/server';
import prisma from "../../../lib/prisma";
import { registrarLogAccionDesdeRequest } from "../../../lib/logAccion";

export async function GET() {
  const herramientas = await prisma.herramienta.findMany({
    include: { asignaciones: true }
  });
  return NextResponse.json(herramientas);
}

export async function POST(req) {
  const body = await req.json();
  const nueva = await prisma.herramienta.create({ data: body });

  // Registrar log de creación
  await registrarLogAccionDesdeRequest(
    req,
    nueva,
    "Herramienta",
    "CREAR",
    `Creación de herramienta (ID: ${nueva.id})`
  );

  return NextResponse.json(nueva);
}

export async function DELETE(req) {
  const { id } = await req.json();
  if (!id) {
    return NextResponse.json({ error: 'ID requerido' }, { status: 400 });
  }
  try {
    // Obtener el objeto antes de eliminar para loguear
    const eliminada = await prisma.herramienta.findUnique({ where: { id: Number(id) } });
    await prisma.herramienta.delete({ where: { id: Number(id) } });

    // Registrar log de eliminación
    if (eliminada) {
      await registrarLogAccionDesdeRequest(
        req,
        eliminada,
        "Herramienta",
        "ELIMINAR",
        `Eliminación de herramienta (ID: ${eliminada.id})`
      );
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: 'No se pudo eliminar' }, { status: 500 });
  }
}
