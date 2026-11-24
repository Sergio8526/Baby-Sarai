/**
 * Barra lateral del panel de administración (diseño de public/css/admin.css):
 * fondo oscuro, nombre de la marca con costura punteada, menú con íconos
 * y la sesión de la administradora con el botón para salir.
 */
import { Link, NavLink, useNavigate } from 'react-router';
import { useAuth } from '../../hooks/useAuth.js';

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
  pedidos: (
    <>
      <path d="M6 3h12l1 18H5L6 3Z" />
      <path d="M9 7a3 3 0 0 0 6 0" />
    </>
  ),
  usuarios: (
    <>
      <circle cx="9" cy="8" r="3.5" />
      <path d="M2.5 20c1-3.5 3.5-5.5 6.5-5.5s5.5 2 6.5 5.5M16 4.5a3.5 3.5 0 0 1 0 7M18.5 14.8c1.5.8 2.5 2.6 3 5.2" />
    </>
  ),
  tienda: <path d="M3 9.5 12 3l9 6.5V21h-6v-6H9v6H3Z" />,
  salir: <path d="M15 4h4a1 1 0 0 1 1 1v14a1 1 0 0 1-1 1h-4M10 8l-4 4 4 4M6 12h10" />,
};

const ENLACES = [
  { ruta: '/admin', texto: 'Resumen', icono: 'resumen', exacta: true },
  { ruta: '/admin/productos', texto: 'Productos', icono: 'productos' },
  { ruta: '/admin/categorias', texto: 'Categorías', icono: 'categorias' },
  { ruta: '/admin/pedidos', texto: 'Pedidos', icono: 'pedidos' },
  { ruta: '/admin/usuarios', texto: 'Usuarios', icono: 'usuarios' },
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
  const { usuario, cerrarSesion } = useAuth();
  const navigate = useNavigate();

  const salir = () => {
    cerrarSesion();
    navigate('/ingresar');
  };

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

      <div className="sesion-panel">
        <p>
          <span>Sesión de</span>
          <strong>{usuario?.nombre}</strong>
        </p>
        <button type="button" className="ver-tienda salir" onClick={salir}>
          <Icono nombre="salir" />
          Cerrar sesión
        </button>
      </div>

      <Link to="/" className="ver-tienda">
        <Icono nombre="tienda" />
        Ver la tienda
      </Link>
    </header>
  );
}
