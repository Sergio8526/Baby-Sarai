/**
 * Etiqueta con el estado de un pedido (Pendiente, Pagado, Enviado...).
 * Sirve en la tienda y en el panel: el color sale de la clase estado-<nombre> (cuenta.css)
 * o de la clase "etiqueta" del panel.
 */
import { infoEstado } from '../../utils/pedidos.js';

/**
 * @param {{estado: string, enPanel?: boolean}} props
 */
export default function EstadoPedido({ estado, enPanel = false }) {
  const { texto, tono } = infoEstado(estado);
  return (
    <span className={enPanel ? `etiqueta ${tono}` : `estado-pedido estado-${estado}`}>{texto}</span>
  );
}
