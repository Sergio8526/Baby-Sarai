const {
  crearProducto,
  listarProductos,
  obtenerProductoPorId,
  actualizarProducto,
  eliminarProducto,
} = require('./src/models/productoModel.js');

async function main() {
  console.log('--- 1. Crear un producto ---');
  const idNuevo = await crearProducto({
    nombre: 'Body manga larga 0-3 meses',
    descripcion: 'Body de algodón suave, manga larga, unisex',
    precio: 25000,
    categoria: 'recien-nacido',
    stock: 30,
  });
  console.log('Producto creado con id:', idNuevo);

  console.log('\n--- 2. Listar todos los productos ---');
  const productos = await listarProductos();
  console.log(productos);

  console.log('\n--- 3. Consultar el producto recién creado ---');
  const producto = await obtenerProductoPorId(idNuevo);
  console.log(producto);

  console.log('\n--- 4. Actualizar el producto ---');
  await actualizarProducto(idNuevo, {
    nombre: 'Body manga larga 0-3 meses',
    descripcion: 'Body de algodón suave, manga larga, unisex',
    precio: 22000,
    categoria: 'recien-nacido',
    stock: 25,
  });
  const productoActualizado = await obtenerProductoPorId(idNuevo);
  console.log(productoActualizado);

  console.log('\n--- 5. Eliminar el producto ---');
  const eliminado = await eliminarProducto(idNuevo);
  console.log('¿Se eliminó?', eliminado);

  console.log('\n--- 6. Confirmar que ya no existe ---');
  const yaNoExiste = await obtenerProductoPorId(idNuevo);
  console.log(yaNoExiste);

  process.exit(0);
}

main().catch((error) => {
  console.error('Ocurrió un error:', error);
  process.exit(1);
});