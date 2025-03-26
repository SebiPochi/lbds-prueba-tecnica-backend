import { Usuario } from './usuario.js'

export type Borracho = Usuario & {
  partidosAnotado?: []
  pagoCuota: boolean
}
