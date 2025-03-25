import { Router } from 'express';
import { AuthController } from '../controllers/auth.js';
import { TipoUsuario } from '../types/usuario.js';
export const createAuthRouter = (authModel) => {
    const authRouter = Router();
    const authController = new AuthController(authModel);
    authRouter.get('/register', (req, res) => {
        var _a;
        if (((_a = req.session) === null || _a === void 0 ? void 0 : _a.user.type) == TipoUsuario.BORRACHO) {
            res.status(403).send({ error: 'Esta pagina ta prohibida' });
        }
        res.send('entro');
    });
    authRouter.post('/register', authController.register);
    authRouter.post('/login', authController.login);
    return authRouter;
};
