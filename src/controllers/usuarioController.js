/**
 * Controlador de usuarios (solo administración).
 */
const usuarioModel = require('../models/usuarioModel.js');
const { validarCambioUsuario } = require('../validators/usuarioValidator.js');
const { validarId } = require('../validators/comunes.js');
const AppError = require('../utils/AppError.js');

/**
 * GET /api/v1/usuarios
 * Filtro opcional: ?rol=cliente | ?rol=admin
 */
async function listar(req, res) {
  const { rol } = req.query;
  if (rol !== undefined && !['admin', 'cliente'].includes(rol)) {
    throw new AppError('El filtro rol debe ser "admin" o "cliente"', 400);
  }
  res.json(await usuarioModel.listarUsuarios({ rol }));
}

/**
 * GET /api/v1/usuarios/:id
 */
async function obtener(req, res) {
  const usuario = await usuarioModel.obtenerUsuarioPorId(validarId(req.params.id));
  if (!usuario) {
    throw new AppError('Usuario no encontrado', 404);
  }
  res.json(usuario);
}

/**
 * PATCH /api/v1/usuarios/:id
 * Cambia el rol y/o activa o desactiva una cuenta.
 */
async function actualizar(req, res) {
  const id = validarId(req.params.id);
  const cambios = validarCambioUsuario(req.body);

  // Evita que la administradora se quite a sí misma el acceso por error
  if (id === req.usuario.id && (cambios.rol === 'cliente' || cambios.activo === false)) {
    throw new AppError(
      'No puedes quitarte el rol de administrador ni desactivar tu propia cuenta',
      409
    );
  }

  const actualizado = await usuarioModel.actualizarUsuario(id, cambios);
  if (!actualizado) {
    throw new AppError('Usuario no encontrado', 404);
  }
  const usuario = await usuarioModel.obtenerUsuarioPorId(id);
  res.json({ mensaje: 'Usuario actualizado', usuario });
}

module.exports = { listar, obtener, actualizar };
