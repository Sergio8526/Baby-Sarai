/**
 * Servicio de productos.
 * Reúne las llamadas al recurso /api/productos del back-end.
 */
import { peticionApi } from './api.js';

const RUTA = '/productos';

/**
 * Lista todos los productos (incluidos los ocultos). Uso: panel de administración.
 * @returns {Promise<Object[]>}
 */
export function listarProductos() {
  return peticionApi(RUTA);
}

/**
 * Lista solo los productos visibles. Uso: tienda.
 * @returns {Promise<Object[]>}
 */
export function listarProductosActivos() {
  return peticionApi(`${RUTA}?soloActivos=true`);
}

/**
 * Consulta un producto por su id.
 * @param {number|string} id
 * @returns {Promise<Object>}
 */
export function obtenerProducto(id) {
  return peticionApi(`${RUTA}/${id}`);
}

/**
 * Crea un producto.
 * @param {Object} datos - Campos del formulario.
 * @returns {Promise<{mensaje: string, producto: Object}>}
 */
export function crearProducto(datos) {
  return peticionApi(RUTA, { metodo: 'POST', datos });
}

/**
 * Actualiza un producto existente.
 * @param {number} id
 * @param {Object} datos
 * @returns {Promise<{mensaje: string, producto: Object}>}
 */
export function actualizarProducto(id, datos) {
  return peticionApi(`${RUTA}/${id}`, { metodo: 'PUT', datos });
}

/**
 * Elimina un producto.
 * @param {number} id
 * @returns {Promise<{mensaje: string}>}
 */
export function eliminarProducto(id) {
  return peticionApi(`${RUTA}/${id}`, { metodo: 'DELETE' });
}
