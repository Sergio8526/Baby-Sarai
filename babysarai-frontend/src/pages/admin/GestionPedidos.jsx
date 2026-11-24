/**
 * Gestión de pedidos (administradora).
 * Lista los pedidos de todos los clientes, filtra por estado y permite ver el
 * detalle y avanzar el pedido por su flujo: pendiente → pagado → enviado → entregado.
 * Cancelar devuelve las unidades al inventario (lo hace la API en una transacción).
 */
import { useCallback, useState } from 'react';
import LineasPedido from '../../components/pedidos/LineasPedido.jsx';
import EstadoPedido from '../../components/pedidos/EstadoPedido.jsx';
import Loader from '../../components/ui/Loader.jsx';
import Mensaje from '../../components/ui/Mensaje.jsx';
import ModalConfirmacion from '../../components/ui/ModalConfirmacion.jsx';
import { useConsulta } from '../../hooks/useConsulta.js';
import { cambiarEstadoPedido, listarPedidos, obtenerPedido } from '../../services/pedidoService.js';
import { ESTADOS_PEDIDO } from '../../utils/constantes.js';
import { formatearFecha, formatearPrecio, normalizarTexto } from '../../utils/formato.js';
import { infoEstado, siguientesEstados } from '../../utils/pedidos.js';

/** Texto del botón para pasar a cada estado. */
const ACCION_ESTADO = {
  pagado: 'Marcar como pagado',
  enviado: 'Marcar como enviado',
  entregado: 'Marcar como entregado',
  cancelado: 'Cancelar pedido',
};

