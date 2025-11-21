import sql from '@config/db.js';

const TipoEnfermedad = {
  async findAll() {
    const result = await sql`SELECT * FROM tipos_enfermedad ORDER BY nombre`;
    return result;
  },

  async findById(id) {
    const result = await sql`SELECT * FROM tipos_enfermedad WHERE id = ${id}`;
    return result[0] || null;
  },

  async create(data) {
    const { nombre } = data;
    const result = await sql`
      INSERT INTO tipos_enfermedad (nombre, descripcion)
      VALUES (${nombre}, ${descripcion})
      RETURNING *
    `;
    return result[0];
  },

  async update(id, data) {
    const { nombre } = data;
    const result = await sql`
      UPDATE tipos_enfermedad
      SET nombre = ${nombre}, descripcion = ${descripcion}
      WHERE id = ${id}
      RETURNING *
    `;
    return result[0] || null;
  },

  async delete(id) {
    const result = await sql`DELETE FROM tipos_enfermedad WHERE id = ${id} RETURNING *`;
    return result[0] || null;
  }
};

export default TipoEnfermedad;