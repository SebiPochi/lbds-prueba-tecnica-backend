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
  app.use(cors())

  app.use((req: Request, res: Response, next: NextFunction) => {
    const token = req.cookies['access-token']
    let data = null

    req.session = { user: null }
    try {
      data = jwt.verify(token, process.env.SECRET_JWT_KEY!)
      req.session.user = data
    } catch (error) {
      console.log('Error middleware session')
    }
    next()
  })

  app.use(createPartidoRouter(partidoModel))
  app.use(createAuthRouter(authModel))
  app.use(createBorrachoRouter(borrachoModel))

  app.listen(PORT, () => {
    console.log(`Running on port: ${PORT}`)
  })
}
