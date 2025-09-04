import { NextResponse } from "next/server";
import prisma from "../../../../lib/prisma";
import { registrarLogAccionDesdeRequest } from "../../../../lib/logAccion";

export async function GET(req, context) {
  try {
    const params = await context.params;
    const id = Number(params.id);
    if (!id) {
      return NextResponse.json({ error: "ID inválido" }, { status: 400 });
    }
    const emprendimiento = await prisma.emprendimiento.findUnique({
      where: { id },
      include: {
        emprendedor: true,
        // asignaciones: true,
        asignaciones: {
          include: {
            herramienta: true,
          },
        },
            asignacionesCapacitacion: { include: { capacitacion: true } },
      },
    });
    if (!emprendimiento) {
      return NextResponse.json(
        { error: "Emprendimiento no encontrado" },
        { status: 404 }
      );
    }
    // Decodificar ubicacion si existe
    if (emprendimiento.ubicacion) {
      try {
        const str = Buffer.isBuffer(emprendimiento.ubicacion)
          ? emprendimiento.ubicacion.toString("utf8")
          : String.fromCharCode(...emprendimiento.ubicacion);
        const obj = JSON.parse(str);
        if (obj.type === "Point" && Array.isArray(obj.coordinates)) {
          emprendimiento.ubicacion = {
            lng: obj.coordinates[0],
            lat: obj.coordinates[1],
          };
        } else if (typeof obj.lat === "number" && typeof obj.lng === "number") {
          emprendimiento.ubicacion = obj;
        } else {
          emprendimiento.ubicacion = null;
        }
      } catch (e) {
        emprendimiento.ubicacion = null;
      }
    }
    return NextResponse.json(emprendimiento);
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function PUT(req, context) {
  try {
    const params = await context.params;
    const numId = Number(params.id);
    if (!numId) {
      return NextResponse.json({ error: "ID inválido" }, { status: 400 });
    }
    const data = await req.json();
    // Si fechaInicio existe, conviértelo a Date
    if (data.fechaInicio) {
      data.fechaInicio = new Date(data.fechaInicio);
    }
    // Si ubicacion es objeto, conviértelo a Bytes
    if (data.ubicacion && typeof data.ubicacion === "object") {
      data.ubicacion = { set: Buffer.from(JSON.stringify(data.ubicacion)) };
    }
    // Eliminar relaciones del objeto data
    delete data.emprendedor;
    delete data.asignaciones;
    const updated = await prisma.emprendimiento.update({
      where: { id: numId },
      data,
    });

    // Registrar log de actualización
    await registrarLogAccionDesdeRequest(
      req,
      updated,
      "Emprendimiento",
      "ACTUALIZAR",
      `Actualización de emprendimiento (ID: ${updated.id})`
    );

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
      return NextResponse.json({ error: "ID inválido" }, { status: 400 });
    }

    // Obtener el objeto antes de eliminar para loguear
    const eliminado = await prisma.emprendimiento.findUnique({ where: { id } });
    await prisma.emprendimiento.delete({
      where: { id },
    });

    // Registrar log de eliminación
    if (eliminado) {
      await registrarLogAccionDesdeRequest(
        req,
        eliminado,
        "Emprendimiento",
        "ELIMINAR",
        `Eliminación de emprendimiento (ID: ${eliminado.id})`
      );
    }

    return NextResponse.json({ ok: true });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
