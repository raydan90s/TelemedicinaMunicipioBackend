import Paciente from '@models/paciente.model.js';

export const getPerfil = async (req, res) => {
  const userId = req.user.id;
  if (!userId) {
    return res.status(401).json({ success: false, message: 'Usuario no autenticado' });
  }

  const paciente = await Paciente.findByUserId(userId);
  if (!paciente) {
    return res.status(404).json({ success: false, message: 'No se encontró paciente' });
  }

  const isComplete = Paciente.isCompleteFromData(paciente);

  return res.status(200).json({ success: true, data: { paciente, isComplete } });
};

export const updatePerfil = async (req, res) => {
  const userId = req.user.id;
  if (!userId) {
    return res.status(401).json({ success: false, message: 'Usuario no autenticado' });
  }

  const updateData = req.body; 

  try {
    const updatedPaciente = await Paciente.updateByUserId(userId, updateData);
    if (!updatedPaciente) {
      return res.status(404).json({ success: false, message: 'Paciente no encontrado' });
    }

    const isComplete = Paciente.isCompleteFromData(updatedPaciente);

    return res.status(200).json({ success: true, data: { paciente: updatedPaciente, isComplete } });
  } catch (error) {
    return res.status(400).json({ success: false, message: error.message || 'Error al actualizar perfil' });
  }
};