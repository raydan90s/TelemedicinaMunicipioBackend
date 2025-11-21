import TipoEnfermedad from '@models/tipoEnfermedad.model.js';

export const getTiposEnfermedad = async (req, res) => {
  try {
    const tipos = await TipoEnfermedad.findAll();
    res.json({ success: true, tipos });
  } catch (error) {
    console.error('Error en getTiposEnfermedad:', error);
    res.status(500).json({ success: false, message: 'Error interno del servidor' });
  }
};

export const getTipoEnfermedad = async (req, res) => {
  try {
    const { id } = req.params;
    const tipo = await TipoEnfermedad.findById(id);
    if (!tipo) return res.status(404).json({ success: false, message: 'Tipo de enfermedad no encontrado' });
    res.json({ success: true, tipo });
  } catch (error) {
    console.error('Error en getTipoEnfermedad:', error);
    res.status(500).json({ success: false, message: 'Error interno del servidor' });
  }
};

export const createTipoEnfermedad = async (req, res) => {
  try {
    const { nombre } = req.body;
    if (!nombre) return res.status(400).json({ success: false, message: 'Nombre es requerido' });
    const nuevoTipo = await TipoEnfermedad.create({ nombre, descripcion });
    res.status(201).json({ success: true, tipo: nuevoTipo });
  } catch (error) {
    console.error('Error en createTipoEnfermedad:', error);
    res.status(500).json({ success: false, message: 'Error interno del servidor' });
  }
};

export const updateTipoEnfermedad = async (req, res) => {
  try {
    const { id } = req.params;
    const { nombre } = req.body;
    if (!nombre) return res.status(400).json({ success: false, message: 'Nombre es requerido' });
    const updated = await TipoEnfermedad.update(id, { nombre, descripcion });
    if (!updated) return res.status(404).json({ success: false, message: 'Tipo de enfermedad no encontrado' });
    res.json({ success: true, tipo: updated });
  } catch (error) {
    console.error('Error en updateTipoEnfermedad:', error);
    res.status(500).json({ success: false, message: 'Error interno del servidor' });
  }
};

export const deleteTipoEnfermedad = async (req, res) => {
  try {
    const { id } = req.params;
    const deleted = await TipoEnfermedad.delete(id);
    if (!deleted) return res.status(404).json({ success: false, message: 'Tipo de enfermedad no encontrado' });
    res.json({ success: true, message: 'Tipo de enfermedad eliminado' });
  } catch (error) {
    console.error('Error en deleteTipoEnfermedad:', error);
    res.status(500).json({ success: false, message: 'Error interno del servidor' });
  }
};