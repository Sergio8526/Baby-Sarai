/**
 * Historial de pedidos del cliente (GET /api/v1/pedidos devuelve solo los suyos).
 */
import { Link } from 'react-router';
import EstadoPedido from '../../components/pedidos/EstadoPedido.jsx';
import AvisoError from '../../components/ui/AvisoError.jsx';
import Loader from '../../components/ui/Loader.jsx';
import { useAuth } from '../../hooks/useAuth.js';
import { useConsulta } from '../../hooks/useConsulta.js';
import { listarPedidos } from '../../services/pedidoService.js';
import { formatearFecha, formatearPrecio } from '../../utils/formato.js';

export default function MisPedidos() {
  const { usuario } = useAuth();
  const { datos, cargando, error, recargar } = useConsulta(listarPedidos);
  // La API devuelve todos los pedidos si quien consulta es la administradora:
  // aquí se muestran solo los propios.
  const pedidos = datos?.filter((pedido) => pedido.usuarioId === usuario.id);

  return (
    <main className="section section--tight">
      <div className="wrap">
        <h1 className="titulo-pagina">Mis pedidos</h1>
        <p className="cuenta-bajada">Hola, {usuario.nombre}. Aquí ves el estado de cada compra.</p>

        {cargando && <Loader texto="Buscando tus pedidos..." />}
        {error && <AvisoError mensaje={error.message} alReintentar={recargar} />}

        {pedidos?.length === 0 && (
          <div className="empty-state is-visible">
            <p className="vacio-titulo">Todavía no tienes pedidos.</p>
            <p>Cuando compres, aquí verás cada pedido y su estado.</p>
            <Link to="/catalogo" className="btn btn-outline">
              Ver el catálogo
            </Link>
          </div>
        )}

        {pedidos?.length > 0 && (
          <ul className="lista-pedidos">
            {pedidos.map((pedido) => (
              <li key={pedido.id}>
                <Link to={`/mis-pedidos/${pedido.id}`} className="pedido-fila">
                  <span className="pedido-numero">Pedido #{pedido.id}</span>
                  <span className="pedido-fecha">{formatearFecha(pedido.fechaCreacion)}</span>
                  <span>
                    {pedido.unidades} {pedido.unidades === 1 ? 'prenda' : 'prendas'}
                  </span>
                  <strong>{formatearPrecio(pedido.total)}</strong>
                  <EstadoPedido estado={pedido.estado} />
                </Link>
              </li>
            ))}
          </ul>
        )}
      </div>
    </main>
  );
}
