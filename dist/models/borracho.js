var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { createClient } from '@libsql/client';
export const turso = createClient({
    url: process.env.TURSO_DATABASE_URL,
    authToken: process.env.TURSO_AUTH_TOKEN,
});
export class BorrachoModel {
    getAll() {
        return __awaiter(this, void 0, void 0, function* () {
            const borrachos = (yield turso.execute('SELECT usuarios.id, usuarios.nombre, usuarios.apellido, usuarios.email, usuarios.password, usuarios.type, borrachosPartidos.partidosAnotado FROM usuarios JOIN borrachosPartidos  ON usuarios.id = borrachosPartidos.user_id WHERE usuarios.type=0')).rows;
            return borrachos;
        });
    }
    get(_a) {
        return __awaiter(this, arguments, void 0, function* ({ id }) {
            const usuario = (yield turso.execute({
                sql: 'SELECT * FROM usuarios WHERE id = ?',
                args: [id],
            })).rows[0];
            return usuario;
        });
    }
    pagarCuota(_a) {
        return __awaiter(this, arguments, void 0, function* ({ id }) {
            const pagado = (yield turso.execute({
                sql: 'UPDATE borrachosCuota SET estaPago = 1 WHERE user_id = ?',
                args: [id],
            })).toJSON();
            console.log(pagado);
            return true;
        });
    }
    anotarsePartido({}) {
        throw new Error('Method not implemented.');
    }
}
