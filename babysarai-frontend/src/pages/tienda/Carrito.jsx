/**
 * Página del carrito: pasos de la compra, prendas agregadas y resumen.
 * Toda la información viene del CartContext (no consulta la API).
 */
import { Link } from 'react-router';
import CartItem from '../../components/carrito/CartItem.jsx';
import CartSummary from '../../components/carrito/CartSummary.jsx';
import PasosCompra from '../../components/carrito/PasosCompra.jsx';
import { useCart } from '../../hooks/useCart.js';

export default function Carrito() {
  const { items, totalUnidades } = useCart();

  return (
    <main className="section section--tight">
      <div className="wrap">
        <PasosCompra pasoActual={1} />
        <h1 className="titulo-pagina">Tu carrito{totalUnidades > 0 && ` (${totalUnidades})`}</h1>

        <div className="cart-layout">
          <div>
            {items.map((item) => (
              <CartItem key={item.id} item={item} />
            ))}

            {items.length === 0 && (
              <div className="cart-empty">
                {/* Tendedero vacío: solo los ganchos se mecen */}
                <div className="tendedero-vacio" aria-hidden="true">
                  <svg viewBox="0 0 300 60" preserveAspectRatio="none">
                    <path d="M0 10 Q 150 50 300 10" />
                  </svg>
                  <span className="gancho" style={{ left: '22%', top: '38%' }} />
                  <span className="gancho" style={{ left: '46%', top: '52%' }} />
                  <span className="gancho" style={{ left: '72%', top: '42%' }} />
                </div>
                <p className="vacio-titulo">Tu carrito está vacío.</p>
                <p>El tendedero está listo; solo faltan las prendas.</p>
                <Link to="/catalogo" className="btn btn-outline">
                  Ir a comprar
                </Link>
              </div>
            )}
          </div>

          <CartSummary />
        </div>
      </div>
    </main>
  );
}
