/**
 * Modelo de categorías.
 * Contiene las consultas SQL sobre la tabla categorias.
 */
const pool = require('../config/db.js');

// Columnas que devuelve cada consulta, traducidas a camelCase
const COLUMNAS = `
  id,
  nombre,
  descripcion,
  activo,
  fecha_creacion AS fechaCreacion
`;

/**
 * Lista las categorías, opcionalmente solo las activas.
 * @param {Object} [filtros]
 * @param {boolean} [filtros.soloActivas=false]
 * @returns {Promise<Array>}
 */
async function listarCategorias({ soloActivas = false } = {}) {
  const where = soloActivas ? 'WHERE activo = 1' : '';
  const [filas] = await pool.query(
    `SELECT ${COLUMNAS} FROM categorias ${where} ORDER BY nombre`
  );
  return filas;
}

/**
 * Consulta una categoría por id.
 * @param {number} id
 * @returns {Promise<Object|null>}
 */
async function obtenerCategoriaPorId(id) {
  const [filas] = await pool.query(
    `SELECT ${COLUMNAS} FROM categorias WHERE id = ?`,
    [id]
  );
  return filas[0] || null;
}

/**
 * Crea una categoría.
 * @param {Object} categoria
 * @param {string} categoria.nombre
 * @param {string} [categoria.descripcion]
 * @returns {Promise<number>} Id de la categoría creada.
 */
async function crearCategoria({ nombre, descripcion = null }) {
  const [resultado] = await pool.query(
    'INSERT INTO categorias (nombre, descripcion) VALUES (?, ?)',
    [nombre, descripcion]
  );
  return resultado.insertId;
}

/**
 * Actualiza una categoría existente.
 * @param {number} id
 * @param {Object} categoria
 * @returns {Promise<boolean>} true si se actualizó.
 */
async function actualizarCategoria(id, { nombre, descripcion = null, activo = true }) {
  const [resultado] = await pool.query(
    'UPDATE categorias SET nombre = ?, descripcion = ?, activo = ? WHERE id = ?',
    [nombre, descripcion, activo ? 1 : 0, id]
  );
  return resultado.affectedRows > 0;
}

/**
 * Elimina una categoría.
 * La base de datos impide borrarla si tiene productos asociados (ON DELETE RESTRICT).
 * @param {number} id
 * @returns {Promise<boolean>} true si se eliminó.
 */
async function eliminarCategoria(id) {
  const [resultado] = await pool.query('DELETE FROM categorias WHERE id = ?', [id]);
  return resultado.affectedRows > 0;
}

module.exports = {
  listarCategorias,
  obtenerCategoriaPorId,
  crearCategoria,
  actualizarCategoria,
  eliminarCategoria,
};