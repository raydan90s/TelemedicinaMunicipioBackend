-- ============================================
-- SISTEMA DE TELEMEDICINA - ESTRUCTURA BD
-- ============================================

-- Tablas Catálogo (Lookup Tables)
-- ============================================

CREATE TABLE generos (
    id SERIAL PRIMARY KEY,
    nombre VARCHAR(50) NOT NULL,
    codigo VARCHAR(10)
);

CREATE TABLE estados_usuario (
    id SERIAL PRIMARY KEY,
    nombre VARCHAR(50) NOT NULL
);

CREATE TABLE roles (
    id SERIAL PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL,
    descripcion TEXT
);

CREATE TABLE permisos (
    id SERIAL PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL,
    descripcion TEXT
);

CREATE TABLE roles_permisos (
    rol_id INTEGER NOT NULL REFERENCES roles(id),
    permiso_id INTEGER NOT NULL REFERENCES permisos(id),
    PRIMARY KEY (rol_id, permiso_id)
);

CREATE TABLE paises (
    id SERIAL PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL
);

CREATE TABLE grupos_sanguineos (
    id SERIAL PRIMARY KEY,
    nombre VARCHAR(10) NOT NULL
);

CREATE TABLE estilos_vida (
    id SERIAL PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL
);

CREATE TABLE especialidades (
    id SERIAL PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL,
    descripcion TEXT
);

CREATE TABLE dias_atencion (
    id SERIAL PRIMARY KEY,
    nombre VARCHAR(20) NOT NULL
);

CREATE TABLE estados_cita (
    id SERIAL PRIMARY KEY,
    nombre VARCHAR(50) NOT NULL
);

CREATE TABLE estados_sesion (
    id SERIAL PRIMARY KEY,
    nombre VARCHAR(50) NOT NULL
);

CREATE TABLE estados_pago (
    id SERIAL PRIMARY KEY,
    nombre VARCHAR(50) NOT NULL
);

CREATE TABLE roles_sesion (
    id SERIAL PRIMARY KEY,
    nombre VARCHAR(50) NOT NULL
);

CREATE TABLE tipos_mensaje (
    id SERIAL PRIMARY KEY,
    nombre VARCHAR(50) NOT NULL
);

CREATE TABLE tipos_enfermedad (
    id SERIAL PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL
);

CREATE TABLE enfermedades (
    id SERIAL PRIMARY KEY,
    nombre VARCHAR(200) NOT NULL,
    descripcion TEXT
);

CREATE TABLE tipo_documento (
    id SERIAL PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL,
    descripcion TEXT
);

CREATE TABLE tipos_centro (
    id SERIAL PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL
);

CREATE TABLE servicios_referidos (
    id SERIAL PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL
);

CREATE TABLE presentaciones_medicamento (
    id SERIAL PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL
);

CREATE TABLE unidades_medida (
    id SERIAL PRIMARY KEY,
    nombre VARCHAR(50) NOT NULL
);

CREATE TABLE vias_administracion (
    id SERIAL PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL
);

-- Tablas Principales
-- ============================================

