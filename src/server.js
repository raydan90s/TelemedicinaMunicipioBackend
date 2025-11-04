require('module-alias/register');
require('dotenv').config({ path: '../.env' });
const app = require('./app');

const PORT = process.env.PORT;
app.listen(PORT, () => {
  console.log(`🚀 Servidor corriendo en http://localhost:${PORT}`);
});
