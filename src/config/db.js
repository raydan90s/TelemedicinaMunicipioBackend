import postgres from 'postgres';

const sql = postgres(process.env.DATABASE_URL, { 
  ssl: 'require',
  onnotice: () => {}
});

export const testConnection = async () => {
  try {
    const result = await sql`SELECT NOW()`;
    console.log('✅ Conexión a PostgreSQL (Supabase) exitosa:', result[0].now);
    return true;
  } catch (err) {
    console.error('❌ Error al conectar a PostgreSQL:', err.message);
    return false;
  }
};

export default sql;