/**
 * Resumen del panel: indicadores del inventario, pedidos por atender y
 * productos por agotarse. Los indicadores se calculan en el navegador a partir
 * de las listas que entrega la API.
 */
import { Link } from 'react-router';
import Loader from '../../components/ui/Loader.jsx';
import Mensaje from '../../components/ui/Mensaje.jsx';
import { useConsulta } from '../../hooks/useConsulta.js';
import { listarCategorias } from '../../services/categoriaService.js';
import { listarPedidosPendientes } from '../../services/pedidoService.js';
import { listarProductos } from '../../services/productoService.js';
import { STOCK_BAJO } from '../../utils/constantes.js';
import { formatearFecha, formatearPrecio } from '../../utils/formato.js';

/**
 * Calcula los indicadores del inventario.
 * @param {Object[]} productos
 * @returns {{visibles: number, unidades: number, valorInventario: number, pocoStock: Object[]}}
 */
function calcularIndicadores(productos) {
  return {
    visibles: productos.filter((p) => p.activo).length,
    unidades: productos.reduce((suma, p) => suma + p.stock, 0),
    valorInventario: productos.reduce((suma, p) => suma + Number(p.precio) * p.stock, 0),
    pocoStock: productos
      .filter((p) => p.activo && p.stock <= STOCK_BAJO)
      .sort((a, b) => a.stock - b.stock),
  };
}

export default function Dashboard() {
  const productos = useConsulta(listarProductos);
  const categorias = useConsulta(listarCategorias);
  const pendientes = useConsulta(listarPedidosPendientes);

  if (productos.cargando || categorias.cargando || pendientes.cargando)
    return <Loader texto="Calculando el resumen..." />;

  const error = productos.error || categorias.error || pendientes.error;
  if (error) return <Mensaje tipo="error">{error.message}</Mensaje>;

  const indicadores = calcularIndicadores(productos.datos);
  const tarjetas = [
    {
      titulo: 'Productos',
      valor: productos.datos.length,
      nota: `${indicadores.visibles} visibles en la tienda`,
    },
    {
      titulo: 'Unidades en stock',
      valor: indicadores.unidades,
      nota: `Valor: ${formatearPrecio(indicadores.valorInventario)}`,
    },
    {
      titulo: 'Pedidos pendientes',
      valor: pendientes.datos.length,
      nota: `Por ${formatearPrecio(pendientes.datos.reduce((suma, p) => suma + p.total, 0))}`,
    },
    {
      titulo: 'Categorías',
      valor: categorias.datos.length,
      nota: `${categorias.datos.filter((c) => c.activo).length} activas`,
    },
  ];

  return (
    <>
      <div className="cabecera-pagina">
        <div>
          <h1>Resumen</h1>
          <p>Así está el inventario de la tienda hoy.</p>
        </div>
      </div>

      <div className="indicadores">
        {tarjetas.map((tarjeta) => (
          <section key={tarjeta.titulo} className="tarjeta indicador">
            <h2>{tarjeta.titulo}</h2>
            <p className="indicador-valor">{tarjeta.valor}</p>
            <p className="indicador-nota">{tarjeta.nota}</p>
          </section>
        ))}
      </div>

      <section className="tarjeta">
        <h2>Pedidos por atender</h2>
        {pendientes.datos.length === 0 ? (
          <p>No hay pedidos pendientes.</p>
        ) : (
          <ul className="lista-stock">
            {pendientes.datos.slice(0, 5).map((pedido) => (
              <li key={pedido.id}>
                <span>
                  #{pedido.id} · {pedido.clienteNombre} · {formatearFecha(pedido.fechaCreacion)}
                </span>
                <strong>{formatearPrecio(pedido.total)}</strong>
              </li>
            ))}
          </ul>
        )}
        <p style={{ marginTop: 16 }}>
          <Link to="/admin/pedidos" className="enlace">
            Ir a pedidos
          </Link>
        </p>
      </section>

      <section className="tarjeta">
        <h2>Por agotarse (stock de {STOCK_BAJO} o menos)</h2>
        {indicadores.pocoStock.length === 0 ? (
          <p>Todo el inventario visible tiene stock suficiente.</p>
        ) : (
          <ul className="lista-stock">
            {indicadores.pocoStock.map((producto) => (
              <li key={producto.id}>
                <span>{producto.nombre}</span>
                <strong>
                  {producto.stock} {producto.stock === 1 ? 'unidad' : 'unidades'}
                </strong>
              </li>
            ))}
          </ul>
        )}
        <p style={{ marginTop: 16 }}>
          <Link to="/admin/productos" className="enlace">
            Ir a productos
          </Link>
        </p>
      </section>
    </>
  );
}
