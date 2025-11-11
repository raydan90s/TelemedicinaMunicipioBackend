import 'dotenv/config';
import app from './app.js';
import { testConnection } from '@config/db.js';

const PORT = process.env.PORT || 3000;

testConnection().then(() => {
  app.listen(PORT, () => {
    console.log(`🚀 Servidor corriendo en http://localhost:${PORT}`);
  });
});