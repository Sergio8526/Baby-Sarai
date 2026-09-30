/**
 * Modelo de productos.
 * Contiene las consultas SQL sobre la tabla productos,
 * unida con categorias para devolver el nombre de la categoría.
 */
const pool = require('../config/db.js');

// Columnas que devuelve cada consulta, traducidas a camelCase
const COLUMNAS = `
  p.id,
  p.nombre,
  p.descripcion,
  p.categoria_id AS categoriaId,
  c.nombre AS categoriaNombre,
  p.talla,
  p.estado,
  p.precio,
  p.stock,
  p.activo,
  p.fecha_creacion AS fechaCreacion,
  p.fecha_actualizacion AS fechaActualizacion
`;

const FROM_JOIN = 'FROM productos p INNER JOIN categorias c ON c.id = p.categoria_id';

/**
 * Lista productos con filtros opcionales.
 * @param {Object} [filtros]
 * @param {number} [filtros.categoriaId] - Solo productos de esa categoría.
 * @param {boolean} [filtros.soloActivos=false] - Solo productos visibles en la tienda.
 * @returns {Promise<Array>}
 */
async function listarProductos({ categoriaId, soloActivos = false } = {}) {
  const condiciones = [];
  const valores = [];

  if (categoriaId) {
    condiciones.push('p.categoria_id = ?');
    valores.push(categoriaId);
  }
  if (soloActivos) {
    condiciones.push('p.activo = 1');
  }

  const where = condiciones.length ? `WHERE ${condiciones.join(' AND ')}` : '';
  const [filas] = await pool.query(
    `SELECT ${COLUMNAS} ${FROM_JOIN} ${where} ORDER BY p.fecha_creacion DESC`,
    valores
  );
  return filas;
}

/**
 * Consulta un producto por id.
 * @param {number} id
 * @returns {Promise<Object|null>}
 */
async function obtenerProductoPorId(id) {
  const [filas] = await pool.query(
    `SELECT ${COLUMNAS} ${FROM_JOIN} WHERE p.id = ?`,
    [id]
  );
  return filas[0] || null;
}

/**
 * Crea un producto.
 * @param {Object} producto - Datos en camelCase.
 * @returns {Promise<number>} Id del producto creado.
 */
async function crearProducto(producto) {
  const { nombre, descripcion, categoriaId, talla, estado, precio, stock, activo } = producto;
  const [resultado] = await pool.query(
    `INSERT INTO productos
      (nombre, descripcion, categoria_id, talla, estado, precio, stock, activo)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
    [nombre, descripcion, categoriaId, talla, estado, precio, stock, activo ? 1 : 0]
  );
  return resultado.insertId;
}

/**
 * Actualiza un producto existente.
 * @param {number} id
 * @param {Object} producto - Datos en camelCase.
 * @returns {Promise<boolean>} true si se actualizó.
 */
async function actualizarProducto(id, producto) {
  const { nombre, descripcion, categoriaId, talla, estado, precio, stock, activo } = producto;
  const [resultado] = await pool.query(
    `UPDATE productos
     SET nombre = ?, descripcion = ?, categoria_id = ?, talla = ?,
         estado = ?, precio = ?, stock = ?, activo = ?
     WHERE id = ?`,
    [nombre, descripcion, categoriaId, talla, estado, precio, stock, activo ? 1 : 0, id]
  );
  return resultado.affectedRows > 0;
}

/**
 * Elimina un producto.
 * @param {number} id
 * @returns {Promise<boolean>} true si se eliminó.
 */
async function eliminarProducto(id) {
  const [resultado] = await pool.query('DELETE FROM productos WHERE id = ?', [id]);
  return resultado.affectedRows > 0;
}

module.exports = {
  listarProductos,
  obtenerProductoPorId,
  crearProducto,
  actualizarProducto,
  eliminarProducto,
};