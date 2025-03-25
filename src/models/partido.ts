import { IPartidoModel } from '../interfaces/partido.js'
import { validatePartido } from '../schemas/partido.js'
import { Partido } from '../types/partido.js'
import { createClient } from '@libsql/client'

export const turso = createClient({
  url: process.env.TURSO_DATABASE_URL!,
  authToken: process.env.TURSO_AUTH_TOKEN!,
})

export class PartidoModel implements IPartidoModel {
  async getAll(): Promise<Partido[]> {
    const partidos = (await turso.execute('SELECT * FROM partidos'))
      .rows as unknown as Partido[]
    return partidos
  }
  async create({ input }: any): Promise<string> {
    const { fecha, rival, cancha, capacidad } = input

    // TODO No puede tener una fecha igual o muy cercana a otra

    try {
      const id = (
        await turso.execute({
          sql: 'INSERT INTO partidos (fecha, rival, cancha, capacidad) VALUES (:fecha, :rival, :cancha, :capacidad)',
          args: { fecha, rival, cancha, capacidad },
        })
      ).toJSON().lastInsertRowid
      return id
    } catch (e) {
      console.log((e as Error).message)
      throw new Error('Error en el servidor al crear el partido')
    }
  }
  async update({ id, input }: any): Promise<Partido> {
    let query = 'UPDATE partidos SET'
    let params = []

    if (input.fecha) {
      query += ' fecha = ?,'
      params.push(input.fecha)
    }

    if (input.rival) {
      query += ' rival = ?,'
      params.push(input.rival)
    }
    if (input.cancha) {
      query += ' cancha = ?,'
      params.push(input.cancha)
    }

    if (input.capacidad) {
      query += ' capacidad = ?,'
      params.push(input.capacidad)
    }

    query = query.slice(0, -1)

    query += ' WHERE id = ?'

    params.push(id)
    try {
      await turso.execute({
        sql: query,
        args: params,
      })
      const partidoUpdated = (
        await turso.execute({
          sql: 'SELECT * FROM partidos WHERE id = ?',
          args: [id],
        })
      ).rows[0] as Partido
      console.log(partidoUpdated)
      return partidoUpdated
    } catch (err) {
      console.log((err as Error).message)
      throw new Error('Error en servidor al actualizar partido')
    }
  }
  async delete(id: number): Promise<string> {
    try {
      const isDeleted = (
        await turso.execute({
          sql: 'DELETE FROM partidos WHERE id = ?',
          args: [id],
        })
      ).toJSON().rowsAffected

      return isDeleted
    } catch (err) {
      console.log((err as Error).message)
      throw new Error('Error en el servidor al eliminar el partido')
    }
  }
}