CREATE TABLE usuarios (
    id SERIAL PRIMARY KEY,
    cedula VARCHAR(20) NOT NULL UNIQUE,
    email VARCHAR(255) NOT NULL UNIQUE,
    password_hash VARCHAR(255) NOT NULL,
    primer_nombre VARCHAR(100) NOT NULL,
    segundo_nombre VARCHAR(100),
    primer_apellido VARCHAR(100) NOT NULL,
    segundo_apellido VARCHAR(100),
    genero_id INTEGER NOT NULL REFERENCES generos(id),
    estado_id INTEGER NOT NULL REFERENCES estados_usuario(id),
    verificado BOOLEAN DEFAULT FALSE,
    fecha_creacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE roles_usuarios (
    usuario_id INTEGER NOT NULL REFERENCES usuarios(id),
    rol_id INTEGER NOT NULL REFERENCES roles(id),
    PRIMARY KEY (usuario_id, rol_id)
);

CREATE TABLE tokens (
    id SERIAL PRIMARY KEY,
    usuario_id INTEGER NOT NULL REFERENCES usuarios(id),
    token TEXT NOT NULL,
    fecha_expiracion TIMESTAMP NOT NULL
);

CREATE TABLE medicos (
    usuario_id INTEGER PRIMARY KEY REFERENCES usuarios(id),
    licencia_medica VARCHAR(50) NOT NULL UNIQUE,
    pasaporte VARCHAR(50)
);

CREATE TABLE medicos_especialidades (
    medico_id INTEGER NOT NULL REFERENCES medicos(usuario_id),
    especialidad_id INTEGER NOT NULL REFERENCES especialidades(id),
    principal BOOLEAN DEFAULT FALSE,
    PRIMARY KEY (medico_id, especialidad_id)
);

CREATE TABLE horarios_medico (
    id SERIAL PRIMARY KEY,
    medico_id INTEGER NOT NULL REFERENCES medicos(usuario_id),
    dia_id INTEGER NOT NULL REFERENCES dias_atencion(id),
    hora_inicio TIME NOT NULL,
    hora_fin TIME NOT NULL
);

CREATE TABLE excepcion_horario (
    id SERIAL PRIMARY KEY,
    medico_id INTEGER NOT NULL REFERENCES medicos(usuario_id),
    fecha DATE NOT NULL,
    hora_inicio TIME,
    hora_fin TIME,
    motivo TEXT
);

CREATE TABLE pacientes (
    usuario_id INTEGER PRIMARY KEY REFERENCES usuarios(id),
    fecha_nacimiento DATE NOT NULL,
    numero_celular VARCHAR(20),
    pais_id INTEGER NOT NULL REFERENCES paises(id),
    lugar_residencia TEXT,
    grupo_sanguineo_id INTEGER NOT NULL REFERENCES grupos_sanguineos(id),
    estilo_vida_id INTEGER NOT NULL REFERENCES estilos_vida(id)
);

CREATE TABLE pacientes_enfermedades (
    paciente_id INTEGER NOT NULL REFERENCES pacientes(usuario_id),
    enfermedad_id INTEGER NOT NULL REFERENCES enfermedades(id),
    tipo_enfermedad_id INTEGER NOT NULL REFERENCES tipos_enfermedad(id),
    detalle TEXT,
    PRIMARY KEY (paciente_id, enfermedad_id, tipo_enfermedad_id)
);

CREATE TABLE historias_clinicas (
    paciente_id INTEGER PRIMARY KEY REFERENCES pacientes(usuario_id),
    fecha_hora_apertura TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE documentos_hc (
    id SERIAL PRIMARY KEY,
    historia_id INTEGER NOT NULL REFERENCES historias_clinicas(paciente_id),
    tipo_id INTEGER NOT NULL REFERENCES tipo_documento(id),
    titulo VARCHAR(255) NOT NULL,
    url TEXT NOT NULL,
    tipo_mime VARCHAR(100) NOT NULL,
    fecha_hora_subida TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Tablas de Citas y Consultas
-- ============================================

CREATE TABLE citas (
    id SERIAL PRIMARY KEY,
    paciente_id INTEGER NOT NULL REFERENCES pacientes(usuario_id),
    medico_id INTEGER NOT NULL REFERENCES medicos(usuario_id),
    fecha_hora_inicio TIMESTAMP NOT NULL,
    fecha_hora_fin TIMESTAMP NOT NULL,
    estado_id INTEGER NOT NULL REFERENCES estados_cita(id),
    telefonica BOOLEAN DEFAULT FALSE,
    fecha_hora_creacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE sesiones_consulta (
    cita_id INTEGER PRIMARY KEY REFERENCES citas(id),
    nombre VARCHAR(255) NOT NULL,
    fecha_hora_inicio TIMESTAMP NOT NULL,
    fecha_hora_fin TIMESTAMP NOT NULL,
    estado_id INTEGER NOT NULL REFERENCES estados_sesion(id),
    grabacion_url TEXT
);

CREATE TABLE participantes_sesion (
    id SERIAL PRIMARY KEY,
    sesion_id INTEGER REFERENCES sesiones_consulta(cita_id),
    usuario_id INTEGER REFERENCES usuarios(id),
    rol_id INTEGER NOT NULL REFERENCES roles_sesion(id),
    token_acceso TEXT NOT NULL,
    nombre VARCHAR(255),
    fecha_hora_union TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    fecha_hora_salida TIMESTAMP
);

CREATE TABLE mensajes_chat (
    id SERIAL PRIMARY KEY,
    sesion_id INTEGER NOT NULL REFERENCES sesiones_consulta(cita_id),
    participante_id INTEGER REFERENCES participantes_sesion(id),
    tipo_mensaje_id INTEGER NOT NULL REFERENCES tipos_mensaje(id),
    contenido_texto TEXT,
    contenido_url TEXT,
    eliminado BOOLEAN DEFAULT FALSE,
    fecha_hora_envio TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE registros_atencion (
    cita_id INTEGER PRIMARY KEY REFERENCES citas(id),
    historia_id INTEGER NOT NULL REFERENCES historias_clinicas(paciente_id),
    motivo_cita TEXT,
    diagnostico TEXT,
    observaciones TEXT,
    fecha_hora_creacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Tablas de Medicamentos y Recetas
-- ============================================

CREATE TABLE medicamentos (
    id SERIAL PRIMARY KEY,
    nombre VARCHAR(255) NOT NULL,
    principio_activo VARCHAR(255) NOT NULL,
    presentacion_id INTEGER NOT NULL REFERENCES presentaciones_medicamento(id),
    concentracion VARCHAR(100)
);

CREATE TABLE recetas_medicas (
    registro_atencion_id INTEGER PRIMARY KEY REFERENCES registros_atencion(cita_id),
    medico_id INTEGER NOT NULL REFERENCES medicos(usuario_id),
    observaciones TEXT,
    fecha_hora_creacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE recetas_medicamentos (
    receta_id INTEGER NOT NULL REFERENCES recetas_medicas(registro_atencion_id),
    medicamento_id INTEGER NOT NULL REFERENCES medicamentos(id),
    cantidad INTEGER NOT NULL,
    unidad_medida_id INTEGER NOT NULL REFERENCES unidades_medida(id),
    frecuencia VARCHAR(100) NOT NULL,
    duracion VARCHAR(100) NOT NULL,
    via_administracion_id INTEGER NOT NULL REFERENCES vias_administracion(id),
    indicaciones TEXT,
    PRIMARY KEY (receta_id, medicamento_id)
);

-- Tablas de Derivaciones
-- ============================================

CREATE TABLE centros_salud (
    id SERIAL PRIMARY KEY,
    nombre VARCHAR(255) NOT NULL,
    tipo_id INTEGER NOT NULL REFERENCES tipos_centro(id),
    direccion TEXT,
    telefono VARCHAR(20)
);

CREATE TABLE derivaciones (
    id SERIAL PRIMARY KEY,
    registro_atencion_id INTEGER REFERENCES registros_atencion(cita_id),
    medico_id INTEGER NOT NULL REFERENCES medicos(usuario_id),
    centro_id INTEGER REFERENCES centros_salud(id),
    motivo TEXT NOT NULL,
    fecha_hora_creacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE derivaciones_servicios (
    derivacion_id INTEGER NOT NULL REFERENCES derivaciones(id),
    servicio_id INTEGER NOT NULL REFERENCES servicios_referidos(id),
    PRIMARY KEY (derivacion_id, servicio_id)
);

-- Tablas de Pagos
-- ============================================

CREATE TABLE pagos (
    id SERIAL PRIMARY KEY,
    medico_id INTEGER NOT NULL REFERENCES medicos(usuario_id),
    transaccion_id VARCHAR(255) NOT NULL UNIQUE,
    monto DECIMAL(10, 2) NOT NULL,
    estado_id INTEGER NOT NULL REFERENCES estados_pago(id),
    fecha_hora_pago TIMESTAMP,
    comprobante_pago TEXT
);

-- Índices para optimización
-- ============================================

CREATE INDEX idx_usuarios_email ON usuarios(email);
CREATE INDEX idx_usuarios_cedula ON usuarios(cedula);
CREATE INDEX idx_citas_paciente ON citas(paciente_id);
CREATE INDEX idx_citas_medico ON citas(medico_id);
CREATE INDEX idx_citas_fecha ON citas(fecha_hora_inicio);
CREATE INDEX idx_tokens_usuario ON tokens(usuario_id);
CREATE INDEX idx_tokens_token ON tokens(token);
CREATE INDEX idx_mensajes_sesion ON mensajes_chat(sesion_id);
CREATE INDEX idx_horarios_medico ON horarios_medico(medico_id);
CREATE INDEX idx_pagos_medico ON pagos(medico_id);
