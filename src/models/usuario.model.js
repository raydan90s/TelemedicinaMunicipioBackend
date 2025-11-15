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

  // MÉTODO SIMPLIFICADO - Solo datos esenciales
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
      rol_id = 2 // Paciente por defecto
    } = userData;

    // Validar que no exista el usuario
    const existente = await this.findByEmailOrCedula(cedula || email);
    if (existente) {
      throw new Error('El usuario ya existe con ese email o cédula');
    }

    // Hash de la contraseña
    const salt = await bcrypt.genSalt(10);
    const password_hash = await bcrypt.hash(password, salt);

    try {
      // Iniciar transacción
      const [usuario] = await sql.begin(async sql => {
        // 1. Crear usuario
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

        // 2. Asignar rol
        await sql`
          INSERT INTO roles_usuarios (usuario_id, rol_id)
          VALUES (${nuevoUsuario.id}, ${rol_id})
        `;

        // 3. Si es paciente, crear registro BÁSICO (sin datos médicos)
        if (rol_id === 1) {
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

          // Crear historia clínica
          await sql`
            INSERT INTO historias_clinicas (paciente_id)
            VALUES (${nuevoUsuario.id})
          `;
        }

        // 4. Si es médico, crear registro básico (sin especialidades)
        if (rol_id === 2) {
          await sql`
            INSERT INTO medicos (usuario_id, licencia_medica, pasaporte)
            VALUES (${nuevoUsuario.id}, 'PENDIENTE', NULL)
          `;
        }

        return [nuevoUsuario];
      });

      return usuario;
    } catch (error) {
      throw error;
    }
  }
};

export default Usuario;