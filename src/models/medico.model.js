// src/models/medico.model.js
import sql from '@config/db.js';
import bcrypt from 'bcrypt';

const Medico = {
  /**
   * Obtener información completa del médico
   */
  async obtenerPorId(medicoId) {
    const result = await sql`
      SELECT 
        u.id,
        u.cedula,
        u.email,
        u.primer_nombre,
        u.segundo_nombre,
        u.primer_apellido,
        u.segundo_apellido,
        g.nombre AS genero,
        m.licencia_medica,
        m.pasaporte,
        (
          SELECT e.nombre 
          FROM medicos_especialidades me
          JOIN especialidades e ON e.id = me.especialidad_id
          WHERE me.medico_id = m.usuario_id AND me.principal = true
          LIMIT 1
        ) AS especialidad_principal
      FROM usuarios u
      JOIN medicos m ON m.usuario_id = u.id
      JOIN generos g ON g.id = u.genero_id
      WHERE u.id = ${medicoId}
    `;

    if (result.length === 0) {
      return null;
    }

    const medico = result[0];

    // Obtener especialidades
    const especialidades = await sql`
      SELECT 
        e.id,
        e.nombre,
        me.principal
      FROM medicos_especialidades me
      JOIN especialidades e ON e.id = me.especialidad_id
      WHERE me.medico_id = ${medicoId}
      ORDER BY me.principal DESC, e.nombre
    `;

    // Obtener horarios
    const horarios = await sql`
      SELECT 
        d.nombre AS dia,
        d.id AS dia_id,
        h.hora_inicio::TEXT,
        h.hora_fin::TEXT
      FROM horarios_medico h
      JOIN dias_atencion d ON d.id = h.dia_id
      WHERE h.medico_id = ${medicoId}
      ORDER BY d.id, h.hora_inicio
    `;

    return {
      ...medico,
      especialidades: especialidades,
      horarios: horarios
    };
  },

  /**
   * Obtener estadísticas del médico
   */
  async obtenerEstadisticas(medicoId) {
    const result = await sql`
      SELECT 
        COUNT(*) FILTER (WHERE ec.nombre = 'Completada') AS consultas_atendidas,
        COUNT(*) FILTER (WHERE ec.nombre = 'Programada' AND c.fecha_hora_inicio >= NOW()) AS consultas_futuras,
        COUNT(*) FILTER (WHERE ec.nombre = 'Programada' AND DATE(c.fecha_hora_inicio) = CURRENT_DATE) AS consultas_hoy
      FROM citas c
      JOIN estados_cita ec ON ec.id = c.estado_id
      WHERE c.medico_id = ${medicoId}
    `;
    return result[0];
  },

  /**
   * Actualizar horarios de atención
   */
  async actualizarHorarios(medicoId, horarios) {
    try {
      // Eliminar horarios existentes
      await sql`
        DELETE FROM horarios_medico 
        WHERE medico_id = ${medicoId}
      `;

      // Insertar nuevos horarios
      for (const horario of horarios) {
        await sql`
          INSERT INTO horarios_medico (medico_id, dia_id, hora_inicio, hora_fin)
          VALUES (${medicoId}, ${horario.dia_id}, ${horario.hora_inicio}, ${horario.hora_fin})
        `;
      }

      return { success: true };
    } catch (error) {
      throw error;
    }
  },

  /**
   * Crear excepción de horario (días no disponibles)
   */
  async crearExcepcionHorario(medicoId, fecha, motivo) {
    const result = await sql`
      INSERT INTO excepcion_horario (medico_id, fecha, motivo)
      VALUES (${medicoId}, ${fecha}, ${motivo})
      RETURNING *
    `;
    return result[0];
  },

  /**
   * Cambiar contraseña del médico
   */
  async cambiarPassword(medicoId, passwordActual, passwordNueva) {
    try {
      // Obtener usuario y verificar contraseña actual
      const usuario = await sql`
        SELECT id, password_hash 
        FROM usuarios 
        WHERE id = ${medicoId}
      `;

      if (usuario.length === 0) {
        throw new Error('Usuario no encontrado');
      }

      // Verificar contraseña actual
      const passwordValida = await bcrypt.compare(passwordActual, usuario[0].password_hash);

      if (!passwordValida) {
        throw new Error('Contraseña actual incorrecta');
      }

      // Hashear nueva contraseña
      const nuevoHash = await bcrypt.hash(passwordNueva, 10);

      // Actualizar contraseña
      await sql`
        UPDATE usuarios 
        SET password_hash = ${nuevoHash}
        WHERE id = ${medicoId}
      `;

      return { success: true };
    } catch (error) {
      throw error;
    }
  },

  /**
   * Cerrar sesión (eliminar tokens)
   */
  async cerrarSesion(medicoId) {
    await sql`
      DELETE FROM tokens 
      WHERE usuario_id = ${medicoId}
    `;
    return { success: true };
  }
};

export default Medico;