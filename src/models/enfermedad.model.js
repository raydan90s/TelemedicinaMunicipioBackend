import sql from '@config/db.js';

const Enfermedad = {
  async findAll() {
    const result = await sql`SELECT * FROM enfermedades ORDER BY nombre`;
    return result;
  },

  async findById(id) {
    const result = await sql`SELECT * FROM enfermedades WHERE id = ${id}`;
    return result[0] || null;
  },

  async create(data) {
    const { nombre, descripcion } = data;
    const result = await sql`
      INSERT INTO enfermedades (nombre, descripcion)
      VALUES (${nombre}, ${descripcion})
      RETURNING *
    `;
    return result[0];
  },

  async update(id, data) {
    const { nombre, descripcion } = data;
    const result = await sql`
      UPDATE enfermedades
      SET nombre = ${nombre}, descripcion = ${descripcion}
      WHERE id = ${id}
      RETURNING *
    `;
    return result[0] || null;
  },

  async delete(id) {
    const result = await sql`DELETE FROM enfermedades WHERE id = ${id} RETURNING *`;
    return result[0] || null;
  }
};

export default Enfermedad;