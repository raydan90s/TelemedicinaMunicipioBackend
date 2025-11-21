import { Router } from 'express';
import { authMiddleware } from '@middlewares/auth.middleware.js';
import { adminMiddleware } from '@middlewares/admin.middleware.js';
import {
  getTiposEnfermedad,
  getTipoEnfermedad,
  createTipoEnfermedad,
  updateTipoEnfermedad,
  deleteTipoEnfermedad
} from '@controllers/tipoEnfermedad.controller.js';

const router = Router();

router.get('/', getTiposEnfermedad);
router.get('/:id', getTipoEnfermedad);
router.post('/', authMiddleware, adminMiddleware, createTipoEnfermedad);
router.put('/:id', authMiddleware, adminMiddleware, updateTipoEnfermedad);
router.delete('/:id', authMiddleware, adminMiddleware, deleteTipoEnfermedad);

export default router;