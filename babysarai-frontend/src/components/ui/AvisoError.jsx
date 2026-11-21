/**
 * Aviso de la tienda cuando la API no responde o devuelve un error.
 * Usa la caja punteada de los estados vacíos de la tienda.
 */
import Prenda from '../prendas/Prenda.jsx';
import styles from './AvisoError.module.css';

/**
 * @param {Object} props
 * @param {string} props.mensaje - Texto del error (viene de ErrorApi).
 * @param {() => void} [props.alReintentar] - Si se envía, muestra el botón Reintentar.
 */
export default function AvisoError({ mensaje, alReintentar }) {
  return (
    <div className={`empty-state is-visible ${styles.aviso}`} role="alert">
      <div className="vacio-arte" aria-hidden="true">
        <Prenda tipo="media" color="#F1CFD6" />
      </div>
      <p className="vacio-titulo">Algo se enredó en el tendedero</p>
      <p>{mensaje}</p>
      {alReintentar && (
        <button type="button" className="btn btn-quieto" onClick={alReintentar}>
          Reintentar
        </button>
      )}
    </div>
  );
}
