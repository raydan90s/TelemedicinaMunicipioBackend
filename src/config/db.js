import postgres from 'postgres';
import dotenv from 'dotenv';

dotenv.config({ path: '../.env' });

const sql = postgres(process.env.DATABASE_URL, { ssl: 'require' });

try {
  const testConnection = await sql`SELECT NOW()`;
  console.log('✅ Conexión a PostgreSQL (Supabase) exitosa:', testConnection[0].now);
} catch (err) {
  console.error('❌ Error al conectar a PostgreSQL:', err.message);
}

export default sql;
