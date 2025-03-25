import { Usuario } from '../types/usuario.js'

export interface IAuthModel {
  login({}): Promise<Usuario>
  register({}): Promise<Usuario>
}
