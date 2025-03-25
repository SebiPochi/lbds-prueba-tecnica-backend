var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import crypto from 'node:crypto';
import bcrypt from 'bcrypt';
import { TipoUsuario } from '../types/usuario.js';
import { createClient } from '@libsql/client';
export const turso = createClient({
    url: process.env.TURSO_DATABASE_URL,
    authToken: process.env.TURSO_AUTH_TOKEN,
});
export class AuthModel {
    register(_a) {
        return __awaiter(this, arguments, void 0, function* ({ input }) {
            // TODO validacion con zod
            // TODO validar que no exista un usuario con ese email
            //if (user) throw new Error('username already exists')
            const uuid = crypto.randomUUID();
            const hashedPassword = yield bcrypt.hash(input.password, 10);
            const id = (yield turso.execute({
                sql: 'INSERT INTO usuarios (id, nombre, apellido, email, password, type) VALUES (?, ?, ?, ?, ?, ?)',
                args: [
                    uuid,
                    input.nombre,
                    input.apellido,
                    input.email,
                    hashedPassword,
                    TipoUsuario.BORRACHO,
                ],
            })).toJSON().lastInsertRowid;
            // creo la row en tabla partidosAnotados, si es un asco
            yield turso.execute({
                sql: 'INSERT INTO borrachosPartidos (user_id, partidosAnotado) VALUES (?, "[]")',
                args: [uuid],
            });
            // TODO devolver usuario no id
            /*
            const newUser = (
              await turso.execute({
                sql: 'SELECT * FROM usuarios WHERE id=?',
                args: [await id],
              })
            ).rows[0] as Usuario
            */
            return id;
        });
    }
    login(_a) {
        return __awaiter(this, arguments, void 0, function* ({ email, password }) {
            // TODO validacion con zod
            const user = (yield turso.execute({
                sql: 'SELECT * FROM usuarios WHERE email = ?',
                args: [email],
            })).rows[0];
            // Esto no deberia pasasr
            const validPassword = yield bcrypt.compare(password, user.password);
            if (!validPassword)
                throw new Error('La contraseña es incorrecta');
            return user;
        });
    }
}
