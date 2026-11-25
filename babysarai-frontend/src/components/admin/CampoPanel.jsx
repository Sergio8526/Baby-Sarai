/**
 * Campo de los formularios del panel: la etiqueta envuelve al control,
 * como en el panel HTML, y debajo se muestra el error de validación.
 */

/**
 * @param {Object} props
 * @param {string} props.etiqueta - Texto de la etiqueta (con * si es obligatorio).
 * @param {string} [props.ancho='completo'] - Clase de columnas: span-3, span-4, span-5, span-7 o completo.
 * @param {string} [props.error] - Mensaje de error del campo.
 * @param {'input'|'select'} [props.como='input']
 * @param {React.ReactNode} [props.children] - Opciones del select.
 */
export default function CampoPanel({
  etiqueta,
  ancho = 'completo',
  error,
  como = 'input',
  children,
  ...resto
}) {
  const Control = como; // "input" o "select" usados como etiqueta JSX

  return (
    <label className={ancho}>
      {etiqueta}
      <Control aria-invalid={Boolean(error)} {...resto}>
        {children}
      </Control>
      {error && <small className="campo-error">{error}</small>}
    </label>
  );
}
