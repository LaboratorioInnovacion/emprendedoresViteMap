import { NextResponse } from 'next/server';
import { jwtVerify } from 'jose';

export async function middleware(req) {
  const token = req.headers.get('authorization')?.split(' ')[1];
  if (!token) return NextResponse.redirect(new URL('/login', req.url));

  try {
    const { payload } = await jwtVerify(token, new TextEncoder().encode(process.env.JWT_SECRET));

    // Ejemplo: bloquear acceso a /admin si no es admin
    if (req.nextUrl.pathname.startsWith('/admin') && payload.rol !== 'ADMIN' && payload.rol !== 'SUPERUSUARIO') {
      return NextResponse.redirect(new URL('/403', req.url));
    }

    return NextResponse.next();
  } catch {
    return NextResponse.redirect(new URL('/login', req.url));
  }
}

export const config = {
  matcher: ['/admin/:path*', '/dashboard/:path*']
};
