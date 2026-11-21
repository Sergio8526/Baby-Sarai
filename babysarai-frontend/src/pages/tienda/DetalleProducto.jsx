/**
 * Detalle de un producto. Lee el id de la URL (/producto/:id) y lo consulta en la API.
 * Diseño de la tienda: la prenda cuelga de una cuerda y se mece, el precio va
 * en una etiqueta colgante y al agregar al carrito la prenda da un saltito.
 */
import { useCallback, useRef, useState } from 'react';
import { Link, useParams } from 'react-router';
import Prenda from '../../components/prendas/Prenda.jsx';
import ProductList from '../../components/productos/ProductList.jsx';
import AvisoError from '../../components/ui/AvisoError.jsx';
import Loader from '../../components/ui/Loader.jsx';
import { useCart } from '../../hooks/useCart.js';
import { useConsulta } from '../../hooks/useConsulta.js';
import { listarProductosActivos, obtenerProducto } from '../../services/productoService.js';
import { STOCK_BAJO, textoEstado } from '../../utils/constantes.js';
import { formatearPrecio } from '../../utils/formato.js';
import { prendaDeProducto } from '../../utils/prendas.js';

/** Cantidad de productos relacionados que se muestran abajo. */
const CANTIDAD_RELACIONADOS = 4;

export default function DetalleProducto() {
  const { id } = useParams();
  // useCallback: la función solo cambia cuando cambia el id, y entonces se vuelve a consultar
  const consultar = useCallback(() => obtenerProducto(id), [id]);
  const { datos: producto, cargando, error } = useConsulta(consultar);
  const todos = useConsulta(listarProductosActivos);

  if (cargando) return <Loader texto="Descolgando la prenda..." />;

  if (error) {
    return (
      <main className="section section--tight">
        <div className="wrap">
          <AvisoError
            mensaje={
              error.estado === 404
                ? 'Este producto no existe o ya no está disponible.'
                : error.message
            }
          />
          <p style={{ textAlign: 'center' }}>
            <Link to="/catalogo" className="btn btn-outline">
              Volver al catálogo
            </Link>
          </p>
        </div>
      </main>
    );
  }

  const relacionados = (todos.datos ?? [])
    .filter((p) => p.categoriaId === producto.categoriaId && p.id !== producto.id)
    .slice(0, CANTIDAD_RELACIONADOS);

  return (
    <main className="section section--tight">
      <div className="wrap">
        <p className="breadcrumb">
          <Link to="/catalogo">Catálogo</Link> /{' '}
          <Link to={`/catalogo?categoria=${producto.categoriaId}`}>{producto.categoriaNombre}</Link>{' '}
          / <span>{producto.nombre}</span>
        </p>
      </div>

      {/* key: si se navega a otro producto, el detalle se crea de nuevo con la cantidad en 1 */}
      <FichaProducto key={producto.id} producto={producto} />

      {relacionados.length > 0 && (
        <section className="wrap relacionados">
          <div className="section-heading">
            <h2>También te puede gustar</h2>
          </div>
          <ProductList productos={relacionados} columnas={4} />
        </section>
      )}
    </main>
  );
}

/**
 * Imagen colgante, datos, cantidad y botón de agregar.
 * @param {{producto: Object}} props
 */
function FichaProducto({ producto }) {
  const { items, agregar } = useCart();
  const [cantidad, setCantidad] = useState(1);
  const [confirmacion, setConfirmacion] = useState('');
  const colgada = useRef(null);
  const { tipo, color } = prendaDeProducto(producto);

  // No se puede agregar más de lo que hay en stock, contando lo que ya está en el carrito
  const enCarrito = items.find((item) => item.id === producto.id)?.cantidad ?? 0;
  const disponibles = producto.activo ? producto.stock - enCarrito : 0;

  const manejarAgregar = () => {
    agregar(producto, cantidad);
    setConfirmacion(`Agregado: ${cantidad} × ${producto.nombre}`);
    setCantidad(1);

    // La prenda da un saltito (clase .salta de tienda.css); se reinicia la animación en el DOM
    const elemento = colgada.current;
    elemento.classList.remove('salta');
    void elemento.offsetWidth;
    elemento.classList.add('salta');
  };

  return (
    <div className="wrap product-detail">
      <div className="product-detail-image" style={{ '--fondo-prenda': color }}>
        <span className="detalle-cuerda" aria-hidden="true" />
        <div ref={colgada} className="detalle-colgada">
          <span className="gancho" />
          <span className="gancho" />
          <Prenda tipo={tipo} color={color} />
        </div>
      </div>

      <div className="detalle-info">
        <h1>{producto.nombre}</h1>
        <span className="product-price precio-etiqueta">{formatearPrecio(producto.precio)}</span>
        <p className="product-desc">
          {producto.descripcion || 'Prenda seleccionada por Baby Saraí.'}
        </p>

        {producto.talla && (
          <>
            <span className="field-label">Talla</span>
            <div className="size-options">
              <span className="size-chip" aria-pressed="true">
                {producto.talla}
              </span>
            </div>
          </>
        )}

        <span className="field-label">Cantidad</span>
        <div className="qty-row">
          <div className="qty-control">
            <button
              type="button"
              aria-label="Restar"
              onClick={() => setCantidad((c) => Math.max(1, c - 1))}
              disabled={cantidad <= 1}
            >
              −
            </button>
            <span aria-live="polite">{cantidad}</span>
            <button
              type="button"
              aria-label="Sumar"
              onClick={() => setCantidad((c) => Math.min(disponibles, c + 1))}
              disabled={cantidad >= disponibles}
            >
              +
            </button>
          </div>
          {disponibles > 0 && producto.stock <= STOCK_BAJO && (
            <span className="field-label">¡Quedan {producto.stock}!</span>
          )}
        </div>

        <button
          type="button"
          className="btn btn-primary btn-block"
          onClick={manejarAgregar}
          disabled={disponibles <= 0}
        >
          {!producto.activo || producto.stock === 0
            ? 'Agotado'
            : disponibles <= 0
              ? 'Ya tienes todas las unidades en el carrito'
              : 'Agregar al carrito'}
        </button>

        <p className={`add-confirm ${confirmacion ? 'is-visible' : ''}`} role="status">
          <svg
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden="true"
          >
            <path d="M20 6 9 17l-5-5" />
          </svg>
          <span>
            {confirmacion} · <Link to="/carrito">Ver carrito</Link>
          </span>
        </p>

        <ul className="product-meta-list">
          <li>
            <span>Categoría</span>
            <span>{producto.categoriaNombre}</span>
          </li>
          <li>
            <span>Estado</span>
            <span>
              {producto.estado === 'nuevo'
                ? 'Nuevo con etiqueta'
                : `${textoEstado(producto.estado)}, buen estado`}
            </span>
          </li>
          <li>
            <span>Disponibles</span>
            <span>{producto.stock}</span>
          </li>
          <li>
            <span>Envío</span>
            <span>2–4 días hábiles</span>
          </li>
        </ul>
      </div>
    </div>
  );
}
