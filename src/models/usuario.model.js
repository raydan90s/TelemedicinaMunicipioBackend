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
        // 0. Buscar el rol por código (DINÁMICO) - USAR MINÚSCULAS
        const [rol] = await sql`
          SELECT id, rolecode, nombre
          FROM roles
          WHERE rolecode = ${roleCode}
        `;

        if (!rol) {
          throw new Error(`Rol con código '${roleCode}' no encontrado`);
        }

        console.log(`✅ Rol encontrado: ${rol.nombre} (ID: ${rol.id}, Code: ${rol.rolecode})`);

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

        console.log(`✅ Usuario creado: ${nuevoUsuario.id}`);

        // 2. Asignar rol (usando el ID dinámico)
        await sql`
          INSERT INTO roles_usuarios (usuario_id, rol_id)
          VALUES (${nuevoUsuario.id}, ${rol.id})
        `;

        console.log(`✅ Rol asignado: ${rol.nombre}`);

        // 3. Crear registros específicos según el rolecode (MINÚSCULAS)
        switch (rol.rolecode) {
          case 'PACIENTE':
            console.log('📝 Creando registro de paciente...');
            // Crear registro BÁSICO de paciente
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
            console.log('✅ Paciente y historia clínica creados');
            break;

          case 'MEDICO':
            console.log('📝 Creando registro de médico...');
            // Crear registro básico de médico
            await sql`
              INSERT INTO medicos (usuario_id, licencia_medica, pasaporte)
              VALUES (${nuevoUsuario.id}, NULL, NULL)
            `;
            console.log('✅ Médico creado');
            break;

          case 'ADMIN':
            console.log('✅ Administrador creado (sin tabla específica)');
            break;

          default:
            console.log(`⚠️ Rol '${rol.rolecode}' no tiene tabla específica`);
            break;
        }

        return [nuevoUsuario];
      });

      console.log(`✅ Registro completo exitoso para usuario ID: ${usuario.id}`);
      return usuario;
    } catch (error) {
      console.error('❌ Error en create usuario:', error);
      throw error;
    }
  }
};

export default Usuario;