import { Request, Response } from 'express'
import { IPartidoModel } from '../interfaces/partido.js'
import { validatePartido } from '../schemas/partido.js'
import { TipoUsuario } from '../types/usuario.js'

export class PartidoController {
  partidoModel: IPartidoModel
  constructor(partidoModel: IPartidoModel) {
    this.partidoModel = partidoModel
  }

  getAll = async (req: Request, res: Response) => {
    // TODO Validations here
    try {
      const partidos = await this.partidoModel.getAll()
      res.send({ partidos })
    } catch (err: unknown) {
      res.status(500).send({ error: (err as Error).message })
    }
  }

  get = async (req: Request, res: Response) => {
    const { id } = req.params
  }

  create = async (req: Request, res: Response) => {
    if (req.session?.user.type == TipoUsuario.BORRACHO) {
      res.status(403).send({ error: 'No autorizado a esta pagina' })
    }

    const input = req.body

    const result = validatePartido(input)

    if (result.error) {
      res.status(400).send({ error: result.error.message })
    }

    try {
      const id = await this.partidoModel.create({ input })
      res.status(201).send({ id })
    } catch (e) {
      res.status(500).send({ error: 'ocurrio un error en el servidor' })
    }
  }
  update = async (req: Request, res: Response) => {
    if (req.session?.user.type == TipoUsuario.BORRACHO) {
      res.status(403).send({ error: 'No autorizado a esta pagina' })
    }

    const { id } = req.params
    const input = req.body

    const result = validatePartido(input)

    if (result.error) {
      res.status(400).send({ error: result.error.message })
    }

    try {
      const partidoUpdated = await this.partidoModel.update({ id, input })
      res.send({ ...partidoUpdated })
    } catch (e) {
      res.status(400).send({ error: (e as Error).message })
    }
  }
  delete = async (req: Request, res: Response) => {
    if (req.session?.user.type == TipoUsuario.BORRACHO) {
      res.status(403).send({ error: 'No autorizado a esta pagina' })
    }

    const id = Number(req.params.id)

    try {
      const isDeleted = await this.partidoModel.delete(id)
      if (isDeleted) {
        res
          .status(202)
          .send({ message: 'El partido fue correctamente eliminado' })
      }
    } catch (err) {
      res.status(400).send((err as Error).message)
    }
  }
}
