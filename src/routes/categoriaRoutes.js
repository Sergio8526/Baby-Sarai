/**
 * Rutas del módulo de categorías.
 * Prefijo: /api/v1/categorias
 * Consultar es público (la tienda muestra las categorías);
 * crear, actualizar y eliminar es solo para la administración.
 */
const express = require('express');
const categoriaController = require('../controllers/categoriaController.js');
const { autenticar, autorizar } = require('../middlewares/autenticacion.js');

const router = express.Router();
const soloAdmin = [autenticar, autorizar('admin')];

router.get('/', categoriaController.listar);
router.get('/:id', categoriaController.obtener);
router.post('/', soloAdmin, categoriaController.crear);
router.put('/:id', soloAdmin, categoriaController.actualizar);
router.delete('/:id', soloAdmin, categoriaController.eliminar);

module.exports = router;
