import { NextResponse } from 'next/server';
import prisma from '../../../../lib/prisma';

export async function GET(req, { params }) {
  try {
    const id = Number(params.id);
    if (!id) {
      return NextResponse.json({ error: 'ID inválido' }, { status: 400 });
    }
    const emprendedor = await prisma.emprendedor.findUnique({
      where: { id },
      include: {
        emprendimientos: true,
        asignaciones: true,
      },
    });
    if (!emprendedor) {
      return NextResponse.json({ error: 'Emprendedor no encontrado' }, { status: 404 });
    }
    // Decodificar ubicacion si existe
    if (emprendedor.ubicacion) {
      try {
        emprendedor.ubicacion = JSON.parse(Buffer.from(emprendedor.ubicacion).toString());
      } catch (e) {
        emprendedor.ubicacion = null;
      }
    }
    return NextResponse.json(emprendedor);
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function PUT(req, { params }) {
  try {
    const { id } = await params;
    const numId = Number(id);
    if (!numId) {
      return NextResponse.json({ error: 'ID inválido' }, { status: 400 });
    }
    const data = await req.json();
    // Si fechaNacimiento existe, conviértelo a Date
    if (data.fechaNacimiento) {
      data.fechaNacimiento = new Date(data.fechaNacimiento);
    }
    // Si ubicacion es objeto, conviértelo a Bytes
    if (data.ubicacion && typeof data.ubicacion === 'object') {
      data.ubicacion = { set: Buffer.from(JSON.stringify(data.ubicacion)) };
    }
    // Eliminar relaciones del objeto data
    delete data.emprendimientos;
    delete data.asignaciones;
    const updated = await prisma.emprendedor.update({
      where: { id: numId },
      data,
    });
    return NextResponse.json(updated);
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function DELETE(req, { params }) {
  try {
    const id = Number(params.id);
    if (!id) {
      return NextResponse.json({ error: 'ID inválido' }, { status: 400 });
    }
    await prisma.emprendedor.delete({
      where: { id },
    });
    return NextResponse.json({ ok: true });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
