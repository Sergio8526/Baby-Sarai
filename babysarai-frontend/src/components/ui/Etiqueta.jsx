/**
 * Etiqueta de estado del panel ("Visible", "Oculto", "Activa"...),
 * con un punto de color delante.
 */

/**
 * @param {Object} props
 * @param {'si'|'no'|'aviso'} props.tono
 * @param {React.ReactNode} props.children
 */
export default function Etiqueta({ tono, children }) {
  return <span className={`etiqueta ${tono}`}>{children}</span>;
}
