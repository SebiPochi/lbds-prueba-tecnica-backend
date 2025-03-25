import { Router } from "express";
import { PartidoController } from "../controllers/partidos.js";
export const createPartidoRouter = (partidoModel) => {
    const partidosRouter = Router();
    const partidoController = new PartidoController(partidoModel);
    partidosRouter.get('/partidos', partidoController.getAll);
    partidosRouter.post('/partidos', partidoController.create);
    partidosRouter.patch('/partidos/:id', partidoController.update);
    partidosRouter.delete('/partidos/:id', partidoController.delete);
    return partidosRouter;
};
