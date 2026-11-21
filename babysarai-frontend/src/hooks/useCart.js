/**
 * Hook para usar el carrito desde cualquier componente.
 * Ejemplo: const { agregar, totalUnidades } = useCart();
 */
import { use } from 'react';
import { CartContext } from '../context/CartContext.js';

/**
 * @returns {{
 *   items: Object[], totalUnidades: number, subtotal: number,
 *   agregar: Function, cambiarCantidad: Function, quitar: Function, vaciar: Function
 * }}
 */
export function useCart() {
  const contexto = use(CartContext);
  if (!contexto) {
    throw new Error('useCart debe usarse dentro de <CartProvider>');
  }
  return contexto;
}
