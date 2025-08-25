import { NextResponse } from 'next/server';
import prisma from '../../../lib/prisma';

export async function GET() {
  const emprendimientos = await prisma.emprendimiento.findMany({
    select: { id: true, denominacion: true }
  });
  return NextResponse.json(emprendimientos);
}
