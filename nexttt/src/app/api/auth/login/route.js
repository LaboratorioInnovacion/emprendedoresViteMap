import prisma from "../../../../lib/prisma.js";
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { NextResponse } from 'next/server';

export async function POST(req) {
  const { email, password } = await req.json();

  const usuario = await prisma.usuario.findUnique({
    where: { email },
    include: { emprendedor: true }
  });

  if (!usuario || !usuario.activo)
    return NextResponse.json({ error: 'Credenciales inválidas' }, { status: 401 });

  const valid = await bcrypt.compare(password, usuario.password);
  if (!valid) return NextResponse.json({ error: 'Contraseña incorrecta' }, { status: 401 });

  const token = jwt.sign(
    {
      id: usuario.id,
      email: usuario.email,
      rol: usuario.rol,
      emprendedorId: usuario.emprendedor?.id || null
    },
    process.env.JWT_SECRET,
    { expiresIn: '7d' }
  );

  return NextResponse.json({ token });
}

// import { NextResponse } from "next/server";
// import prisma from "../../../../lib/prisma.js";
// import bcrypt from "bcryptjs";
// import jwt from "jsonwebtoken";

// export async function POST(req) {
//   try {
//     const body = await req.json();
//     const { email, password } = body;

//     const usuario = await prisma.usuario.findUnique({
//       where: { email },
//       include: { emprendedor: true },
//     });

//     if (!usuario || !usuario.activo) {
//       return NextResponse.json(
//         { error: "Credenciales inválidas" },
//         { status: 401 }
//       );
//     }

//     const isValid = await bcrypt.compare(password, usuario.password);
//     if (!isValid) {
//       return NextResponse.json(
//         { error: "Contraseña incorrecta" },
//         { status: 401 }
//       );
//     }
//     const token = jwt.sign(
//       {
//         id: usuario.id,
//         email: usuario.email,
//         rol: usuario.rol,
//         emprendedorId: usuario.emprendedorId,
//       },
//       process.env.JWT_SECRET,
//       { expiresIn: "7d" }
//     );
//     // const token = jwt.sign(
//     //   {
//     //     id: usuario.id,
//     //     email: usuario.email,
//     //     rol: usuario.rol,
//     //     emprendedorId: usuario.emprendedorId || null
//     //   },
//     //   process.env.JWT_SECRET,
//     //   { expiresIn: '1d' }
//     // );

//     return NextResponse.json({ token });
//   } catch (error) {
//     return NextResponse.json(
//       { error: "Error al iniciar sesión" },
//       { status: 500 }
//     );
//   }
// }
