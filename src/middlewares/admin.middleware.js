import { verifyToken } from '@utils/jwt.util.js';
import Usuario from '@models/usuario.model.js';

export const adminMiddleware = async (req, res, next) => {
  try {
    // Verificar auth
    if (!req.user) {
      return res.status(500).json({ success: false, message: 'AuthMiddleware no ejecutado' });
    }

    // Verifica si el usuario tiene rol ADMIN
    if (!req.user.roles || !req.user.roles['Administrador']) {
      return res.status(403).json({ success: false, message: 'Acceso denegado: Se requiere rol de administrador' });
    }

    next();
  } catch (error) {
    console.error('Error en adminMiddleware:', error);
    res.status(401).json({ success: false, message: 'Token inválido o expirado' });
  }
};