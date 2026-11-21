/**
 * Indicador de carga mientras llegan los datos de la API.
 * Es una prenda que se mece colgada, igual que el resto de la marca.
 */
import Prenda from '../prendas/Prenda.jsx';
import styles from './Loader.module.css';

/**
 * @param {{texto?: string}} props
 */
export default function Loader({ texto = 'Cargando...' }) {
  return (
    <div className={styles.contenedor} role="status">
      <div className={styles.prenda}>
        <Prenda tipo="body" color="#F1CFD6" />
      </div>
      <span>{texto}</span>
    </div>
  );
}
