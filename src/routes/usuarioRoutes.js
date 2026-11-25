/**
 * Rutas de administración de usuarios.
 * Prefijo: /api/v1/usuarios — todas son solo para la administración.
 */
const express = require('express');
const usuarioController = require('../controllers/usuarioController.js');
const { autenticar, autorizar } = require('../middlewares/autenticacion.js');

const router = express.Router();

// router.use aplica los middlewares a TODAS las rutas de este archivo
router.use(autenticar, autorizar('admin'));

router.get('/', usuarioController.listar);
router.get('/:id', usuarioController.obtener);
router.patch('/:id', usuarioController.actualizar);

module.exports = router;
