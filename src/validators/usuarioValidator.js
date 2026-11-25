/**
 * Validación de los datos de los usuarios (registro, inicio de sesión y administración).
 */
const AppError = require('../utils/AppError.js');
const { textoOpcional } = require('./comunes.js');

const ROLES_VALIDOS = ['admin', 'cliente'];
// Formato básico de correo: algo@algo.algo, sin espacios
const FORMATO_EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
// Teléfono: solo dígitos, espacios, + y guiones, entre 7 y 20 caracteres
const FORMATO_TELEFONO = /^[0-9+\- ]{7,20}$/;

/**
 * Limpia y valida un correo. Se guarda en minúsculas para que
 * "Sergio@Correo.com" y "sergio@correo.com" sean la misma cuenta.
 */
function limpiarEmail(valor, errores) {
  const email = typeof valor === 'string' ? valor.trim().toLowerCase() : '';
  if (!email) {
    errores.push('El correo es obligatorio');
  } else if (email.length > 120 || !FORMATO_EMAIL.test(email)) {
    errores.push('El correo no tiene un formato válido');
  }
  return email;
}

/**
 * Valida un teléfono opcional.
 */
function limpiarTelefono(valor, errores, obligatorio = false) {
  const telefono = textoOpcional(valor, 20, 'El teléfono', errores);
  if (!telefono) {
    if (obligatorio) errores.push('El teléfono es obligatorio');
    return null;
  }
  if (!FORMATO_TELEFONO.test(telefono)) {
    errores.push('El teléfono solo puede tener números, espacios, + y guiones (7 a 20 caracteres)');
  }
  return telefono;
}

/**
 * Datos para crear una cuenta de cliente.
 * La contraseña debe tener entre 8 y 72 caracteres, con al menos una letra y un número
 * (72 es el máximo que bcrypt tiene en cuenta).
 * @param {Object} datos - Cuerpo de la petición.
 * @returns {{nombre: string, email: string, contrasena: string, telefono: string|null}}
 */
function validarRegistro(datos = {}) {
  const errores = [];

  const nombre = typeof datos.nombre === 'string' ? datos.nombre.trim() : '';
  if (nombre.length < 3 || nombre.length > 100) {
    errores.push('El nombre debe tener entre 3 y 100 caracteres');
  }

  const email = limpiarEmail(datos.email, errores);

  const contrasena = typeof datos.contrasena === 'string' ? datos.contrasena : '';
  if (contrasena.length < 8 || contrasena.length > 72) {
    errores.push('La contraseña debe tener entre 8 y 72 caracteres');
  } else if (!/[a-zA-Z]/.test(contrasena) || !/[0-9]/.test(contrasena)) {
    errores.push('La contraseña debe tener al menos una letra y un número');
  }

  const telefono = limpiarTelefono(datos.telefono, errores);

  if (errores.length) {
    throw new AppError('Datos de registro no válidos', 400, errores);
  }
  return { nombre, email, contrasena, telefono };
}

/**
 * Datos para iniciar sesión. Aquí no se revisan las reglas de la contraseña:
 * solo que vengan los dos campos.
 * @param {Object} datos
 * @returns {{email: string, contrasena: string}}
 */
function validarLogin(datos = {}) {
  const errores = [];
  const email = typeof datos.email === 'string' ? datos.email.trim().toLowerCase() : '';
  const contrasena = typeof datos.contrasena === 'string' ? datos.contrasena : '';
  if (!email) errores.push('El correo es obligatorio');
  if (!contrasena) errores.push('La contraseña es obligatoria');
  if (errores.length) {
    throw new AppError('Datos de inicio de sesión incompletos', 400, errores);
  }
  return { email, contrasena };
}

/**
 * Cambios que la administradora puede hacer a un usuario: rol y/o estado.
 * @param {Object} datos
 * @returns {{rol?: string, activo?: boolean}}
 */
function validarCambioUsuario(datos = {}) {
  const errores = [];
  const cambios = {};

  if (datos.rol !== undefined) {
    if (!ROLES_VALIDOS.includes(datos.rol)) {
      errores.push('El rol debe ser "admin" o "cliente"');
    }
    cambios.rol = datos.rol;
  }
  if (datos.activo !== undefined) {
    if (typeof datos.activo !== 'boolean') {
      errores.push('"activo" debe ser true o false');
    }
    cambios.activo = datos.activo;
  }
  if (!errores.length && Object.keys(cambios).length === 0) {
    errores.push('Envía al menos uno de los campos: rol, activo');
  }

  if (errores.length) {
    throw new AppError('Datos del usuario no válidos', 400, errores);
  }
  return cambios;
}

module.exports = { validarRegistro, validarLogin, validarCambioUsuario, limpiarTelefono };
