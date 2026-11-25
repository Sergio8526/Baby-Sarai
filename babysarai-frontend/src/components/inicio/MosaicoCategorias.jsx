/**
 * Mosaico de categorías del inicio: una tarjeta grande y dos pequeñas,
 * cada una con su prenda ilustrada que se inclina al pasar el mouse.
 */
import { Link } from 'react-router';
import { useRevelar } from '../../hooks/useRevelar.js';
import { prendaDeCategoria } from '../../utils/prendas.js';
import Prenda from '../prendas/Prenda.jsx';

/** Colores de fondo de las tarjetas (durazno, rosa y azul de la marca). */
const FONDOS = [
  { fondo: '#F3D6C0', tela: '#FBEADC' },
  { fondo: '#F1CFD6', tela: '#FBE6EA' },
  { fondo: '#C9DCE3', tela: '#E6F0F3' },
];

/**
 * @param {{categorias: Object[]}} props - Se muestran las tres primeras.
 */
export default function MosaicoCategorias({ categorias }) {
  return (
    <div className="cat-mosaico">
      {categorias.slice(0, 3).map((categoria, indice) => (
        <TarjetaCategoria key={categoria.id} categoria={categoria} indice={indice} />
      ))}
    </div>
  );
}

/**
 * @param {{categoria: Object, indice: number}} props
 */
function TarjetaCategoria({ categoria, indice }) {
  const ref = useRevelar();
  const colores = FONDOS[indice % FONDOS.length];

  return (
    <Link
      ref={ref}
      data-revelar
      to={`/catalogo?categoria=${categoria.id}`}
      className={`cat-tile ${indice === 0 ? 'cat-tile--grande' : ''}`}
      style={{ '--fondo-cat': colores.fondo, '--orden': indice }}
    >
      <div className="cat-tile-arte">
        <Prenda tipo={prendaDeCategoria(categoria.nombre)} color={colores.tela} />
      </div>
      <div className="cat-tile-texto">
        <h3>{categoria.nombre}</h3>
        {categoria.descripcion && <span>{categoria.descripcion}</span>}
      </div>
      <span className="cat-flecha" aria-hidden="true">
        →
      </span>
    </Link>
  );
}
