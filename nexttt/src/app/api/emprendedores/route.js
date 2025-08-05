import { NextResponse } from "next/server";
import prisma from "../../../lib/prisma";
import { getToken } from "next-auth/jwt";
import { useSession } from "next-auth/react";

export async function POST(req) {
  try {
    const token = await getToken({
      req,
      secret: process.env.NEXTAUTH_SECRET,
      cookieName: "__Secure-next-auth.session-token", // 👈 clave en producción
    });

    console.log("🔐 Token recibido en API:", token);

    // if (!token) {
    //   return NextResponse.json({ error: "No autorizado" }, { status: 403 });
    // }

    // if (token.rol !== "EMPRENDEDOR") {
    //   return NextResponse.json({ error: "Rol no permitido" }, { status: 403 });
    // }

    const data = await req.json();

    const nuevo = await prisma.emprendedor.create({
      data: {
        ...data,
       fechaNacimiento: new Date(data.fechaNacimiento), // 👈 esto es clave
        usuario: { connect: { id: token.id } },
      },
    });

    return NextResponse.json(nuevo);
  } catch (err) {
    console.error("❌ Error en POST /api/emprendedores:", err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
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
