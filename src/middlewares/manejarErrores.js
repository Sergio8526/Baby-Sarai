/**
 * Middleware centralizado de errores.
 * Todos los errores de la aplicación terminan aquí y se convierten
 * en una respuesta JSON con el código HTTP adecuado.
 */
const AppError = require('../utils/AppError.js');

// Errores de MySQL que ya sabemos interpretar
const ERRORES_MYSQL = {
  ER_DUP_ENTRY: { estado: 409, mensaje: 'Ya existe un registro con ese nombre' },
  ER_ROW_IS_REFERENCED_2: { estado: 409, mensaje: 'No se puede eliminar porque tiene productos asociados' },
  ER_NO_REFERENCED_ROW_2: { estado: 400, mensaje: 'La categoría seleccionada no existe' },
  ER_CHECK_CONSTRAINT_VIOLATED: { estado: 400, mensaje: 'El precio y el stock no pueden ser negativos' },
};

/**
 * Responde 404 cuando se pide una ruta de la API que no existe.
 */
function rutaNoEncontrada(req, res) {
  res.status(404).json({ mensaje: `No existe la ruta ${req.method} ${req.originalUrl}` });
}

/**
 * Convierte cualquier error en una respuesta JSON.
 */
// eslint-disable-next-line no-unused-vars
function manejarErrores(error, req, res, next) {
  // Errores propios (validación, no encontrado, etc.)
  if (error instanceof AppError) {
    return res.status(error.estado).json({ mensaje: error.message, detalles: error.detalles });
  }

  // JSON mal formado en el cuerpo de la petición
  if (error.type === 'entity.parse.failed') {
    return res.status(400).json({ mensaje: 'El cuerpo de la petición no es un JSON válido' });
  }

  // Errores conocidos de MySQL
  const errorMysql = ERRORES_MYSQL[error.code];
  if (errorMysql) {
    return res.status(errorMysql.estado).json({ mensaje: errorMysql.mensaje });
  }

  // Cualquier otro error: se registra en consola y no se muestran detalles técnicos al usuario
  console.error(error);
  return res.status(500).json({ mensaje: 'Error interno del servidor' });
}

module.exports = { rutaNoEncontrada, manejarErrores };