/**
 * Middlewares de seguridad.
 *
 * autenticar: revisa el encabezado "Authorization: Bearer <token>". Si el token es
 *   válido y el usuario sigue activo, guarda sus datos en req.usuario y deja pasar
 *   la petición. Si no, responde 401 y la petición nunca llega al controlador.
 *
 * autorizar(...roles): se usa DESPUÉS de autenticar. Solo deja pasar a los roles
 *   indicados; a los demás les responde 403 (sabemos quién es, pero no tiene permiso).
 */
const { TokenExpiredError } = require('jsonwebtoken');
const { verificarToken } = require('../utils/token.js');
const usuarioModel = require('../models/usuarioModel.js');
const AppError = require('../utils/AppError.js');

/**
 * Exige un token válido.
 */
async function autenticar(req, res, next) {
  const encabezado = req.headers.authorization ?? '';
  const [tipo, token] = encabezado.split(' ');

  if (tipo !== 'Bearer' || !token) {
    throw new AppError(
      'Debes iniciar sesión. Envía el token como: Authorization: Bearer <token>',
      401
    );
  }

  let contenido;
  try {
    contenido = verificarToken(token);
  } catch (error) {
    if (error instanceof TokenExpiredError) {
      throw new AppError('La sesión expiró. Inicia sesión de nuevo', 401);
    }
    throw new AppError('Token inválido', 401);
  }

  // Se consulta el usuario en la base de datos para usar su rol ACTUAL:
  // si la administradora lo desactivó o le cambió el rol, el token viejo deja de servir.
  const usuario = await usuarioModel.obtenerUsuarioPorId(Number(contenido.sub));
  if (!usuario || !usuario.activo) {
    throw new AppError('El usuario no existe o está desactivado', 401);
  }

  req.usuario = usuario;
  next();
}

/**
 * Permite el paso solo a los roles indicados.
 * @param {...string} roles - Por ejemplo: autorizar('admin')
 * @returns {Function} Middleware de Express.
 */
function autorizar(...roles) {
  return (req, res, next) => {
    if (!roles.includes(req.usuario?.rol)) {
      throw new AppError('No tienes permiso para realizar esta acción', 403);
    }
    next();
  };
}

module.exports = { autenticar, autorizar };
