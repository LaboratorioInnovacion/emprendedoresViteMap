import { NextResponse } from 'next/server';
import prisma from "../../../lib/prisma";

// Utilidad para parsear ubicación
function parseUbicacion(ubicacion) {
  if (!ubicacion || typeof ubicacion !== 'object') return null;
  return Buffer.from(JSON.stringify({
    type: 'Point',
    coordinates: [ubicacion.lng, ubicacion.lat]
  }));
}

// GET: lista o por id
export async function GET(req) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get('id');
    if (id) {
      const emprendimiento = await prisma.emprendimiento.findUnique({
        where: { id: Number(id) },
        include: { emprendedor: true, asignaciones: true }
      });
      if (!emprendimiento) return NextResponse.json({ error: 'No encontrado' }, { status: 404 });
      return NextResponse.json(emprendimiento);
    }
    // Lista filtrada por emprendedorId si existe
    const emprendedorId = searchParams.get('emprendedorId');
    const where = emprendedorId ? { emprendedorId: Number(emprendedorId) } : {};
    const lista = await prisma.emprendimiento.findMany({
      where,
      include: { emprendedor: true, asignaciones: true }
    });
    return NextResponse.json(lista);
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// POST: crear
export async function POST(req) {
  try {
    const body = await req.json();
    // Validación básica
    if (!body.denominacion || !body.emprendedorId) {
      return NextResponse.json({ error: 'Faltan campos obligatorios' }, { status: 400 });
    }
    const nuevo = await prisma.emprendimiento.create({
      data: {
        ...body,
        cantidadPersonal: body.cantidadPersonal ? Number(body.cantidadPersonal) : 0,
        cantidadSucursales: body.cantidadSucursales ? Number(body.cantidadSucursales) : 0,
        ubicacion: parseUbicacion(body.ubicacion)
      }
    });
    return NextResponse.json(nuevo);
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// PUT: actualizar
export async function PUT(req) {
  try {
    const body = await req.json();
    if (!body.id) return NextResponse.json({ error: 'Falta id' }, { status: 400 });
    const actualizado = await prisma.emprendimiento.update({
      where: { id: Number(body.id) },
      data: {
        ...body,
        cantidadPersonal: body.cantidadPersonal ? Number(body.cantidadPersonal) : 0,
        cantidadSucursales: body.cantidadSucursales ? Number(body.cantidadSucursales) : 0,
        ubicacion: parseUbicacion(body.ubicacion)
      }
    });
    return NextResponse.json(actualizado);
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// DELETE: eliminar
export async function DELETE(req) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get('id');
    if (!id) return NextResponse.json({ error: 'Falta id' }, { status: 400 });
    await prisma.emprendimiento.delete({ where: { id: Number(id) } });
    return NextResponse.json({ ok: true });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
