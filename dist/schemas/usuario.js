import z from 'zod';
const usuarioSchema = z.object({
    id: z.string().uuid(),
    nombre: z.string(),
    apellido: z.string(),
    email: z.string().email(),
    password: z.string(),
    type: z.number().min(0),
    entradasCompradas: z.number().min(0),
});
export function validateUsuario(input) {
    return usuarioSchema.safeParse(input);
}
export function validatePartialUsuario(input) {
    return usuarioSchema.partial().safeParse(input);
}
