/**
 * Rutas del módulo de categorías.
 * Prefijo: /api/categorias (definido en app.js)
 */
const express = require('express');
const categoriaController = require('../controllers/categoriaController.js');

const router = express.Router();

router.get('/', categoriaController.listar);
router.get('/:id', categoriaController.obtener);
router.post('/', categoriaController.crear);
router.put('/:id', categoriaController.actualizar);
router.delete('/:id', categoriaController.eliminar);

module.exports = router;