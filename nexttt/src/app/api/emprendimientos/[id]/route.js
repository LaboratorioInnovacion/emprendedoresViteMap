import { NextResponse } from 'next/server';
import prisma from '../../../../lib/prisma';

export async function GET(req, { params }) {
  try {
    const id = Number(params.id);
    if (!id) {
      return NextResponse.json({ error: 'ID inválido' }, { status: 400 });
    }
    const emprendimiento = await prisma.emprendimiento.findUnique({
      where: { id },
      include: {
        emprendedor: true,
        asignaciones: true,
      },
    });
    if (!emprendimiento) {
      return NextResponse.json({ error: 'Emprendimiento no encontrado' }, { status: 404 });
    }
    // Decodificar ubicacion si existe
    if (emprendimiento.ubicacion) {
      try {
        emprendimiento.ubicacion = JSON.parse(Buffer.from(emprendimiento.ubicacion).toString());
      } catch (e) {
        emprendimiento.ubicacion = null;
      }
    }
    return NextResponse.json(emprendimiento);
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
    // Si fechaInicio existe, conviértelo a Date
    if (data.fechaInicio) {
      data.fechaInicio = new Date(data.fechaInicio);
    }
    // Si ubicacion es objeto, conviértelo a Bytes
    if (data.ubicacion && typeof data.ubicacion === 'object') {
      data.ubicacion = { set: Buffer.from(JSON.stringify(data.ubicacion)) };
    }
    // Eliminar relaciones del objeto data
    delete data.emprendedor;
    delete data.asignaciones;
    const updated = await prisma.emprendimiento.update({
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
    await prisma.emprendimiento.delete({
      where: { id },
    });
    return NextResponse.json({ ok: true });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
