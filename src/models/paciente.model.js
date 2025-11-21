import sql from '@config/db.js';

const Paciente = {
  async findByUserId(userId) {
    const result = await sql`
      SELECT * FROM pacientes
      WHERE usuario_id = ${userId}
    `;

    if (result.length === 0) {
      return null;
    }
    return result[0];
  },
  
  isCompleteFromData(pacienteData) {
    if (!pacienteData) return false;

    const requiredFields = [
      'fecha_nacimiento', 
      'pais_id', 
      'lugar_residencia', 
      'numero_celular', 
      'grupo_sanguineo_id', 
      'estilo_vida_id' 
    ];
    
    return requiredFields.every(field => pacienteData[field] !== null && pacienteData[field] !== undefined);
  },
  
  async updateByUserId(userId, updateData) {
  
    const allowedFields = [
      'fecha_nacimiento',
      'numero_celular',
      'pais_id',
      'lugar_residencia',
      'grupo_sanguineo_id',
      'estilo_vida_id'
    ];
  
    const filteredData = {};
    for (const field of allowedFields) {
      if (updateData[field] !== undefined) {
        filteredData[field] = updateData[field];
      }
    }
  
    if (Object.keys(filteredData).length === 0) {
      throw new Error('No se proporcionaron campos válidos para actualizar');
    }
  
    const setClause = Object.keys(filteredData).map(field => `${field} = ${sql(filteredData[field])}`).join(', ');
    const result = await sql`
      UPDATE pacientes
      SET ${sql(setClause)}
      WHERE usuario_id = ${userId}
      RETURNING *
    `;
  
    if (result.length === 0) {
      return null; 
    }
    
    return result[0]; 
  },
}

export default Paciente;