/**
 * Funciones de validación reutilizables.
 */
const AppError = require('../utils/AppError.js');

/**
 * Valida que un id de la URL sea un entero positivo.
 * @param {string} valor - Valor recibido en req.params.
 * @returns {number} El id convertido a número.
 */
function validarId(valor) {
  const id = Number(valor);
  if (!Number.isInteger(id) || id <= 0) {
    throw new AppError('El id debe ser un número entero positivo', 400);
  }
  return id;
}

/**
 * Limpia un texto opcional y valida su longitud máxima.
 * @param {*} valor - Valor recibido.
 * @param {number} maximo - Longitud máxima permitida.
 * @param {string} campo - Nombre del campo, para el mensaje de error.
 * @param {string[]} errores - Lista donde se agregan los errores encontrados.
 * @returns {string|null} El texto limpio, o null si viene vacío.
 */
function textoOpcional(valor, maximo, campo, errores) {
  if (valor === undefined || valor === null) return null;
  const texto = String(valor).trim();
  if (texto.length > maximo) {
    errores.push(`${campo} no puede superar ${maximo} caracteres`);
  }
  return texto || null;
}

module.exports = { validarId, textoOpcional };