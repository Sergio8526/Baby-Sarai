/**
 * Barra de pasos de la compra: Carrito → Datos de envío → Confirmación.
 */

const PASOS = ['Carrito', 'Datos de envío', 'Confirmación'];

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
