import { NextResponse } from 'next/server';
import prisma from '../../../lib/prisma';

export async function GET() {
  const emprendedores = await prisma.emprendedor.findMany({
    select: { id: true, nombre: true, apellido: true }
  });
  return NextResponse.json(emprendedores);
}
