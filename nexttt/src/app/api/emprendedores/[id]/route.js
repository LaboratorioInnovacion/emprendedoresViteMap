import { NextResponse } from 'next/server';
import  prisma  from "../../../../lib/prisma";

// export async function GET(_, { params }) {
//   const emprendedor = await prisma.emprendedor.findUnique({
//     where: { id: Number(params.id) },
//     include: { emprendimientos: true, asignaciones: true }
//   });
//   return NextResponse.json(emprendedor);
// }
export async function GET(req, context) {
  const params = await context.params;
  const id = Number(params.id);

  const emprendedor = await prisma.emprendedor.findUnique({
    where: { id },
    include: {
      emprendimientos: true,
      asignaciones: true,
    },
  });

  if (!emprendedor) {
    return NextResponse.json({ error: "Emprendedor no encontrado" }, { status: 404 });
  }

  return NextResponse.json(emprendedor);
}

export async function PUT(req, context) {
  const params = await context.params;
  const data = await req.json();

  const updated = await prisma.emprendedor.update({
    where: { id: Number(params.id) },
    data,
    fechaNacimiento: new Date(data.fechaNacimiento),
  });

  return NextResponse.json(updated);
}

// export async function DELETE(_, { params }) {
export async function DELETE(_, context) {
  const params = await context.params;
  await prisma.emprendedor.delete({
    where: { id: Number(params.id) }
  });
  return NextResponse.json({ ok: true });
}
