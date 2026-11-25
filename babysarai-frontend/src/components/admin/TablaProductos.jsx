/**
 * Tabla de inventario del panel, con botones de editar y eliminar por fila.
 */
import { STOCK_BAJO, textoEstado } from '../../utils/constantes.js';
import { formatearPrecio } from '../../utils/formato.js';
import Etiqueta from '../ui/Etiqueta.jsx';

/**
 * @param {Object} props
 * @param {Object[]} props.productos
 * @param {(producto: Object) => void} props.alEditar
 * @param {(producto: Object) => void} props.alEliminar
 */
export default function TablaProductos({ productos, alEditar, alEliminar }) {
  return (
    <div className="tabla-contenedor">
      <table className="tabla-productos">
        <thead>
          <tr>
            <th scope="col">Nombre</th>
            <th scope="col">Categoría</th>
            <th scope="col">Talla</th>
            <th scope="col">Estado</th>
            <th scope="col" className="num">
              Precio
            </th>
            <th scope="col" className="num">
              Stock
            </th>
            <th scope="col">Tienda</th>
            <th scope="col">Acciones</th>
          </tr>
        </thead>
        <tbody>
          {productos.length === 0 && (
            <tr>
              <td colSpan={8} className="vacio">
                No hay productos que coincidan con el filtro.
              </td>
            </tr>
          )}
          {productos.map((producto) => (
            <tr key={producto.id}>
              <td>{producto.nombre}</td>
              <td>{producto.categoriaNombre}</td>
              <td>{producto.talla || '—'}</td>
              <td>{textoEstado(producto.estado)}</td>
              <td className="num">{formatearPrecio(producto.precio)}</td>
              <td className="num">
                {producto.stock <= STOCK_BAJO ? (
                  <Etiqueta tono={producto.stock === 0 ? 'no' : 'aviso'}>{producto.stock}</Etiqueta>
                ) : (
                  producto.stock
                )}
              </td>
              <td>
                <Etiqueta tono={producto.activo ? 'si' : 'no'}>
                  {producto.activo ? 'Visible' : 'Oculto'}
                </Etiqueta>
              </td>
              <td className="acciones-fila">
                <button type="button" className="pequeno" onClick={() => alEditar(producto)}>
                  Editar
                </button>
                <button
                  type="button"
                  className="pequeno peligro"
                  onClick={() => alEliminar(producto)}
                >
                  Eliminar
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
