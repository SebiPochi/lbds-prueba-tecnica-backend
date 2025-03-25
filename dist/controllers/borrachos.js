var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { validatePartialUsuario } from '../schemas/usuario.js';
import { TipoUsuario } from '../types/usuario.js';
export class BorrachoController {
    constructor(borrachoModel) {
        this.getAll = (req, res) => __awaiter(this, void 0, void 0, function* () {
            // TODO Validations here
            try {
                const partidos = yield this.borrachoModel.getAll();
                res.send({ partidos });
            }
            catch (err) {
                console.log(err.message);
                res.status(500).send({ error: 'Ocurrio un error en el servidor' });
            }
        });
        this.pagarCuota = (req, res) => __awaiter(this, void 0, void 0, function* () {
            const { id } = req.params;
            const result = validatePartialUsuario({ id });
            if (result.error) {
                res.status(400).send({ error: 'El id no es valido' });
            }
            // Es borracho?
            try {
                const posibleBorracho = yield this.borrachoModel.get({ id });
                if ((yield posibleBorracho).type !== TipoUsuario.BORRACHO) {
                    res.status(403).send({ error: 'El usuario no es borracho' });
                }
            }
            catch (e) {
                res.status(500).send({ error: 'Ocurrio un error en el servidor' });
            }
            try {
                yield this.borrachoModel.pagarCuota(id);
            }
            catch (e) {
                console.log(e.message);
                res.status(500).send({ error: 'Ocurrio un error en el servidor' });
            }
        });
        this.borrachoModel = borrachoModel;
    }
}
