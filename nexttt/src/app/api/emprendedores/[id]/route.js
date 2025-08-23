import { NextResponse } from 'next/server';
import prisma from '../../../../lib/prisma';

export async function GET(req, context) {
  try {
    const params = await context.params;
    const id = Number(params.id);
    if (!id) {
      return NextResponse.json({ error: 'ID inválido' }, { status: 400 });
    }
    const emprendedor = await prisma.emprendedor.findUnique({
      where: { id },
      include: {
        emprendimientos: true,
        // asignaciones: true,
        asignaciones: { include: { herramienta: true } },
      },
    });
    if (!emprendedor) {
      return NextResponse.json({ error: 'Emprendedor no encontrado' }, { status: 404 });
    }
    // Decodificar ubicacion si existe
    if (emprendedor.ubicacion) {
      try {
        const str = Buffer.isBuffer(emprendedor.ubicacion)
          ? emprendedor.ubicacion.toString("utf8")
          : String.fromCharCode(...emprendedor.ubicacion);
        const obj = JSON.parse(str);
        if (obj.type === "Point" && Array.isArray(obj.coordinates)) {
          emprendedor.ubicacion = { lng: obj.coordinates[0], lat: obj.coordinates[1] };
        } else if (typeof obj.lat === "number" && typeof obj.lng === "number") {
          emprendedor.ubicacion = obj;
        } else {
          emprendedor.ubicacion = null;
        }
      } catch (e) {
        emprendedor.ubicacion = null;
      }
    }
    return NextResponse.json(emprendedor);
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function PUT(req, context) {
  try {
    const params = await context.params;
    const numId = Number(params.id);
    if (!numId) {
      return NextResponse.json({ error: 'ID inválido' }, { status: 400 });
    }
    const data = await req.json();
    // Si fechaNacimiento existe, conviértelo a Date
    if (data.fechaNacimiento) {
      data.fechaNacimiento = new Date(data.fechaNacimiento);
    }
    // Si ubicacion existe, conviértelo a Bytes (acepta string o objeto)
    if (data.ubicacion) {
      let ubicacionStr = typeof data.ubicacion === 'object' ? JSON.stringify(data.ubicacion) : data.ubicacion;
      data.ubicacion = { set: Buffer.from(ubicacionStr) };
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

export async function DELETE(req, context) {
  try {
    const params = await context.params;
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
