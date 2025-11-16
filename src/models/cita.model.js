import sql from '@config/db.js';

const Cita = {
  /**
   * Obtener citas del día actual para un médico
   */
  async obtenerCitasDelDia(medicoId) {
    const result = await sql`
      SELECT 
        c.id,
        c.fecha_hora_inicio,
        c.fecha_hora_fin,
        ec.nombre as estado,
        ec.id as estado_id,
        u.primer_nombre as paciente_nombre,
        u.segundo_nombre as paciente_segundo_nombre,
        u.primer_apellido as paciente_apellido,
        u.segundo_apellido as paciente_segundo_apellido,
        p.usuario_id as paciente_id,
        p.numero_celular as paciente_celular
      FROM citas c
      JOIN estados_cita ec ON c.estado_id = ec.id
      JOIN pacientes p ON c.paciente_id = p.usuario_id
      JOIN usuarios u ON p.usuario_id = u.id
      WHERE c.medico_id = ${medicoId}
      AND DATE(c.fecha_hora_inicio) = CURRENT_DATE
      ORDER BY c.fecha_hora_inicio
    `;
    return result;
  },

  /**
   * Obtener citas de una fecha específica para un médico
   */
  async obtenerCitasPorFecha(medicoId, fecha) {
    const result = await sql`
      SELECT 
        c.id,
        c.fecha_hora_inicio,
        c.fecha_hora_fin,
        ec.nombre as estado,
        ec.id as estado_id,
        u.primer_nombre as paciente_nombre,
        u.segundo_nombre as paciente_segundo_nombre,
        u.primer_apellido as paciente_apellido,
        u.segundo_apellido as paciente_segundo_apellido,
        p.usuario_id as paciente_id,
        p.numero_celular as paciente_celular
      FROM citas c
      JOIN estados_cita ec ON c.estado_id = ec.id
      JOIN pacientes p ON c.paciente_id = p.usuario_id
      JOIN usuarios u ON p.usuario_id = u.id
      WHERE c.medico_id = ${medicoId}
      AND DATE(c.fecha_hora_inicio) = ${fecha}
      ORDER BY c.fecha_hora_inicio
    `;
    return result;
  },

  /**
   * Obtener todas las citas futuras de un médico
   */
  async obtenerCitasFuturas(medicoId) {
    const result = await sql`
      SELECT 
        c.id,
        c.fecha_hora_inicio,
        c.fecha_hora_fin,
        ec.nombre as estado,
        ec.id as estado_id,
        u.primer_nombre as paciente_nombre,
        u.segundo_nombre as paciente_segundo_nombre,
        u.primer_apellido as paciente_apellido,
        u.segundo_apellido as paciente_segundo_apellido,
        p.usuario_id as paciente_id,
        p.numero_celular as paciente_celular
      FROM citas c
      JOIN estados_cita ec ON c.estado_id = ec.id
      JOIN pacientes p ON c.paciente_id = p.usuario_id
      JOIN usuarios u ON p.usuario_id = u.id
      WHERE c.medico_id = ${medicoId}
      AND c.fecha_hora_inicio >= CURRENT_DATE
      ORDER BY c.fecha_hora_inicio
    `;
    return result;
  },

  /**
   * Obtener una cita específica por ID
   */
  async obtenerPorId(citaId) {
    const result = await sql`
      SELECT 
        c.*,
        ec.nombre as estado,
        u.primer_nombre as paciente_nombre,
        u.primer_apellido as paciente_apellido,
        p.usuario_id as paciente_id
      FROM citas c
      JOIN estados_cita ec ON c.estado_id = ec.id
      JOIN pacientes p ON c.paciente_id = p.usuario_id
      JOIN usuarios u ON p.usuario_id = u.id
      WHERE c.id = ${citaId}
    `;
    return result[0];
  },

  /**
   * Marcar cita como completada
   * CORRECTO: Busca el estado por nombre, no hardcodea el ID
   */
  async marcarComoAtendida(citaId) {
    try {
      // Buscar el ID del estado "Completada" dinámicamente
      const estadoCompletada = await sql`
        SELECT id FROM estados_cita 
        WHERE nombre = 'Completada'
        LIMIT 1
      `;
      
      if (estadoCompletada.length === 0) {
        throw new Error('Estado "Completada" no encontrado en la base de datos');
      }

      // Actualizar la cita con el estado encontrado
      const result = await sql`
        UPDATE citas 
        SET estado_id = ${estadoCompletada[0].id}
        WHERE id = ${citaId}
        RETURNING *
      `;
      
      if (result.length === 0) {
        throw new Error('Cita no encontrada');
      }
      
      return result[0];
    } catch (error) {
      console.error('Error en marcarComoAtendida:', error);
      throw error;
    }
  },

  /**
   * Cambiar estado de una cita (genérico)
   * Útil para cancelar, reprogramar, etc.
   */
  async cambiarEstado(citaId, nombreEstado) {
    try {
      // Buscar el estado por nombre
      const estado = await sql`
        SELECT id FROM estados_cita 
        WHERE nombre = ${nombreEstado}
        LIMIT 1
      `;
      
      if (estado.length === 0) {
        throw new Error(`Estado "${nombreEstado}" no encontrado en la base de datos`);
      }

      const result = await sql`
        UPDATE citas 
        SET estado_id = ${estado[0].id}
        WHERE id = ${citaId}
        RETURNING *
      `;
      
      if (result.length === 0) {
        throw new Error('Cita no encontrada');
      }
      
      return result[0];
    } catch (error) {
      console.error('Error en cambiarEstado:', error);
      throw error;
    }
  }
};

export default Cita;