import Roles from '@models/roles.model.js';

export const listarRoles = async (req, res) => {
  try {
    const roles = await Roles.findAll();
    res.json({ success: true, data: roles });
  } catch (error) {
    console.error('Error en listarRoles:', error);
    res.status(500).json({ success: false, message: 'Error al obtener los roles' });
  }
};

export const obtenerRol = async (req, res) => {
  try {
    const { id } = req.params;
    const rol = await Roles.findById(id);

    if (!rol) {
      return res.status(404).json({ success: false, message: 'Rol no encontrado' });
    }

    res.json({ success: true, data: rol });
  } catch (error) {
    console.error('Error en obtenerRol:', error);
    res.status(500).json({ success: false, message: 'Error al obtener el rol' });
  }
};

export const crearRol = async (req, res) => {
  try {
    const { nombre, descripcion, code } = req.body;

    if (!nombre) {
      return res.status(400).json({
        success: false,
        message: 'El campo "nombre" es obligatorio'
      });
    }

    const nuevo = await Roles.create({ nombre, descripcion, code });

    res.status(201).json({
      success: true,
      message: 'Rol creado exitosamente',
      data: nuevo
    });
  } catch (error) {
    console.error('Error en crearRol:', error);
    res.status(500).json({ success: false, message: 'Error al crear el rol' });
  }
};

export const actualizarRol = async (req, res) => {
  try {
    const { id } = req.params;
    const { nombre, descripcion, code } = req.body;

    const existe = await Roles.findById(id);

    if (!existe) {
      return res.status(404).json({ success: false, message: 'Rol no encontrado' });
    }

    const actualizado = await Roles.update(id, { nombre, descripcion, code });

    res.json({
      success: true,
      message: 'Rol actualizado correctamente',
      data: actualizado
    });
  } catch (error) {
    console.error('Error en actualizarRol:', error);
    res.status(500).json({ success: false, message: 'Error al actualizar el rol' });
  }
};

export const eliminarRol = async (req, res) => {
  try {
    const { id } = req.params;

    const existe = await Roles.findById(id);
    if (!existe) {
      return res.status(404).json({ success: false, message: 'Rol no encontrado' });
    }

    await Roles.delete(id);

    res.json({
      success: true,
      message: 'Rol eliminado correctamente'
    });
  } catch (error) {
    console.error('Error en eliminarRol:', error);
    res.status(500).json({ success: false, message: 'Error al eliminar el rol' });
  }
};
