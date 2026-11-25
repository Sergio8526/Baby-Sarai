/**
 * Servicio de autenticación: registro, inicio de sesión y perfil.
 * Recurso de la API: /api/v1/auth
 */
import { peticionApi } from './api.js';

/**
 * Crea una cuenta de cliente.
 * @param {{nombre: string, email: string, contrasena: string, telefono?: string}} datos
 * @returns {Promise<{mensaje: string, usuario: Object}>}
 */
export function registrar(datos) {
  return peticionApi('/auth/registro', { metodo: 'POST', datos });
}

/**
 * Inicia sesión.
 * @param {{email: string, contrasena: string}} credenciales
 * @returns {Promise<{mensaje: string, token: string, usuario: Object}>}
 */
export function iniciarSesion(credenciales) {
  return peticionApi('/auth/login', { metodo: 'POST', datos: credenciales });
}

/**
 * Datos del usuario dueño del token guardado.
 * @returns {Promise<Object>}
 */
export function obtenerPerfil() {
  return peticionApi('/auth/perfil');
}
