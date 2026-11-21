/**
 * Fila de un producto dentro del carrito: prenda, nombre, cantidad, precio y eliminar.
 */
import { useCart } from '../../hooks/useCart.js';
import { formatearPrecio } from '../../utils/formato.js';
import { prendaDeProducto } from '../../utils/prendas.js';
import Prenda from '../prendas/Prenda.jsx';
import styles from './CartItem.module.css';

/**
 * @param {{item: {id: number, nombre: string, precio: number, talla?: string,
 *   categoriaNombre?: string, stock: number, cantidad: number}}} props
 */
export default function CartItem({ item }) {
  const { cambiarCantidad, quitar } = useCart();
  const { tipo, color } = prendaDeProducto(item);

  return (
    <div className="cart-item">
      <div className="cart-item-thumb" style={{ '--fondo-prenda': color }}>
        <Prenda tipo={tipo} color={color} />
      </div>

      <div>
        <p className="cart-item-name">{item.nombre}</p>
        <p className="cart-item-meta">
          {item.talla ? `Talla ${item.talla} · ` : ''}
          {formatearPrecio(item.precio)} c/u
        </p>
        <div className={styles.fila}>
          <div className="qty-control">
            <button
              type="button"
              onClick={() => cambiarCantidad(item.id, item.cantidad - 1)}
              disabled={item.cantidad <= 1}
              aria-label={`Quitar una unidad de ${item.nombre}`}
            >
              −
            </button>
            <span aria-live="polite">{item.cantidad}</span>
            <button
              type="button"
              onClick={() => cambiarCantidad(item.id, item.cantidad + 1)}
              disabled={item.cantidad >= item.stock}
              aria-label={`Agregar una unidad de ${item.nombre}`}
            >
              +
            </button>
          </div>
          <button type="button" className="cart-item-remove" onClick={() => quitar(item.id)}>
            Eliminar
          </button>
        </div>
      </div>

      <p className="cart-item-price">{formatearPrecio(item.precio * item.cantidad)}</p>
    </div>
  );
}
