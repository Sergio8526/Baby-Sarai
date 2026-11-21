/**
 * Barra lateral del panel de administración (diseño de public/css/admin.css):
 * fondo oscuro, nombre de la marca con costura punteada y menú con íconos.
 */
import { Link, NavLink } from 'react-router';

// Íconos dibujados en SVG (los mismos del panel HTML)
const ICONOS = {
  resumen: <path d="M4 20V10M10 20V4M16 20v-7M22 20H2" />,
  productos: <path d="M8 3 4 5.5v4L6 9v12h12V9l2 .5v-4L16 3c-.6 1.7-2.1 2.8-4 2.8S8.6 4.7 8 3Z" />,
  categorias: (
    <>
      <path d="M3.5 12.2V4.5a1 1 0 0 1 1-1h7.7l8.3 8.3a1.4 1.4 0 0 1 0 2l-6.7 6.7a1.4 1.4 0 0 1-2 0l-8.3-8.3Z" />
      <circle cx="8.2" cy="8.2" r="1.4" />
    </>
  ),
  tienda: <path d="M3 9.5 12 3l9 6.5V21h-6v-6H9v6H3Z" />,
};

const ENLACES = [
  { ruta: '/admin', texto: 'Resumen', icono: 'resumen', exacta: true },
  { ruta: '/admin/productos', texto: 'Productos', icono: 'productos' },
  { ruta: '/admin/categorias', texto: 'Categorías', icono: 'categorias' },
];

/** Dibuja un ícono con el trazo del panel. */
function Icono({ nombre }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.75"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      {ICONOS[nombre]}
    </svg>
  );
}

export default function Sidebar() {
  return (
    <header className="barra">
      <Link to="/admin" className="marca">
        <span className="marca-nombre">Baby Saraí</span>
        <span className="marca-detalle">Panel de administración</span>
      </Link>

      <nav aria-label="Secciones del panel">
        {ENLACES.map((enlace) => (
          // NavLink agrega la clase "activo" y aria-current="page" a la sección abierta
          <NavLink
            key={enlace.ruta}
            to={enlace.ruta}
            end={enlace.exacta}
            className={({ isActive }) => (isActive ? 'activo' : undefined)}
          >
            <Icono nombre={enlace.icono} />
            {enlace.texto}
          </NavLink>
        ))}
      </nav>

      <Link to="/" className="ver-tienda">
        <Icono nombre="tienda" />
        Ver la tienda
      </Link>
    </header>
  );
}
