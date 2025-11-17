// src/routes/medico.route.js
import express from 'express';
import { 
  obtenerMedico,
  obtenerEstadisticasMedico,
  actualizarHorarios,
  crearExcepcionHorario,
  cambiarPassword,
  cerrarSesion
} from '@controllers/medico.controller.js';

const router = express.Router();

// ============================================
// RUTAS DE MÉDICOS
// ============================================

/**
 * GET /medicos/:medicoId
 * Obtener información completa del médico
 * 
 * Incluye:
 *   - Datos personales
 *   - Especialidades
 *   - Horarios de atención
 *   - Licencia médica
 * 
 * Params:
 *   - medicoId: ID del médico (usuario_id)
 * 
 * Response:
 *   {
 *     success: true,
 *     data: {
 *       id, cedula, email, primer_nombre, segundo_nombre,
 *       primer_apellido, segundo_apellido, genero,
 *       licencia_medica, pasaporte, especialidad_principal,
 *       especialidades: [...],
 *       horarios: [...]
 *     }
 *   }
 */
router.get('/:medicoId', obtenerMedico);

/**
 * GET /medicos/:medicoId/estadisticas
 * Obtener estadísticas del médico
 * 
 * Params:
 *   - medicoId: ID del médico
 * 
 * Response:
 *   {
 *     success: true,
 *     data: {
 *       consultas_atendidas: 35,
 *       consultas_futuras: 12,
 *       consultas_hoy: 5
 *     }
 *   }
 */
router.get('/:medicoId/estadisticas', obtenerEstadisticasMedico);

/**
 * PATCH /medicos/:medicoId/horarios
 * Actualizar horarios de atención
 * 
 * Params:
 *   - medicoId: ID del médico
 * 
 * Body:
 *   {
 *     horarios: [
 *       { dia_id: 1, hora_inicio: "09:00", hora_fin: "13:00" },
 *       { dia_id: 1, hora_inicio: "14:00", hora_fin: "16:00" },
 *       { dia_id: 2, hora_inicio: "10:00", hora_fin: "12:00" }
 *     ]
 *   }
 * 
 * Response:
 *   {
 *     success: true,
 *     message: "Horarios actualizados exitosamente"
 *   }
 */
router.patch('/:medicoId/horarios', actualizarHorarios);

/**
 * POST /medicos/:medicoId/excepcion-horario
 * Crear excepción de horario (día no disponible)
 * 
 * Params:
 *   - medicoId: ID del médico
 * 
 * Body:
 *   {
 *     fecha: "2025-12-25",
 *     motivo: "Vacaciones"
 *   }
 * 
 * Response:
 *   {
 *     success: true,
 *     message: "Excepción de horario creada exitosamente",
 *     data: { id, medico_id, fecha, motivo }
 *   }
 */
router.post('/:medicoId/excepcion-horario', crearExcepcionHorario);

/**
 * PATCH /medicos/:medicoId/cambiar-password
 * Cambiar contraseña del médico
 * 
 * Params:
 *   - medicoId: ID del médico
 * 
 * Body:
 *   {
 *     passwordActual: "password123",
 *     passwordNueva: "newPassword456"
 *   }
 * 
 * Response:
 *   {
 *     success: true,
 *     message: "Contraseña actualizada exitosamente"
 *   }
 */
router.patch('/:medicoId/cambiar-password', cambiarPassword);

/**
 * POST /medicos/:medicoId/logout
 * Cerrar sesión del médico
 * 
 * Params:
 *   - medicoId: ID del médico
 * 
 * Response:
 *   {
 *     success: true,
 *     message: "Sesión cerrada exitosamente"
 *   }
 */
router.post('/:medicoId/logout', cerrarSesion);

export default router;