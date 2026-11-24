/**
 * Reglas de los pedidos que el front-end necesita para mostrar información.
 * La API vuelve a calcular y validar todo: estas funciones solo sirven para la pantalla.
 */
import { ENVIO, ESTADOS_PEDIDO, TRANSICIONES_PEDIDO } from './constantes.js';

/**
 * Costo de envío estimado según el subtotal del carrito.
 * @param {number} subtotal
 * @returns {number} 0 si el carrito está vacío o si el subtotal llega al envío gratis.
 */
export function calcularEnvio(subtotal) {
  if (subtotal <= 0) return 0;
  return subtotal >= ENVIO.gratisDesde ? 0 : ENVIO.costo;
}

/**
 * Cuánto falta para el envío gratis.
 * @param {number} subtotal
 * @returns {number} 0 si ya lo alcanzó.
 */
export function faltaParaEnvioGratis(subtotal) {
  return Math.max(0, ENVIO.gratisDesde - subtotal);
}

/**
 * Estados a los que puede pasar un pedido (para los botones del panel).
 * @param {string} estado
 * @returns {string[]}
 */
export function siguientesEstados(estado) {
  return TRANSICIONES_PEDIDO[estado] ?? [];
}

/**
 * Texto y tono de la etiqueta de un estado.
 * @param {string} estado
 * @returns {{texto: string, tono: string}}
 */
export function infoEstado(estado) {
  return ESTADOS_PEDIDO[estado] ?? { texto: estado, tono: 'aviso' };
}

/**
 * Convierte los ítems del carrito en el formato que espera POST /api/v1/pedidos.
 * @param {{id: number, cantidad: number}[]} items
 * @returns {{productoId: number, cantidad: number}[]}
 */
export function itemsParaPedido(items) {
  return items.map((item) => ({ productoId: item.id, cantidad: item.cantidad }));
}
