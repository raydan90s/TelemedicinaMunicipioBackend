import sql from '@config/db.js';

const Paciente = {
  /**
   * Obtener historia clínica completa de un paciente
   * Incluye: datos personales, enfermedades, consultas previas y documentos
   */
  async obtenerHistoriaClinica(pacienteId) {
    try {
      // 1. Info básica del paciente
      const paciente = await sql`
        SELECT 
          u.id,
          u.cedula,
          u.email,
          u.primer_nombre,
          u.segundo_nombre,
          u.primer_apellido,
          u.segundo_apellido,
          g.nombre as genero,
          p.fecha_nacimiento,
          p.numero_celular,
          pa.nombre as pais,
          p.lugar_residencia,
          gs.nombre as grupo_sanguineo,
          ev.nombre as estilo_vida
        FROM usuarios u
        JOIN pacientes p ON u.id = p.usuario_id
        JOIN generos g ON u.genero_id = g.id
        LEFT JOIN paises pa ON p.pais_id = pa.id
        LEFT JOIN grupos_sanguineos gs ON p.grupo_sanguineo_id = gs.id
        LEFT JOIN estilos_vida ev ON p.estilo_vida_id = ev.id
        WHERE u.id = ${pacienteId}
      `;

      if (paciente.length === 0) {
        return null;
      }

      // 2. Enfermedades del paciente
      const enfermedades = await sql`
        SELECT 
          e.nombre as enfermedad,
          te.nombre as tipo,
          pe.detalle
        FROM pacientes_enfermedades pe
        JOIN enfermedades e ON pe.enfermedad_id = e.id
        JOIN tipos_enfermedad te ON pe.tipo_enfermedad_id = te.id
        WHERE pe.paciente_id = ${pacienteId}
      `;

      // 3. Historial de consultas previas
      const consultas = await sql`
        SELECT 
          ra.cita_id,
          c.fecha_hora_inicio as fecha,
          ra.motivo_cita,
          ra.diagnostico,
          ra.observaciones,
          u.primer_nombre as medico_nombre,
          u.primer_apellido as medico_apellido,
          e.nombre as especialidad
        FROM registros_atencion ra
        JOIN citas c ON ra.cita_id = c.id
        JOIN medicos m ON c.medico_id = m.usuario_id
        JOIN usuarios u ON m.usuario_id = u.id
        LEFT JOIN medicos_especialidades me ON m.usuario_id = me.medico_id AND me.principal = true
        LEFT JOIN especialidades e ON me.especialidad_id = e.id
        WHERE ra.historia_id = ${pacienteId}
        ORDER BY c.fecha_hora_inicio DESC
      `;

      // 4. Documentos de la historia clínica
      const documentos = await sql`
        SELECT 
          d.id,
          d.titulo,
          d.url,
          d.fecha_hora_subida,
          td.nombre as tipo_documento
        FROM documentos_hc d
        JOIN historias_clinicas hc ON d.historia_id = hc.paciente_id
        JOIN tipo_documento td ON d.tipo_id = td.id
        WHERE hc.paciente_id = ${pacienteId}
        ORDER BY d.fecha_hora_subida DESC
      `;

      // Combinar toda la información
      return {
        ...paciente[0],
        enfermedades,
        consultas_previas: consultas,
        documentos
      };
    } catch (error) {
      console.error('Error en obtenerHistoriaClinica:', error);
      throw error;
    }
  },

  /**
   * Obtener solo información básica del paciente
   */
  async obtenerPorId(pacienteId) {
    const result = await sql`
      SELECT 
        u.id,
        u.cedula,
        u.primer_nombre,
        u.segundo_nombre,
        u.primer_apellido,
        u.segundo_apellido,
        u.email,
        g.nombre as genero,
        p.numero_celular,
        p.fecha_nacimiento
      FROM usuarios u
      JOIN pacientes p ON u.id = p.usuario_id
      JOIN generos g ON u.genero_id = g.id
      WHERE u.id = ${pacienteId}
    `;
    return result[0];
  },

  /**
   * Verificar si un usuario es paciente
   */
  async esPaciente(usuarioId) {
    const result = await sql`
      SELECT COUNT(*) as count
      FROM pacientes
      WHERE usuario_id = ${usuarioId}
    `;
    return result[0].count > 0;
  }
};

export default Paciente;