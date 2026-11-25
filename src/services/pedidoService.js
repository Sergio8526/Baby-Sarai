/**
 * Servicio de pedidos: reglas de negocio de las compras.
 *
 * Crear o cancelar un pedido toca varias tablas a la vez (pedidos, detalle_pedidos
 * y productos). Por eso se hace dentro de una TRANSACCIÓN: si algo falla a la mitad
 * (por ejemplo, no hay stock del tercer producto), se deshace todo con ROLLBACK
 * y la base de datos queda exactamente como estaba.
 */
const pool = require('../config/db.js');
const pedidoModel = require('../models/pedidoModel.js');
const AppError = require('../utils/AppError.js');
const { envio } = require('../config/env.js');

// Estados a los que puede pasar un pedido desde cada estado
const TRANSICIONES = {
  pendiente: ['pagado', 'cancelado'],
  pagado: ['enviado', 'cancelado'],
  enviado: ['entregado'],
  entregado: [],
  cancelado: [],
};

/**
 * Redondea un valor de dinero a 2 decimales.
 * @param {number} valor
 * @returns {number}
 */
function redondear(valor) {
  return Math.round(valor * 100) / 100;
}

/**
 * Ejecuta una función dentro de una transacción.
 * @template T
 * @param {(conexion: import('mysql2/promise').PoolConnection) => Promise<T>} trabajo
 * @returns {Promise<T>}
 */
async function enTransaccion(trabajo) {
  const conexion = await pool.getConnection();
  try {
    await conexion.beginTransaction();
    const resultado = await trabajo(conexion);
    await conexion.commit();
    return resultado;
  } catch (error) {
    await conexion.rollback();
    throw error;
  } finally {
    conexion.release(); // la conexión vuelve al pool
  }
}

/**
 * Calcula el costo de envío según el subtotal.
 * @param {number} subtotal
 * @returns {number}
 */
function calcularEnvio(subtotal) {
  return subtotal >= envio.gratisDesde ? 0 : envio.costo;
}

/**
 * Crea un pedido: revisa el stock, guarda el pedido con su detalle y descuenta el inventario.
 * Los precios se toman de la base de datos, NUNCA de lo que envía el cliente.
 * @param {number} usuarioId
 * @param {ReturnType<import('../validators/pedidoValidator.js').validarPedido>} datos
 * @returns {Promise<number>} Id del pedido creado.
 */
async function crearPedido(usuarioId, datos) {
  return enTransaccion(async (conexion) => {
    const ids = datos.items.map((i) => i.productoId);
    const productos = await pedidoModel.bloquearProductos(conexion, ids);
    const porId = new Map(productos.map((p) => [p.id, p]));

    // 1. Revisar cada producto antes de tocar nada
    const problemas = [];
    for (const { productoId, cantidad } of datos.items) {
      const producto = porId.get(productoId);
      if (!producto || !producto.activo) {
        problemas.push(`El producto ${productoId} no existe o no está disponible`);
      } else if (producto.stock < cantidad) {
        problemas.push(
          `"${producto.nombre}": pediste ${cantidad} y solo hay ${producto.stock} disponible(s)`
        );
      }
    }
    if (problemas.length) {
      throw new AppError('No se pudo crear el pedido', 409, problemas);
    }

    // 2. Calcular las líneas y los totales con los precios actuales
    const lineas = datos.items.map(({ productoId, cantidad }) => {
      const producto = porId.get(productoId);
      return {
        productoId,
        nombreProducto: producto.nombre,
        talla: producto.talla,
        cantidad,
        precioUnitario: producto.precio,
        subtotal: redondear(producto.precio * cantidad),
      };
    });
    const subtotal = redondear(lineas.reduce((suma, l) => suma + l.subtotal, 0));
    const costoEnvio = calcularEnvio(subtotal);

    // 3. Guardar el pedido, su detalle y descontar el stock
    const pedidoId = await pedidoModel.insertarPedido(conexion, {
      usuarioId,
      subtotal,
      costoEnvio,
      total: redondear(subtotal + costoEnvio),
      direccionEnvio: datos.direccionEnvio,
      ciudad: datos.ciudad,
      telefono: datos.telefono,
      notas: datos.notas,
    });
    await pedidoModel.insertarDetalle(conexion, pedidoId, lineas);
    for (const linea of lineas) {
      await pedidoModel.moverStock(conexion, linea.productoId, -linea.cantidad);
    }
    return pedidoId;
  });
}

/**
 * Cambia el estado de un pedido respetando el flujo permitido.
 * Si el nuevo estado es "cancelado", las unidades vuelven al inventario.
 * @param {number} pedidoId
 * @param {string} nuevoEstado
 * @param {{id: number, rol: string}} usuario - Quién hace el cambio.
 */
async function cambiarEstado(pedidoId, nuevoEstado, usuario) {
  await enTransaccion(async (conexion) => {
    const pedido = await pedidoModel.bloquearPedido(conexion, pedidoId);

    // Un cliente no puede saber si existen pedidos de otras personas: para él es "no encontrado"
    if (!pedido || (usuario.rol !== 'admin' && pedido.usuarioId !== usuario.id)) {
      throw new AppError('Pedido no encontrado', 404);
    }

    // El cliente solo puede cancelar, y solo mientras el pedido esté pendiente
    if (
      usuario.rol !== 'admin' &&
      !(nuevoEstado === 'cancelado' && pedido.estado === 'pendiente')
    ) {
      throw new AppError('Solo puedes cancelar pedidos que estén pendientes', 409);
    }

    if (!TRANSICIONES[pedido.estado].includes(nuevoEstado)) {
      throw new AppError(`Un pedido "${pedido.estado}" no puede pasar a "${nuevoEstado}"`, 409, [
        `Estados permitidos desde "${pedido.estado}": ${TRANSICIONES[pedido.estado].join(', ') || 'ninguno'}`,
      ]);
    }

    if (nuevoEstado === 'cancelado') {
      await pedidoModel.devolverStock(conexion, pedidoId);
    }
    await pedidoModel.cambiarEstado(conexion, pedidoId, nuevoEstado);
  });
}

module.exports = { crearPedido, cambiarEstado, calcularEnvio, TRANSICIONES };
