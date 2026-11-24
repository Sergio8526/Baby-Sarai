/**
 * Proveedor del carrito de compras.
 * Guarda los productos agregados y los comparte con toda la aplicación
 * (Header, DetalleProducto, Carrito...) sin pasar props de componente en componente.
 * El carrito se guarda en localStorage para no perderlo al recargar la página.
 */
import { useEffect, useMemo, useReducer } from 'react';
import { CartContext } from './CartContext.js';
import { carritoReducer } from './carritoReducer.js';

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
