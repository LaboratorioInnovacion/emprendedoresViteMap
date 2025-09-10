// middleware.ts
import { NextResponse } from 'next/server';
import { getToken }      from 'next-auth/jwt';

export async function middleware(req) {
  const token = await getToken({
    req,
    secret: process.env.NEXTAUTH_SECRET,
    encryption: true,
  });
  const { pathname } = req.nextUrl;

  // 0) Proteger rutas de API también
  if (pathname.startsWith('/api/')) {
    // Si no está logueado, redirige a login
    if (!token) {
      return NextResponse.redirect(new URL('/auth/login', req.url));
    }
    // Si el token está expirado, redirige a login
    if (token.exp && Date.now() / 1000 > token.exp) {
      return NextResponse.redirect(new URL('/auth/login', req.url));
    }
    // Puedes agregar aquí reglas de rol para endpoints de API si lo deseas
  }

  // 1) Si va a /auth o es estático, no lo bloquea:
  if (pathname.startsWith('/_next') || pathname.startsWith('/auth')) {
    return NextResponse.next();
  }

  // 2) Si no está logueado, lo manda al login:
  if (!token) {
    return NextResponse.redirect(new URL('/auth/login', req.url));
  }
  // 2b) Si el token está expirado, lo manda al login:
  if (token.exp && Date.now() / 1000 > token.exp) {
    return NextResponse.redirect(new URL('/auth/login', req.url));
  }

  // 3) Rutas /admin → solo ADMIN
  if (pathname.startsWith('/admin') && token.rol !== 'ADMIN') {
    return NextResponse.redirect(new URL('/403', req.url));
  }

  // 4) Rutas /emprendedor → solo EMPRENDEDOR
  if (pathname.startsWith('/emprendedor') && token.rol !== 'EMPRENDEDOR') {
    return NextResponse.redirect(new URL('/403', req.url));
  }

  // 5) Rutas /herramientas y /capacitaciones → solo ADMIN y SUPERUSUARIO
  if ((pathname.startsWith('/herramientas') || pathname.startsWith('/capacitaciones')) && !(token.rol === 'ADMIN' || token.rol === 'SUPERUSUARIO')) {
    return NextResponse.redirect(new URL('/403', req.url));
  }

  // 6) Deja pasar al resto
  return NextResponse.next();
}

export const config = {
  matcher: ['/admin/:path*', '/emprendedor/:path*', '/((?!_next|favicon.ico).*)'],
};
