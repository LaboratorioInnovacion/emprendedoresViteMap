import { NextResponse } from 'next/server';
import { jwtVerify } from 'jose';

const secret = new TextEncoder().encode(process.env.JWT_SECRET);

export async function middleware(req) {
  const token = req.headers.get('authorization')?.replace('Bearer ', '')
    || req.cookies.get('token')?.value;

  const url = req.nextUrl.clone();

  if (!token) {
    url.pathname = '/login';
    return NextResponse.redirect(url);
  }

  try {
    const { payload } = await jwtVerify(token, secret);
    const rol = payload.rol;
    const pathname = req.nextUrl.pathname;

    // 🔐 Protección por rutas
    if (pathname.startsWith('/admin') && !['ADMIN', 'SUPERUSUARIO'].includes(rol)) {
      url.pathname = '/403';
      return NextResponse.redirect(url);
    }

    if (pathname.startsWith('/super') && rol !== 'SUPERUSUARIO') {
      url.pathname = '/403';
      return NextResponse.redirect(url);
    }

    if (pathname.startsWith('/dashboard') && rol !== 'EMPRENDEDOR') {
      url.pathname = '/403';
      return NextResponse.redirect(url);
    }

    // ✅ Dejar pasar
    return NextResponse.next();

  } catch (err) {
    console.error('Token inválido:', err.message);
    url.pathname = '/login';
    return NextResponse.redirect(url);
  }
}

export const config = {
  matcher: [
    '/admin/:path*',
    '/super/:path*',
    '/dashboard/:path*'
  ]
};
// import { NextResponse } from 'next/server';
// import { jwtVerify } from 'jose';

// export async function middleware(req) {
//   const token = req.headers.get('authorization')?.split(' ')[1];
//   if (!token) return NextResponse.redirect(new URL('/login', req.url));

//   try {
//     const { payload } = await jwtVerify(token, new TextEncoder().encode(process.env.JWT_SECRET));

//     // Ejemplo: bloquear acceso a /admin si no es admin
//     if (req.nextUrl.pathname.startsWith('/admin') && payload.rol !== 'ADMIN' && payload.rol !== 'SUPERUSUARIO') {
//       return NextResponse.redirect(new URL('/403', req.url));
//     }

//     return NextResponse.next();
//   } catch {
//     return NextResponse.redirect(new URL('/login', req.url));
//   }
// }

// export const config = {
//   matcher: ['/admin/:path*', '/dashboard/:path*']
// };
