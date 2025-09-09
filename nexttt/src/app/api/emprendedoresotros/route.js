import { NextResponse } from "next/server";
import prisma from "../../../lib/prisma";
import { getToken } from "next-auth/jwt";
import { registrarLogAccionDesdeRequest } from "../../../lib/logAccion";

// Utilidad para decodificar ubicacion Bytes a {lat, lng}
function decodeUbicacion(ubicacion) {
  if (!ubicacion) return null;
  try {
    const str = Buffer.isBuffer(ubicacion)
      ? ubicacion.toString("utf8")
      : String.fromCharCode(...ubicacion);
    const obj = JSON.parse(str);
    if (obj.type === "Point" && Array.isArray(obj.coordinates)) {
      return { lng: obj.coordinates[0], lat: obj.coordinates[1] };
    }
    if (typeof obj.lat === "number" && typeof obj.lng === "number") {
      return obj;
    }
  } catch (e) {}
  return null;
}

export async function GET() {
  try {
    const emprendedores = await prisma.emprendedorOtros.findMany();
    // Decodificar ubicacion para todos
    const emprendedoresConUbicacion = emprendedores.map((emp) => ({
      ...emp,
      ubicacion: decodeUbicacion(emp.ubicacion),
    }));
    return NextResponse.json(emprendedoresConUbicacion);
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

export async function POST(req) {
  try {
    const token = await getToken({
      req,
      secret: process.env.NEXTAUTH_SECRET,
      cookieName: "next-auth.session-token",
    });

    const data = await req.json();

    // Adaptar ubicación si viene como string JSON
    let ubicacion = data.ubicacion;
    if (typeof ubicacion === "string") {
      try {
        ubicacion = JSON.parse(ubicacion);
      } catch {}
    }
    // Guardar como Bytes tipo Point si hay lat/lng
    let ubicacionBytes = null;
    if (ubicacion && typeof ubicacion.lat === "number" && typeof ubicacion.lng === "number") {
      ubicacionBytes = Buffer.from(JSON.stringify({ type: "Point", coordinates: [ubicacion.lng, ubicacion.lat] }));
    }

    // Construir objeto de datos
    const dataToCreate = {
      ...data,
      fechaNacimiento: data.fechaNacimiento ? new Date(data.fechaNacimiento) : null,
      ubicacion: ubicacionBytes,
    };
    // Solo conectar usuario si hay token válido
    if (token && token.id) {
      dataToCreate.usuario = { connect: { id: token.id } };
    }

    const nuevo = await prisma.emprendedorOtros.create({
      data: dataToCreate,
    });

    // Registrar log de creación
    await registrarLogAccionDesdeRequest(
      req,
      nuevo,
      "EmprendedorOtros",
      "CREAR",
      `Creación de emprendedor otros (ID: ${nuevo.id})`
    );

    return NextResponse.json(nuevo);
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

export async function PUT(req, context) {
  const params = await context.params;
  const data = await req.json();

  const updated = await prisma.emprendedorOtros.update({
    where: { id: Number(params.id) },
    data,
    fechaNacimiento: new Date(data.fechaNacimiento),
  });

  // Registrar log de actualización
  await registrarLogAccionDesdeRequest(
    req,
    updated,
    "EmprendedorOtros",
    "ACTUALIZAR",
    `Actualización de emprendedor otros (ID: ${updated.id})`
  );

  return NextResponse.json(updated);
}
