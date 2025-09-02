import prisma from "./prisma";

export async function registrarLog({ usuarioId, entidad, entidadId, accion, descripcion }) {
  try {
    await prisma.logAccion.create({
      data: {
        usuarioId: token && token.id ? Number(token.id) : null,
        entidad,
        entidadId: nuevo ? nuevo.id : entidadId,
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