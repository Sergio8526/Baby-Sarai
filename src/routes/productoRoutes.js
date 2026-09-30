const express = require('express');
const productoController = require('../controllers/productoController.js');

const router = express.Router();

// Rutas del módulo de productos
router.get('/', productoController.listar);          // Listar todos
router.get('/:id', productoController.obtener);      // Consultar uno por id
router.post('/', productoController.crear);          // Crear
router.put('/:id', productoController.actualizar);   // Actualizar
router.delete('/:id', productoController.eliminar);  // Eliminar

module.exports = router;