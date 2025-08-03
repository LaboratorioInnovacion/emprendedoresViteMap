// middleware.ts

import { getToken } from "next-auth/jwt";
import { NextResponse } from "next/server";

export async function middleware(req) {
  const token = await getToken({ req });
  
  const url = req.nextUrl;

  if (!token) {
    return NextResponse.redirect(new URL("/auth/login", req.url));
  }

  const isAdminPage = url.pathname.startsWith("/admin");

  if (isAdminPage && token.rol !== "ADMIN") {
    return NextResponse.redirect(new URL("/no-autorizado", req.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*", "/dashboard/:path*"], // rutas protegidas
};

// //MIDLEWARE PARA EL BACKEND DE NEXT.JS
// // Este middleware verifica el JWT y protege las rutas según el rol del usuario
// import { NextResponse } from 'next/server';
// import { jwtVerify } from 'jose';

// const PUBLIC_ROUTES = ['/login', '/register', '/'];

// export async function middleware(req) {
//   const { pathname } = req.nextUrl;

//   if (PUBLIC_ROUTES.includes(pathname)) return NextResponse.next();

//   const token = req.cookies.get('token')?.value;
//   if (!token) return NextResponse.redirect(new URL('/auth/login', req.url));

//   try {
//     const secret = new TextEncoder().encode(process.env.JWT_SECRET);
//     const { payload } = await jwtVerify(token, secret);

//     // Protección por ruta
//     if (pathname.startsWith('/admin') && !['ADMIN', 'SUPERUSUARIO'].includes(payload.rol)) {
//       return NextResponse.redirect(new URL('/403', req.url));
//     }

//     if (pathname.startsWith('/super') && payload.rol !== 'SUPERUSUARIO') {
//       return NextResponse.redirect(new URL('/403', req.url));
//     }

//     if (pathname.startsWith('/perfil') && payload.rol !== 'EMPRENDEDOR') {
//       return NextResponse.redirect(new URL('/403', req.url));
//     }

//     return NextResponse.next();
//   } catch (err) {
//     return NextResponse.redirect(new URL('/login', req.url));
//   }
// }

// export const config = {
//   matcher: ['/perfil/:path*', '/admin/:path*', '/super/:path*']
// };

// // import jwt from 'jsonwebtoken';

// // export function getUserFromRequest(req) {
// //   const token = req.headers.get('authorization')?.replace('Bearer ', '');
// //   if (!token) throw new Error('No autorizado');

// //   try {
// //     return jwt.verify(token, process.env.JWT_SECRET);
// //   } catch {
// //     throw new Error('Token inválido');
// //   }
// // }

// // export function requireRole(user, roles) {
// //   if (!roles.includes(user.rol)) {
// //     throw new Error('Acceso denegado');
// //   }
// // }

// // import { NextResponse } from 'next/server';
// // import { jwtVerify } from 'jose';

// // const secret = new TextEncoder().encode(process.env.JWT_SECRET);

// // export async function middleware(req) {
// //   const token = req.headers.get('authorization')?.replace('Bearer ', '')
// //     || req.cookies.get('token')?.value;

// //   const url = req.nextUrl.clone();

// //   if (!token) {
// //     url.pathname = '/login';
// //     return NextResponse.redirect(url);
// //   }

// //   try {
// //     const { payload } = await jwtVerify(token, secret);
// //     const rol = payload.rol;
// //     const pathname = req.nextUrl.pathname;

// //     // 🔐 Protección por rutas
// //     if (pathname.startsWith('/admin') && !['ADMIN', 'SUPERUSUARIO'].includes(rol)) {
// //       url.pathname = '/403';
// //       return NextResponse.redirect(url);
// //     }

// //     if (pathname.startsWith('/super') && rol !== 'SUPERUSUARIO') {
// //       url.pathname = '/403';
// //       return NextResponse.redirect(url);
// //     }

// //     if (pathname.startsWith('/dashboard') && rol !== 'EMPRENDEDOR') {
// //       url.pathname = '/403';
// //       return NextResponse.redirect(url);
// //     }

// //     // ✅ Dejar pasar
// //     return NextResponse.next();

// //   } catch (err) {
// //     console.error('Token inválido:', err.message);
// //     url.pathname = '/login';
// //     return NextResponse.redirect(url);
// //   }
// // }

// // export const config = {
// //   matcher: [
// //     '/admin/:path*',
// //     '/super/:path*',
// //     '/dashboard/:path*'
// //   ]
// // };
// // // import { NextResponse } from 'next/server';
// // // import { jwtVerify } from 'jose';

// // // export async function middleware(req) {
// // //   const token = req.headers.get('authorization')?.split(' ')[1];
// // //   if (!token) return NextResponse.redirect(new URL('/login', req.url));

// // //   try {
// // //     const { payload } = await jwtVerify(token, new TextEncoder().encode(process.env.JWT_SECRET));

// // //     // Ejemplo: bloquear acceso a /admin si no es admin
// // //     if (req.nextUrl.pathname.startsWith('/admin') && payload.rol !== 'ADMIN' && payload.rol !== 'SUPERUSUARIO') {
// // //       return NextResponse.redirect(new URL('/403', req.url));
// // //     }

// // //     return NextResponse.next();
// // //   } catch {
// // //     return NextResponse.redirect(new URL('/login', req.url));
// // //   }
// // // }

// // // export const config = {
// // //   matcher: ['/admin/:path*', '/dashboard/:path*']
// // // };
