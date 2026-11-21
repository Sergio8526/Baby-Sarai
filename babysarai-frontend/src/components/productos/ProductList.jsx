/**
 * Cuadrícula de productos. Recorre la lista con map() y pinta una ProductCard por cada uno.
 */
import ProductCard from './ProductCard.jsx';

/**
 * @param {Object} props
 * @param {Object[]} props.productos
 * @param {3|4} [props.columnas=3] - Columnas en pantalla grande (clases product-grid--3 / --4).
 * @param {'aparece'|'revelar'} [props.animacion]
 */
export default function ProductList({ productos, columnas = 3, animacion }) {
  return (
    <div className={`product-grid product-grid--${columnas}`}>
      {productos.map((producto, indice) => (
        // key ayuda a React a identificar cada tarjeta cuando la lista cambia
        <ProductCard key={producto.id} producto={producto} orden={indice} animacion={animacion} />
      ))}
    </div>
  );
}
