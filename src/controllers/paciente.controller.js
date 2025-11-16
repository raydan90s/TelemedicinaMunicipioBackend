import Paciente from '@models/paciente.model.js';

/**
 * Obtener historia clínica completa de un paciente
 * GET /pacientes/:pacienteId/historia
 */
export const obtenerHistoriaClinica = async (req, res) => {
  try {
    const { pacienteId } = req.params;

    if (!pacienteId) {
      return res.status(400).json({
        success: false,
        message: 'El ID del paciente es requerido'
      });
    }

    const historiaClinica = await Paciente.obtenerHistoriaClinica(pacienteId);

    if (!historiaClinica) {
      return res.status(404).json({
        success: false,
        message: 'Paciente no encontrado'
      });
    }

    res.json({
      success: true,
      data: historiaClinica
    });
  } catch (error) {
    console.error('❌ Error en obtenerHistoriaClinica:', error);
    res.status(500).json({
      success: false,
      message: 'Error al obtener la historia clínica',
      error: error.message
    });
  }
};

/**
 * Obtener información básica de un paciente
 * GET /pacientes/:pacienteId
 */
export const obtenerPaciente = async (req, res) => {
  try {
    const { pacienteId } = req.params;

    if (!pacienteId) {
      return res.status(400).json({
        success: false,
        message: 'El ID del paciente es requerido'
      });
    }

    const paciente = await Paciente.obtenerPorId(pacienteId);

    if (!paciente) {
      return res.status(404).json({
        success: false,
        message: 'Paciente no encontrado'
      });
    }

    res.json({
      success: true,
      data: paciente
    });
  } catch (error) {
    console.error('❌ Error en obtenerPaciente:', error);
    res.status(500).json({
      success: false,
      message: 'Error al obtener el paciente',
      error: error.message
    });
  }
};