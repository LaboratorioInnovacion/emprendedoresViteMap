import { NextResponse } from 'next/server';
import prisma from "../../../../lib/prisma";

// params: { params: { id: string } }
export async function GET(req, { params }) {
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
    await prisma.herramienta.delete({ where: { id: Number(id) } });
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: 'No se pudo eliminar' }, { status: 500 });
  }
}
