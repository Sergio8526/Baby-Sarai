/**
 * Resumen del pedido en el carrito: subtotal, envío estimado y total.
 * El botón lleva a los datos de envío (/checkout). Si el cliente no ha
 * iniciado sesión, la ruta protegida lo envía primero a /ingresar.
 */
import { Link } from 'react-router';
import { useCart } from '../../hooks/useCart.js';
import { ENVIO } from '../../utils/constantes.js';
import { formatearPrecio } from '../../utils/formato.js';
import { calcularEnvio, faltaParaEnvioGratis } from '../../utils/pedidos.js';

export default function CartSummary() {
  const { items, subtotal } = useCart();
  const envio = calcularEnvio(subtotal);
  const falta = faltaParaEnvioGratis(subtotal);

  return (
    <aside className="summary-card" aria-label="Resumen del pedido">
      <h2 className="summary-titulo">Resumen del pedido</h2>
      <div className="summary-row">
        <span>Subtotal</span>
        <span>{formatearPrecio(subtotal)}</span>
      </div>
      <div className="summary-row">
        <span>Envío</span>
        <span>{items.length === 0 ? '—' : envio ? formatearPrecio(envio) : 'Gratis'}</span>
      </div>
      <div className="summary-row summary-row--total">
        <span>Total</span>
        <span>{formatearPrecio(subtotal + envio)}</span>
      </div>
      {items.length > 0 ? (
        <Link to="/checkout" className="btn btn-primary btn-block">
          Continuar con la compra
        </Link>
      ) : (
        <button type="button" className="btn btn-primary btn-block" disabled>
          Continuar con la compra
        </button>
      )}
      <p className="summary-nota">
        {items.length > 0 && falta > 0
          ? `Te faltan ${formatearPrecio(falta)} para el envío gratis.`
          : `Envío de ${formatearPrecio(ENVIO.costo)} a cualquier ciudad; gratis desde ${formatearPrecio(ENVIO.gratisDesde)}.`}
      </p>
    </aside>
  );
}
