import { Router } from 'express'
import { IBorrachoModel } from '../interfaces/borracho.js'
import { BorrachoController } from '../controllers/borrachos.js'
import { IPartidoModel } from '../interfaces/partido.js'

export const createBorrachoRouter = (
  borrachoModel: IBorrachoModel,
  partidoModel: IPartidoModel,
): Router => {
  const borrachosRouter = Router()
  const borrachoController = new BorrachoController(borrachoModel, partidoModel)

  borrachosRouter.get('/borrachos', borrachoController.getAll)
  borrachosRouter.get(
    '/borrachos/:id/partidos',
    borrachoController.getPartidosAnotado,
  )
  borrachosRouter.get('/borrachos/:id', borrachoController.get)
  borrachosRouter.post('/borrachos/pagar', borrachoController.pagarCuota)
  borrachosRouter.post(
    '/borrachos/anotarse',
    borrachoController.anotarsePartido,
  )

  return borrachosRouter
}
