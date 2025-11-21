import { Router } from 'express';
import { getPerfil, updatePerfil } from '@controllers/paciente.controller.js'
import { authMiddleware } from '@middlewares/auth.middleware.js';
import { adminMiddleware } from '@middlewares/admin.middleware.js';

const router = Router();

router.get('/perfil', authMiddleware, getPerfil);
router.put('/perfil', authMiddleware, updatePerfil);

export default router;