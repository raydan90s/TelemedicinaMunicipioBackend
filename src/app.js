const express = require('express');
const cors = require('cors');
const pool = require('./config/db');
const pacienteRoutes = require('@routes/paciente/paciente.route');
const usuarioRoutes  = require('@routes/usuario/usuario.route');
const morgan = require('morgan');
const doctorRoutes   = require('@routes/doctor/doctor.route');
const detalleTratamientoPacienteRoutes = require('@routes/detalleTratamientoPaciente/detalleTratamientoPaciente.routes');
const paisRoutes = require('@routes/paises/paises.route');
const provinciaRoutes = require('@routes/provincia/provincia.routes');
const ciudadRoutes = require('@routes/ciudades/ciudades.route');
const tratamientoDetalleRoutes = require('@routes/tratamientoDetalle/tratamientoDetalle.routes');
const tratamientosRoutes = require('@routes/tratamientos/tratamientos.route');
const citasRoutes = require('@routes/citas/citas.routes');
const consultoriosRoutes = require('@routes/consultorios/consultorios.routes');

const app = express();
app.use(morgan('dev'));

app.use(express.json());
app.use(cors({
  origin: ['http://localhost:5173'], 
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'], 
  credentials: true, 
}));

app.get('/', async (req, res) => {
  try {
    const result = await pool.query('SELECT NOW()');
    res.json({ server_time: result.rows[0] });
  } catch (error) {
    console.error('Error consultando la BD:', error);
    res.status(500).json({ message: 'Error al conectar con la base de datos' });
  }
});

app.use('/pacientes', pacienteRoutes);
app.use('/login', usuarioRoutes);
app.use('/doctores', doctorRoutes);
app.use('/detalles', detalleTratamientoPacienteRoutes);
app.use('/paises', paisRoutes);
app.use('/provincias', provinciaRoutes);
app.use('/ciudades', ciudadRoutes);
app.use('/tratamientos_detalle', tratamientoDetalleRoutes);
app.use('/tratamientos', tratamientosRoutes);
app.use('/citas', citasRoutes);
app.use('/consultorios', consultoriosRoutes);

module.exports = app;
