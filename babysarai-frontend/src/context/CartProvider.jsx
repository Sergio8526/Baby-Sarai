/**
 * Proveedor del carrito de compras.
 * Guarda los productos agregados y los comparte con toda la aplicación
 * (Header, DetalleProducto, Carrito...) sin pasar props de componente en componente.
 * El carrito se guarda en localStorage para no perderlo al recargar la página.
 */
import { useEffect, useMemo, useReducer } from 'react';
import { CartContext } from './CartContext.js';

const CLAVE_ALMACENAMIENTO = 'babysarai-carrito';

/**
 * Lee el carrito guardado en el navegador.
 * @returns {Object[]} Lista de ítems o una lista vacía si no hay nada o el dato está dañado.
 */
function leerCarritoGuardado() {
  try {
    const guardado = JSON.parse(localStorage.getItem(CLAVE_ALMACENAMIENTO));
    return Array.isArray(guardado) ? guardado : [];
  } catch {
    return [];
  }
}

/**
 * Reductor del carrito: recibe el estado actual y una acción, y devuelve el nuevo estado.
 * Nunca modifica el arreglo original; siempre crea uno nuevo (inmutabilidad).
 * @param {Object[]} items - Ítems actuales: { id, nombre, precio, talla, stock, cantidad }.
 * @param {{tipo: string, producto?: Object, id?: number, cantidad?: number}} accion
 * @returns {Object[]}
 */
function carritoReducer(items, accion) {
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

/**
 * Envuelve la aplicación y ofrece el carrito a todos los componentes hijos.
 * @param {{children: React.ReactNode}} props
 */
export default function CartProvider({ children }) {
  const [items, dispatch] = useReducer(carritoReducer, [], leerCarritoGuardado);

  // Cada vez que cambia el carrito se guarda en el navegador
  useEffect(() => {
    localStorage.setItem(CLAVE_ALMACENAMIENTO, JSON.stringify(items));
  }, [items]);

  // useMemo evita crear un objeto nuevo en cada render si el carrito no cambió
  const valor = useMemo(() => {
    const totalUnidades = items.reduce((suma, item) => suma + item.cantidad, 0);
    const subtotal = items.reduce((suma, item) => suma + item.precio * item.cantidad, 0);

    return {
      items,
      totalUnidades,
      subtotal,
      agregar: (producto, cantidad = 1) => dispatch({ tipo: 'agregar', producto, cantidad }),
      cambiarCantidad: (id, cantidad) => dispatch({ tipo: 'cambiarCantidad', id, cantidad }),
      quitar: (id) => dispatch({ tipo: 'quitar', id }),
      vaciar: () => dispatch({ tipo: 'vaciar' }),
    };
  }, [items]);

  return <CartContext value={valor}>{children}</CartContext>;
}
