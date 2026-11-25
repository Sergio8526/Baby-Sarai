/**
 * Controlador de autenticación: registro, inicio de sesión y perfil.
 */
const bcrypt = require('bcryptjs');
const usuarioModel = require('../models/usuarioModel.js');
const { validarRegistro, validarLogin } = require('../validators/usuarioValidator.js');
const { generarToken, duracion } = require('../utils/token.js');
const { rondasBcrypt } = require('../config/env.js');
const AppError = require('../utils/AppError.js');

// Hash de una contraseña cualquiera. Si el correo no existe, se compara contra este
// hash para que la respuesta tarde lo mismo: así nadie puede averiguar, midiendo
// el tiempo, qué correos están registrados.
const HASH_DE_RELLENO = bcrypt.hashSync('contrasena-de-relleno-1', rondasBcrypt);

/**
 * POST /api/v1/auth/registro
 * Crea una cuenta de CLIENTE. Las cuentas de administración se crean con
 * el script "npm run crear-admin", nunca desde la API pública.
 */
async function registrar(req, res) {
  const datos = validarRegistro(req.body);
  const contrasenaHash = await bcrypt.hash(datos.contrasena, rondasBcrypt);
  // Si el correo ya existe, MySQL lanza ER_DUP_ENTRY y manejarErrores responde 409
  const id = await usuarioModel.crearUsuario({ ...datos, contrasenaHash, rol: 'cliente' });
  const usuario = await usuarioModel.obtenerUsuarioPorId(id);
  res.status(201).json({ mensaje: 'Cuenta creada. Ya puedes iniciar sesión', usuario });
}

/**
 * POST /api/v1/auth/login
 * Devuelve un token JWT si el correo y la contraseña son correctos.
 */
async function iniciarSesion(req, res) {
  const { email, contrasena } = validarLogin(req.body);
  const usuario = await usuarioModel.obtenerUsuarioPorEmail(email);

  const coincide = await bcrypt.compare(contrasena, usuario?.contrasenaHash ?? HASH_DE_RELLENO);

  // Mismo mensaje si el correo no existe o la contraseña está mal:
  // no se le dice a un atacante cuál de los dos acertó.
  if (!usuario || !coincide) {
    throw new AppError('Correo o contraseña incorrectos', 401);
  }
  if (!usuario.activo) {
    throw new AppError('Tu cuenta está desactivada. Comunícate con la tienda', 403);
  }

  const { contrasenaHash: _hash, ...datosPublicos } = usuario;
  res.json({
    mensaje: `Bienvenido(a), ${usuario.nombre}`,
    token: generarToken(usuario),
    tipo: 'Bearer',
    expiraEn: duracion,
    usuario: datosPublicos,
  });
}

/**
 * GET /api/v1/auth/perfil  (requiere token)
 * Devuelve los datos del usuario dueño del token.
 */
function perfil(req, res) {
  res.json(req.usuario);
}

module.exports = { registrar, iniciarSesion, perfil };
