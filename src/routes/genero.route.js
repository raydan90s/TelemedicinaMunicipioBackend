import { Router } from 'express';
import { authMiddleware } from '@middlewares/auth.middleware.js';
import { adminMiddleware } from '@middlewares/admin.middleware.js';
import {
  listarGeneros,
  obtenerGenero,
  crearGenero,
  actualizarGenero,
  eliminarGenero
} from '@controllers/genero.controller.js';

const router = Router();

router.get('/', listarGeneros);
router.get('/:id', obtenerGenero);

router.post('/', authMiddleware, adminMiddleware, crearGenero);
router.put('/:id', authMiddleware, adminMiddleware, actualizarGenero);
router.delete('/:id', authMiddleware, adminMiddleware, eliminarGenero);

export default router;