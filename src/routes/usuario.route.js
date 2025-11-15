import express from 'express';
import { loginUsuario, tokenUsuario, registrarUsuario } from '@controllers/usuario.controller.js'; 
const router = express.Router();

router.post('/login', loginUsuario);
router.get('/token', tokenUsuario);
router.post('/registro', registrarUsuario);


export default router;