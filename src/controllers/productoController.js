const productoModel = require('../models/productoModel.js');

/**
 * GET /api/productos - Lista todos los productos.
 */
async function listar(req, res) {
  try {
    const productos = await productoModel.listarProductos();
    res.json(productos);
  } catch (error) {
    console.error(error);
    res.status(500).json({ mensaje: 'Error al listar los productos' });
  }
}

/**
 * GET /api/productos/:id - Consulta un producto por id.
 */
async function obtener(req, res) {
  try {
    const producto = await productoModel.obtenerProductoPorId(req.params.id);
    if (!producto) {
      return res.status(404).json({ mensaje: 'Producto no encontrado' });
    }
    res.json(producto);
  } catch (error) {
    console.error(error);
    res.status(500).json({ mensaje: 'Error al consultar el producto' });
  }
}

/**
 * POST /api/productos - Crea un producto (recibe datos del formulario).
 */
async function crear(req, res) {
  try {
    const { nombre, precio } = req.body;
    if (!nombre || !precio) {
      return res.status(400).json({ mensaje: 'Nombre y precio son obligatorios' });
    }
    const id = await productoModel.crearProducto(req.body);
    res.status(201).json({ mensaje: 'Producto creado', id });
  } catch (error) {
    console.error(error);
    res.status(500).json({ mensaje: 'Error al crear el producto' });
  }
}

/**
 * PUT /api/productos/:id - Actualiza un producto.
 */
async function actualizar(req, res) {
  try {
    const actualizado = await productoModel.actualizarProducto(req.params.id, req.body);
    if (!actualizado) {
      return res.status(404).json({ mensaje: 'Producto no encontrado' });
    }
    res.json({ mensaje: 'Producto actualizado' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ mensaje: 'Error al actualizar el producto' });
  }
}

/**
 * DELETE /api/productos/:id - Elimina un producto.
 */
async function eliminar(req, res) {
  try {
    const eliminado = await productoModel.eliminarProducto(req.params.id);
    if (!eliminado) {
      return res.status(404).json({ mensaje: 'Producto no encontrado' });
    }
    res.json({ mensaje: 'Producto eliminado' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ mensaje: 'Error al eliminar el producto' });
  }
}

module.exports = { listar, obtener, crear, actualizar, eliminar };