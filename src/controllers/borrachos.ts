import { Request, Response } from 'express'
import { IBorrachoModel } from '../interfaces/borracho.js'
import { validatePartialUsuario } from '../schemas/usuario.js'
import { TipoUsuario } from '../types/usuario.js'

export class BorrachoController {
  borrachoModel: IBorrachoModel
  constructor(borrachoModel: IBorrachoModel) {
    this.borrachoModel = borrachoModel
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
    const { id } = req.params

    const result = validatePartialUsuario({ id })

    if (result.error) {
      res.status(400).send({ error: 'El id no es valido' })
    }

    // Es borracho?
    try {
      const posibleBorracho = await this.borrachoModel.get({ id })
      if ((await posibleBorracho).type !== TipoUsuario.BORRACHO) {
        res.status(403).send({ error: 'El usuario no es borracho' })
      }
    } catch (e) {
      res.status(500).send({ error: 'Ocurrio un error en el servidor' })
    }

    try {
      await this.borrachoModel.pagarCuota(id)
    } catch (e) {
      console.log((e as Error).message)
      res.status(500).send({ error: 'Ocurrio un error en el servidor' })
    }
  }
}
