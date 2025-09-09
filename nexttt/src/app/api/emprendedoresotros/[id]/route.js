
import { NextResponse } from "next/server";
import prisma from "../../../../lib/prisma";
import { getToken } from "next-auth/jwt";
import { registrarLogAccionDesdeRequest } from "../../../../lib/logAccion";

// Utilidad para decodificar ubicacion Bytes a {lat, lng}
function decodeUbicacion(ubicacion) {
	if (!ubicacion) return null;
	try {
		const str = Buffer.isBuffer(ubicacion)
			? ubicacion.toString("utf8")
			: String.fromCharCode(...ubicacion);
		const obj = JSON.parse(str);
		if (obj.type === "Point" && Array.isArray(obj.coordinates)) {
			return { lng: obj.coordinates[0], lat: obj.coordinates[1] };
		}
		if (typeof obj.lat === "number" && typeof obj.lng === "number") {
			return obj;
		}
	} catch (e) {}
	return null;
}

export async function GET(req, { params }) {
	try {
		const resolvedParams = await params;
		const id = Number(resolvedParams.id);
		const emp = await prisma.emprendedorOtros.findUnique({ where: { id } });
		if (!emp) return NextResponse.json({ error: "No encontrado" }, { status: 404 });
		return NextResponse.json({ ...emp, ubicacion: decodeUbicacion(emp.ubicacion) });
	} catch (err) {
		return NextResponse.json({ error: err.message }, { status: 500 });
	}
}

export async function PUT(req, { params }) {
	try {
		const resolvedParams = await params;
		const id = Number(resolvedParams.id);
		const data = await req.json();
		// Adaptar ubicación si viene como string JSON
		let ubicacion = data.ubicacion;
		if (typeof ubicacion === "string") {
			try {
				ubicacion = JSON.parse(ubicacion);
			} catch {}
		}
		// Guardar como Bytes tipo Point si hay lat/lng
		let ubicacionBytes = null;
		if (ubicacion && typeof ubicacion.lat === "number" && typeof ubicacion.lng === "number") {
			ubicacionBytes = Buffer.from(JSON.stringify({ type: "Point", coordinates: [ubicacion.lng, ubicacion.lat] }));
		}
		const dataToUpdate = {
			...data,
			fechaNacimiento: data.fechaNacimiento ? new Date(data.fechaNacimiento) : null,
			ubicacion: ubicacionBytes,
		};
		const updated = await prisma.emprendedorOtros.update({
			where: { id },
			data: dataToUpdate,
		});
		// Registrar log de actualización
		await registrarLogAccionDesdeRequest(
			req,
			updated,
			"EmprendedorOtros",
			"ACTUALIZAR",
			`Actualización de emprendedor otros (ID: ${updated.id})`
		);
		return NextResponse.json({ ...updated, ubicacion: decodeUbicacion(updated.ubicacion) });
	} catch (err) {
		return NextResponse.json({ error: err.message }, { status: 500 });
	}
}

export async function DELETE(req, { params }) {
	try {
		const resolvedParams = await params;
		const id = Number(resolvedParams.id);
		const deleted = await prisma.emprendedorOtros.delete({ where: { id } });
		// Registrar log de borrado
		await registrarLogAccionDesdeRequest(
			req,
			deleted,
			"EmprendedorOtros",
			"BORRAR",
			`Borrado de emprendedor otros (ID: ${deleted.id})`
		);
		return NextResponse.json({ success: true });
	} catch (err) {
		return NextResponse.json({ error: err.message }, { status: 500 });
	}
}
