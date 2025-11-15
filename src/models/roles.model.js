import sql from '@config/db.js';

const Roles = {
  async findAll() {
    return await sql`
      SELECT * FROM roles ORDER BY id
    `;
  },

  async findById(id) {
    const result = await sql`
      SELECT * FROM roles WHERE id = ${id}
    `;
    return result[0];
  },

  async findByCode(code) {
    const result = await sql`
      SELECT * FROM roles WHERE code = ${code}
    `;
    return result[0];
  },

  async create(data) {
    const { nombre, descripcion, code } = data;

    const [nuevo] = await sql`
      INSERT INTO roles (nombre, descripcion, code)
      VALUES (${nombre}, ${descripcion || null}, ${code || null})
      RETURNING *
    `;

    return nuevo;
  },

  async update(id, data) {
    const { nombre, descripcion, code } = data;

    const [actualizado] = await sql`
      UPDATE roles
      SET 
        nombre = ${nombre},
        descripcion = ${descripcion || null},
        code = ${code || null}
      WHERE id = ${id}
      RETURNING *
    `;

    return actualizado;
  },

  async delete(id) {
    const result = await sql`
      DELETE FROM roles
      WHERE id = ${id}
      RETURNING id
    `;
    return result[0];
  }
};

export default Roles;
