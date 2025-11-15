import Genero from '@models/genero.model.js';

export const listarGeneros = async (req, res) => {
  try {
    const generos = await Genero.findAll();
    res.json({ success: true, data: generos });
  } catch (error) {
    console.error('Error en listarGeneros:', error);
    res.status(500).json({ success: false, message: 'Error al obtener los géneros' });
  }
};

export const obtenerGenero = async (req, res) => {
  try {
    const { id } = req.params;
    const genero = await Genero.findById(id);

    if (!genero) {
      return res.status(404).json({ success: false, message: 'Género no encontrado' });
    }

    res.json({ success: true, data: genero });
  } catch (error) {
    console.error('Error en obtenerGenero:', error);
    res.status(500).json({ success: false, message: 'Error al obtener el género' });
  }
};

export const crearGenero = async (req, res) => {
  try {
    const { nombre, codigo } = req.body;

    if (!nombre) {
      return res.status(400).json({
        success: false,
        message: 'El campo "nombre" es obligatorio'
      });
    }

    const nuevo = await Genero.create({ nombre, codigo });

    res.status(201).json({
      success: true,
      message: 'Género creado exitosamente',
      data: nuevo
    });
  } catch (error) {
    console.error('Error en crearGenero:', error);
    res.status(500).json({ success: false, message: 'Error al crear el género' });
  }
};

export const actualizarGenero = async (req, res) => {
  try {
    const { id } = req.params;
    const { nombre, codigo } = req.body;

    const existe = await Genero.findById(id);
    if (!existe) {
      return res.status(404).json({ success: false, message: 'Género no encontrado' });
    }

    const actualizado = await Genero.update(id, { nombre, codigo });

    res.json({
      success: true,
      message: 'Género actualizado exitosamente',
      data: actualizado
    });
  } catch (error) {
    console.error('Error en actualizarGenero:', error);
    res.status(500).json({ success: false, message: 'Error al actualizar el género' });
  }
};

export const eliminarGenero = async (req, res) => {
  try {
    const { id } = req.params;

    const existe = await Genero.findById(id);
    if (!existe) {
      return res.status(404).json({ success: false, message: 'Género no encontrado' });
    }

    await Genero.delete(id);

    res.json({
      success: true,
      message: 'Género eliminado correctamente'
    });
  } catch (error) {
    console.error('Error en eliminarGenero:', error);
    res.status(500).json({ success: false, message: 'Error al eliminar el género' });
  }
};
