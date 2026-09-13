const pool = require('../config/db.js');

/**
 * Inserta un nuevo producto en la base de datos.
 * @param {Object} producto - Datos del producto a crear.
 * @param {string} producto.nombre - Nombre del producto.
 * @param {string} producto.descripcion - Descripción del producto.
 * @param {number} producto.precio - Precio unitario.
 * @param {string} producto.categoria - Categoría del producto.
 * @param {number} producto.stock - Cantidad disponible en inventario.
 * @returns {Promise<number>} El id del producto recién creado.
 */
async function crearProducto(producto) {
  const { nombre, descripcion, precio, categoria, stock } = producto;
  const [resultado] = await pool.query(
    'INSERT INTO productos (nombre, descripcion, precio, categoria, stock) VALUES (?, ?, ?, ?, ?)',
    [nombre, descripcion, precio, categoria, stock]
  );
  return resultado.insertId;
}

/**
 * Consulta todos los productos registrados.
 * @returns {Promise<Array>} Lista de productos.
 */
async function listarProductos() {
  const [filas] = await pool.query('SELECT * FROM productos ORDER BY fecha_creacion DESC');
  return filas;
}

/**
 * Consulta un producto por su id.
 * @param {number} id - Id del producto.
 * @returns {Promise<Object|null>} El producto encontrado, o null si no existe.
 */
async function obtenerProductoPorId(id) {
  const [filas] = await pool.query('SELECT * FROM productos WHERE id = ?', [id]);
  return filas[0] || null;
}

/**
 * Actualiza los datos de un producto existente.
 * @param {number} id - Id del producto a actualizar.
 * @param {Object} producto - Nuevos datos del producto.
 * @returns {Promise<boolean>} true si se actualizó algún registro.
 */
async function actualizarProducto(id, producto) {
  const { nombre, descripcion, precio, categoria, stock } = producto;
  const [resultado] = await pool.query(
    'UPDATE productos SET nombre = ?, descripcion = ?, precio = ?, categoria = ?, stock = ? WHERE id = ?',
    [nombre, descripcion, precio, categoria, stock, id]
  );
  return resultado.affectedRows > 0;
}

/**
 * Elimina un producto por su id.
 * @param {number} id - Id del producto a eliminar.
 * @returns {Promise<boolean>} true si se eliminó algún registro.
 */
async function eliminarProducto(id) {
  const [resultado] = await pool.query('DELETE FROM productos WHERE id = ?', [id]);
  return resultado.affectedRows > 0;
}

module.exports = {
  crearProducto,
  listarProductos,
  obtenerProductoPorId,
  actualizarProducto,
  eliminarProducto,
};