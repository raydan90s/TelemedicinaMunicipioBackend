import { Router } from 'express';
import { authMiddleware } from '@middlewares/auth.middleware.js';
import { adminMiddleware } from '@middlewares/admin.middleware.js';
import {
  getEnfermedades,
  getEnfermedad,
  createEnfermedad,
  updateEnfermedad,
  deleteEnfermedad
} from '@controllers/enfermedad.controller.js';

const router = Router();

router.get('/', getEnfermedades);
router.get('/:id', getEnfermedad);

router.post('/', authMiddleware, adminMiddleware, createEnfermedad);
router.put('/:id', authMiddleware, adminMiddleware, updateEnfermedad);
router.delete('/:id', authMiddleware, adminMiddleware, deleteEnfermedad);

export default router;