import { Request, Response } from 'express'
import { IAuthModel } from '../interfaces/auth.js'
import jwt from 'jsonwebtoken'
import { validatePartialUsuario, validateUsuario } from '../schemas/usuario.js'
export class AuthController {
  authModel: IAuthModel
  constructor(authModel: IAuthModel) {
    this.authModel = authModel
  }

  register = async (req: Request, res: Response) => {
    const input = req.body

    // TODO validacion
    const result = validateUsuario(input)

    if (result.error) {
      res.status(400).send({ error: result.error.message })
    }

    try {
      const id = await this.authModel.register({ input })
      res.send({ id })
    } catch (err) {
      console.log(`${(err as Error).name}: ${(err as Error).message}`)
      res.status(500).send('Ocurrio un error en el servidor') // TODO Validacion
    }
  }

  login = async (req: Request, res: Response) => {
    const { email, password } = req.body

    const result = validatePartialUsuario({ email, password })

    if (result.error) {
      res.status(400).send({ error: result.error.message })
    }

    try {
      const user = await this.authModel.login({ email, password })
      const token = jwt.sign(
        { id: user.id, email: user.email, type: user.type },
        process.env.SECRET_JWT_KEY!,
        {
          expiresIn: '1h',
        },
      )
      res
        .cookie('access-token', token, {
          httpOnly: true,
        })
        .send({ user })
    } catch (err) {
      console.log((err as Error).message)
      res.status(500).send('Ocurrio un error en el servidor')
    }
  }
}
