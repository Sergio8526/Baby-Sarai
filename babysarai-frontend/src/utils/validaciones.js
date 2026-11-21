/**
 * Validaciones de los formularios del panel.
 * Repiten las reglas del back-end para avisar al usuario antes de enviar.
 * El back-end vuelve a validar siempre, porque el front-end se puede saltar.
 */
import { LIMITES } from './constantes.js';

/**
 * Valida los datos del formulario de producto.
 * @param {Object} datos
 * @returns {Object} Errores por campo. Si está vacío, los datos son válidos.
 */
export function validarProducto(datos) {
  const errores = {};
  const nombre = datos.nombre.trim();

  if (!nombre) {
    errores.nombre = 'El nombre es obligatorio';
  } else if (nombre.length > LIMITES.nombreProducto) {
    errores.nombre = `Máximo ${LIMITES.nombreProducto} caracteres`;
  }

  if (!datos.categoriaId) {
    errores.categoriaId = 'Selecciona una categoría';
  }

  const precio = Number(datos.precio);
  if (datos.precio === '' || Number.isNaN(precio) || precio < 0) {
    errores.precio = 'Escribe un precio mayor o igual a 0';
  }

  const stock = Number(datos.stock);
  if (datos.stock === '' || !Number.isInteger(stock) || stock < 0) {
    errores.stock = 'El stock debe ser un número entero mayor o igual a 0';
  }

  if (datos.talla.trim().length > LIMITES.talla) {
    errores.talla = `Máximo ${LIMITES.talla} caracteres`;
  }

  if (datos.descripcion.trim().length > LIMITES.descripcion) {
    errores.descripcion = `Máximo ${LIMITES.descripcion} caracteres`;
  }

  return errores;
}

/**
 * Valida los datos del formulario de categoría.
 * @param {Object} datos
 * @returns {Object} Errores por campo.
 */
export function validarCategoria(datos) {
  const errores = {};
  const nombre = datos.nombre.trim();

  if (!nombre) {
    errores.nombre = 'El nombre es obligatorio';
  } else if (nombre.length > LIMITES.nombreCategoria) {
    errores.nombre = `Máximo ${LIMITES.nombreCategoria} caracteres`;
  }

  if (datos.descripcion.trim().length > LIMITES.descripcion) {
    errores.descripcion = `Máximo ${LIMITES.descripcion} caracteres`;
  }

  return errores;
}
