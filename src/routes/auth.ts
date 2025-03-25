import { Request, Router } from 'express'
import { AuthController } from '../controllers/auth.js'
import { IAuthModel } from '../interfaces/auth.js'
import { TipoUsuario } from '../types/usuario.js'

export const createAuthRouter = (authModel: IAuthModel): Router => {
  const authRouter = Router()
  const authController = new AuthController(authModel)

  authRouter.get('/register', (req: Request, res) => {
    if (req.session?.user.type == TipoUsuario.BORRACHO) {
      res.status(403).send({ error: 'Esta pagina ta prohibida' })
    }

    res.send('entro')
  })
  authRouter.post('/register', authController.register)
  authRouter.post('/login', authController.login)

  return authRouter
}
