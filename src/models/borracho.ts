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
    let query =
      'SELECT usuarios.id, usuarios.nombre, usuarios.apellido, usuarios.email, usuarios.password, usuarios.type, borrachosPartidos.partidosAnotado, borrachosCuota.estaPago FROM usuarios'

    query +=
      ' JOIN borrachosPartidos ON usuarios.id = borrachosPartidos.user_id'
    query +=
      ' JOIN borrachosCuota ON usuarios.id = borrachosCuota.user_id WHERE usuarios.type=0'
    const borrachos = (await turso.execute(query)).rows as unknown as Borracho[]
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

  async getBorracho({ id }: any): Promise<Borracho> {
    let query =
      'SELECT usuarios.id, usuarios.nombre, usuarios.apellido, usuarios.email, usuarios.password, usuarios.type, borrachosPartidos.partidosAnotado, borrachosCuota.estaPago FROM usuarios'

    query +=
      ' JOIN borrachosPartidos ON usuarios.id = borrachosPartidos.user_id'
    query +=
      ' JOIN borrachosCuota ON usuarios.id = borrachosCuota.user_id WHERE usuarios.id = ?'

    const borracho = (
      await turso.execute({
        sql: query,
        args: [id],
      })
    ).rows[0] as unknown as Borracho
    return borracho
  }

  async pagarCuota({ id }: any): Promise<boolean> {
    //Ya esta pago?
    const posibleBorracho = (await this.getBorracho({ id })) as Borracho

    if (Boolean(posibleBorracho!.estaPago) === true) {
      throw new Error('El usuario ya pago la cuota')
    }

    const pagado = (
      await turso.execute({
        sql: 'UPDATE borrachosCuota SET estaPago = 1 WHERE user_id = ?',
        args: [id],
      })
    ).toJSON()

    return true
  }

  async anotarsePartido({ borrachoId, partidoId }: any): Promise<string[]> {
    // Obtener todos los partidos anotado
    const res = await turso.execute({
      sql: 'SELECT partidosAnotado FROM borrachosPartidos WHERE user_id = ?',
      args: [borrachoId],
    })
    let partidosAnotado = JSON.parse(res.rows[0].partidosAnotado as string)

    if (partidosAnotado.includes(partidoId)) {
      throw new Error('El borracho ya está anotado a este partido')
    }

    partidosAnotado.push(partidoId)

    await turso.execute({
      sql: 'UPDATE borrachosPartidos SET partidosAnotado = ? WHERE user_id = ?',
      args: [JSON.stringify(partidosAnotado), borrachoId],
    })

    // sumar una entradaComprada al partido
    await turso.execute({
      sql: 'UPDATE partidos SET entradasCompradas = entradasCompradas + 1 WHERE id = ?',
      args: [partidoId],
    })

    return partidosAnotado
  }

  async getPartidosAnotado({ id }: any): Promise<string[]> {
    // Obtener todos los partidos anotado
    const res = await turso.execute({
      sql: 'SELECT partidosAnotado FROM borrachosPartidos WHERE user_id = ?',
      args: [id],
    })
    let partidosAnotado = JSON.parse(res.rows[0].partidosAnotado as string)

    return partidosAnotado
  }
}
