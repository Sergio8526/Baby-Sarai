/**
 * Crea la cuenta de administración de la tienda (o convierte en admin una cuenta existente).
 *
 * Uso:
 *   npm run crear-admin -- "Nombre Apellido" correo@ejemplo.com "Contrasena123"
 *
 * El registro público (/api/v1/auth/registro) SIEMPRE crea clientes: así nadie
 * puede darse a sí mismo permisos de administración desde internet.
 */
const bcrypt = require('bcryptjs');
const pool = require('../src/config/db.js');
const usuarioModel = require('../src/models/usuarioModel.js');
const { validarRegistro } = require('../src/validators/usuarioValidator.js');
const { rondasBcrypt } = require('../src/config/env.js');

async function main() {
  const [nombre, email, contrasena] = process.argv.slice(2);
  if (!nombre || !email || !contrasena) {
    console.log('Uso: npm run crear-admin -- "Nombre Apellido" correo@ejemplo.com "Contrasena123"');
    process.exitCode = 1;
    return;
  }

  // Se usan las mismas reglas del registro (correo válido, contraseña segura...)
  const datos = validarRegistro({ nombre, email, contrasena });
  const existente = await usuarioModel.obtenerUsuarioPorEmail(datos.email);

  if (existente) {
    await usuarioModel.actualizarUsuario(existente.id, { rol: 'admin', activo: true });
    console.log(
      `La cuenta ${datos.email} ya existía: ahora es administradora (contraseña sin cambios).`
    );
  } else {
    const contrasenaHash = await bcrypt.hash(datos.contrasena, rondasBcrypt);
    const id = await usuarioModel.crearUsuario({ ...datos, contrasenaHash, rol: 'admin' });
    console.log(`Cuenta de administración creada: ${datos.email} (id ${id}).`);
  }
}

main()
  .catch((error) => {
    console.error(
      error.detalles?.length ? `${error.message}:\n- ${error.detalles.join('\n- ')}` : error.message
    );
    process.exitCode = 1;
  })
  .finally(() => pool.end());
