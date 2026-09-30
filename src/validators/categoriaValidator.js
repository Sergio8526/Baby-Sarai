/**
 * Validación de los datos de una categoría.
 */
const AppError = require('../utils/AppError.js');
const { textoOpcional } = require('./comunes.js');

/**
 * Valida y limpia los datos recibidos para crear o actualizar una categoría.
 * @param {Object} datos - Cuerpo de la petición.
 * @returns {Object} Datos limpios listos para el modelo.
 */
function validarCategoria(datos = {}) {
  const errores = [];

  const nombre = typeof datos.nombre === 'string' ? datos.nombre.trim() : '';
  if (!nombre) {
    errores.push('El nombre es obligatorio');
  } else if (nombre.length > 60) {
    errores.push('El nombre no puede superar 60 caracteres');
  }

  const descripcion = textoOpcional(datos.descripcion, 255, 'La descripción', errores);

  if (errores.length) {
    throw new AppError('Datos de la categoría no válidos', 400, errores);
  }

  return {
    nombre,
    descripcion,
    activo: datos.activo === undefined ? true : Boolean(datos.activo),
  };
}

module.exports = { validarCategoria };