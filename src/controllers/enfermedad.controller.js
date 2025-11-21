import Enfermedad from '@models/enfermedad.model.js';

export const getEnfermedades = async (req, res) => {
  try {
    const enfermedades = await Enfermedad.findAll();
    res.json({ success: true, enfermedades });
  } catch (error) {
    console.error('Error en getEnfermedades:', error);
    res.status(500).json({ success: false, message: 'Error interno del servidor' });
  }
};

export const getEnfermedad = async (req, res) => {
  try {
    const { id } = req.params;
    const enfermedad = await Enfermedad.findById(id);
    if (!enfermedad) return res.status(404).json({ success: false, message: 'Enfermedad no encontrada' });
    res.json({ success: true, enfermedad });
  } catch (error) {
    console.error('Error en getEnfermedad:', error);
    res.status(500).json({ success: false, message: 'Error interno del servidor' });
  }
};

export const createEnfermedad = async (req, res) => {
  try {
    const { nombre, descripcion } = req.body;
    if (!nombre) return res.status(400).json({ success: false, message: 'Nombre es requerido' });
    const nuevaEnfermedad = await Enfermedad.create({ nombre, descripcion });
    res.status(201).json({ success: true, enfermedad: nuevaEnfermedad });
  } catch (error) {
    console.error('Error en createEnfermedad:', error);
    res.status(500).json({ success: false, message: 'Error interno del servidor' });
  }
};

export const updateEnfermedad = async (req, res) => {
  try {
    const { id } = req.params;
    const { nombre, descripcion } = req.body;
    if (!nombre) return res.status(400).json({ success: false, message: 'Nombre es requerido' });
    const updated = await Enfermedad.update(id, { nombre, descripcion });
    if (!updated) return res.status(404).json({ success: false, message: 'Enfermedad no encontrada' });
    res.json({ success: true, enfermedad: updated });
  } catch (error) {
    console.error('Error en updateEnfermedad:', error);
    res.status(500).json({ success: false, message: 'Error interno del servidor' });
  }
};

export const deleteEnfermedad = async (req, res) => {
  try {
    const { id } = req.params;
    const deleted = await Enfermedad.delete(id);
    if (!deleted) return res.status(404).json({ success: false, message: 'Enfermedad no encontrada' });
    res.json({ success: true, message: 'Enfermedad eliminada' });
  } catch (error) {
    console.error('Error en deleteEnfermedad:', error);
    res.status(500).json({ success: false, message: 'Error interno del servidor' });
  }
};