import { Request } from 'express'

declare module 'express' {
  export interface Request {
    session?: { user: any } // Define las propiedades que necesitas
  }
}
