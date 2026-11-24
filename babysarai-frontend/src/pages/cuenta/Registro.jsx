/**
 * Registro de clientes. Al crear la cuenta inicia sesión de una vez
 * y vuelve a la página de origen (por ejemplo, el carrito).
 */
import { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router';
import CampoTienda from '../../components/formularios/CampoTienda.jsx';
import { useAuth } from '../../hooks/useAuth.js';
import { validarRegistro } from '../../utils/validaciones.js';

const VACIO = { nombre: '', email: '', telefono: '', contrasena: '', confirmacion: '' };

export default function Registro() {
  const { registrarse } = useAuth();
  const navigate = useNavigate();
  const desde = useLocation().state?.desde;

  const [valores, setValores] = useState(VACIO);
  const [errores, setErrores] = useState({});
  const [errorApi, setErrorApi] = useState(null);
  const [enviando, setEnviando] = useState(false);

  const manejarCambio = (evento) => {
    const { name, value } = evento.target;
    setValores((anteriores) => ({ ...anteriores, [name]: value }));
    setErrores((anteriores) => ({ ...anteriores, [name]: undefined }));
  };

  const manejarEnvio = async (evento) => {
    evento.preventDefault();
    const nuevosErrores = validarRegistro(valores);
    setErrores(nuevosErrores);
    if (Object.keys(nuevosErrores).length > 0) return;

    setEnviando(true);
    setErrorApi(null);
    try {
      await registrarse({
        nombre: valores.nombre.trim(),
        email: valores.email.trim(),
        telefono: valores.telefono.trim() || undefined,
        contrasena: valores.contrasena,
      });
      navigate(desde || '/mis-pedidos', { replace: true });
    } catch (error) {
      // 409 "Ya existe una cuenta con ese correo" o 400 con detalles
      setErrorApi(error);
      setEnviando(false);
    }
  };

  return (
    <main className="section section--tight">
      <div className="wrap cuenta-layout">
        <section className="cuenta-card">
          <h1 className="titulo-pagina">Crea tu cuenta</h1>
          <p className="cuenta-bajada">
            Así puedes comprar en línea y seguir el estado de tus pedidos.
          </p>
          {errorApi && (
            <div className="aviso-cuenta aviso-cuenta--error" role="alert">
              {errorApi.message}
              {errorApi.detalles?.length > 0 && (
                <ul>
                  {errorApi.detalles.map((detalle) => (
                    <li key={detalle}>{detalle}</li>
                  ))}
                </ul>
              )}
            </div>
          )}
          <form onSubmit={manejarEnvio} noValidate>
            <CampoTienda
              etiqueta="Nombre completo"
              name="nombre"
              autoComplete="name"
              value={valores.nombre}
              onChange={manejarCambio}
              error={errores.nombre}
              maxLength={100}
            />
            <div className="form-grid">
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
                etiqueta="Teléfono (opcional)"
                type="tel"
                name="telefono"
                autoComplete="tel"
                value={valores.telefono}
                onChange={manejarCambio}
                error={errores.telefono}
              />
            </div>
            <div className="form-grid">
              <CampoTienda
                etiqueta="Contraseña"
                type="password"
                name="contrasena"
                autoComplete="new-password"
                value={valores.contrasena}
                onChange={manejarCambio}
                error={errores.contrasena}
                ayuda="Mínimo 8 caracteres, con letras y números"
              />
              <CampoTienda
                etiqueta="Repite la contraseña"
                type="password"
                name="confirmacion"
                autoComplete="new-password"
                value={valores.confirmacion}
                onChange={manejarCambio}
                error={errores.confirmacion}
              />
            </div>
            <button type="submit" className="btn btn-primary btn-block" disabled={enviando}>
              {enviando ? 'Creando tu cuenta...' : 'Crear cuenta'}
            </button>
          </form>
          <p className="cuenta-alterna">
            ¿Ya tienes cuenta?{' '}
            <Link to="/ingresar" state={{ desde }}>
              Ingresa aquí
            </Link>
          </p>
        </section>
      </div>
    </main>
  );
}
