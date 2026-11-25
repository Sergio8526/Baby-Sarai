/**
 * Rutas de pedidos.
 * Prefijo: /api/v1/pedidos — todas requieren haber iniciado sesión.
 */
const express = require('express');
const pedidoController = require('../controllers/pedidoController.js');
const { autenticar, autorizar } = require('../middlewares/autenticacion.js');

const router = express.Router();

router.use(autenticar);

router.post('/', pedidoController.crear); // Comprar
router.get('/', pedidoController.listar); // Mis pedidos (admin: todos)
router.get('/:id', pedidoController.obtener); // Detalle de un pedido
router.patch('/:id/cancelar', pedidoController.cancelar); // Cancelar un pedido pendiente
router.patch('/:id/estado', autorizar('admin'), pedidoController.cambiarEstado); // Admin: cambiar estado

module.exports = router;
