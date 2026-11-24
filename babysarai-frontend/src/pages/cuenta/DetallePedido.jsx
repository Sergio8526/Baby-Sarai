/**
 * Detalle de un pedido del cliente. Si viene de la compra (state.recienCreado)
 * muestra la confirmación (paso 3). Permite cancelar mientras esté pendiente.
 */
import { useCallback, useState } from 'react';
import { Link, useLocation, useParams } from 'react-router';
import PasosCompra from '../../components/carrito/PasosCompra.jsx';
import EstadoPedido from '../../components/pedidos/EstadoPedido.jsx';
import LineasPedido from '../../components/pedidos/LineasPedido.jsx';
import AvisoError from '../../components/ui/AvisoError.jsx';
import Loader from '../../components/ui/Loader.jsx';
import { useConsulta } from '../../hooks/useConsulta.js';
import { cancelarPedido, obtenerPedido } from '../../services/pedidoService.js';
import { formatearFecha } from '../../utils/formato.js';

export default function DetallePedido() {
  const { id } = useParams();
  const recienCreado = useLocation().state?.recienCreado;
  const consultar = useCallback(() => obtenerPedido(id), [id]);
  const { datos: pedido, cargando, error, recargar } = useConsulta(consultar);

  const [cancelando, setCancelando] = useState(false);
  const [errorCancelar, setErrorCancelar] = useState('');

  const cancelar = async () => {
    if (!window.confirm('¿Seguro que quieres cancelar este pedido?')) return;
    setCancelando(true);
    setErrorCancelar('');
    try {
      await cancelarPedido(pedido.id);
      recargar();
    } catch (falla) {
      setErrorCancelar(falla.message);
    } finally {
      setCancelando(false);
    }
  };

  if (cargando && !pedido) return <Loader texto="Cargando el pedido..." />;
  if (error) {
    return (
      <main className="section section--tight">
        <div className="wrap">
          <AvisoError mensaje={error.message} />
          <p style={{ textAlign: 'center' }}>
            <Link to="/mis-pedidos">Volver a mis pedidos</Link>
          </p>
        </div>
      </main>
    );
  }

  return (
    <main className="section section--tight">
      <div className="wrap">
        {recienCreado && (
          <>
            <PasosCompra pasoActual={3} />
            <div className="confirmation is-visible">
              <div className="confirmation-icon" aria-hidden="true">
                <svg
                  width="30"
                  height="30"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.4"
                >
                  <path d="m5 12 5 5L20 7" />
                </svg>
              </div>
              <h2>¡Gracias por tu compra!</h2>
              <p>
                Recibimos tu pedido #{pedido.id}. Te contactaremos para coordinar el pago y la
                entrega.
              </p>
            </div>
          </>
        )}

        <div className="detalle-pedido-cabecera">
          <div>
            <p className="breadcrumb">
              <Link to="/mis-pedidos">Mis pedidos</Link> / Pedido #{pedido.id}
            </p>
            <h1 className="titulo-pagina">Pedido #{pedido.id}</h1>
            <p className="cuenta-bajada">Hecho el {formatearFecha(pedido.fechaCreacion)}</p>
          </div>
          <EstadoPedido estado={pedido.estado} />
        </div>

        <div className="cart-layout">
          <section className="cuenta-card">
            <h2 className="summary-titulo">Productos</h2>
            <LineasPedido pedido={pedido} />
          </section>
          <aside className="summary-card">
            <h2 className="summary-titulo">Entrega</h2>
            <p>
              {pedido.direccionEnvio}
              <br />
              {pedido.ciudad} · {pedido.telefono}
            </p>
            {pedido.notas && <p className="summary-nota">Nota: {pedido.notas}</p>}
            {pedido.estado === 'pendiente' && (
              <button
                type="button"
                className="btn btn-quieto btn-block"
                onClick={cancelar}
                disabled={cancelando}
              >
                {cancelando ? 'Cancelando...' : 'Cancelar pedido'}
              </button>
            )}
            {errorCancelar && (
              <p className="form-error" style={{ display: 'block' }} role="alert">
                {errorCancelar}
              </p>
            )}
          </aside>
        </div>
      </div>
    </main>
  );
}
