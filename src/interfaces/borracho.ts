import { Borracho } from '../types/borracho.js'
import { Partido } from '../types/partido.js'
import { Usuario } from '../types/usuario.js'

export interface IBorrachoModel {
  getAll(): Promise<Borracho[]>
  get({}): Promise<Usuario>
  getBorracho({}): Promise<Borracho>
  pagarCuota({}): Promise<boolean>
  anotarsePartido({}): Promise<string[]>
  getPartidosAnotado({}): Promise<string[]>
}
