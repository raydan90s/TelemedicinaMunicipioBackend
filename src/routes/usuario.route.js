import { Router } from 'express';
import { loginUsuario, tokenUsuario, registrarUsuario } from '@controllers/usuario.controller.js'; 
import { authMiddleware } from '@middlewares/auth.middleware.js'
const router = Router();

router.post('/login', loginUsuario);
router.post('/registro', registrarUsuario);
router.get('/token', authMiddleware, tokenUsuario);


export default router;