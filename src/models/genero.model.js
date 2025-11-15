import sql from '@config/db.js';

const Genero = {
  async findAll() {
    return await sql`SELECT * FROM generos ORDER BY id`;
  },

  async findById(id) {
    const result = await sql`
      SELECT * FROM generos WHERE id = ${id}
    `;
    return result[0];
  },

  async create(data) {
    const { nombre, codigo } = data;

    const [nuevo] = await sql`
      INSERT INTO generos (nombre, codigo)
      VALUES (${nombre}, ${codigo || null})
      RETURNING *
    `;

    return nuevo;
  },

  async update(id, data) {
    const { nombre, codigo } = data;

    const [actualizado] = await sql`
      UPDATE generos
      SET nombre = ${nombre},
          codigo = ${codigo || null}
      WHERE id = ${id}
      RETURNING *
    `;

    return actualizado;
  },

  async delete(id) {
    const result = await sql`
      DELETE FROM generos WHERE id = ${id}
      RETURNING id
    `;
    return result[0];
  }
};

export default Genero;