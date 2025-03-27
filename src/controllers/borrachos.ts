import { Request, Response } from 'express'
import { IBorrachoModel } from '../interfaces/borracho.js'
import { validatePartialUsuario } from '../schemas/usuario.js'
import { TipoUsuario } from '../types/usuario.js'
import { IPartidoModel } from '../interfaces/partido.js'

export class BorrachoController {
  borrachoModel: IBorrachoModel
  partidoModel: IPartidoModel
  constructor(borrachoModel: IBorrachoModel, partidoModel: IPartidoModel) {
    this.borrachoModel = borrachoModel
    this.partidoModel = partidoModel
  }

  get = async (req: Request, res: Response) => {
    const { id } = req.params

    try {
      const borracho = await this.borrachoModel.getBorracho({ id })
      res.send({ borracho })
    } catch (e) {
      res.status(500).send('Ocurrio un error en el servidor')
    }
  }

  getAll = async (req: Request, res: Response) => {
    // TODO Validations here
    try {
      const borrachos = await this.borrachoModel.getAll()
      res.send({ borrachos })
    } catch (err) {
      console.log((err as Error).message)
      res.status(500).send({ error: 'Ocurrio un error en el servidor' })
    }
  }

  pagarCuota = async (req: Request, res: Response) => {
    const { id } = req.body

    const result = validatePartialUsuario({ id })
    if (result.error) {
      res.status(400).send({ error: 'El id no es valido' })
      return
    }

    let posibleBorracho
    // Es borracho?
    try {
      posibleBorracho = await this.borrachoModel.get({ id })
      if (posibleBorracho.type !== TipoUsuario.BORRACHO) {
        res.status(403).send({ error: 'El usuario no es borracho' })
        return
      }
    } catch (e) {
      console.log(e)
      res.status(500).send({ error: 'Ocurrio un error en el servidor' })
    }

    try {
      await this.borrachoModel.pagarCuota({ id })
      res.send({ message: 'Se ha pagado la cuota correctamente' })
    } catch (e) {
      if ((e as Error).message === 'El usuario ya pago la cuota') {
        res.status(400).send({ error: (e as Error).message })
      } else {
        res.status(500).send({ error: 'Ocurrio un error en el servidor' })
      }
    }
  }
  anotarsePartido = async (req: Request, res: Response): Promise<void> => {
    const { borrachoId, partidoId } = req.body

    const result = validatePartialUsuario({ id: borrachoId })
    if (result.error) {
      res.status(400).send({ error: 'El id no es valido' })
      return
    }

    // Es borracho?
    let posibleBorracho
    try {
      posibleBorracho = await this.borrachoModel.get({ id: borrachoId })
      if (posibleBorracho.type !== TipoUsuario.BORRACHO) {
        res.status(403).send({ error: 'El usuario no es borracho' })
        return
      }
    } catch (e) {
      console.log(e)
      res.status(500).send({ error: 'Ocurrio un error en el servidor' })
      return
    }

    // Hay capcidadad?
    try {
      const tieneCapacidad = await this.partidoModel.tieneCapacidad({
        id: partidoId,
      })
      if (!tieneCapacidad) {
        res.status(400).send({ error: 'La cancha no tiene mas capacidad' })
        return
      }
    } catch (e) {
      res.status(400).send({ error: 'No hay mas capacidad en la cancha' })
      return
    }

    try {
      const partidosAnotado = await this.borrachoModel.anotarsePartido({
        borrachoId,
        partidoId,
      })
      res.send({ partidosAnotado })
    } catch (e) {
      if (
        (e as Error).message === 'El borracho ya está anotado a este partido'
      ) {
        res.status(400).send({ error: (e as Error).message })
      } else {
        res.status(500).send({ error: 'Ocurrio un error en el servidor' })
      }
    }
  }

  getPartidosAnotado = async (req: Request, res: Response) => {
    const { id } = req.params

    try {
      const partidosAnotado = await this.borrachoModel.getPartidosAnotado({
        id,
      })
      res.send({ partidosAnotado })
    } catch (e) {
      res.status(500).send({ error: (e as Error).message })
    }
  }
}
