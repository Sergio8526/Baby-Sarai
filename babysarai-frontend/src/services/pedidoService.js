/**
 * Servicio de pedidos.
 * Recurso de la API: /api/v1/pedidos (todas las rutas exigen sesión).
 */
import { peticionApi } from './api.js';

const RUTA = '/pedidos';

/**
 * Crea un pedido con los productos del carrito.
 * @param {{items: {productoId: number, cantidad: number}[], direccionEnvio: string,
 *   ciudad: string, telefono: string, notas?: string}} datos
 * @returns {Promise<{mensaje: string, pedido: Object}>}
 */
export function crearPedido(datos) {
  return peticionApi(RUTA, { metodo: 'POST', datos });
}

/**
 * Lista pedidos. El cliente recibe solo los suyos; la administradora, todos.
 * @param {{estado?: string}} [filtros]
 * @returns {Promise<Object[]>}
 */
export function listarPedidos({ estado } = {}) {
  return peticionApi(estado ? `${RUTA}?estado=${encodeURIComponent(estado)}` : RUTA);
}

/** Lista solo los pedidos pendientes (resumen del panel). */
export function listarPedidosPendientes() {
  return listarPedidos({ estado: 'pendiente' });
}

/**
 * Consulta un pedido con su detalle.
 * @param {number|string} id
 * @returns {Promise<Object>}
 */
export function obtenerPedido(id) {
  return peticionApi(`${RUTA}/${id}`);
}

/**
 * El cliente cancela su pedido pendiente; las unidades vuelven al inventario.
 * @param {number} id
 * @returns {Promise<{mensaje: string, pedido: Object}>}
 */
export function cancelarPedido(id) {
  return peticionApi(`${RUTA}/${id}/cancelar`, { metodo: 'PATCH' });
}

/**
 * La administradora cambia el estado de un pedido.
 * @param {number} id
 * @param {string} estado
 * @returns {Promise<{mensaje: string, pedido: Object}>}
 */
export function cambiarEstadoPedido(id, estado) {
  return peticionApi(`${RUTA}/${id}/estado`, { metodo: 'PATCH', datos: { estado } });
}
