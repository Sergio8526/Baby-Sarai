/**
 * Cliente HTTP del front-end.
 * Todas las peticiones a la API de Baby Saraí (Node.js + Express + MySQL)
 * pasan por aquí, para manejar la URL base, el formato JSON y los errores
 * en un solo lugar.
 */

/** URL base de la API. Por defecto /api, que Vite reenvía a localhost:3000. */
const URL_BASE = import.meta.env.VITE_API_URL || '/api';

/**
 * Error que devuelve la API (validación, registro no encontrado, etc.).
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
 * Hace una petición a la API y devuelve el cuerpo de la respuesta en JSON.
 * @param {string} ruta - Ruta relativa, por ejemplo "/productos".
 * @param {Object} [opciones]
 * @param {string} [opciones.metodo='GET'] - Método HTTP.
 * @param {Object} [opciones.datos] - Cuerpo de la petición (se envía como JSON).
 * @returns {Promise<any>} Respuesta de la API.
 * @throws {ErrorApi} Si la API responde con error o no hay conexión.
 */
export async function peticionApi(ruta, { metodo = 'GET', datos } = {}) {
  let respuesta;

  try {
    respuesta = await fetch(`${URL_BASE}${ruta}`, {
      method: metodo,
      headers: datos ? { 'Content-Type': 'application/json' } : undefined,
      body: datos ? JSON.stringify(datos) : undefined,
    });
  } catch {
    // fetch solo falla aquí cuando no hay conexión con el servidor
    throw new ErrorApi(
      'No se pudo conectar con el servidor. Verifica que la API esté encendida.',
      0
    );
  }

  // Algunas respuestas de error pueden no traer JSON; en ese caso se usa un objeto vacío
  const cuerpo = await respuesta.json().catch(() => ({}));

  // 502, 503 y 504 sin mensaje propio: el proxy de Vite no encontró el back-end encendido
  if ([502, 503, 504].includes(respuesta.status) && !cuerpo.mensaje) {
    throw new ErrorApi(
      'No se pudo conectar con el servidor. Verifica que la API esté encendida.',
      respuesta.status
    );
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
