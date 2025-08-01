import { NextResponse } from 'next/server';
import  {prisma } from "../../../lib/prisma";

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
