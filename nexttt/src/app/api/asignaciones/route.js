import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function GET() {
  const asignaciones = await prisma.asignacion.findMany({
    include: {
      herramienta: true,
      emprendedor: true,
      emprendimiento: true
    }
  });
  return NextResponse.json(asignaciones);
}

export async function POST(req) {
  const body = await req.json();
  const nueva = await prisma.asignacion.create({ data: body });
  return NextResponse.json(nueva);
}
