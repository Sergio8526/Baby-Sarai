/**
 * Página 404 de la tienda: una media solitaria colgada en la cuerda.
 */
import { Link } from 'react-router';
import Prenda from '../components/prendas/Prenda.jsx';

export default function NotFound() {
  return (
    <main className="wrap error-page">
      <div className="error-tendedero" aria-hidden="true">
        <svg viewBox="0 0 300 70" preserveAspectRatio="none">
          <path d="M0 12 Q 150 62 300 12" />
        </svg>
        <div className="error-media">
          <Prenda tipo="media" color="#F1CFD6" />
          <span className="gancho" />
        </div>
      </div>
      <p className="error-code">404</p>
      <h1>No encontramos esta página</h1>
      <p>
        Se perdió, como esa media que nunca vuelve de la lavadora. El enlace puede estar roto o la
        página pudo haberse movido, pero seguro encuentras algo lindo para el bebé en nuestro
        catálogo.
      </p>
      <Link to="/" className="btn btn-primary">
        Volver al inicio
      </Link>
    </main>
  );
}
