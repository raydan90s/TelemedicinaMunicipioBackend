import express from 'express';
import { 
  obtenerCitasDelDia, 
  obtenerCitaPorId,
  marcarCitaAtendida,
  obtenerCitasPorFecha,
  obtenerCitasFuturas,
  cambiarEstadoCita
} from '@controllers/cita.controller.js';

const router = express.Router();

// ============================================
// RUTAS DE CITAS
// ============================================

/**
 * GET /citas/medico/:medicoId/hoy
 * Obtener todas las citas del día actual para un médico
 * 
 * Params:
 *   - medicoId: ID del médico (usuario_id en tabla medicos)
 * 
 * Response:
 *   {
 *     success: true,
 *     data: [...citas],
 *     count: 5
 *   }
 */
router.get('/medico/:medicoId/hoy', obtenerCitasDelDia);

/**
 * GET /citas/medico/:medicoId/futuras
 * Obtener todas las citas futuras de un médico
 * 
 * Params:
 *   - medicoId: ID del médico
 * 
 * Response:
 *   {
 *     success: true,
 *     data: [...citas],
 *     count: 10
 *   }
 */
router.get('/medico/:medicoId/futuras', obtenerCitasFuturas);

/**
 * GET /citas/medico/:medicoId/fecha/:fecha
 * Obtener citas de una fecha específica
 * 
 * Params:
 *   - medicoId: ID del médico
 *   - fecha: Fecha en formato YYYY-MM-DD (ejemplo: 2025-11-20)
 * 
 * Response:
 *   {
 *     success: true,
 *     data: [...citas],
 *     count: 3,
 *     fecha: "2025-11-20"
 *   }
 */
router.get('/medico/:medicoId/fecha/:fecha', obtenerCitasPorFecha);

/**
 * GET /citas/:citaId
 * Obtener detalles de una cita específica
 * 
 * Params:
 *   - citaId: ID de la cita
 * 
 * Response:
 *   {
 *     success: true,
 *     data: { ...cita }
 *   }
 */
router.get('/:citaId', obtenerCitaPorId);

/**
 * PATCH /citas/:citaId/atender
 * Marcar una cita como completada/atendida
 * 
 * Params:
 *   - citaId: ID de la cita
 * 
 * Response:
 *   {
 *     success: true,
 *     message: "Cita marcada como completada exitosamente",
 *     data: { ...cita actualizada }
 *   }
 */
router.patch('/:citaId/atender', marcarCitaAtendida);

/**
 * PATCH /citas/:citaId/estado
 * Cambiar el estado de una cita (genérico)
 * 
 * Params:
 *   - citaId: ID de la cita
 * 
 * Body:
 *   {
 *     nombreEstado: "Programada" | "Completada"
 *   }
 * 
 * Response:
 *   {
 *     success: true,
 *     message: "Estado de la cita actualizado a 'Completada'",
 *     data: { ...cita actualizada }
 *   }
 */
router.patch('/:citaId/estado', cambiarEstadoCita);

export default router;