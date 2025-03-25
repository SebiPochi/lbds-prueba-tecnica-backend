import { IBorrachoModel } from '../interfaces/borracho.js'
import { IPartidoModel } from '../interfaces/partido.js'
import { Borracho } from '../types/borracho.js'
import { Partido } from '../types/partido.js'
import { createClient } from '@libsql/client'
import { Usuario } from '../types/usuario.js'

export const turso = createClient({
  url: process.env.TURSO_DATABASE_URL!,
  authToken: process.env.TURSO_AUTH_TOKEN!,
})

export class BorrachoModel implements IBorrachoModel {
  async getAll(): Promise<Borracho[]> {
    const borrachos = (
      await turso.execute(
        'SELECT usuarios.id, usuarios.nombre, usuarios.apellido, usuarios.email, usuarios.password, usuarios.type, borrachosPartidos.partidosAnotado FROM usuarios JOIN borrachosPartidos  ON usuarios.id = borrachosPartidos.user_id WHERE usuarios.type=0',
      )
    ).rows as unknown as Borracho[]
    return borrachos
  }

  async get({ id }: any): Promise<Usuario> {
    const usuario = (
      await turso.execute({
        sql: 'SELECT * FROM usuarios WHERE id = ?',
        args: [id],
      })
    ).rows[0] as Usuario
    return usuario
  }

  async pagarCuota({ id }: any): Promise<boolean> {
    const pagado = (
      await turso.execute({
        sql: 'UPDATE borrachosCuota SET estaPago = 1 WHERE user_id = ?',
        args: [id],
      })
    ).toJSON()
    console.log(pagado)
    return true
  }
  anotarsePartido({}: {}): Promise<Partido> {
    throw new Error('Method not implemented.')
  }
}
