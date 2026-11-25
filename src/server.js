/**
 * Punto de entrada: inicia el servidor HTTP de Baby Saraí.
 * Ejecutar con: npm start  (o npm run dev para reiniciar al guardar cambios)
 */
const app = require('./app.js');
const { puerto } = require('./config/env.js');

app.listen(puerto, (error) => {
  if (error) {
    // Por ejemplo EADDRINUSE: otro programa ya está usando el puerto
    console.error(`No se pudo iniciar el servidor en el puerto ${puerto}: ${error.message}`);
    process.exit(1);
  }
  console.log(`Servidor Baby Saraí corriendo en http://localhost:${puerto}`);
  console.log(`Documentación de la API: http://localhost:${puerto}/api/docs`);
});
