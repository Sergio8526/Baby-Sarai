/**
 * Resumen del pedido: subtotal, envío fijo y total, y el botón para enviar
 * el pedido por WhatsApp (el canal de venta actual de la tienda, mientras
 * la API no tenga el módulo de pedidos).
 */
import { useCart } from '../../hooks/useCart.js';
import { CONTACTO, COSTO_ENVIO } from '../../utils/constantes.js';
import { formatearPrecio } from '../../utils/formato.js';

/**
 * Arma el texto del pedido para enviarlo por WhatsApp.
 * @param {Object[]} items
 * @param {number} total
 * @returns {string}
 */
function crearMensajePedido(items, total) {
  const lineas = items.map(
    (item) => `• ${item.cantidad} x ${item.nombre}${item.talla ? ` (talla ${item.talla})` : ''}`
  );
  return [
    'Hola, quiero hacer este pedido en Baby Saraí:',
    ...lineas,
    `Total con envío: ${formatearPrecio(total)}`,
  ].join('\n');
}

export default function CartSummary() {
  const { items, subtotal } = useCart();
  const envio = items.length > 0 ? COSTO_ENVIO : 0;
  const total = subtotal + envio;
  const enlaceWhatsapp = `https://wa.me/${CONTACTO.whatsapp}?text=${encodeURIComponent(
    crearMensajePedido(items, total)
  )}`;

  return (
    <aside className="summary-card" aria-label="Resumen del pedido">
      <h2 className="summary-titulo">Resumen del pedido</h2>
      <div className="summary-row">
        <span>Subtotal</span>
        <span>{formatearPrecio(subtotal)}</span>
      </div>
      <div className="summary-row">
        <span>Envío</span>
        <span>{envio ? formatearPrecio(envio) : '—'}</span>
      </div>
      <div className="summary-row summary-row--total">
        <span>Total</span>
        <span>{formatearPrecio(total)}</span>
      </div>
      <a
        className="btn btn-primary btn-block"
        href={enlaceWhatsapp}
        target="_blank"
        rel="noreferrer"
      >
        Pedir por WhatsApp
      </a>
      <p className="summary-nota">Envío fijo de $8.000 a cualquier ciudad de Colombia.</p>
    </aside>
  );
}
