/**
 * Pie de página de la tienda (diseño de babysarai-web).
 */
import { Link } from 'react-router';
import { useConsulta } from '../../hooks/useConsulta.js';
import { listarCategoriasActivas } from '../../services/categoriaService.js';
import { CONTACTO } from '../../utils/constantes.js';

export default function Footer() {
  const { datos: categorias } = useConsulta(listarCategoriasActivas);
  const anioActual = new Date().getFullYear();

  return (
    <footer className="site-footer">
      <div className="wrap footer-grid">
        <div className="footer-brand">
          <span className="logo">Baby Saraí</span>
          <p>
            Ropa de bebé nueva y seminueva, escogida con cariño para acompañar los primeros años.
          </p>
        </div>
        <div>
          <h4>Tienda</h4>
          <ul>
            {(categorias ?? []).slice(0, 4).map((categoria) => (
              <li key={categoria.id}>
                <Link to={`/catalogo?categoria=${categoria.id}`}>{categoria.nombre}</Link>
              </li>
            ))}
          </ul>
        </div>
        <div>
          <h4>Ayuda</h4>
          <ul>
            <li>
              <Link to="/carrito">Mi carrito</Link>
            </li>
            <li>
              <Link to="/mis-pedidos">Mis pedidos</Link>
            </li>
            <li>
              <Link to="/catalogo">Todo el catálogo</Link>
            </li>
            <li>
              <a href={`https://wa.me/${CONTACTO.whatsapp}`} target="_blank" rel="noreferrer">
                WhatsApp
              </a>
            </li>
          </ul>
        </div>
        <div>
          <h4>Administración</h4>
          <ul>
            <li>
              <Link to="/admin">Panel de la tienda</Link>
            </li>
          </ul>
        </div>
        <div>
          <h4>Síguenos</h4>
          <ul>
            <li>
              <a href={CONTACTO.instagram} target="_blank" rel="noreferrer">
                Instagram
              </a>
            </li>
            <li>
              <a href={CONTACTO.facebook} target="_blank" rel="noreferrer">
                Facebook
              </a>
            </li>
          </ul>
        </div>
      </div>
      <div className="footer-bottom">
        © {anioActual} Baby Saraí — Ropa de bebé nueva y seminueva
      </div>
    </footer>
  );
}
