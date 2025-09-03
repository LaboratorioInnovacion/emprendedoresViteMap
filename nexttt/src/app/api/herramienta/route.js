import { NextResponse } from 'next/server';
import prisma from "../../../lib/prisma";
import { registrarLogAccionDesdeRequest } from "../../../lib/logAccion";

export async function GET() {
  const herramientas = await prisma.herramienta.findMany({
    include: { asignaciones: true }
  });
  return NextResponse.json(herramientas);
}

export async function POST(req) {
  const body = await req.json();
  // Adaptar los campos para que sean arrays
  const adaptArray = (val) => Array.isArray(val) ? val : val ? [val] : [];
  const data = {
    ...body,
    origenTipo: adaptArray(body.origenTipo),
    tipoHerramientaEmprendimiento: adaptArray(body.tipoHerramientaEmprendimiento),
    tipoHerramientaEmprendedor: adaptArray(body.tipoHerramientaEmprendedor),
  };
  const nueva = await prisma.herramienta.create({ data });

  // Registrar log de creación
  await registrarLogAccionDesdeRequest(
    req,
    nueva,
    "Herramienta",
    "CREAR",
    `Creación de herramienta (ID: ${nueva.id})`
  );

  return NextResponse.json(nueva);
}

export async function DELETE(req) {
  const { id } = await req.json();
  if (!id) {
    return NextResponse.json({ error: 'ID requerido' }, { status: 400 });
  }
  try {
    // Obtener el objeto antes de eliminar para loguear
    const eliminada = await prisma.herramienta.findUnique({ where: { id: Number(id) } });
    await prisma.herramienta.delete({ where: { id: Number(id) } });

    // Registrar log de eliminación
    if (eliminada) {
      await registrarLogAccionDesdeRequest(
        req,
        eliminada,
        "Herramienta",
        "ELIMINAR",
        `Eliminación de herramienta (ID: ${eliminada.id})`
      );
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: 'No se pudo eliminar' }, { status: 500 });
  }
}

export async function PUT(req) {
  const body = await req.json();
  // Adaptar los campos para que sean arrays
  const adaptArray = (val) => Array.isArray(val) ? val : val ? [val] : [];
  const data = {
    ...body,
    origenTipo: adaptArray(body.origenTipo),
    tipoHerramientaEmprendimiento: adaptArray(body.tipoHerramientaEmprendimiento),
    tipoHerramientaEmprendedor: adaptArray(body.tipoHerramientaEmprendedor),
  };
  const actualizada = await prisma.herramienta.update({
    where: { id: Number(body.id) },
    data,
  });

  // Registrar log de edición
  await registrarLogAccionDesdeRequest(
    req,
    actualizada,
    "Herramienta",
    "EDITAR",
    `Edición de herramienta (ID: ${actualizada.id})`
  );

  return NextResponse.json(actualizada);
}
