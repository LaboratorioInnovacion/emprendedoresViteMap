
import prisma from "./prisma";
import { getToken } from "next-auth/jwt";

/**
 * Registra un log de acción obteniendo el token desde el request y usando el objeto creado.
 * Si se pasa usuarioId, lo prioriza sobre el id del token.
 * @param {Request} req - El request recibido en el endpoint
 * @param {Object} nuevo - El objeto creado (por ejemplo, el emprendedor)
 * @param {string} entidad - Nombre de la entidad
 * @param {string} accion - Acción realizada
 * @param {string} descripcion - Descripción del log
 * @param {number} [usuarioId] - ID de usuario (opcional, prioriza sobre el token)
 */
export async function registrarLogAccionDesdeRequest(req, nuevo, entidad, accion, descripcion, usuarioId) {
  try {
    const token = await getToken({
      req,
      secret: process.env.NEXTAUTH_SECRET,
      cookieName: "next-auth.session-token",
    });
    // Obtener la fecha actual en horario de Argentina y convertir a UTC
    const { zonedTimeToUtc } = await import('date-fns-tz');
    const zonaArgentina = 'America/Argentina/Buenos_Aires';
    const ahoraArgentina = new Date();
    const fechaArgentinaUTC = zonedTimeToUtc(ahoraArgentina, zonaArgentina);
    const usuarioIdFinal = (typeof usuarioId === 'number' && !isNaN(usuarioId))
      ? usuarioId
      : (token && token.id ? Number(token.id) : null);
    await prisma.logAccion.create({
      data: {
        usuarioId: usuarioIdFinal,
        entidad,
        entidadId: nuevo.id,
        accion,
        descripcion,
        fecha: fechaArgentinaUTC,
      },
    });
  } catch (logErr) {
    console.error("❌ Error registrando log de creación:", logErr);
  }
}

/**
 * Registra un log de acción en la base de datos.
 * Puedes pasar token y nuevo para simular el comportamiento del endpoint, o solo los datos directos.
 * @param {Object} params
 * @param {Object} [params.token] - Token de usuario (opcional)
 * @param {Object} [params.nuevo] - Objeto creado (opcional)
 * @param {number} [params.usuarioId] - ID de usuario (opcional)
 * @param {string} params.entidad - Nombre de la entidad
 * @param {number} [params.entidadId] - ID de la entidad
 * @param {string} params.accion - Acción realizada
 * @param {string} params.descripcion - Descripción del log
 */
export async function registrarLog({ token, nuevo, usuarioId, entidad, entidadId, accion, descripcion }) {
  try {
    // Prioriza usuarioId explícito si se pasa, luego token.id, luego null
    let usuarioIdFinal = null;
    if (typeof usuarioId === 'number' && !isNaN(usuarioId)) {
      usuarioIdFinal = usuarioId;
    } else if (token && token.id) {
      usuarioIdFinal = Number(token.id);
    }
    const entidadIdFinal = nuevo && nuevo.id ? nuevo.id : (entidadId ?? null);
    await prisma.logAccion.create({
      data: {
        usuarioId: usuarioIdFinal,
        entidad,
        entidadId: entidadIdFinal,
        accion,
        descripcion,
      },
    });
  } catch (logErr) {
    console.error("❌ Error registrando log de creación:", logErr);
  }
}


// import prisma from "./prisma";

// export async function registrarLog({ usuarioId, entidad, entidadId, accion, descripcion }) {
//   try {
//     await prisma.logAccion.create({
//       data: {
//         usuarioId: usuarioId || null,
//         entidad,
//         entidadId,
//         accion,
//         descripcion,
//       },
//     });
//   } catch (err) {
//     // Opcional: loguear error en consola
//     console.error("Error registrando log:", err);
//   }
// }