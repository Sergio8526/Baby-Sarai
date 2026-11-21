/**
 * Tarjeta de producto con el diseño de la tienda: prenda ilustrada sobre su
 * color, etiqueta colgante (Nuevo / Seminuevo), nombre y precio.
 * Solo muestra datos: los recibe por props y no consulta la API.
 */
import { Link } from 'react-router';
import { useRevelar } from '../../hooks/useRevelar.js';
import { STOCK_BAJO, textoEstado } from '../../utils/constantes.js';
import { formatearPrecio } from '../../utils/formato.js';
import { prendaDeProducto } from '../../utils/prendas.js';
import Prenda from '../prendas/Prenda.jsx';
import styles from './ProductCard.module.css';

/**
 * @param {Object} props
 * @param {Object} props.producto - Producto tal como lo entrega la API.
 * @param {number} [props.orden=0] - Posición en la lista; retrasa la animación de entrada.
 * @param {'aparece'|'revelar'} [props.animacion='aparece'] - "aparece" al cargar o "revelar" al hacer scroll.
 */
export default function ProductCard({ producto, orden = 0, animacion = 'aparece' }) {
  const refRevelar = useRevelar();
  const { tipo, color } = prendaDeProducto(producto);
  const agotado = producto.stock <= 0;
  const revelar = animacion === 'revelar';

  return (
    <Link
      to={`/producto/${producto.id}`}
      ref={revelar ? refRevelar : undefined}
      data-revelar={revelar || undefined}
      className={`product-link ${revelar ? '' : 'aparece'}`}
      style={{ '--orden': orden }}
    >
      <article className="product-card">
        <div className="product-thumb" style={{ '--fondo-prenda': color }}>
          <Prenda tipo={tipo} color={color} />
          <span
            className={`product-badge ${producto.estado === 'nuevo' ? '' : 'product-badge--semi'}`}
          >
            {textoEstado(producto.estado)}
          </span>
        </div>
        <div className="product-info">
          <h3>{producto.nombre}</h3>
          <p className={styles.detalle}>
            {producto.talla ? `Talla ${producto.talla}` : producto.categoriaNombre}
            {agotado && <span className={styles.agotado}> · Agotado</span>}
            {!agotado && producto.stock <= STOCK_BAJO && <span> · Últimas unidades</span>}
          </p>
          <p className="product-price">{formatearPrecio(producto.precio)}</p>
        </div>
      </article>
    </Link>
  );
}
