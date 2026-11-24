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

/** Formato básico de correo, igual al de la API (usuarioValidator.js). */
const FORMATO_EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
/** Teléfono: números, espacios, + y guiones, de 7 a 20 caracteres. */
const FORMATO_TELEFONO = /^[0-9+\- ]{7,20}$/;

/**
 * Valida el formulario de inicio de sesión.
 * @param {{email: string, contrasena: string}} datos
 * @returns {Object} Errores por campo.
 */
export function validarLogin(datos) {
  const errores = {};
  if (!datos.email.trim()) errores.email = 'Escribe tu correo';
  if (!datos.contrasena) errores.contrasena = 'Escribe tu contraseña';
  return errores;
}

/**
 * Valida el formulario de registro con las mismas reglas de la API.
 * @param {{nombre: string, email: string, telefono: string, contrasena: string, confirmacion: string}} datos
 * @returns {Object} Errores por campo.
 */
export function validarRegistro(datos) {
  const errores = {};
  const nombre = datos.nombre.trim();
  if (nombre.length < 3 || nombre.length > 100) {
    errores.nombre = 'Escribe tu nombre (3 a 100 caracteres)';
  }
  if (!FORMATO_EMAIL.test(datos.email.trim())) {
    errores.email = 'Escribe un correo válido';
  }
  if (datos.telefono.trim() && !FORMATO_TELEFONO.test(datos.telefono.trim())) {
    errores.telefono = 'Solo números, espacios, + y guiones (7 a 20)';
  }
  if (datos.contrasena.length < 8 || datos.contrasena.length > 72) {
    errores.contrasena = 'Usa entre 8 y 72 caracteres';
  } else if (!/[a-zA-Z]/.test(datos.contrasena) || !/[0-9]/.test(datos.contrasena)) {
    errores.contrasena = 'Incluye al menos una letra y un número';
  }
  if (datos.confirmacion !== datos.contrasena) {
    errores.confirmacion = 'Las contraseñas no coinciden';
  }
  return errores;
}

/**
 * Valida los datos de envío del pedido.
 * @param {{direccionEnvio: string, ciudad: string, telefono: string, notas: string}} datos
 * @returns {Object} Errores por campo.
 */
export function validarEnvio(datos) {
  const errores = {};
  const direccion = datos.direccionEnvio.trim();
  if (!direccion) errores.direccionEnvio = 'Escribe la dirección de entrega';
  else if (direccion.length > 200) errores.direccionEnvio = 'Máximo 200 caracteres';
  if (!datos.ciudad.trim()) errores.ciudad = 'Escribe la ciudad';
  if (!FORMATO_TELEFONO.test(datos.telefono.trim())) {
    errores.telefono = 'Escribe un teléfono de contacto válido';
  }
  if (datos.notas.trim().length > 255) errores.notas = 'Máximo 255 caracteres';
  return errores;
}
