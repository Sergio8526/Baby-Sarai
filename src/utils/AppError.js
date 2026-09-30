/**
 * Error de la aplicación con código HTTP.
 * Se lanza cuando el error es "esperado" (datos inválidos, registro no encontrado)
 * y el mensaje se puede mostrar tal cual al usuario.
 */
class AppError extends Error {
  /**
   * @param {string} mensaje - Mensaje para el usuario.
   * @param {number} [estado=400] - Código HTTP de la respuesta.
   * @param {string[]} [detalles=[]] - Lista de errores específicos (por ejemplo, de validación).
   */
  constructor(mensaje, estado = 400, detalles = []) {
    super(mensaje);
    this.estado = estado;
    this.detalles = detalles;
  }
}

module.exports = AppError;