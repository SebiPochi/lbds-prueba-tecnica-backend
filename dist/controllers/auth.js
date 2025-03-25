var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import jwt from 'jsonwebtoken';
import { validatePartialUsuario, validateUsuario } from '../schemas/usuario.js';
export class AuthController {
    constructor(authModel) {
        this.register = (req, res) => __awaiter(this, void 0, void 0, function* () {
            const input = req.body;
            // TODO validacion
            const result = validateUsuario(input);
            if (result.error) {
                res.status(400).send({ error: result.error.message });
            }
            try {
                const id = yield this.authModel.register({ input });
                res.send({ id });
            }
            catch (err) {
                console.log(`${err.name}: ${err.message}`);
                res.status(500).send('Ocurrio un error en el servidor'); // TODO Validacion
            }
        });
        this.login = (req, res) => __awaiter(this, void 0, void 0, function* () {
            const { email, password } = req.body;
            const result = validatePartialUsuario({ email, password });
            if (result.error) {
                res.status(400).send({ error: result.error.message });
            }
            try {
                const user = yield this.authModel.login({ email, password });
                const token = jwt.sign({ id: user.id, email: user.email, type: user.type }, process.env.SECRET_JWT_KEY, {
                    expiresIn: '1h',
                });
                res
                    .cookie('access-token', token, {
                    httpOnly: true,
                })
                    .send({ user });
            }
            catch (err) {
                console.log(err.message);
                res.status(500).send('Ocurrio un error en el servidor');
            }
        });
        this.authModel = authModel;
    }
}
