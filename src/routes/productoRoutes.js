/**
 * Rutas del módulo de productos.
 * Prefijo: /api/v1/productos
 * Consultar es público (catálogo de la tienda);
 * crear, actualizar y eliminar es solo para la administración.
 */
const express = require('express');
const productoController = require('../controllers/productoController.js');
const { autenticar, autorizar } = require('../middlewares/autenticacion.js');

const router = express.Router();
const soloAdmin = [autenticar, autorizar('admin')];

router.get('/', productoController.listar); // Listar (filtros ?categoriaId=&soloActivos=)
router.get('/:id', productoController.obtener); // Consultar uno por id
router.post('/', soloAdmin, productoController.crear); // Crear
router.put('/:id', soloAdmin, productoController.actualizar); // Actualizar
router.delete('/:id', soloAdmin, productoController.eliminar); // Eliminar

module.exports = router;
