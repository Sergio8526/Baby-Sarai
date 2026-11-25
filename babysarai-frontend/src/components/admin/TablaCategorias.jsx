/**
 * Tabla de categorías del panel.
 * Muestra cuántos productos tiene cada una: la base de datos no deja eliminar
 * una categoría que todavía tenga productos (ON DELETE RESTRICT).
 */
import Etiqueta from '../ui/Etiqueta.jsx';

/**
 * @param {Object} props
 * @param {Object[]} props.categorias
 * @param {Object<number, number>} props.conteoProductos - Productos por id de categoría.
 * @param {(categoria: Object) => void} props.alEditar
 * @param {(categoria: Object) => void} props.alEliminar
 */
export default function TablaCategorias({ categorias, conteoProductos, alEditar, alEliminar }) {
  return (
    <div className="tabla-contenedor">
      <table>
        <thead>
          <tr>
            <th scope="col">Nombre</th>
            <th scope="col">Descripción</th>
            <th scope="col" className="num">
              Productos
            </th>
            <th scope="col">Estado</th>
            <th scope="col">Acciones</th>
          </tr>
        </thead>
        <tbody>
          {categorias.length === 0 && (
            <tr>
              <td colSpan={5} className="vacio">
                Todavía no hay categorías registradas.
              </td>
            </tr>
          )}
          {categorias.map((categoria) => {
            const totalProductos = conteoProductos[categoria.id] ?? 0;
            return (
              <tr key={categoria.id}>
                <td>{categoria.nombre}</td>
                <td>{categoria.descripcion || '—'}</td>
                <td className="num">{totalProductos}</td>
                <td>
                  <Etiqueta tono={categoria.activo ? 'si' : 'no'}>
                    {categoria.activo ? 'Activa' : 'Inactiva'}
                  </Etiqueta>
                </td>
                <td className="acciones-fila">
                  <button type="button" className="pequeno" onClick={() => alEditar(categoria)}>
                    Editar
                  </button>
                  <button
                    type="button"
                    className="pequeno peligro"
                    onClick={() => alEliminar(categoria)}
                    disabled={totalProductos > 0}
                    title={totalProductos > 0 ? 'Primero mueve o elimina sus productos' : undefined}
                  >
                    Eliminar
                  </button>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
