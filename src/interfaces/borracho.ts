import { Borracho } from '../types/borracho.js'
import { Partido } from '../types/partido.js'
import { Usuario } from '../types/usuario.js'

export interface IBorrachoModel {
  getAll(): Promise<Borracho[]>
  get({}): Promise<Usuario>
  pagarCuota({}): Promise<boolean>
  anotarsePartido({}): Promise<Partido>
}
