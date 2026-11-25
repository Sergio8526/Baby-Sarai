/**
 * Modelo de usuarios.
 * Contiene las consultas SQL sobre la tabla usuarios.
 * El hash de la contraseña solo se devuelve en obtenerUsuarioPorEmail,
 * que es la única consulta que lo necesita (para el inicio de sesión).
 */
const pool = require('../config/db.js');

// Columnas públicas, traducidas a camelCase (sin el hash de la contraseña)
const COLUMNAS = `
  id,
  nombre,
  email,
  rol,
  telefono,
  activo,
  fecha_creacion AS fechaCreacion
`;

/**
 * Convierte el campo activo (0/1 en MySQL) en booleano.
 * @param {Object} fila
 * @returns {Object}
 */
function aUsuario(fila) {
  return fila ? { ...fila, activo: Boolean(fila.activo) } : null;
}

/**
 * Crea un usuario.
 * @param {{nombre: string, email: string, contrasenaHash: string, rol?: string, telefono?: string|null}} usuario
 * @returns {Promise<number>} Id del usuario creado.
 */
async function crearUsuario({ nombre, email, contrasenaHash, rol = 'cliente', telefono = null }) {
  const [resultado] = await pool.query(
    'INSERT INTO usuarios (nombre, email, contrasena_hash, rol, telefono) VALUES (?, ?, ?, ?, ?)',
    [nombre, email, contrasenaHash, rol, telefono]
  );
  return resultado.insertId;
}

/**
 * Consulta un usuario por id (sin el hash).
 * @param {number} id
 * @returns {Promise<Object|null>}
 */
async function obtenerUsuarioPorId(id) {
  const [filas] = await pool.query(`SELECT ${COLUMNAS} FROM usuarios WHERE id = ?`, [id]);
  return aUsuario(filas[0]);
}

/**
 * Consulta un usuario por correo, INCLUYENDO el hash. Solo para el inicio de sesión.
 * @param {string} email
 * @returns {Promise<Object|null>}
 */
async function obtenerUsuarioPorEmail(email) {
  const [filas] = await pool.query(
    `SELECT ${COLUMNAS}, contrasena_hash AS contrasenaHash FROM usuarios WHERE email = ?`,
    [email]
  );
  return aUsuario(filas[0]);
}

/**
 * Lista los usuarios con filtros opcionales.
 * @param {{rol?: string}} [filtros]
 * @returns {Promise<Array>}
 */
async function listarUsuarios({ rol } = {}) {
  const where = rol ? 'WHERE rol = ?' : '';
  const [filas] = await pool.query(
    `SELECT ${COLUMNAS} FROM usuarios ${where} ORDER BY fecha_creacion DESC, id DESC`,
    rol ? [rol] : []
  );
  return filas.map(aUsuario);
}

/**
 * Cambia el rol y/o el estado de un usuario.
 * Solo se actualizan los campos que vienen en "cambios".
 * @param {number} id
 * @param {{rol?: string, activo?: boolean}} cambios
 * @returns {Promise<boolean>} true si el usuario existe.
 */
async function actualizarUsuario(id, cambios) {
  const columnas = [];
  const valores = [];
  if (cambios.rol !== undefined) {
    columnas.push('rol = ?');
    valores.push(cambios.rol);
  }
  if (cambios.activo !== undefined) {
    columnas.push('activo = ?');
    valores.push(cambios.activo ? 1 : 0);
  }
  const [resultado] = await pool.query(`UPDATE usuarios SET ${columnas.join(', ')} WHERE id = ?`, [
    ...valores,
    id,
  ]);
  return resultado.affectedRows > 0;
}

module.exports = {
  crearUsuario,
  obtenerUsuarioPorId,
  obtenerUsuarioPorEmail,
  listarUsuarios,
  actualizarUsuario,
};
