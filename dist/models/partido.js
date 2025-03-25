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
export class PartidoModel {
    getAll() {
        return __awaiter(this, void 0, void 0, function* () {
            const partidos = (yield turso.execute('SELECT * FROM partidos'))
                .rows;
            return partidos;
        });
    }
    create(_a) {
        return __awaiter(this, arguments, void 0, function* ({ input }) {
            const { fecha, rival, cancha, capacidad } = input;
            // TODO No puede tener una fecha igual o muy cercana a otra
            try {
                const id = (yield turso.execute({
                    sql: 'INSERT INTO partidos (fecha, rival, cancha, capacidad) VALUES (:fecha, :rival, :cancha, :capacidad)',
                    args: { fecha, rival, cancha, capacidad },
                })).toJSON().lastInsertRowid;
                return id;
            }
            catch (e) {
                console.log(e.message);
                throw new Error('Error en el servidor al crear el partido');
            }
        });
    }
    update(_a) {
        return __awaiter(this, arguments, void 0, function* ({ id, input }) {
            let query = 'UPDATE partidos SET';
            let params = [];
            if (input.fecha) {
                query += ' fecha = ?,';
                params.push(input.fecha);
            }
            if (input.rival) {
                query += ' rival = ?,';
                params.push(input.rival);
            }
            if (input.cancha) {
                query += ' cancha = ?,';
                params.push(input.cancha);
            }
            if (input.capacidad) {
                query += ' capacidad = ?,';
                params.push(input.capacidad);
            }
            query = query.slice(0, -1);
            query += ' WHERE id = ?';
            params.push(id);
            try {
                yield turso.execute({
                    sql: query,
                    args: params,
                });
                const partidoUpdated = (yield turso.execute({
                    sql: 'SELECT * FROM partidos WHERE id = ?',
                    args: [id],
                })).rows[0];
                console.log(partidoUpdated);
                return partidoUpdated;
            }
            catch (err) {
                console.log(err.message);
                throw new Error('Error en servidor al actualizar partido');
            }
        });
    }
    delete(id) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const isDeleted = (yield turso.execute({
                    sql: 'DELETE FROM partidos WHERE id = ?',
                    args: [id],
                })).toJSON().rowsAffected;
                return isDeleted;
            }
            catch (err) {
                console.log(err.message);
                throw new Error('Error en el servidor al eliminar el partido');
            }
        });
    }
}
