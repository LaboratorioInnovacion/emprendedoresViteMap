import { NextResponse } from "next/server";
import prisma from "../../../lib/prisma";
import { getToken } from "next-auth/jwt";

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
    const emprendedores = await prisma.emprendedor.findMany();
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

    console.log("🔐 Token recibido en API:", token);

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

    const nuevo = await prisma.emprendedor.create({
      data: dataToCreate,
    });

    // Registrar log de creación
    try {
      await prisma.logAccion.create({
        data: {
          usuarioId: token && token.id ? Number(token.id) : null,
          entidad: "Emprendedor",
          entidadId: nuevo.id,
          accion: "CREAR",
          descripcion: `Creación de emprendedor (ID: ${nuevo.id})`,
        },
      });
    } catch (logErr) {
      console.error("❌ Error registrando log de creación:", logErr);
    }

    return NextResponse.json(nuevo);
  } catch (err) {
    console.error("❌ Error en POST /api/emprendedores:", err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
export async function PUT(req, context) {
  const params = await context.params;
  const data = await req.json();

  const updated = await prisma.emprendedor.update({
    where: { id: Number(params.id) },
    data,
    fechaNacimiento: new Date(data.fechaNacimiento),
  });

  // Obtener token para saber quién actualiza
  let token = null;
  try {
    token = await getToken({
      req,
      secret: process.env.NEXTAUTH_SECRET,
      cookieName: "__Secure-next-auth.session-token",
    });
  } catch {}

  // Registrar log de actualización
  try {
    await prisma.logAccion.create({
      data: {
        usuarioId: token && token.id ? token.id : null,
        entidad: "Emprendedor",
        entidadId: updated.id,
        accion: "ACTUALIZAR",
        descripcion: `Actualización de emprendedor (ID: ${updated.id})`,
      },
    });
  } catch (logErr) {
    console.error("❌ Error registrando log de actualización:", logErr);
  }

  return NextResponse.json(updated);
}

// import { NextResponse } from "next/server";
// import prisma from "../../../lib/prisma";
// import { getToken } from "next-auth/jwt";

// export async function POST(req) {
//   try {
//     const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });

//     console.log("🔐 Token recibido en API:", token);

//     if (!token) {
//       return NextResponse.json({ error: "No autorizado" }, { status: 403 });
//     }

//     if (token.rol !== "EMPRENDEDOR") {
//       return NextResponse.json({ error: "Rol no permitido" }, { status: 403 });
//     }

//     const data = await req.json();

//     const nuevo = await prisma.emprendedor.create({
//       data: {
//         ...data,
//         usuario: { connect: { id: token.id } },
//       },
//     });

//     return NextResponse.json(nuevo);
//   } catch (err) {
//     console.error("❌ Error en POST /api/emprendedores:", err);
//     return NextResponse.json({ error: err.message }, { status: 500 });
//   }
// }

// import { NextResponse } from "next/server";
// import prisma from "../../../lib/prisma";
// import { getToken } from "next-auth/jwt";

// export async function POST(req) {
//   try {
//     const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });

//     console.log("🔐 Token recibido en API:", token); // 👈 log clave

//     if (!token) {
//       throw new Error("No autorizado");
//     }

//     if (token.rol !== "EMPRENDEDOR") {
//       throw new Error("Rol no permitido");
//     }

//     const data = await req.json();
//     const nuevo = await prisma.emprendedor.create({
//       data: {
//         ...data,
//         usuario: { connect: { id: token.id } }
//       }
//     });

//     return NextResponse.json(nuevo);
//   } catch (err) {
//     console.error("❌ Error en POST /api/emprendedores:", err);
//     return NextResponse.json({ error: err.message }, { status: 403 });
//   }
// }

// import { NextResponse } from "next/server";
// // import prisma from '@/lib/prisma';
// import  prisma  from "../../../lib/prisma";
// import { getUserFromRequest, requireRole } from '../../../lib/auth';

// import jwt from "jsonwebtoken";

// export async function GET() {
//   const emprendedores = await prisma.emprendedor.findMany({
//     include: { emprendimientos: true, asignaciones: true },
//   });
//   return NextResponse.json(emprendedores);
// }

// export async function POST(req) {
//   try {
//     const user = getUserFromRequest(req);
//     requireRole(user, ['EMPRENDEDOR']);

//     const data = await req.json();
//     const nuevo = await prisma.emprendedor.create({
//       data: {
//         ...data,
//         usuario: { connect: { id: user.id } }
//       }
//     });

//     return NextResponse.json(nuevo);
//   } catch (err) {
//     return NextResponse.json({ error: err.message }, { status: 403 });
//   }
// }
// export async function POST(req) {
//      const user = getUserFromRequest(req);
//     requireRole(user, ['EMPRENDEDOR']);

//   const token = req.headers.get("authorization")?.split(" ")[1];
//   if (!token)
//     return NextResponse.json({ error: "No autorizado" }, { status: 401 });

//   try {
//     const payload = jwt.verify(token, process.env.JWT_SECRET);
//     const body = await req.json();

//     const nuevo = await prisma.emprendedor.create({
//       data: {
//         ...body,
//         usuario: { connect: { id: payload.id } },
//       },
//     });

//     return NextResponse.json(nuevo);
//   } catch (e) {
//     return NextResponse.json({ error: "Token inválido" }, { status: 403 });
//   }
// }

// export async function POST(req) {
//   const token = req.headers.get('authorization')?.split(' ')[1];
//   if (!token) return NextResponse.json({ error: 'No autorizado' }, { status: 401 });

//   try {
//     const payload = jwt.verify(token, process.env.JWT_SECRET);
//     const body = await req.json();

//     const nuevo = await prisma.emprendedor.create({
//       data: {
//         ...body,
//         usuario: { connect: { id: payload.id } }
//       }
//     });

//     return NextResponse.json(nuevo);
//   } catch (e) {
//     return NextResponse.json({ error: 'Token inválido' }, { status: 403 });
//   }
// }

// import { NextResponse } from 'next/server';
// import prisma from '@/lib/prisma';

// export async function GET() {
//   const emprendedores = await prisma.emprendedor.findMany({
//     include: { emprendimientos: true, asignaciones: true }
//   });
//   return NextResponse.json(emprendedores);
// }

// export async function POST(req) {
//   const body = await req.json();

//   const nuevo = await prisma.emprendedor.create({
//     data: {
//       ...body,
//       ubicacion: body.ubicacion
//         ? Buffer.from(JSON.stringify({
//             type: 'Point',
//             coordinates: [body.ubicacion.lng, body.ubicacion.lat]
//           }))
//         : null
//     }
//   });

//   return NextResponse.json(nuevo);
// }
