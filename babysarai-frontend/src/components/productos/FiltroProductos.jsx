/**
 * Filtros del catálogo (columna izquierda), con las casillas de la tienda.
 * Es un componente "controlado": no guarda los filtros, los recibe del padre
 * (la página Catalogo) y le avisa cada cambio con alCambiar.
 */
import { ESTADOS_PRODUCTO, ORDENES_CATALOGO } from '../../utils/constantes.js';
import styles from './FiltroProductos.module.css';

/**
 * @param {Object} props
 * @param {{busqueda: string, categorias: string[], estados: string[], orden: string}} props.filtros
 * @param {Object[]} props.categorias - Categorías activas.
 * @param {(campo: string, valor: string|string[]) => void} props.alCambiar
 * @param {() => void} props.alLimpiar
 */
export default function FiltroProductos({ filtros, categorias, alCambiar, alLimpiar }) {
  /** Agrega o quita un valor de una lista (las casillas permiten varias opciones). */
  const alternar = (campo, valor) => {
    const lista = filtros[campo];
    alCambiar(campo, lista.includes(valor) ? lista.filter((v) => v !== valor) : [...lista, valor]);
  };

  const hayFiltros =
    filtros.busqueda || filtros.categorias.length > 0 || filtros.estados.length > 0;

  return (
    <aside className="filters" aria-label="Filtros">
      <h2 className="filters-titulo">Filtrar por</h2>

      <div className={styles.grupo}>
        <label className={styles.etiqueta} htmlFor="busqueda-catalogo">
          Buscar
        </label>
        <input
          id="busqueda-catalogo"
          className={styles.campo}
          type="search"
          placeholder="Body, pijama, 0-3M..."
          value={filtros.busqueda}
          onChange={(evento) => alCambiar('busqueda', evento.target.value)}
        />
      </div>

      <fieldset className="filter-group">
        <legend>Categoría</legend>
        {categorias.map((categoria) => (
          <label key={categoria.id} className="filter-option">
            <input
              type="checkbox"
              checked={filtros.categorias.includes(String(categoria.id))}
              onChange={() => alternar('categorias', String(categoria.id))}
            />
            {categoria.nombre}
          </label>
        ))}
      </fieldset>

      <fieldset className="filter-group">
        <legend>Estado</legend>
        {ESTADOS_PRODUCTO.map((estado) => (
          <label key={estado.valor} className="filter-option">
            <input
              type="checkbox"
              checked={filtros.estados.includes(estado.valor)}
              onChange={() => alternar('estados', estado.valor)}
            />
            {estado.texto}
          </label>
        ))}
      </fieldset>

      <div className={styles.grupo}>
        <label className={styles.etiqueta} htmlFor="orden-catalogo">
          Ordenar por
        </label>
        <select
          id="orden-catalogo"
          className={styles.campo}
          value={filtros.orden}
          onChange={(evento) => alCambiar('orden', evento.target.value)}
        >
          {ORDENES_CATALOGO.map((orden) => (
            <option key={orden.valor} value={orden.valor}>
              {orden.texto}
            </option>
          ))}
        </select>
      </div>

      {hayFiltros && (
        <button type="button" className={`filters-ayuda ${styles.limpiar}`} onClick={alLimpiar}>
          Quitar todos los filtros
        </button>
      )}
    </aside>
  );
}
