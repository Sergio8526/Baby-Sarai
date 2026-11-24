/**
 * Lógica del carrito separada del componente, para poder probarla sola
 * (pruebas unitarias en carritoReducer.test.js).
 */

/**
 * Reductor del carrito: recibe el estado actual y una acción, y devuelve el nuevo estado.
 * Nunca modifica el arreglo original; siempre crea uno nuevo (inmutabilidad).
 * @param {Object[]} items - Ítems actuales: { id, nombre, precio, talla, stock, cantidad }.
 * @param {{tipo: string, producto?: Object, id?: number, cantidad?: number}} accion
 * @returns {Object[]}
 */
export function carritoReducer(items, accion) {
  switch (accion.tipo) {
    case 'agregar': {
      const { producto, cantidad } = accion;
      const existente = items.find((item) => item.id === producto.id);
      if (existente) {
        // Si ya está, se suma la cantidad sin pasar del stock disponible
        return items.map((item) =>
          item.id === producto.id
            ? { ...item, cantidad: Math.min(item.cantidad + cantidad, producto.stock) }
            : item
        );
      }
      return [
        ...items,
        {
          id: producto.id,
          nombre: producto.nombre,
          precio: Number(producto.precio),
          talla: producto.talla,
          categoriaNombre: producto.categoriaNombre,
          stock: producto.stock,
          cantidad: Math.min(cantidad, producto.stock),
        },
      ];
    }
    case 'cambiarCantidad':
      return items.map((item) =>
        item.id === accion.id
          ? { ...item, cantidad: Math.max(1, Math.min(accion.cantidad, item.stock)) }
          : item
      );
    case 'quitar':
      return items.filter((item) => item.id !== accion.id);
    case 'vaciar':
      return [];
    default:
      throw new Error(`Acción del carrito desconocida: ${accion.tipo}`);
  }
}
