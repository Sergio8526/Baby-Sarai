/**
 * Controlador de productos.
 * Recibe las peticiones HTTP, valida los datos y llama al modelo.
 * Los errores no se capturan aquí: Express 5 los envía automáticamente
 * al middleware manejarErrores.
 */
const productoModel = require('../models/productoModel.js');
const { validarProducto } = require('../validators/productoValidator.js');
const { validarId } = require('../validators/comunes.js');
const AppError = require('../utils/AppError.js');

/**
 * GET /api/productos
 * Filtros opcionales por query: ?categoriaId=1&soloActivos=true
 */
async function listar(req, res) {
  const { categoriaId, soloActivos } = req.query;
  const productos = await productoModel.listarProductos({
    categoriaId: categoriaId ? validarId(categoriaId) : undefined,
    soloActivos: soloActivos === 'true',
  });
  res.json(productos);
}

/**
 * GET /api/productos/:id
 */
async function obtener(req, res) {
  const id = validarId(req.params.id);
  const producto = await productoModel.obtenerProductoPorId(id);
  if (!producto) {
    throw new AppError('Producto no encontrado', 404);
  }
  res.json(producto);
}

/**
 * POST /api/productos
 */
async function crear(req, res) {
  const datos = validarProducto(req.body);
  const id = await productoModel.crearProducto(datos);
  const producto = await productoModel.obtenerProductoPorId(id);
  res.status(201).json({ mensaje: 'Producto creado', producto });
}

/**
 * PUT /api/productos/:id
 */
async function actualizar(req, res) {
  const id = validarId(req.params.id);
  const datos = validarProducto(req.body);
  const actualizado = await productoModel.actualizarProducto(id, datos);
  if (!actualizado) {
    throw new AppError('Producto no encontrado', 404);
  }
  const producto = await productoModel.obtenerProductoPorId(id);
  res.json({ mensaje: 'Producto actualizado', producto });
}

/**
 * DELETE /api/productos/:id
 */
async function eliminar(req, res) {
  const id = validarId(req.params.id);
  const eliminado = await productoModel.eliminarProducto(id);
  if (!eliminado) {
    throw new AppError('Producto no encontrado', 404);
  }
  res.json({ mensaje: 'Producto eliminado' });
}

module.exports = { listar, obtener, crear, actualizar, eliminar };