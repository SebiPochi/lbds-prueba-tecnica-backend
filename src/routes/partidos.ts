import { Router } from "express";
import { PartidoController } from "../controllers/partidos.js";
import { IPartidoModel } from "../interfaces/partido.js";

export const createPartidoRouter = (partidoModel: IPartidoModel): Router => {
  const partidosRouter = Router()
  const partidoController = new PartidoController(partidoModel)

  partidosRouter.get('/partidos', partidoController.getAll)
  partidosRouter.post('/partidos', partidoController.create)
  partidosRouter.patch('/partidos/:id', partidoController.update)
  partidosRouter.delete('/partidos/:id', partidoController.delete)

  return partidosRouter
}