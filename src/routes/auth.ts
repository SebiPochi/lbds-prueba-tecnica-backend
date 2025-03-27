import { Request, Router } from 'express'
import { AuthController } from '../controllers/auth.js'
import { IAuthModel } from '../interfaces/auth.js'
import { TipoUsuario } from '../types/usuario.js'

export const createAuthRouter = (authModel: IAuthModel): Router => {
  const authRouter = Router()
  const authController = new AuthController(authModel)

  authRouter.post('/register', authController.register)
  authRouter.post('/login', authController.login)

  return authRouter
}
