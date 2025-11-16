import express from 'express';
import { 
  obtenerHistoriaClinica,
  obtenerPaciente 
} from '@controllers/paciente.controller.js';

const router = express.Router();

// ============================================
// RUTAS DE PACIENTES
// ============================================

/**
 * GET /pacientes/:pacienteId/historia
 * Obtener la historia clínica completa de un paciente
 * 
 * Incluye:
 *   - Datos personales
 *   - Enfermedades (crónicas, hereditarias, etc.)
 *   - Historial de consultas previas
 *   - Documentos médicos adjuntos
 * 
 * Params:
 *   - pacienteId: ID del paciente (usuario_id en tabla pacientes)
 * 
 * Response:
 *   {
 *     success: true,
 *     data: {
 *       id, cedula, nombre, apellido, ...datos_personales,
 *       enfermedades: [...],
 *       consultas_previas: [...],
 *       documentos: [...]
 *     }
 *   }
 */
router.get('/:pacienteId/historia', obtenerHistoriaClinica);

/**
 * GET /pacientes/:pacienteId
 * Obtener información básica de un paciente
 * 
 * Solo retorna datos personales sin historial médico completo
 * 
 * Params:
 *   - pacienteId: ID del paciente
 * 
 * Response:
 *   {
 *     success: true,
 *     data: {
 *       id, cedula, nombre, apellido, email, celular, ...
 *     }
 *   }
 */
router.get('/:pacienteId', obtenerPaciente);

export default router;