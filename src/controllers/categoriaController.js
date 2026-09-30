/**
 * Controlador de categorías.
 * Recibe las peticiones HTTP, valida los datos y llama al modelo.
 */
const categoriaModel = require('../models/categoriaModel.js');
const { validarCategoria } = require('../validators/categoriaValidator.js');
const { validarId } = require('../validators/comunes.js');
const AppError = require('../utils/AppError.js');

/**
 * GET /api/categorias
 * Filtro opcional: ?soloActivas=true
 */
async function listar(req, res) {
  const categorias = await categoriaModel.listarCategorias({
    soloActivas: req.query.soloActivas === 'true',
  });
  res.json(categorias);
}

/**
 * GET /api/categorias/:id
 */
async function obtener(req, res) {
  const id = validarId(req.params.id);
  const categoria = await categoriaModel.obtenerCategoriaPorId(id);
  if (!categoria) {
    throw new AppError('Categoría no encontrada', 404);
  }
  res.json(categoria);
}

/**
 * POST /api/categorias
 */
async function crear(req, res) {
  const datos = validarCategoria(req.body);
  const id = await categoriaModel.crearCategoria(datos);
  const categoria = await categoriaModel.obtenerCategoriaPorId(id);
  res.status(201).json({ mensaje: 'Categoría creada', categoria });
}

/**
 * PUT /api/categorias/:id
 */
async function actualizar(req, res) {
  const id = validarId(req.params.id);
  const datos = validarCategoria(req.body);
  const actualizada = await categoriaModel.actualizarCategoria(id, datos);
  if (!actualizada) {
    throw new AppError('Categoría no encontrada', 404);
  }
  const categoria = await categoriaModel.obtenerCategoriaPorId(id);
  res.json({ mensaje: 'Categoría actualizada', categoria });
}

/**
 * DELETE /api/categorias/:id
 * Si la categoría tiene productos, MySQL lo impide y manejarErrores responde 409.
 */
async function eliminar(req, res) {
  const id = validarId(req.params.id);
  const eliminada = await categoriaModel.eliminarCategoria(id);
  if (!eliminada) {
    throw new AppError('Categoría no encontrada', 404);
  }
  res.json({ mensaje: 'Categoría eliminada' });
}

module.exports = { listar, obtener, crear, actualizar, eliminar };