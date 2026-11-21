/**
 * Página de inicio con el diseño de la tienda: portada con tendedero,
 * promesas de compra, mosaico de categorías, productos destacados,
 * explicación de nuevo y seminuevo, y buscador de tallas.
 */
import { useEffect, useState } from 'react';
import { Link } from 'react-router';
import BuscadorTallas from '../../components/inicio/BuscadorTallas.jsx';
import MosaicoCategorias from '../../components/inicio/MosaicoCategorias.jsx';
import Tendedero from '../../components/inicio/Tendedero.jsx';
import ProductList from '../../components/productos/ProductList.jsx';
import AvisoError from '../../components/ui/AvisoError.jsx';
import Loader from '../../components/ui/Loader.jsx';
import { useConsulta } from '../../hooks/useConsulta.js';
import { useRevelar } from '../../hooks/useRevelar.js';
import { listarCategoriasActivas } from '../../services/categoriaService.js';
import { listarProductosActivos } from '../../services/productoService.js';

/** Cantidad de productos en "Recién llegados". */
const CANTIDAD_DESTACADOS = 4;

export default function Home() {
  const productos = useConsulta(listarProductosActivos);
  const categorias = useConsulta(listarCategoriasActivas);

  // Activa la animación de entrada de la portada un instante después de montar,
  // para que el navegador alcance a pintar el estado inicial (prendas arriba y transparentes).
  const [portadaLista, setPortadaLista] = useState(false);
  useEffect(() => {
    let segundo;
    const primero = requestAnimationFrame(() => {
      segundo = requestAnimationFrame(() => setPortadaLista(true));
    });
    return () => {
      cancelAnimationFrame(primero);
      cancelAnimationFrame(segundo);
    };
  }, []);

  // El id más alto es el último producto creado
  const recientes = [...(productos.datos ?? [])]
    .sort((a, b) => b.id - a.id)
    .slice(0, CANTIDAD_DESTACADOS);

  return (
    <main>
      <section className={`portada ${portadaLista ? 'portada-lista' : ''}`}>
        <div className="wrap portada-grid">
          <div className="portada-texto">
            <h1 className="portada-titulo">
              <span className="linea">
                <span>
                  Ropa <em>suave</em>
                </span>
              </span>
              <span className="linea">
                <span>y segura para los</span>
              </span>
              <span className="linea">
                <span>primeros años</span>
              </span>
            </h1>
            <p className="portada-bajada">
              Prendas nuevas y seminuevas, escogidas una por una: cómodas para tu bebé y amables con
              el bolsillo.
            </p>
            <div className="portada-acciones">
              <Link to="/catalogo" className="btn btn-primary">
                Ver colección
              </Link>
              <a href="#tallas" className="btn btn-quieto">
                ¿Qué talla necesita?
              </a>
            </div>
          </div>
          <Tendedero />
        </div>
      </section>

      <section className="promesas" aria-label="Cómo compras en Baby Saraí">
        <ul className="wrap promesas-lista">
          <li>
            <strong>Pedido por WhatsApp</strong>
            <span>Te confirmamos disponibilidad al instante</span>
          </li>
          <li>
            <strong>Envío fijo de $8.000</strong>
            <span>A cualquier ciudad de Colombia</span>
          </li>
          <li>
            <strong>Cambios hasta 15 días</strong>
            <span>Prendas nuevas con etiqueta</span>
          </li>
        </ul>
      </section>

      <section className="section">
        <div className="wrap">
          <div className="section-heading">
            <h2>Compra por categoría</h2>
            <Link to="/catalogo" className="eyebrow-link">
              Ver todas
            </Link>
          </div>
          {categorias.datos && <MosaicoCategorias categorias={categorias.datos} />}
        </div>
      </section>

      <section className="section section--tight">
        <div className="wrap">
          <div className="section-heading">
            <h2>Recién llegados</h2>
            <Link to="/catalogo" className="eyebrow-link">
              Ver todo
            </Link>
          </div>
          {productos.cargando && <Loader texto="Colgando las prendas..." />}
          {productos.error && (
            <AvisoError mensaje={productos.error.message} alReintentar={productos.recargar} />
          )}
          {productos.datos && (
            <ProductList productos={recientes} columnas={4} animacion="revelar" />
          )}
        </div>
      </section>

      <section className="section dos-vidas">
        <div className="wrap dos-vidas-grid">
          <div className="dos-vidas-texto">
            <h2>
              Cada prenda trae su <em>etiqueta</em> clara
            </h2>
            <p>
              Los bebés crecen rápido y mucha ropa se usa apenas unas semanas. Por eso vendemos
              prendas nuevas y también seminuevas en excelente estado, siempre identificadas.
            </p>
            <Link to="/catalogo?estado=usado" className="eyebrow-link">
              Ver prendas seminuevas
            </Link>
          </div>
          <div className="dos-vidas-etiquetas">
            <EtiquetaGrande titulo="Nuevo" dato="Cambios hasta 15 días">
              Con etiqueta original, de proveedores locales.
            </EtiquetaGrande>
            <EtiquetaGrande titulo="Seminuevo" dato="Cambios hasta 8 días" seminuevo>
              Revisamos tela, costuras y cierres antes de publicarla.
            </EtiquetaGrande>
          </div>
        </div>
      </section>

      <section className="section" id="tallas">
        <div className="wrap">
          <BuscadorTallas />
        </div>
      </section>
    </main>
  );
}

/**
 * Etiqueta grande colgante (sección "nuevo y seminuevo").
 * @param {{titulo: string, dato: string, seminuevo?: boolean, children: React.ReactNode}} props
 */
function EtiquetaGrande({ titulo, dato, seminuevo = false, children }) {
  const ref = useRevelar();
  return (
    <article ref={ref} data-revelar className={`tag-grande ${seminuevo ? 'tag-grande--semi' : ''}`}>
      <span className="tag-ojal" aria-hidden="true" />
      <h3>{titulo}</h3>
      <p>{children}</p>
      <p className="tag-dato">{dato}</p>
    </article>
  );
}
