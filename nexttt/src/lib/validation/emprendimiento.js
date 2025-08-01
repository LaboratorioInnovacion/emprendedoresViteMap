import { z } from "zod"

export const emprendimientoSchema = z.object({
  denominacion: z.string().min(2, "La denominación debe tener al menos 2 caracteres"),
  emprendedorId: z.string().min(1, "Selecciona un emprendedor"),
  etapa: z.enum(["Idea", "En desarrollo", "Activo", "Pausado"], {
    required_error: "Selecciona una etapa",
  }),
  sector: z.string().min(2, "El sector debe tener al menos 2 caracteres"),
  descripcion: z.string().optional(),
})
