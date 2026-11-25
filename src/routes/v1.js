/**
 * Versión 1 de la API de Baby Saraí.
 * Reúne las rutas de todos los módulos bajo el prefijo /api/v1.
 *
 * ¿Por qué versionar? Si más adelante un servicio cambia de forma incompatible
 * (por ejemplo, cambia el formato de la respuesta), se crea /api/v2 y las
 * aplicaciones que usan /api/v1 siguen funcionando sin cambios.
 */
const express = require('express');

const router = express.Router();

router.use('/auth', require('./authRoutes.js'));
router.use('/usuarios', require('./usuarioRoutes.js'));
router.use('/categorias', require('./categoriaRoutes.js'));
router.use('/productos', require('./productoRoutes.js'));
router.use('/pedidos', require('./pedidoRoutes.js'));

module.exports = router;
