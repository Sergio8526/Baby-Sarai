/**
 * Servicio de usuarios (solo administración).
 * Recurso de la API: /api/v1/usuarios
 */
import { peticionApi } from './api.js';

/**
 * Lista las cuentas de la tienda.
 * @returns {Promise<Object[]>}
 */
export function listarUsuarios() {
  return peticionApi('/usuarios');
}

/**
 * Cambia el rol o activa/desactiva una cuenta.
 * @param {number} id
 * @param {{rol?: string, activo?: boolean}} cambios
 * @returns {Promise<{mensaje: string, usuario: Object}>}
 */
export function actualizarUsuario(id, cambios) {
  return peticionApi(`/usuarios/${id}`, { metodo: 'PATCH', datos: cambios });
}
