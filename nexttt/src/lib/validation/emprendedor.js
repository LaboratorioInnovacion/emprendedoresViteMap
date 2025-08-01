import { z } from "zod"

export const emprendedorSchema = z.object({
  nombre: z.string().min(2, "El nombre debe tener al menos 2 caracteres"),
  apellido: z.string().min(2, "El apellido debe tener al menos 2 caracteres"),
  dni: z.string().regex(/^\d{7,8}$/, "DNI debe tener 7 u 8 dígitos"),
  cuil: z.string().regex(/^\d{11}$/, "CUIL debe tener 11 dígitos"),
  email: z.string().email("Email inválido"),
  password: z.string().min(6, "La contraseña debe tener al menos 6 caracteres").optional(),
})
