import z from 'zod'

const partidoSchema = z.object({
  id: z.number().min(0).optional(),
  fecha: z.string(),
  rival: z.string(),
  cancha: z.string(),
  capacidad: z.number(),
  entradasCompradas: z.number().min(0).optional(),
})

export function validatePartido(input: object) {
  return partidoSchema.safeParse(input)
}
