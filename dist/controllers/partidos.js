var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { validatePartido } from '../schemas/partido.js';
import { TipoUsuario } from '../types/usuario.js';
export class PartidoController {
    constructor(partidoModel) {
        this.getAll = (req, res) => __awaiter(this, void 0, void 0, function* () {
            // TODO Validations here
            try {
                const partidos = yield this.partidoModel.getAll();
                res.send({ partidos });
            }
            catch (err) {
                res.status(500).send({ error: err.message });
            }
        });
        this.get = (req, res) => __awaiter(this, void 0, void 0, function* () {
            const { id } = req.params;
        });
        this.create = (req, res) => __awaiter(this, void 0, void 0, function* () {
            var _a;
            if (((_a = req.session) === null || _a === void 0 ? void 0 : _a.user.type) == TipoUsuario.BORRACHO) {
                res.status(403).send({ error: 'No autorizado a esta pagina' });
            }
            const input = req.body;
            const result = validatePartido(input);
            if (result.error) {
                res.status(400).send({ error: result.error.message });
            }
            try {
                const id = yield this.partidoModel.create({ input });
                res.status(201).send({ id });
            }
            catch (e) {
                res.status(500).send({ error: 'ocurrio un error en el servidor' });
            }
        });
        this.update = (req, res) => __awaiter(this, void 0, void 0, function* () {
            var _a;
            if (((_a = req.session) === null || _a === void 0 ? void 0 : _a.user.type) == TipoUsuario.BORRACHO) {
                res.status(403).send({ error: 'No autorizado a esta pagina' });
            }
            const { id } = req.params;
            const input = req.body;
            const result = validatePartido(input);
            if (result.error) {
                res.status(400).send({ error: result.error.message });
            }
            try {
                const partidoUpdated = yield this.partidoModel.update({ id, input });
                res.send(Object.assign({}, partidoUpdated));
            }
            catch (e) {
                res.status(400).send({ error: e.message });
            }
        });
        this.delete = (req, res) => __awaiter(this, void 0, void 0, function* () {
            var _a;
            if (((_a = req.session) === null || _a === void 0 ? void 0 : _a.user.type) == TipoUsuario.BORRACHO) {
                res.status(403).send({ error: 'No autorizado a esta pagina' });
            }
            const id = Number(req.params.id);
            try {
                const isDeleted = yield this.partidoModel.delete(id);
                if (isDeleted) {
                    res
                        .status(202)
                        .send({ message: 'El partido fue correctamente eliminado' });
                }
            }
            catch (err) {
                res.status(400).send(err.message);
            }
        });
        this.partidoModel = partidoModel;
    }
}
