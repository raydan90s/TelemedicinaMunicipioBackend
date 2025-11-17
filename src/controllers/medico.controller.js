// src/controllers/medico.controller.js
import Medico from '@models/medico.model.js';

/**
 * Obtener información completa del médico
 * GET /medicos/:medicoId
 */
export const obtenerMedico = async (req, res) => {
  try {
    const { medicoId } = req.params;

    if (!medicoId) {
      return res.status(400).json({
        success: false,
        message: 'El ID del médico es requerido'
      });
    }

    const medico = await Medico.obtenerPorId(medicoId);

    if (!medico) {
      return res.status(404).json({
        success: false,
        message: 'Médico no encontrado'
      });
    }

    res.json({
      success: true,
      data: medico
    });

  } catch (error) {
    console.error('❌ Error en obtenerMedico:', error);
    res.status(500).json({
      success: false,
      message: 'Error al obtener información del médico',
      error: error.message
    });
  }
};

/**
 * Obtener estadísticas del médico
 * GET /medicos/:medicoId/estadisticas
 */
export const obtenerEstadisticasMedico = async (req, res) => {
  try {
    const { medicoId } = req.params;

    if (!medicoId) {
      return res.status(400).json({
        success: false,
        message: 'El ID del médico es requerido'
      });
    }

    const estadisticas = await Medico.obtenerEstadisticas(medicoId);

    res.json({
      success: true,
      data: estadisticas
    });

  } catch (error) {
    console.error('❌ Error en obtenerEstadisticasMedico:', error);
    res.status(500).json({
      success: false,
      message: 'Error al obtener estadísticas',
      error: error.message
    });
  }
};

/**
 * Actualizar horarios de atención
 * PATCH /medicos/:medicoId/horarios
 */
export const actualizarHorarios = async (req, res) => {
  try {
    const { medicoId } = req.params;
    const { horarios } = req.body;

    if (!medicoId) {
      return res.status(400).json({
        success: false,
        message: 'El ID del médico es requerido'
      });
    }

    if (!Array.isArray(horarios) || horarios.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'Debe proporcionar al menos un horario'
      });
    }

    await Medico.actualizarHorarios(medicoId, horarios);

    res.json({
      success: true,
      message: 'Horarios actualizados exitosamente'
    });

  } catch (error) {
    console.error('❌ Error en actualizarHorarios:', error);
    res.status(500).json({
      success: false,
      message: 'Error al actualizar horarios',
      error: error.message
    });
  }
};

/**
 * Crear excepción de horario
 * POST /medicos/:medicoId/excepcion-horario
 */
export const crearExcepcionHorario = async (req, res) => {
  try {
    const { medicoId } = req.params;
    const { fecha, motivo } = req.body;

    if (!medicoId) {
      return res.status(400).json({
        success: false,
        message: 'El ID del médico es requerido'
      });
    }

    if (!fecha) {
      return res.status(400).json({
        success: false,
        message: 'La fecha es requerida'
      });
    }

    const excepcion = await Medico.crearExcepcionHorario(medicoId, fecha, motivo);

    res.status(201).json({
      success: true,
      message: 'Excepción de horario creada exitosamente',
      data: excepcion
    });

  } catch (error) {
    console.error('❌ Error en crearExcepcionHorario:', error);
    res.status(500).json({
      success: false,
      message: 'Error al crear excepción de horario',
      error: error.message
    });
  }
};

/**
 * Cambiar contraseña del médico
 * PATCH /medicos/:medicoId/cambiar-password
 */
export const cambiarPassword = async (req, res) => {
  try {
    const { medicoId } = req.params;
    const { passwordActual, passwordNueva } = req.body;

    if (!medicoId) {
      return res.status(400).json({
        success: false,
        message: 'El ID del médico es requerido'
      });
    }

    if (!passwordActual || !passwordNueva) {
      return res.status(400).json({
        success: false,
        message: 'Contraseña actual y nueva son requeridas'
      });
    }

    if (passwordNueva.length < 8) {
      return res.status(400).json({
        success: false,
        message: 'La contraseña nueva debe tener al menos 8 caracteres'
      });
    }

    await Medico.cambiarPassword(medicoId, passwordActual, passwordNueva);

    res.json({
      success: true,
      message: 'Contraseña actualizada exitosamente'
    });

  } catch (error) {
    console.error('❌ Error en cambiarPassword:', error);

    // Manejo específico de errores
    if (error.message === 'Usuario no encontrado') {
      return res.status(404).json({
        success: false,
        message: error.message
      });
    }

    if (error.message === 'Contraseña actual incorrecta') {
      return res.status(401).json({
        success: false,
        message: error.message
      });
    }

    res.status(500).json({
      success: false,
      message: 'Error al cambiar contraseña',
      error: error.message
    });
  }
};

/**
 * Cerrar sesión
 * POST /medicos/:medicoId/logout
 */
export const cerrarSesion = async (req, res) => {
  try {
    const { medicoId } = req.params;

    if (!medicoId) {
      return res.status(400).json({
        success: false,
        message: 'El ID del médico es requerido'
      });
    }

    await Medico.cerrarSesion(medicoId);

    res.json({
      success: true,
      message: 'Sesión cerrada exitosamente'
    });

  } catch (error) {
    console.error('❌ Error en cerrarSesion:', error);
    res.status(500).json({
      success: false,
      message: 'Error al cerrar sesión',
      error: error.message
    });
  }
};