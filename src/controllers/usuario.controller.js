import Usuario from '@models/usuario.model.js';
import { generateToken, verifyToken } from '@utils/jwt.util.js';

export const loginUsuario = async (req, res) => {
  try {
    const { identifier, password } = req.body; 
    const user = await Usuario.validateLogin(identifier, password);

    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Credenciales incorrectas o usuario inactivo',
      });
    }

    const token = generateToken({
      id: user.id,
      email: user.email,
      roles: user.roles,
    });

    res.json({
      success: true,
      usuario: {
        id: user.id,
        email: user.email,
        cedula: user.cedula,
        primer_nombre: user.primer_nombre,
        primer_apellido: user.primer_apellido,
        verificado: user.verificado,
      },
      roles: user.roles,
      token,
    });
  } catch (error) {
    console.error('Error en loginUsuario:', error);
    res.status(500).json({ success: false, message: 'Error interno del servidor' });
  }
};

export const tokenUsuario = async (req, res) => {
  const authHeader = req.headers.authorization;
  if (!authHeader) return res.status(401).json({ message: 'Token no proporcionado' });

  const token = authHeader.split(' ')[1];

  try {
    const data = verifyToken(token);
    const usuario = await Usuario.findByEmailOrCedula(data.email);

    if (!usuario) {
      return res.status(401).json({ message: 'Usuario inválido o inactivo' });
    }

    res.json({
      usuario: {
        id: usuario.id,
        email: usuario.email,
        primer_nombre: usuario.primer_nombre,
        primer_apellido: usuario.primer_apellido,
      },
      roles: data.roles,
    });
  } catch (err) {
    console.error('Error en tokenUsuario:', err);
    res.status(401).json({ message: 'Token inválido o expirado' });
  }
};

// REGISTRO SIMPLIFICADO - Solo datos esenciales
export const registrarUsuario = async (req, res) => {
  console.log('📝 DATOS RECIBIDOS EN REGISTRO:', req.body);
  console.log('🔍 VALIDANDO SOLO CAMPOS BÁSICOS...');
  try {
    const {
      cedula,
      email,
      password,
      primer_nombre,
      segundo_nombre,
      primer_apellido,
      segundo_apellido,
      genero_id,
      numero_celular,
      tipo_usuario // 'paciente' o 'medico' (opcional, default: paciente)
    } = req.body;

    // ===== VALIDACIONES BÁSICAS (SOLO CAMPOS ESENCIALES) =====
    if (!cedula || !email || !password || !primer_nombre || !primer_apellido || !genero_id) {
      return res.status(400).json({
        success: false,
        message: 'Faltan campos requeridos: cedula, email, password, primer_nombre, primer_apellido, genero_id'
      });
    }

    // Validar formato de email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({
        success: false,
        message: 'Formato de email inválido'
      });
    }

    // Validar longitud de contraseña
    if (password.length < 8) {
      return res.status(400).json({
        success: false,
        message: 'La contraseña debe tener al menos 8 caracteres'
      });
    }

    // Por defecto todos se registran como pacientes
    const rol_id = tipo_usuario === 'medico' ? 1 : 2;

    // ===== CREAR USUARIO CON DATOS BÁSICOS =====
    const nuevoUsuario = await Usuario.create({
      cedula,
      email,
      password,
      primer_nombre,
      segundo_nombre,
      primer_apellido,
      segundo_apellido,
      genero_id,
      numero_celular,
      estado_id: 1, // Activo
      rol_id
    });

    // Generar token
    const token = generateToken({
      id: nuevoUsuario.id,
      email: nuevoUsuario.email,
      roles: { [rol_id === 2 ? 'Médico' : 'Paciente']: [] }
    });

    res.status(201).json({
      success: true,
      message: 'Usuario registrado exitosamente',
      usuario: {
        id: nuevoUsuario.id,
        email: nuevoUsuario.email,
        cedula: nuevoUsuario.cedula,
        primer_nombre: nuevoUsuario.primer_nombre,
        primer_apellido: nuevoUsuario.primer_apellido,
        verificado: nuevoUsuario.verificado,
      },
      token
    });
  } catch (error) {
    console.error('Error en registrarUsuario:', error);
    
    if (error.message === 'El usuario ya existe con ese email o cédula') {
      return res.status(409).json({
        success: false,
        message: error.message
      });
    }

    res.status(500).json({
      success: false,
      message: 'Error interno del servidor al registrar usuario'
    });
  }
};