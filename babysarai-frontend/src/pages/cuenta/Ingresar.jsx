/**
 * Inicio de sesión de clientes y de la administradora.
 * Después de entrar vuelve a la página que el usuario quería ver (state.desde),
 * o al panel si es administradora.
 */
import { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router';
import CampoTienda from '../../components/formularios/CampoTienda.jsx';
import { useAuth } from '../../hooks/useAuth.js';
import { destinoDespuesDeIngresar } from '../../utils/sesion.js';
import { validarLogin } from '../../utils/validaciones.js';

export default function Ingresar() {
  const { iniciarSesion, avisoSesion, limpiarAviso } = useAuth();
  const navigate = useNavigate();
  const desde = useLocation().state?.desde;

  const [valores, setValores] = useState({ email: '', contrasena: '' });
  const [errores, setErrores] = useState({});
  const [errorApi, setErrorApi] = useState('');
  const [enviando, setEnviando] = useState(false);

  const manejarCambio = (evento) => {
    const { name, value } = evento.target;
    setValores((anteriores) => ({ ...anteriores, [name]: value }));
    setErrores((anteriores) => ({ ...anteriores, [name]: undefined }));
  };

  const manejarEnvio = async (evento) => {
    evento.preventDefault();
    const nuevosErrores = validarLogin(valores);
    setErrores(nuevosErrores);
    if (Object.keys(nuevosErrores).length > 0) return;

    setEnviando(true);
    setErrorApi('');
    try {
      const usuario = await iniciarSesion({
        email: valores.email.trim(),
        contrasena: valores.contrasena,
      });
      navigate(destinoDespuesDeIngresar(usuario, desde), { replace: true });
    } catch (error) {
      // 401 "Correo o contraseña incorrectos" o 403 "Tu cuenta está desactivada..."
      setErrorApi(error.message);
      setEnviando(false);
    }
  };

  return (
    <main className="section section--tight">
      <div className="wrap cuenta-layout">
        <section className="cuenta-card">
          <h1 className="titulo-pagina">Ingresa a tu cuenta</h1>
          {avisoSesion && (
            <p className="aviso-cuenta" role="status">
              {avisoSesion}{' '}
              <button type="button" className="enlace-boton" onClick={limpiarAviso}>
                Entendido
              </button>
            </p>
          )}
          {errorApi && (
            <p className="aviso-cuenta aviso-cuenta--error" role="alert">
              {errorApi}
            </p>
          )}
          <form onSubmit={manejarEnvio} noValidate>
            <CampoTienda
              etiqueta="Correo"
              type="email"
              name="email"
              autoComplete="email"
              value={valores.email}
              onChange={manejarCambio}
              error={errores.email}
            />
            <CampoTienda
              etiqueta="Contraseña"
              type="password"
              name="contrasena"
              autoComplete="current-password"
              value={valores.contrasena}
              onChange={manejarCambio}
              error={errores.contrasena}
            />
            <button type="submit" className="btn btn-primary btn-block" disabled={enviando}>
              {enviando ? 'Ingresando...' : 'Ingresar'}
            </button>
          </form>
          <p className="cuenta-alterna">
            ¿Primera vez en Baby Saraí?{' '}
            <Link to="/registro" state={{ desde }}>
              Crea tu cuenta
            </Link>
          </p>
        </section>
      </div>
    </main>
  );
}
