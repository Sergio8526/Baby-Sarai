/**
 * Controlador de pedidos.
 * Los clientes crean, consultan y cancelan SUS pedidos.
 * La administración ve todos los pedidos y cambia su estado.
 */
const pedidoModel = require('../models/pedidoModel.js');
const pedidoService = require('../services/pedidoService.js');
const {
  validarPedido,
  validarEstado,
  validarFiltroEstado,
} = require('../validators/pedidoValidator.js');
const { validarId } = require('../validators/comunes.js');
const AppError = require('../utils/AppError.js');

/**
 * Consulta un pedido y comprueba que el usuario pueda verlo.
 * Si es de otro cliente se responde 404 (no 403) para no revelar que existe.
 */
async function buscarPedidoVisible(id, usuario) {
  const pedido = await pedidoModel.obtenerPedidoPorId(id);
  if (!pedido || (usuario.rol !== 'admin' && pedido.usuarioId !== usuario.id)) {
    throw new AppError('Pedido no encontrado', 404);
  }
  return pedido;
}

/**
 * POST /api/v1/pedidos
 */
async function crear(req, res) {
  const datos = validarPedido(req.body);
  const id = await pedidoService.crearPedido(req.usuario.id, datos);
  const pedido = await pedidoModel.obtenerPedidoPorId(id);
  res.status(201).location(`/api/v1/pedidos/${id}`).json({ mensaje: 'Pedido creado', pedido });
}

/**
 * GET /api/v1/pedidos
 * Cliente: solo sus pedidos. Admin: todos, con filtros ?estado= y ?usuarioId=
 */
async function listar(req, res) {
  const estado = validarFiltroEstado(req.query.estado);
  const esAdmin = req.usuario.rol === 'admin';
  let usuarioId = req.usuario.id;
  if (esAdmin) {
    usuarioId = req.query.usuarioId ? validarId(req.query.usuarioId) : undefined;
  }
  res.json(await pedidoModel.listarPedidos({ usuarioId, estado }));
}

/**
 * GET /api/v1/pedidos/:id
 */
async function obtener(req, res) {
  res.json(await buscarPedidoVisible(validarId(req.params.id), req.usuario));
}

/**
 * PATCH /api/v1/pedidos/:id/estado  (solo admin)
 */
async function cambiarEstado(req, res) {
  const id = validarId(req.params.id);
  const estado = validarEstado(req.body);
  await pedidoService.cambiarEstado(id, estado, req.usuario);
  const pedido = await pedidoModel.obtenerPedidoPorId(id);
  res.json({ mensaje: `Pedido actualizado a "${estado}"`, pedido });
}

/**
 * PATCH /api/v1/pedidos/:id/cancelar
 * El cliente cancela su pedido pendiente; las unidades vuelven al inventario.
 */
async function cancelar(req, res) {
  const id = validarId(req.params.id);
  await pedidoService.cambiarEstado(id, 'cancelado', req.usuario);
  const pedido = await pedidoModel.obtenerPedidoPorId(id);
  res.json({ mensaje: 'Pedido cancelado', pedido });
}

module.exports = { crear, listar, obtener, cambiarEstado, cancelar };
