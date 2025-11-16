import sql from '@config/db.js';
import bcrypt from 'bcrypt';

const Usuario = {
  async findByEmailOrCedula(identifier) {
    const result = await sql`
      SELECT * FROM usuarios 
      WHERE email = ${identifier} OR cedula = ${identifier}
    `;
    return result[0];
  },

  async getRolesYPermisos(usuarioId) {
    const result = await sql`
      SELECT 
        r.id AS rol_id,
        r.nombre AS rol_nombre,
        p.id AS permiso_id,
        p.nombre AS permiso_nombre
      FROM roles r
      JOIN roles_usuarios ru ON ru.rol_id = r.id
      LEFT JOIN roles_permisos rp ON rp.rol_id = r.id
      LEFT JOIN permisos p ON p.id = rp.permiso_id
      WHERE ru.usuario_id = ${usuarioId}
    `;
    return result;
  },

  async validateLogin(identifier, password) {
    const user = await this.findByEmailOrCedula(identifier);
    if (!user) return null;

    const isMatch = await bcrypt.compare(password, user.password_hash);
    if (!isMatch || !user.estado_id) return null;

    const rolesYPermisos = await this.getRolesYPermisos(user.id);

    const roles = {};
    for (const row of rolesYPermisos) {
      if (!roles[row.rol_nombre]) roles[row.rol_nombre] = [];
      if (row.permiso_nombre) roles[row.rol_nombre].push(row.permiso_nombre);
    }

    return { ...user, roles };
  },

  async create(userData) {
    const {
      cedula,
      email,
      password,
      primer_nombre,
      segundo_nombre,
      primer_apellido,
      segundo_apellido,
      genero_id,
      numero_celular,
      estado_id = 1,
      roleCode = 'PACIENTE'
    } = userData;

    const existente = await this.findByEmailOrCedula(cedula || email);
    if (existente) {
      throw new Error('El usuario ya existe con ese email o cédula');
    }

    const salt = await bcrypt.genSalt(10);
    const password_hash = await bcrypt.hash(password, salt);

    try {
      const [usuario] = await sql.begin(async sql => {
        const [rol] = await sql`
          SELECT id, rolecode, nombre
          FROM roles
          WHERE rolecode = ${roleCode}
        `;

        if (!rol) {
          throw new Error(`Rol con código '${roleCode}' no encontrado`);
        }

        const [nuevoUsuario] = await sql`
          INSERT INTO usuarios (
            cedula, email, password_hash, 
            primer_nombre, segundo_nombre, 
            primer_apellido, segundo_apellido,
            genero_id, estado_id
          ) VALUES (
            ${cedula}, ${email}, ${password_hash},
            ${primer_nombre}, ${segundo_nombre || null},
            ${primer_apellido}, ${segundo_apellido || null},
            ${genero_id}, ${estado_id}
          )
          RETURNING *
        `;

        await sql`
          INSERT INTO roles_usuarios (usuario_id, rol_id)
          VALUES (${nuevoUsuario.id}, ${rol.id})
        `;


        switch (rol.rolecode) {
          case 'PACIENTE':
            await sql`
              INSERT INTO pacientes (
                usuario_id, 
                fecha_nacimiento, 
                pais_id, 
                lugar_residencia,
                numero_celular,
                grupo_sanguineo_id, 
                estilo_vida_id
              ) VALUES (
                ${nuevoUsuario.id}, 
                NULL, 
                1, 
                NULL,
                ${numero_celular || null},
                NULL, 
                NULL
              )
            `;

            await sql`
              INSERT INTO historias_clinicas (paciente_id)
              VALUES (${nuevoUsuario.id})
            `;
            break;

          case 'MEDICO':
            await sql`
              INSERT INTO medicos (usuario_id, licencia_medica, pasaporte)
              VALUES (${nuevoUsuario.id}, NULL, NULL)
            `;
            break;

          default:
            break;
        }

        return [nuevoUsuario];
      });

      return usuario;
    } catch (error) {
      console.error('❌ Error en create usuario:', error);
      throw error;
    }
  }
};

export default Usuario;