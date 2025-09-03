
import prisma from "./prisma";
import { getToken } from "next-auth/jwt";

/**
 * Registra un log de acción obteniendo el token desde el request y usando el objeto creado.
 * @param {Request} req - El request recibido en el endpoint
 * @param {Object} nuevo - El objeto creado (por ejemplo, el emprendedor)
 * @param {string} entidad - Nombre de la entidad
 * @param {string} accion - Acción realizada
 * @param {string} descripcion - Descripción del log
 */
export async function registrarLogAccionDesdeRequest(req, nuevo, entidad, accion, descripcion) {
  try {
    const token = await getToken({
      req,
      secret: process.env.NEXTAUTH_SECRET,
      cookieName: "next-auth.session-token",
    });
    await prisma.logAccion.create({
      data: {
        usuarioId: token && token.id ? Number(token.id) : null,
        entidad,
        entidadId: nuevo.id,
        accion,
        descripcion,
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
    // Si se pasa token y nuevo, usar sus ids, ignorando usuarioId y entidadId directos
    const usuarioIdFinal = token && token.id ? Number(token.id) : null;
    const entidadIdFinal = nuevo && nuevo.id ? nuevo.id : null;
    await prisma.logAccion.create({
      data: {
        usuarioId: usuarioIdFinal !== null ? usuarioIdFinal : (usuarioId ?? null),
        entidad,
        entidadId: entidadIdFinal !== null ? entidadIdFinal : (entidadId ?? null),
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