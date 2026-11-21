/**
 * Ilustración de una prenda (body, vestido, enterizo, media...).
 * Reemplaza a las fotos mientras la tabla productos no tenga imágenes.
 *
 * Nota sobre dangerouslySetInnerHTML: React no deja insertar HTML como texto
 * para evitar ataques XSS. Aquí es seguro porque los dibujos son constantes
 * escritas por nosotros en dibujos.js; nunca vienen del usuario ni de la API.
 */
import { DIBUJOS } from './dibujos.js';

/**
 * @param {Object} props
 * @param {string} [props.tipo='body'] - Clave de DIBUJOS.
 * @param {string} [props.color] - Color de la tela en hexadecimal.
 */
export default function Prenda({ tipo = 'body', color }) {
  return (
    <svg
      className="prenda"
      viewBox="0 0 120 120"
      aria-hidden="true"
      focusable="false"
      style={color ? { '--tela': color } : undefined}
      dangerouslySetInnerHTML={{ __html: DIBUJOS[tipo] ?? DIBUJOS.body }}
    />
  );
}
