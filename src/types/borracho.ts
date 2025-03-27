import { Usuario } from './usuario.js'

export type Borracho = Usuario & {
  partidosAnotado?: []
  estaPago: boolean
}
