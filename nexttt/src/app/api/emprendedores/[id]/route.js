import { NextResponse } from 'next/server';
import  {prisma } from "../../../lib/prisma";

export async function GET(_, { params }) {
  const emprendedor = await prisma.emprendedor.findUnique({
    where: { id: Number(params.id) },
    include: { emprendimientos: true, asignaciones: true }
  });
  return NextResponse.json(emprendedor);
}

export async function PUT(req, { params }) {
  const data = await req.json();

  const updated = await prisma.emprendedor.update({
    where: { id: Number(params.id) },
    data
  });

  return NextResponse.json(updated);
}

export async function DELETE(_, { params }) {
  await prisma.emprendedor.delete({
    where: { id: Number(params.id) }
  });
  return NextResponse.json({ ok: true });
}
