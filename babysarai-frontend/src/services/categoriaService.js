/**
 * Servicio de categorías.
 * Reúne las llamadas al recurso /api/v1/categorias del back-end.
 * Consultar es público; crear, actualizar y eliminar exige sesión de administradora.
 */
import { peticionApi } from './api.js';

const RUTA = '/categorias';

/**
 * Lista todas las categorías (activas e inactivas). Uso: panel de administración.
 * @returns {Promise<Object[]>}
 */
export function listarCategorias() {
  return peticionApi(RUTA);
}

/**
 * Lista solo las categorías activas. Uso: tienda.
 * @returns {Promise<Object[]>}
 */
export function listarCategoriasActivas() {
  return peticionApi(`${RUTA}?soloActivas=true`);
}

/**
 * Crea una categoría.
 * @param {Object} datos
 * @returns {Promise<{mensaje: string, categoria: Object}>}
 */
export function crearCategoria(datos) {
  return peticionApi(RUTA, { metodo: 'POST', datos });
}

/**
 * Actualiza una categoría.
 * @param {number} id
 * @param {Object} datos
 * @returns {Promise<{mensaje: string, categoria: Object}>}
 */
export function actualizarCategoria(id, datos) {
  return peticionApi(`${RUTA}/${id}`, { metodo: 'PUT', datos });
}

/**
 * Elimina una categoría. La API responde 409 si todavía tiene productos.
 * @param {number} id
 * @returns {Promise<{mensaje: string}>}
 */
export function eliminarCategoria(id) {
  return peticionApi(`${RUTA}/${id}`, { metodo: 'DELETE' });
}
