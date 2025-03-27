import express, { NextFunction, Request, Response } from 'express'
import { PORT } from './config.js'
import { createPartidoRouter } from './routes/partidos.js'
import { IPartidoModel } from './interfaces/partido.js'
import { IAuthModel } from './interfaces/auth.js'
import { createAuthRouter } from './routes/auth.js'
import jwt from 'jsonwebtoken'
import cookieParser from 'cookie-parser'
import { IBorrachoModel } from './interfaces/borracho.js'
import { createBorrachoRouter } from './routes/borrachos.js'
import cors from 'cors'

export const createApp = (
  partidoModel: IPartidoModel,
  authModel: IAuthModel,
  borrachoModel: IBorrachoModel,
): void => {
  const app = express()
  app.use(express.json())
  app.use(cookieParser())
  app.use(
    cors({
      origin: 'http://localhost:5173', // El frontend
      methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'], // Métodos permitidos
      credentials: true, // Permitir el uso de cookies y credenciales
    }),
  )

  app.use((req: Request, res: Response, next: NextFunction) => {
    let token = req.cookies['access-token']
    const authHeader = req.headers['authorization']
    let data = null
    req.session = { user: null }

    if (req.path === '/login' || req.path === '/register') {
      return next()
    }

    if (!token) {
      if (authHeader != null) {
        token = authHeader.split(' ')[1] // Desestructuración para obtener el segundo valor (token)
      }
      if (!token) {
        res
          .status(401)
          .send({ error: 'El token de inicio de sesión expiró o es nulo' })
      }
    }

    try {
      data = jwt.verify(token, process.env.SECRET_JWT_KEY!)
      req.session.user = data
      next()
    } catch (error) {
      if ((error as Error).message === 'jwt expired') {
        res.status(403).send({ error: 'Debe iniciar sesión nuevamente' })
      } else {
        res.status(401).json({ error: 'Token inválido' })
      }
    }
  })

  app.use(createPartidoRouter(partidoModel))
  app.use(createAuthRouter(authModel))
  app.use(createBorrachoRouter(borrachoModel))

  app.listen(PORT, () => {
    console.log(`Running on port: ${PORT}`)
  })
}
