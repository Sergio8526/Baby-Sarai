/**
 * Protege rutas del front-end.
 *  - Sin sesión: lleva a /ingresar y recuerda a dónde quería ir el usuario.
 *  - Con sesión pero sin el rol pedido: lleva al inicio de la tienda.
 *
 * Importante: esto solo mejora la experiencia. La seguridad real está en la API,
 * que vuelve a revisar el token y el rol en cada petición (401 / 403).
 */
import { Navigate, Outlet, useLocation } from 'react-router';
import { useAuth } from '../../hooks/useAuth.js';
import Loader from '../ui/Loader.jsx';

/**
 * @param {{rol?: 'admin'|'cliente', children?: React.ReactNode}} props
 *   Si no se envía children, muestra las rutas hijas (<Outlet />).
 */
export default function RutaProtegida({ rol, children }) {
  const { usuario, verificando } = useAuth();
  const ubicacion = useLocation();

  if (verificando) return <Loader texto="Verificando tu sesión..." />;

  if (!usuario) {
    return (
      <Navigate to="/ingresar" replace state={{ desde: ubicacion.pathname + ubicacion.search }} />
    );
  }

  if (rol && usuario.rol !== rol) {
    return <Navigate to="/" replace />;
  }

  return children ?? <Outlet />;
}
