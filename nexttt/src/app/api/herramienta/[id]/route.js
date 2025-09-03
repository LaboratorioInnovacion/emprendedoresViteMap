import { NextResponse } from 'next/server';
import prisma from "../../../../lib/prisma";
import { registrarLogAccionDesdeRequest } from "../../../../lib/logAccion";

// params: { params: { id: string } }
export async function GET(req, context) {
  const params = await context.params;
  const { id } = params;
  if (!id) {
    return NextResponse.json({ error: 'ID requerido' }, { status: 400 });
  }
  try {
    const herramienta = await prisma.herramienta.findUnique({
      where: { id: Number(id) },
      include: { asignaciones: true },
    });
    if (!herramienta) {
      return NextResponse.json({ error: 'No encontrada' }, { status: 404 });
    }
    return NextResponse.json(herramienta);
  } catch (error) {
    return NextResponse.json({ error: 'Error al buscar herramienta' }, { status: 500 });
  }
}

export async function DELETE(req, { params }) {
  const { id } = params;
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

// PUT: Actualizar una herramienta por ID
export async function PUT(req, context) {
  const params = await context.params;
  const { id } = params;
  if (!id) {
    return NextResponse.json({ error: 'ID requerido' }, { status: 400 });
  }
  try {
    const data = await req.json();
    delete data.asignaciones;
    const updated = await prisma.herramienta.update({
      where: { id: Number(id) },
      data,
    });

    // Registrar log de actualización
    await registrarLogAccionDesdeRequest(
      req,
      updated,
      "Herramienta",
      "ACTUALIZAR",
      `Actualización de herramienta (ID: ${updated.id})`
    );

    return NextResponse.json(updated);
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }}