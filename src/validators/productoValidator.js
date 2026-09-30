/**
 * Validación de los datos de un producto.
 */
const AppError = require('../utils/AppError.js');
const { textoOpcional } = require('./comunes.js');

const ESTADOS_VALIDOS = ['nuevo', 'usado'];

/**
 * Valida y limpia los datos recibidos para crear o actualizar un producto.
 * @param {Object} datos - Cuerpo de la petición.
 * @returns {Object} Datos limpios listos para el modelo.
 */
function validarProducto(datos = {}) {
  const errores = [];

  const nombre = typeof datos.nombre === 'string' ? datos.nombre.trim() : '';
  if (!nombre) {
    errores.push('El nombre es obligatorio');
  } else if (nombre.length > 100) {
    errores.push('El nombre no puede superar 100 caracteres');
  }

  const precio = Number(datos.precio);
  if (datos.precio === undefined || datos.precio === '' || Number.isNaN(precio) || precio < 0) {
    errores.push('El precio debe ser un número mayor o igual a 0');
  }

  const categoriaId = Number(datos.categoriaId);
  if (!Number.isInteger(categoriaId) || categoriaId <= 0) {
    errores.push('Debe seleccionar una categoría');
  }

  const stock = datos.stock === undefined || datos.stock === '' ? 0 : Number(datos.stock);
  if (!Number.isInteger(stock) || stock < 0) {
    errores.push('El stock debe ser un número entero mayor o igual a 0');
  }

  const estado = datos.estado || 'nuevo';
  if (!ESTADOS_VALIDOS.includes(estado)) {
    errores.push('El estado debe ser "nuevo" o "usado"');
  }

  const descripcion = textoOpcional(datos.descripcion, 255, 'La descripción', errores);
  const talla = textoOpcional(datos.talla, 20, 'La talla', errores);

  if (errores.length) {
    throw new AppError('Datos del producto no válidos', 400, errores);
  }

  return {
    nombre,
    descripcion,
    categoriaId,
    talla,
    estado,
    precio,
    stock,
    activo: datos.activo === undefined ? true : Boolean(datos.activo),
  };
}

module.exports = { validarProducto };