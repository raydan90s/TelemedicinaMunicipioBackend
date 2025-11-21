import { Router } from 'express';
import { authMiddleware } from '@middlewares/auth.middleware.js';
import { adminMiddleware } from '@middlewares/admin.middleware.js';
import {
  listarRoles,
  obtenerRol,
  crearRol,
  actualizarRol,
  eliminarRol
} from '@controllers/roles.controller.js';

const router = Router();

router.get('/', listarRoles);
router.get('/:id', obtenerRol);

router.post('/', authMiddleware, adminMiddleware, crearRol);
router.put('/:id', authMiddleware, adminMiddleware, actualizarRol);
router.delete('/:id', authMiddleware, adminMiddleware, eliminarRol);

export default router;
