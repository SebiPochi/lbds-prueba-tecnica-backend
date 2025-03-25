import { Router } from 'express'
import { IBorrachoModel } from '../interfaces/borracho.js'
import { BorrachoController } from '../controllers/borrachos.js'

export const createBorrachoRouter = (borrachoModel: IBorrachoModel): Router => {
  const borrachosRouter = Router()
  const borrachoController = new BorrachoController(borrachoModel)

  borrachosRouter.get('/borrachos', borrachoController.getAll)
  //borrachosRouter.post('/borrachos/pagar/:id', borrachoController.pagarCuota)

  return borrachosRouter
}
