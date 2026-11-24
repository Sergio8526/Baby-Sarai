/**
 * Encabezado de la tienda (diseño de babysarai-web): logo, menú con las
 * categorías activas, buscador desplegable, cuenta del usuario y botón del
 * carrito con contador.
 */
import { useEffect, useRef, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router';
import { useAuth } from '../../hooks/useAuth.js';
import { useCart } from '../../hooks/useCart.js';
import { useConsulta } from '../../hooks/useConsulta.js';
import { listarCategoriasActivas } from '../../services/categoriaService.js';

/** Ícono de la cuenta (silueta). */
function IconoCuenta() {
  return (
    <svg
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      aria-hidden="true"
    >
      <circle cx="12" cy="8" r="4" />
      <path d="M4 21c1.5-4 4.5-6 8-6s6.5 2 8 6" />
    </svg>
  );
}

/** Cuántas categorías caben en el menú antes de que se vea apretado. */
const CATEGORIAS_EN_MENU = 3;

export default function Header() {
  const { totalUnidades } = useCart();
  const { usuario, esAdmin, cerrarSesion } = useAuth();
  const { datos: categorias } = useConsulta(listarCategoriasActivas);
  const { pathname, search } = useLocation();
  const navigate = useNavigate();

  const [menuAbierto, setMenuAbierto] = useState(false);
  const [buscadorAbierto, setBuscadorAbierto] = useState(false);
  const [busqueda, setBusqueda] = useState('');
  const inputBusqueda = useRef(null);
  const contador = useRef(null);
  const totalAnterior = useRef(totalUnidades);

  // El contador "rebota" cuando aumenta (clase .rebota de tienda.css).
  // Se reinicia la animación quitando y poniendo la clase directamente en el DOM.
  useEffect(() => {
    const elemento = contador.current;
    if (elemento && totalUnidades > totalAnterior.current) {
      elemento.classList.remove('rebota');
      void elemento.offsetWidth; // obliga al navegador a "olvidar" la animación anterior
      elemento.classList.add('rebota');
    }
    totalAnterior.current = totalUnidades;
  }, [totalUnidades]);

  /** Marca el enlace de la página actual (aria-current) para el subrayado de costura. */
  const actual = (ruta, consulta = '') =>
    pathname === ruta && (consulta ? search === consulta : !search) ? 'page' : undefined;

  const alternarBuscador = () => {
    setBuscadorAbierto((abierto) => !abierto);
    // Espera a que el campo sea visible para enfocarlo
    setTimeout(() => inputBusqueda.current?.focus(), 200);
  };

  /** Al presionar Enter se va al catálogo con el texto buscado en la URL. */
  const buscar = (evento) => {
    evento.preventDefault();
    const texto = busqueda.trim();
    navigate(texto ? `/catalogo?q=${encodeURIComponent(texto)}` : '/catalogo');
    setMenuAbierto(false);
  };

  const cerrarMenu = () => setMenuAbierto(false);

  /** Cierra la sesión y vuelve al inicio (así ninguna página privada queda abierta). */
  const salir = () => {
    navigate('/');
    setMenuAbierto(false);
    cerrarSesion();
  };

  return (
    <header className="site-header">
      <div className="wrap">
        <Link to="/" className="logo" onClick={cerrarMenu}>
          Baby Saraí
        </Link>

        <nav className={`main-nav ${menuAbierto ? 'is-open' : ''}`} aria-label="Menú principal">
          <ul>
            <li>
              <Link to="/" aria-current={actual('/')} onClick={cerrarMenu}>
                Inicio
              </Link>
            </li>
            <li>
              <Link to="/catalogo" aria-current={actual('/catalogo')} onClick={cerrarMenu}>
                Catálogo
              </Link>
            </li>
            {(categorias ?? []).slice(0, CATEGORIAS_EN_MENU).map((categoria) => (
              <li key={categoria.id}>
                <Link
                  to={`/catalogo?categoria=${categoria.id}`}
                  aria-current={actual('/catalogo', `?categoria=${categoria.id}`)}
                  onClick={cerrarMenu}
                >
                  {categoria.nombre}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <div className="header-actions">
          <button
            type="button"
            className="icon-btn"
            aria-label="Buscar"
            aria-expanded={buscadorAbierto}
            onClick={alternarBuscador}
          >
            <svg
              width="19"
              height="19"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              aria-hidden="true"
            >
              <circle cx="11" cy="11" r="7" />
              <path d="m21 21-4.3-4.3" />
            </svg>
            <span>Buscar</span>
          </button>
          <form
            className={`search-box ${buscadorAbierto ? 'is-open' : ''}`}
            role="search"
            onSubmit={buscar}
          >
            <div>
              <input
                ref={inputBusqueda}
                type="search"
                placeholder="Buscar productos..."
                aria-label="Buscar productos"
                value={busqueda}
                onChange={(evento) => setBusqueda(evento.target.value)}
                tabIndex={buscadorAbierto ? 0 : -1}
              />
            </div>
          </form>

          {usuario ? (
            <div className="cuenta-menu">
              <Link
                to={esAdmin ? '/admin' : '/mis-pedidos'}
                className="cuenta-link"
                onClick={cerrarMenu}
                title={esAdmin ? 'Ir al panel' : 'Ver mis pedidos'}
              >
                <IconoCuenta />
                <span>{esAdmin ? 'Panel' : usuario.nombre.split(' ')[0]}</span>
              </Link>
              <button type="button" className="cuenta-salir" onClick={salir}>
                Salir
              </button>
            </div>
          ) : (
            <Link to="/ingresar" className="cuenta-link" onClick={cerrarMenu}>
              <IconoCuenta />
              <span>Ingresar</span>
            </Link>
          )}

          <Link to="/carrito" className="cart-link" onClick={cerrarMenu}>
            Carrito{' '}
            <span ref={contador} className="cart-count" aria-label={`${totalUnidades} productos`}>
              {totalUnidades}
            </span>
          </Link>

          <button
            type="button"
            className="nav-toggle"
            aria-label="Abrir menú"
            aria-expanded={menuAbierto}
            onClick={() => setMenuAbierto((abierto) => !abierto)}
          >
            <svg
              width="22"
              height="22"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              aria-hidden="true"
            >
              <path d="M3 6h18M3 12h18M3 18h18" />
            </svg>
          </button>
        </div>
      </div>
    </header>
  );
}
