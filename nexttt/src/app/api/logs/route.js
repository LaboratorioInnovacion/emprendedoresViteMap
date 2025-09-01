import { NextResponse } from "next/server";
import prisma from "../../../lib/prisma";

// GET /api/logs - Devuelve los logs de acciones, más recientes primero
export async function GET(req) {
  try {
    const logs = await prisma.logAccion.findMany({
      orderBy: { fecha: "desc" },
      include: {
        usuario: {
          select: { id: true, email: true, rol: true }
        }
      }
    });
    return NextResponse.json(logs);
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
