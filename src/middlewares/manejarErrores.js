/**
 * Middleware centralizado de errores.
 * Todos los errores de la aplicación terminan aquí y se convierten
 * en una respuesta JSON con el código HTTP adecuado.
 */
const AppError = require('../utils/AppError.js');

// Mensajes según la restricción de la base de datos que falló.
// El nombre de la restricción aparece en el mensaje que devuelve MySQL.
const RESTRICCIONES = [
  {
    nombre: 'fk_detalle_productos',
    estado: 409,
    mensaje: 'No se puede eliminar el producto porque ya tiene pedidos. Desactívalo en su lugar',
  },
  {
    nombre: 'fk_pedidos_usuarios',
    estado: 409,
    mensaje: 'No se puede eliminar el usuario porque tiene pedidos',
  },
  {
    nombre: 'fk_productos_categorias',
    estado: 409,
    mensaje: 'No se puede eliminar porque tiene productos asociados',
  },
  { nombre: 'email', estado: 409, mensaje: 'Ya existe una cuenta con ese correo' },
];

// Errores de MySQL que ya sabemos interpretar (cuando ninguna restricción coincide)
const ERRORES_MYSQL = {
  ER_DUP_ENTRY: { estado: 409, mensaje: 'Ya existe un registro con ese nombre' },
  ER_ROW_IS_REFERENCED_2: {
    estado: 409,
    mensaje: 'No se puede eliminar porque tiene registros asociados',
  },
  ER_NO_REFERENCED_ROW_2: { estado: 400, mensaje: 'La categoría seleccionada no existe' },
  ER_CHECK_CONSTRAINT_VIOLATED: {
    estado: 400,
    mensaje: 'Los valores numéricos no pueden ser negativos',
  },
};

/**
 * Busca el mensaje adecuado para un error de MySQL.
 * @param {Error & {code?: string, sqlMessage?: string}} error
 * @returns {{estado: number, mensaje: string}|undefined}
 */
function interpretarErrorMysql(error) {
  const general = ERRORES_MYSQL[error.code];
  if (!general) return undefined;
  const texto = error.sqlMessage ?? '';
  const especifico = RESTRICCIONES.find(
    (r) =>
      texto.includes(`\`${r.nombre}\``) ||
      texto.includes(`'${r.nombre}'`) ||
      texto.includes(`.${r.nombre}'`)
  );
  return especifico ?? general;
}

/**
 * Responde 404 cuando se pide una ruta de la API que no existe.
 */
function rutaNoEncontrada(req, res) {
  res.status(404).json({ mensaje: `No existe la ruta ${req.method} ${req.originalUrl}` });
}

/**
 * Convierte cualquier error en una respuesta JSON.
 */
function manejarErrores(error, req, res, _next) {
  // Errores propios (validación, no encontrado, sin permiso, etc.)
  if (error instanceof AppError) {
    return res.status(error.estado).json({ mensaje: error.message, detalles: error.detalles });
  }

  // JSON mal formado o demasiado grande en el cuerpo de la petición
  if (error.type === 'entity.parse.failed') {
    return res.status(400).json({ mensaje: 'El cuerpo de la petición no es un JSON válido' });
  }
  if (error.type === 'entity.too.large') {
    return res.status(413).json({ mensaje: 'El cuerpo de la petición es demasiado grande' });
  }

  // Errores conocidos de MySQL
  const errorMysql = interpretarErrorMysql(error);
  if (errorMysql) {
    return res.status(errorMysql.estado).json({ mensaje: errorMysql.mensaje });
  }

  // Cualquier otro error: se registra en consola y no se muestran detalles técnicos al usuario
  console.error(error);
  return res.status(500).json({ mensaje: 'Error interno del servidor' });
}

module.exports = { rutaNoEncontrada, manejarErrores };
