import { verifyToken } from '@utils/jwt.util.js';
import Usuario from '@models/usuario.model.js';

export const authMiddleware = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader) {
      return res.status(401).json({ success: false, message: 'Token no proporcionado' });
    }

    const token = authHeader.split(' ')[1];
    const data = verifyToken(token);

    // Verificar que el usuario existe en la BD
    const usuario = await Usuario.findByEmailOrCedula(data.email);
    if (!usuario || usuario.estado_id !== 1) { // Asumiendo estado_id = 1 para activo
      return res.status(401).json({ success: false, message: 'Usuario inválido o inactivo' });
    }

    // Adjuntar usuario y roles a req para uso en controladores
    req.user = {
      id: usuario.id,
      email: usuario.email,
      primer_nombre: usuario.primer_nombre,
      primer_apellido: usuario.primer_apellido,
      roles: data.roles, 
    };

    next();
  } catch (error) {
    console.error('Error en authMiddleware:', error);
    res.status(401).json({ success: false, message: 'Token inválido o expirado' });
  }
};