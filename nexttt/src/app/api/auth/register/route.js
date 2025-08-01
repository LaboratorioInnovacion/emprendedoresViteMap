import { NextResponse } from 'next/server';
import prisma from "../../../../lib/prisma.js";
import bcrypt from 'bcryptjs';

export async function POST(req) {
  const { email, password } = await req.json();

  const existe = await prisma.usuario.findUnique({ where: { email } });
  if (existe) return NextResponse.json({ error: 'Email ya registrado' }, { status: 400 });

  const hashed = await bcrypt.hash(password, 10);
  const nuevo = await prisma.usuario.create({
    data: { email, password: hashed, rol: 'EMPRENDEDOR' }
  });

  return NextResponse.json({ ok: true, usuarioId: nuevo.id });
}

// import { NextResponse } from "next/server";
// import  prisma  from "../../../../lib/prisma.js";
// import bcrypt from "bcryptjs";

// export async function POST(req) {
//   try {
//     const body = await req.json();
//     const { email, password } = body;

//     const existe = await prisma.usuario.findUnique({ where: { email } });
//     if (existe) {
//       return NextResponse.json(
//         { error: "Email ya registrado" },
//         { status: 400 }
//       );
//     }

//     const hashedPassword = await bcrypt.hash(password, 10);

//     const nuevo = await prisma.usuario.create({
//       data: {
//         email,
//         password: hashedPassword,
//         rol: "EMPRENDEDOR",
//       },
//     });

//     return NextResponse.json({ ok: true, usuarioId: nuevo.id });
//   } catch (error) {
//     return NextResponse.json(
//       { error: "Error al registrar usuario" },
//       { status: 500 }
//     );
//   }
// }
