/**
 * Página del catálogo: productos visibles con filtros, búsqueda y orden.
 *
 * Los filtros se guardan en la URL (?categoria=2&estado=usado&q=body). Así el
 * enlace se puede compartir por WhatsApp y al recargar no se pierden.
 * Los productos se traen una sola vez y se filtran en el navegador, porque
 * el inventario de la tienda es pequeño y así la búsqueda responde al instante.
 */
import { useSearchParams } from 'react-router';
import FiltroProductos from '../../components/productos/FiltroProductos.jsx';
import ProductList from '../../components/productos/ProductList.jsx';
import Prenda from '../../components/prendas/Prenda.jsx';
import AvisoError from '../../components/ui/AvisoError.jsx';
import Loader from '../../components/ui/Loader.jsx';
import { useConsulta } from '../../hooks/useConsulta.js';
import { listarCategoriasActivas } from '../../services/categoriaService.js';
import { listarProductosActivos } from '../../services/productoService.js';
import { normalizarTexto } from '../../utils/formato.js';

/** Convierte "1,3" en ["1", "3"] (los filtros de varias opciones van separados por coma). */
const leerLista = (valor) => (valor ? valor.split(',') : []);

/**
 * Aplica búsqueda, filtros y orden a la lista de productos.
 * Es una función pura: no modifica la lista original.
 * @param {Object[]} productos
 * @param {{busqueda: string, categorias: string[], estados: string[], orden: string}} filtros
 * @returns {Object[]}
 */
function filtrarProductos(productos, filtros) {
  const busqueda = normalizarTexto(filtros.busqueda);

  const filtrados = productos.filter((producto) => {
    const texto = normalizarTexto(
      `${producto.nombre} ${producto.descripcion ?? ''} ${producto.categoriaNombre ?? ''} ${producto.talla ?? ''}`
    );
    return (
      (!busqueda || texto.includes(busqueda)) &&
      (filtros.categorias.length === 0 ||
        filtros.categorias.includes(String(producto.categoriaId))) &&
      (filtros.estados.length === 0 || filtros.estados.includes(producto.estado))
    );
  });

  const comparadores = {
    recientes: (a, b) => b.id - a.id,
    'precio-asc': (a, b) => Number(a.precio) - Number(b.precio),
    'precio-desc': (a, b) => Number(b.precio) - Number(a.precio),
    nombre: (a, b) => a.nombre.localeCompare(b.nombre, 'es'),
  };

  return filtrados.sort(comparadores[filtros.orden] ?? comparadores.recientes);
}

/** Nombre del parámetro de la URL para cada filtro. */
const PARAMETROS = { busqueda: 'q', categorias: 'categoria', estados: 'estado', orden: 'orden' };

export default function Catalogo() {
  const [parametros, setParametros] = useSearchParams();
  const productos = useConsulta(listarProductosActivos);
  const categorias = useConsulta(listarCategoriasActivas);

  // Los filtros se leen directamente de la URL (no hace falta useState)
  const filtros = {
    busqueda: parametros.get('q') ?? '',
    categorias: leerLista(parametros.get('categoria')),
    estados: leerLista(parametros.get('estado')),
    orden: parametros.get('orden') ?? 'recientes',
  };

  /** Cambia un filtro en la URL; si queda vacío, se quita el parámetro. */
  const cambiarFiltro = (campo, valor) => {
    const texto = Array.isArray(valor) ? valor.join(',') : valor;
    const nuevos = new URLSearchParams(parametros);
    if (texto) nuevos.set(PARAMETROS[campo], texto);
    else nuevos.delete(PARAMETROS[campo]);
    setParametros(nuevos, { replace: true });
  };

  // Título: si hay una sola categoría elegida se usa su nombre
  const categoriaUnica =
    filtros.categorias.length === 1
      ? categorias.datos?.find((c) => String(c.id) === filtros.categorias[0])
      : null;
  const titulo =
    categoriaUnica?.nombre ?? (filtros.busqueda ? `“${filtros.busqueda}”` : 'Catálogo');

  const resultado = productos.datos ? filtrarProductos(productos.datos, filtros) : [];

  return (
    <main className="section section--tight">
      <div className="wrap">
        <div className="cabecera-catalogo">
          <h1>{titulo}</h1>
          {productos.datos && (
            <p className="results-summary" aria-live="polite">
              {resultado.length}{' '}
              {resultado.length === 1 ? 'producto encontrado' : 'productos encontrados'}
            </p>
          )}
        </div>
      </div>

      <div className="wrap category-layout">
        <FiltroProductos
          filtros={filtros}
          categorias={categorias.datos ?? []}
          alCambiar={cambiarFiltro}
          alLimpiar={() => setParametros({}, { replace: true })}
        />

        <div>
          {productos.cargando && <Loader texto="Colgando las prendas..." />}
          {productos.error && (
            <AvisoError mensaje={productos.error.message} alReintentar={productos.recargar} />
          )}
          {productos.datos && resultado.length > 0 && <ProductList productos={resultado} />}
          {productos.datos && resultado.length === 0 && (
            <div className="empty-state is-visible">
              <div className="vacio-arte" aria-hidden="true">
                <Prenda tipo="escarpines" color="#E3E0EE" />
              </div>
              <p>
                No encontramos productos con esos filtros o esa búsqueda. Prueba quitando alguno o
                usa otro término.
              </p>
            </div>
          )}
        </div>
      </div>
    </main>
  );
}
