/**
 * Cliente HTTP del front-end.
 * Todas las peticiones a la API de Baby Saraí (Node.js + Express + MySQL)
 * pasan por aquí, para manejar en un solo lugar:
 *   - la URL base con la versión de la API (/api/v1),
 *   - el formato JSON,
 *   - el token de sesión (encabezado Authorization: Bearer <token>),
 *   - los errores.
 */

/** URL base de la API. Por defecto /api/v1 (en desarrollo, Vite la reenvía a localhost:3000). */
const URL_BASE = import.meta.env.VITE_API_URL || '/api/v1';

/** Clave donde se guarda el token en el navegador. */
const CLAVE_TOKEN = 'babysarai-token';

/** Evento que avisa a la aplicación que la sesión ya no sirve (token vencido o cuenta desactivada). */
export const EVENTO_SESION_EXPIRADA = 'babysarai:sesion-expirada';

/** Mensaje cuando no hay conexión con el servidor. */
const SIN_CONEXION = 'No se pudo conectar con el servidor. Verifica que la API esté encendida.';

/**
 * Error que devuelve la API (validación, registro no encontrado, sin permiso, etc.).
 * Guarda el código HTTP y la lista de detalles que envía el back-end.
 */
export class ErrorApi extends Error {
  /**
   * @param {string} mensaje - Mensaje para mostrar al usuario.
   * @param {number} estado - Código HTTP (0 si no hubo conexión).
   * @param {string[]} [detalles=[]] - Errores específicos de validación.
   */
  constructor(mensaje, estado, detalles = []) {
    super(mensaje);
    this.name = 'ErrorApi';
    this.estado = estado;
    this.detalles = detalles;
  }
}

/**
 * Token guardado. Se lee de localStorage para que la sesión sobreviva a una recarga.
 * @returns {string|null}
 */
export function leerToken() {
  try {
    return localStorage.getItem(CLAVE_TOKEN);
  } catch {
    return null;
  }
}

/**
 * Guarda o borra el token.
 * @param {string|null} token - null para cerrar la sesión.
 */
export function guardarToken(token) {
  try {
    if (token) localStorage.setItem(CLAVE_TOKEN, token);
    else localStorage.removeItem(CLAVE_TOKEN);
  } catch {
    // Si el navegador bloquea localStorage, la sesión dura solo mientras la pestaña esté abierta
  }
}

/**
 * Hace una petición a la API y devuelve el cuerpo de la respuesta en JSON.
 * Si hay un token guardado, lo envía en el encabezado Authorization.
 * @param {string} ruta - Ruta relativa, por ejemplo "/productos".
 * @param {Object} [opciones]
 * @param {string} [opciones.metodo='GET'] - Método HTTP.
 * @param {Object} [opciones.datos] - Cuerpo de la petición (se envía como JSON).
 * @returns {Promise<any>} Respuesta de la API.
 * @throws {ErrorApi} Si la API responde con error o no hay conexión.
 */
export async function peticionApi(ruta, { metodo = 'GET', datos } = {}) {
  const token = leerToken();
  const encabezados = {};
  if (datos) encabezados['Content-Type'] = 'application/json';
  if (token) encabezados.Authorization = `Bearer ${token}`;

  let respuesta;
  try {
    respuesta = await fetch(`${URL_BASE}${ruta}`, {
      method: metodo,
      headers: encabezados,
      body: datos ? JSON.stringify(datos) : undefined,
    });
  } catch {
    // fetch solo falla aquí cuando no hay conexión con el servidor
    throw new ErrorApi(SIN_CONEXION, 0);
  }

  // Algunas respuestas de error pueden no traer JSON; en ese caso se usa un objeto vacío
  const cuerpo = await respuesta.json().catch(() => ({}));

  // 502, 503 y 504 sin mensaje propio: el proxy de Vite no encontró el back-end encendido
  if ([502, 503, 504].includes(respuesta.status) && !cuerpo.mensaje) {
    throw new ErrorApi(SIN_CONEXION, respuesta.status);
  }

  // Se envió un token y la API lo rechazó: la sesión venció o la cuenta fue desactivada
  if (respuesta.status === 401 && token) {
    guardarToken(null);
    window.dispatchEvent(new CustomEvent(EVENTO_SESION_EXPIRADA, { detail: cuerpo.mensaje }));
  }

  if (!respuesta.ok) {
    throw new ErrorApi(
      cuerpo.mensaje || `Error ${respuesta.status} al consultar la API`,
      respuesta.status,
      cuerpo.detalles || []
    );
  }

  return cuerpo;
}
