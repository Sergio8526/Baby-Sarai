/**
 * Detalle de un pedido: productos comprados y totales.
 * Los precios son los que se cobraron (copiados en detalle_pedidos al comprar).
 */
import { formatearPrecio } from '../../utils/formato.js';

/**
 * @param {{pedido: Object}} props - Pedido con items, subtotal, costoEnvio y total.
 */
export default function LineasPedido({ pedido }) {
  return (
    <div className="lineas-pedido">
      <ul>
        {pedido.items.map((item) => (
          <li key={item.productoId}>
            <span>
              {item.cantidad} × {item.nombreProducto}
              {item.talla && <small> · Talla {item.talla}</small>}
            </span>
            <span>{formatearPrecio(item.subtotal)}</span>
          </li>
        ))}
      </ul>
      <dl>
        <div>
          <dt>Subtotal</dt>
          <dd>{formatearPrecio(pedido.subtotal)}</dd>
        </div>
        <div>
          <dt>Envío</dt>
          <dd>{pedido.costoEnvio ? formatearPrecio(pedido.costoEnvio) : 'Gratis'}</dd>
        </div>
        <div className="total">
          <dt>Total</dt>
          <dd>{formatearPrecio(pedido.total)}</dd>
        </div>
      </dl>
    </div>
  );
}
