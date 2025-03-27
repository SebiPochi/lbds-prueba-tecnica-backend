import { Request, Response } from 'express'
import { IBorrachoModel } from '../interfaces/borracho.js'
import { validatePartialUsuario } from '../schemas/usuario.js'
import { TipoUsuario } from '../types/usuario.js'

export class BorrachoController {
  borrachoModel: IBorrachoModel
  constructor(borrachoModel: IBorrachoModel) {
    this.borrachoModel = borrachoModel
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
      return res.status(400).send({ error: 'El id no es valido' })
    }

    let posibleBorracho
    // Es borracho?
    try {
      posibleBorracho = await this.borrachoModel.get({ id })
      if (posibleBorracho.type !== TipoUsuario.BORRACHO) {
        return res.status(403).send({ error: 'El usuario no es borracho' })
      }
    } catch (e) {
      console.log(e)
      return res.status(500).send({ error: 'Ocurrio un error en el servidor' })
    }

    try {
      await this.borrachoModel.pagarCuota({ id })
      res.send({ message: 'Se ha pagado la cuota correctamente' })
    } catch (e) {
      if ((e as Error).message === 'El usuario ya pago la cuota') {
        return res.status(400).send({ error: (e as Error).message })
      }
      res.status(500).send({ error: 'Ocurrio un error en el servidor' })
    }
  }
  anotarsePartido = async (req: Request, res: Response) => {
    const { borrachoId, partidoId } = req.body

    const result = validatePartialUsuario({ id: borrachoId })
    if (result.error) {
      return res.status(400).send({ error: 'El id no es valido' })
    }

    // Es borracho?
    let posibleBorracho
    try {
      console.log(borrachoId, partidoId)
      posibleBorracho = await this.borrachoModel.get({ id: borrachoId })
      if (posibleBorracho.type !== TipoUsuario.BORRACHO) {
        return res.status(403).send({ error: 'El usuario no es borracho' })
      }
    } catch (e) {
      console.log(e)
      return res.status(500).send({ error: 'Ocurrio un error en el servidor' })
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
        return res.status(400).send({ error: (e as Error).message })
      }
    }
  }

  getPartidosAnotado = async (req: Request, res: Response) => {
    const { id } = req.params

    console.log(id)

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
