export type Usuario = {
  id?: string
  nombre?: string
  apellido?: string
  email?: string
  password?: string
  type?: TipoUsuario
}

export enum TipoUsuario {
  BORRACHO,
  ORGANIZACION,
}
