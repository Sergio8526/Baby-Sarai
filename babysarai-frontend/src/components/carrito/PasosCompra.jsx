/**
 * Barra de pasos de la compra: Carrito → Pedido por WhatsApp → Confirmación.
 */

const PASOS = ['Carrito', 'Pedido por WhatsApp', 'Confirmación'];

/**
 * @param {{pasoActual: number}} props - Número del paso actual, empezando en 1.
 */
export default function PasosCompra({ pasoActual }) {
  return (
    <ol className="pasos" aria-label="Pasos de la compra">
      {PASOS.map((paso, indice) => {
        const numero = indice + 1;
        const clase = numero === pasoActual ? 'activo' : numero < pasoActual ? 'hecho' : undefined;
        return (
          <li
            key={paso}
            className={clase}
            aria-current={numero === pasoActual ? 'step' : undefined}
          >
            <span>{numero}</span>
            {paso}
          </li>
        );
      })}
    </ol>
  );
}
