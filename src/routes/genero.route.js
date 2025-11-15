import { Router } from 'express';
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
router.post('/', crearGenero);
router.put('/:id', actualizarGenero);
router.delete('/:id', eliminarGenero);

export default router;