import crypto from 'node:crypto'
import bcrypt from 'bcrypt'
import { IAuthModel } from '../interfaces/auth.js'
import { TipoUsuario, Usuario } from '../types/usuario.js'
import { createClient } from '@libsql/client'

export const turso = createClient({
  url: process.env.TURSO_DATABASE_URL!,
  authToken: process.env.TURSO_AUTH_TOKEN!,
})

export class AuthModel implements IAuthModel {
  async register({ input }: any): Promise<Usuario> {
    // TODO validacion con zod

    // TODO validar que no exista un usuario con ese email
    //if (user) throw new Error('username already exists')

    const uuid = crypto.randomUUID()
    const hashedPassword = await bcrypt.hash(input.password, 10)
    const id = (
      await turso.execute({
        sql: 'INSERT INTO usuarios (id, nombre, apellido, email, password, type) VALUES (?, ?, ?, ?, ?, ?)',
        args: [
          uuid,
          input.nombre,
          input.apellido,
          input.email,
          hashedPassword,
          TipoUsuario.BORRACHO,
        ],
      })
    ).toJSON().lastInsertRowid

    // creo la row en tabla partidosAnotados, si es un asco
    await turso.execute({
      sql: 'INSERT INTO borrachosPartidos (user_id, partidosAnotado) VALUES (?, "[]")',
      args: [uuid],
    })

    // TODO devolver usuario no id
    /*
    const newUser = (
      await turso.execute({
        sql: 'SELECT * FROM usuarios WHERE id=?',
        args: [await id],
      })
    ).rows[0] as Usuario
    */
    return id
  }

  async login({ email, password }: any) {
    // TODO validacion con zod
    const user = (
      await turso.execute({
        sql: 'SELECT * FROM usuarios WHERE email = ?',
        args: [email],
      })
    ).rows[0] as Usuario

    // Esto no deberia pasasr
    const validPassword = await bcrypt.compare(password, user.password!)
    if (!validPassword) throw new Error('La contraseña es incorrecta')

    return user
  }
}
