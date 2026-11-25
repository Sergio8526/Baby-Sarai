/**
 * Modelo de pedidos.
 * Contiene las consultas SQL sobre las tablas pedidos y detalle_pedidos.
 *
 * Las funciones que escriben reciben una "conexion" como primer parámetro:
 * así el servicio de pedidos puede ejecutarlas todas dentro de la MISMA
 * transacción (o todo se guarda, o nada se guarda).
 */
const pool = require('../config/db.js');

const COLUMNAS_PEDIDO = `
  p.id,
  p.usuario_id AS usuarioId,
  u.nombre AS clienteNombre,
  u.email AS clienteEmail,
  p.estado,
  p.subtotal,
  p.costo_envio AS costoEnvio,
  p.total,
  p.direccion_envio AS direccionEnvio,
  p.ciudad,
  p.telefono,
  p.notas,
  p.fecha_creacion AS fechaCreacion,
  p.fecha_actualizacion AS fechaActualizacion
`;

const FROM_JOIN = 'FROM pedidos p INNER JOIN usuarios u ON u.id = p.usuario_id';

/**
 * Consulta los productos de un pedido y los BLOQUEA hasta que termine la transacción
 * (FOR UPDATE). Así dos clientes no pueden comprar al mismo tiempo la última unidad.
 * @param {import('mysql2/promise').PoolConnection} conexion
 * @param {number[]} ids
 * @returns {Promise<Array>}
 */
async function bloquearProductos(conexion, ids) {
  const [filas] = await conexion.query(
    `SELECT id, nombre, talla, precio, stock, activo
     FROM productos WHERE id IN (?) ORDER BY id FOR UPDATE`,
    [ids]
  );
  return filas;
}

/**
 * Inserta el encabezado del pedido.
 * @returns {Promise<number>} Id del pedido.
 */
async function insertarPedido(conexion, pedido) {
  const [resultado] = await conexion.query(
    `INSERT INTO pedidos
      (usuario_id, subtotal, costo_envio, total, direccion_envio, ciudad, telefono, notas)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
    [
      pedido.usuarioId,
      pedido.subtotal,
      pedido.costoEnvio,
      pedido.total,
      pedido.direccionEnvio,
      pedido.ciudad,
      pedido.telefono,
      pedido.notas,
    ]
  );
  return resultado.insertId;
}

/**
 * Inserta todas las líneas del detalle en una sola consulta.
 */
async function insertarDetalle(conexion, pedidoId, lineas) {
  const filas = lineas.map((l) => [
    pedidoId,
    l.productoId,
    l.nombreProducto,
    l.talla,
    l.cantidad,
    l.precioUnitario,
    l.subtotal,
  ]);
  await conexion.query(
    `INSERT INTO detalle_pedidos
      (pedido_id, producto_id, nombre_producto, talla, cantidad, precio_unitario, subtotal)
     VALUES ?`,
    [filas]
  );
}

/**
 * Suma (o resta, con cantidad negativa) unidades al stock de un producto.
 */
async function moverStock(conexion, productoId, cantidad) {
  await conexion.query('UPDATE productos SET stock = stock + ? WHERE id = ?', [
    cantidad,
    productoId,
  ]);
}

/**
 * Devuelve al inventario todas las unidades de un pedido (al cancelarlo).
 */
async function devolverStock(conexion, pedidoId) {
  await conexion.query(
    `UPDATE productos pr
     INNER JOIN detalle_pedidos d ON d.producto_id = pr.id
     SET pr.stock = pr.stock + d.cantidad
     WHERE d.pedido_id = ?`,
    [pedidoId]
  );
}

/**
 * Consulta el estado de un pedido bloqueándolo para cambiarlo.
 * @returns {Promise<{id: number, usuarioId: number, estado: string}|null>}
 */
async function bloquearPedido(conexion, id) {
  const [filas] = await conexion.query(
    'SELECT id, usuario_id AS usuarioId, estado FROM pedidos WHERE id = ? FOR UPDATE',
    [id]
  );
  return filas[0] || null;
}

/**
 * Cambia el estado de un pedido.
 */
async function cambiarEstado(conexion, id, estado) {
  await conexion.query('UPDATE pedidos SET estado = ? WHERE id = ?', [estado, id]);
}

/**
 * Lista pedidos (sin el detalle) con filtros opcionales.
 * @param {{usuarioId?: number, estado?: string}} [filtros]
 * @returns {Promise<Array>}
 */
async function listarPedidos({ usuarioId, estado } = {}) {
  const condiciones = [];
  const valores = [];
  if (usuarioId) {
    condiciones.push('p.usuario_id = ?');
    valores.push(usuarioId);
  }
  if (estado) {
    condiciones.push('p.estado = ?');
    valores.push(estado);
  }
  const where = condiciones.length ? `WHERE ${condiciones.join(' AND ')}` : '';
  const [filas] = await pool.query(
    `SELECT ${COLUMNAS_PEDIDO},
       (SELECT COALESCE(SUM(d.cantidad), 0) FROM detalle_pedidos d WHERE d.pedido_id = p.id) AS unidades
     ${FROM_JOIN} ${where}
     ORDER BY p.fecha_creacion DESC, p.id DESC`,
    valores
  );
  return filas.map((f) => ({ ...f, unidades: Number(f.unidades) }));
}

/**
 * Consulta un pedido con su detalle.
 * @param {number} id
 * @returns {Promise<Object|null>}
 */
async function obtenerPedidoPorId(id) {
  const [filas] = await pool.query(`SELECT ${COLUMNAS_PEDIDO} ${FROM_JOIN} WHERE p.id = ?`, [id]);
  if (!filas[0]) return null;
  const [items] = await pool.query(
    `SELECT producto_id AS productoId, nombre_producto AS nombreProducto, talla,
            cantidad, precio_unitario AS precioUnitario, subtotal
     FROM detalle_pedidos WHERE pedido_id = ? ORDER BY id`,
    [id]
  );
  const unidades = items.reduce((suma, i) => suma + i.cantidad, 0);
  return { ...filas[0], unidades, items };
}

module.exports = {
  bloquearProductos,
  insertarPedido,
  insertarDetalle,
  moverStock,
  devolverStock,
  bloquearPedido,
  cambiarEstado,
  listarPedidos,
  obtenerPedidoPorId,
};
