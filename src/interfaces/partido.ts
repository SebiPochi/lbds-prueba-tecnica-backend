import { Partido } from '../types/partido.js'

export interface IPartidoModel {
  tieneCapacidad({}): Promise<boolean>
  getAll(): Promise<Partido[]>
  create({}): Promise<string>
  update({}): Promise<Partido>
  delete(id: number): Promise<string>
}
