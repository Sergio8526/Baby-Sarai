/**
 * Mensaje del panel (éxito o error), con el ícono y colores de admin.css.
 */

/**
 * @param {Object} props
 * @param {'exito'|'error'} props.tipo
 * @param {string[]} [props.detalles] - Errores de validación que envía la API.
 * @param {() => void} [props.alCerrar]
 * @param {React.ReactNode} props.children - Mensaje principal.
 */
export default function Mensaje({ tipo, detalles = [], alCerrar, children }) {
  return (
    <div className={`mensaje ${tipo}`} role={tipo === 'error' ? 'alert' : 'status'}>
      <div>
        {children}
        {detalles.length > 0 && (
          <ul>
            {detalles.map((detalle) => (
              <li key={detalle}>{detalle}</li>
            ))}
          </ul>
        )}
      </div>
      {alCerrar && (
        <button type="button" className="cerrar" onClick={alCerrar} aria-label="Cerrar mensaje">
          ×
        </button>
      )}
    </div>
  );
}
