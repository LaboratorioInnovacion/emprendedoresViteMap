import { NextResponse } from 'next/server';
import  {prisma } from "../../../lib/prisma";

export async function GET() {
  const lista = await prisma.emprendimiento.findMany({
    include: { emprendedor: true, asignaciones: true }
  });
  return NextResponse.json(lista);
}

export async function POST(req) {
  const body = await req.json();

  const nuevo = await prisma.emprendimiento.create({
    data: {
      ...body,
      ubicacion: body.ubicacion
        ? Buffer.from(JSON.stringify({
            type: 'Point',
            coordinates: [body.ubicacion.lng, body.ubicacion.lat]
          }))
        : null
    }
  });

  return NextResponse.json(nuevo);
}