export default function GestionPedidos() {
  const [filtroEstado, setFiltroEstado] = useState('');
  const [busqueda, setBusqueda] = useState('');
  const consultar = useCallback(() => listarPedidos({ estado: filtroEstado }), [filtroEstado]);
  const pedidos = useConsulta(consultar);

  const [seleccionado, setSeleccionado] = useState(null); // pedido con detalle
  const [cargandoDetalle, setCargandoDetalle] = useState(false);
  const [porCancelar, setPorCancelar] = useState(false);
  const [procesando, setProcesando] = useState(false);
  const [aviso, setAviso] = useState(null);

  const verDetalle = async (id) => {
    setCargandoDetalle(true);
    setAviso(null);
    try {
      setSeleccionado(await obtenerPedido(id));
    } catch (error) {
      setAviso({ tipo: 'error', mensaje: error.message });
    } finally {
      setCargandoDetalle(false);
    }
  };

  const cambiarEstado = async (estado) => {
    setProcesando(true);
    try {
      const respuesta = await cambiarEstadoPedido(seleccionado.id, estado);
      setSeleccionado(respuesta.pedido);
      setAviso({ tipo: 'exito', mensaje: respuesta.mensaje });
      pedidos.recargar();
    } catch (error) {
      // 409: cambio no permitido (por ejemplo, otra persona ya lo cambió)
      setAviso({ tipo: 'error', mensaje: error.message, detalles: error.detalles });
    } finally {
      setProcesando(false);
      setPorCancelar(false);
    }
  };

  const texto = normalizarTexto(busqueda);
  const visibles = (pedidos.datos ?? []).filter(
    (p) =>
      !texto ||
      normalizarTexto(p.clienteNombre).includes(texto) ||
      normalizarTexto(p.clienteEmail).includes(texto) ||
      String(p.id) === texto
  );

  return (
    <>
      <div className="cabecera-pagina">
        <div>
          <h1>Pedidos</h1>
          <p>Revisa las compras de la tienda y actualiza su estado.</p>
        </div>
      </div>

      {aviso && (
        <Mensaje tipo={aviso.tipo} detalles={aviso.detalles} alCerrar={() => setAviso(null)}>
          {aviso.mensaje}
        </Mensaje>
      )}

      {seleccionado && (
        <section className="tarjeta" aria-live="polite">
          <div className="encabezado-tabla">
            <h2>
              Pedido #{seleccionado.id} · <EstadoPedido estado={seleccionado.estado} enPanel />
            </h2>
            <button
              type="button"
              className="secundario pequeno"
              onClick={() => setSeleccionado(null)}
            >
              Cerrar detalle
            </button>
          </div>
          <div className="detalle-pedido-panel">
            <div>
              <h3>Productos</h3>
              <LineasPedido pedido={seleccionado} />
            </div>
            <div>
              <h3>Cliente y entrega</h3>
              <p>
                <strong>{seleccionado.clienteNombre}</strong> · {seleccionado.clienteEmail}
              </p>
              <p>
                {seleccionado.direccionEnvio}, {seleccionado.ciudad}
              </p>
              <p>Teléfono: {seleccionado.telefono}</p>
              {seleccionado.notas && <p>Nota: {seleccionado.notas}</p>}
              <p>Creado: {formatearFecha(seleccionado.fechaCreacion)}</p>

              <div className="botones-estado">
                {siguientesEstados(seleccionado.estado).map((estado) => (
                  <button
                    key={estado}
                    type="button"
                    className={estado === 'cancelado' ? 'peligro' : undefined}
                    disabled={procesando}
                    onClick={() =>
                      estado === 'cancelado' ? setPorCancelar(true) : cambiarEstado(estado)
                    }
                  >
                    {ACCION_ESTADO[estado]}
                  </button>
                ))}
                {siguientesEstados(seleccionado.estado).length === 0 && (
                  <p>Este pedido ya está {infoEstado(seleccionado.estado).texto.toLowerCase()}.</p>
                )}
              </div>
            </div>
          </div>
        </section>
      )}

      <section className="tarjeta">
        <div className="encabezado-tabla">
          <h2>Listado</h2>
          <div className="filtros-tabla">
            <input
              type="search"
              placeholder="Buscar por cliente o número"
              aria-label="Buscar por cliente o número de pedido"
              value={busqueda}
              onChange={(evento) => setBusqueda(evento.target.value)}
            />
            <select
              aria-label="Filtrar por estado"
              value={filtroEstado}
              onChange={(evento) => setFiltroEstado(evento.target.value)}
            >
              <option value="">Todos los estados</option>
              {Object.entries(ESTADOS_PEDIDO).map(([valor, { texto: nombre }]) => (
                <option key={valor} value={valor}>
                  {nombre}
                </option>
              ))}
            </select>
          </div>
        </div>

        {pedidos.cargando && !pedidos.datos && <Loader texto="Cargando pedidos..." />}
        {pedidos.error && <Mensaje tipo="error">{pedidos.error.message}</Mensaje>}

        {pedidos.datos && (
          <div className="tabla-contenedor">
            <table>
              <thead>
                <tr>
                  <th scope="col">#</th>
                  <th scope="col">Fecha</th>
                  <th scope="col">Cliente</th>
                  <th scope="col" className="num">
                    Prendas
                  </th>
                  <th scope="col" className="num">
                    Total
                  </th>
                  <th scope="col">Estado</th>
                  <th scope="col">Acciones</th>
                </tr>
              </thead>
              <tbody>
                {visibles.length === 0 && (
                  <tr>
                    <td colSpan={7} className="vacio">
                      No hay pedidos con ese filtro.
                    </td>
                  </tr>
                )}
                {visibles.map((pedido) => (
                  <tr
                    key={pedido.id}
                    className={seleccionado?.id === pedido.id ? 'seleccionada' : undefined}
                  >
                    <td>{pedido.id}</td>
                    <td>{formatearFecha(pedido.fechaCreacion)}</td>
                    <td>
                      {pedido.clienteNombre}
                      <br />
                      <small>{pedido.clienteEmail}</small>
                    </td>
                    <td className="num">{pedido.unidades}</td>
                    <td className="num">{formatearPrecio(pedido.total)}</td>
                    <td>
                      <EstadoPedido estado={pedido.estado} enPanel />
                    </td>
                    <td className="acciones-fila">
                      <button
                        type="button"
                        className="pequeno"
                        disabled={cargandoDetalle}
                        onClick={() => verDetalle(pedido.id)}
                      >
                        Ver detalle
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>

      <ModalConfirmacion
        abierto={porCancelar}
        titulo={`¿Cancelar el pedido #${seleccionado?.id ?? ''}?`}
        textoConfirmar="Cancelar pedido"
        procesando={procesando}
        alConfirmar={() => cambiarEstado('cancelado')}
        alCancelar={() => setPorCancelar(false)}
      >
        Las prendas vuelven al inventario. Esta acción no se puede deshacer.
      </ModalConfirmacion>
    </>
  );
}
