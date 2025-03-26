import z from 'zod'

const usuarioSchema = z.object({
  id: z.string().uuid().optional(),
  nombre: z.string(),
  apellido: z.string(),
  email: z.string().email(),
  password: z.string(),
  type: z.number().min(0).optional(),
  entradasCompradas: z.number().min(0).optional(),
  estaPago: z.number().min(0).optional(),
})

export function validateUsuario(input: object) {
  return usuarioSchema.safeParse(input)
}

export function validatePartialUsuario(input: object) {
  return usuarioSchema.partial().safeParse(input)
}
