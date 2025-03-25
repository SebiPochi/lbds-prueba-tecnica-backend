import z from 'zod';
const partidoSchema = z.object({
    id: z.number().min(0),
    fecha: z.string(),
    rival: z.string(),
    cancha: z.string(),
    capacidad: z.number(),
    entradasCompradas: z.number().min(0)
});
export function validatePartido(input) {
    return partidoSchema.safeParse(input);
}
