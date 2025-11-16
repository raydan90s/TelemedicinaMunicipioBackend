import Cita from '@models/cita.model.js';

/**
 * Obtener citas del día actual para un médico
 * GET /citas/medico/:medicoId/hoy
 */
export const obtenerCitasDelDia = async (req, res) => {
  try {
    const { medicoId } = req.params;

    if (!medicoId) {
      return res.status(400).json({
        success: false,
        message: 'El ID del médico es requerido'
      });
    }

    const citas = await Cita.obtenerCitasDelDia(medicoId);

    res.json({
      success: true,
      data: citas,
      count: citas.length
    });
  } catch (error) {
    console.error('❌ Error en obtenerCitasDelDia:', error);
    res.status(500).json({
      success: false,
      message: 'Error al obtener las citas del día',
      error: error.message
    });
  }
};

/**
 * Obtener citas de una fecha específica
 * GET /citas/medico/:medicoId/fecha/:fecha
 */
export const obtenerCitasPorFecha = async (req, res) => {
  try {
    const { medicoId, fecha } = req.params;

    if (!medicoId || !fecha) {
      return res.status(400).json({
        success: false,
        message: 'El ID del médico y la fecha son requeridos'
      });
    }

    // Validar formato de fecha (YYYY-MM-DD)
    const fechaRegex = /^\d{4}-\d{2}-\d{2}$/;
    if (!fechaRegex.test(fecha)) {
      return res.status(400).json({
        success: false,
        message: 'Formato de fecha inválido. Use YYYY-MM-DD'
      });
    }

    const citas = await Cita.obtenerCitasPorFecha(medicoId, fecha);

    res.json({
      success: true,
      data: citas,
      count: citas.length,
      fecha
    });
  } catch (error) {
    console.error('❌ Error en obtenerCitasPorFecha:', error);
    res.status(500).json({
      success: false,
      message: 'Error al obtener las citas',
      error: error.message
    });
  }
};

/**
 * Obtener todas las citas futuras de un médico
 * GET /citas/medico/:medicoId/futuras
 */
export const obtenerCitasFuturas = async (req, res) => {
  try {
    const { medicoId } = req.params;

    if (!medicoId) {
      return res.status(400).json({
        success: false,
        message: 'El ID del médico es requerido'
      });
    }

    const citas = await Cita.obtenerCitasFuturas(medicoId);

    res.json({
      success: true,
      data: citas,
      count: citas.length
    });
  } catch (error) {
    console.error('❌ Error en obtenerCitasFuturas:', error);
    res.status(500).json({
      success: false,
      message: 'Error al obtener las citas futuras',
      error: error.message
    });
  }
};

/**
 * Obtener una cita específica por ID
 * GET /citas/:citaId
 */
export const obtenerCitaPorId = async (req, res) => {
  try {
    const { citaId } = req.params;

    if (!citaId) {
      return res.status(400).json({
        success: false,
        message: 'El ID de la cita es requerido'
      });
    }

    const cita = await Cita.obtenerPorId(citaId);

    if (!cita) {
      return res.status(404).json({
        success: false,
        message: 'Cita no encontrada'
      });
    }

    res.json({
      success: true,
      data: cita
    });
  } catch (error) {
    console.error('❌ Error en obtenerCitaPorId:', error);
    res.status(500).json({
      success: false,
      message: 'Error al obtener la cita',
      error: error.message
    });
  }
};

/**
 * Marcar cita como atendida/completada
 * PATCH /citas/:citaId/atender
 */
export const marcarCitaAtendida = async (req, res) => {
  try {
    const { citaId } = req.params;

    if (!citaId) {
      return res.status(400).json({
        success: false,
        message: 'El ID de la cita es requerido'
      });
    }

    const cita = await Cita.marcarComoAtendida(citaId);

    res.json({
      success: true,
      message: 'Cita marcada como completada exitosamente',
      data: cita
    });
  } catch (error) {
    console.error('❌ Error en marcarCitaAtendida:', error);
    
    // Manejo específico de errores
    if (error.message.includes('no encontrada') || error.message.includes('no encontrado')) {
      return res.status(404).json({
        success: false,
        message: error.message
      });
    }

    res.status(500).json({
      success: false,
      message: 'Error al marcar la cita como atendida',
      error: error.message
    });
  }
};

/**
 * Cambiar estado de una cita (genérico)
 * PATCH /citas/:citaId/estado
 * Body: { nombreEstado: "Programada" | "Completada" }
 */
export const cambiarEstadoCita = async (req, res) => {
  try {
    const { citaId } = req.params;
    const { nombreEstado } = req.body;

    if (!citaId || !nombreEstado) {
      return res.status(400).json({
        success: false,
        message: 'El ID de la cita y el nombre del estado son requeridos'
      });
    }

    const cita = await Cita.cambiarEstado(citaId, nombreEstado);

    res.json({
      success: true,
      message: `Estado de la cita actualizado a "${nombreEstado}"`,
      data: cita
    });
  } catch (error) {
    console.error('❌ Error en cambiarEstadoCita:', error);
    
    if (error.message.includes('no encontrada') || error.message.includes('no encontrado')) {
      return res.status(404).json({
        success: false,
        message: error.message
      });
    }

    res.status(500).json({
      success: false,
      message: 'Error al cambiar el estado de la cita',
      error: error.message
    });
  }
};