import { NextResponse } from 'next/server';
import  prisma  from "../../../lib/prisma";

export async function GET() {
  const herramientas = await prisma.herramienta.findMany({
    include: { asignaciones: true }
  });
  return NextResponse.json(herramientas);
}

export async function POST(req) {
  const body = await req.json();
  const nueva = await prisma.herramienta.create({ data: body });
  return NextResponse.json(nueva);
}

export async function DELETE(req) {
  const { id } = await req.json();
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
