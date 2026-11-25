/**
 * Proveedor de la sesión del usuario.
 * Guarda quién inició sesión (cliente o administradora) y ofrece a toda la
 * aplicación las acciones iniciar sesión, registrarse y cerrar sesión.
 *
 * El token se guarda en localStorage (services/api.js). Al recargar la página,
 * el proveedor pregunta a la API quién es el dueño del token (/auth/perfil):
 * si el token venció o la cuenta fue desactivada, la sesión se cierra sola.
 */
import { useCallback, useEffect, useMemo, useState } from 'react';
import { EVENTO_SESION_EXPIRADA, guardarToken, leerToken } from '../services/api.js';
import * as authService from '../services/authService.js';
import { AuthContext } from './AuthContext.js';

/**
 * @param {{children: React.ReactNode}} props
 */
export default function AuthProvider({ children }) {
  const [usuario, setUsuario] = useState(null);
  // Mientras se verifica el token guardado no se sabe si hay sesión: las rutas protegidas esperan
  const [verificando, setVerificando] = useState(() => Boolean(leerToken()));
  const [avisoSesion, setAvisoSesion] = useState(null);

  // 1. Al abrir la aplicación: si hay un token guardado, se valida con la API
  useEffect(() => {
    if (!leerToken()) return;
    let vigente = true;
    authService
      .obtenerPerfil()
      .then((perfil) => vigente && setUsuario(perfil))
      .catch(() => {
        guardarToken(null);
        if (vigente) setUsuario(null);
      })
      .finally(() => vigente && setVerificando(false));
    return () => {
      vigente = false;
    };
  }, []);

  // 2. Si cualquier petición recibe 401 con token, api.js avisa y aquí se cierra la sesión
  useEffect(() => {
    const alExpirar = (evento) => {
      setUsuario(null);
      setAvisoSesion(evento.detail || 'Tu sesión terminó. Inicia sesión de nuevo.');
    };
    window.addEventListener(EVENTO_SESION_EXPIRADA, alExpirar);
    return () => window.removeEventListener(EVENTO_SESION_EXPIRADA, alExpirar);
  }, []);

  /** Inicia sesión y guarda el token. Devuelve el usuario para decidir a dónde ir. */
  const iniciarSesion = useCallback(async (credenciales) => {
    const respuesta = await authService.iniciarSesion(credenciales);
    guardarToken(respuesta.token);
    setUsuario(respuesta.usuario);
    setAvisoSesion(null);
    return respuesta.usuario;
  }, []);

  /** Crea la cuenta e inicia sesión de una vez. */
  const registrarse = useCallback(
    async (datos) => {
      await authService.registrar(datos);
      return iniciarSesion({ email: datos.email, contrasena: datos.contrasena });
    },
    [iniciarSesion]
  );

  /** Cierra la sesión: borra el token del navegador. */
  const cerrarSesion = useCallback(() => {
    guardarToken(null);
    setUsuario(null);
  }, []);

  const valor = useMemo(
    () => ({
      usuario,
      verificando,
      esAdmin: usuario?.rol === 'admin',
      avisoSesion,
      limpiarAviso: () => setAvisoSesion(null),
      iniciarSesion,
      registrarse,
      cerrarSesion,
    }),
    [usuario, verificando, avisoSesion, iniciarSesion, registrarse, cerrarSesion]
  );

  return <AuthContext value={valor}>{children}</AuthContext>;
}
