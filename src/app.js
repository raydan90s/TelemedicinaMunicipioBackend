import express from 'express';
import cors from 'cors';
import morgan from 'morgan';
import sql from '@config/db.js';
import usuarioRouter from '@routes/usuario.route.js';
import generoRouter from '@routes/genero.route.js';
import rolesRouter from '@routes/roles.route.js';
import citaRouter from '@routes/cita.route.js';        // ⬅️ NUEVO
import pacienteRouter from '@routes/paciente.route.js';
import medicoRouter from '@routes/medico.route.js';  // ⬅️ NUEVO
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
    const result = await sql`SELECT NOW()`;
    res.json({ 
      message: 'Telemedicina API',
      server_time: result[0].now 
    });
  } catch (error) {
    console.error('❌ Error consultando la BD:', error.message);
    res.status(500).json({ message: 'Error al conectar con la base de datos' });
  }
});

app.use('/usuarios', usuarioRouter);
app.use('/genero', generoRouter);
app.use('/roles', rolesRouter);
app.use('/citas', citaRouter);           // ⬅️ NUEVO
app.use('/pacientes', pacienteRouter); 
app.use('/medicos', medicoRouter);  // ⬅️ NUEVO
export default app;