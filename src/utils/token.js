/**
 * Creación y verificación de tokens JWT (JSON Web Token).
 *
 * Un JWT tiene tres partes separadas por puntos: encabezado.contenido.firma
 * El contenido NO está cifrado (cualquiera puede leerlo), pero la firma garantiza
 * que nadie lo modificó: solo el servidor conoce el secreto (JWT_SECRETO).
 * Por eso en el token nunca se guarda información sensible como la contraseña.
 */
const jwt = require('jsonwebtoken');
const { jwt: configJwt } = require('../config/env.js');

/**
 * Genera el token de un usuario que acaba de iniciar sesión.
 * @param {{id: number, rol: string}} usuario
 * @returns {string} Token firmado.
 */
function generarToken(usuario) {
  return jwt.sign(
    { sub: String(usuario.id), rol: usuario.rol }, // "sub" (subject) = a quién pertenece
    configJwt.secreto,
    { expiresIn: configJwt.expira }
  );
}

/**
 * Verifica la firma y la fecha de vencimiento de un token.
 * @param {string} token
 * @returns {{sub: string, rol: string, iat: number, exp: number}} Contenido del token.
 * @throws {jwt.JsonWebTokenError|jwt.TokenExpiredError} Si es inválido o venció.
 */
function verificarToken(token) {
  return jwt.verify(token, configJwt.secreto);
}

module.exports = { generarToken, verificarToken, duracion: configJwt.expira };
