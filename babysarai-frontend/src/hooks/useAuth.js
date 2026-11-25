/**
 * Hook para usar la sesión desde cualquier componente.
 * Ejemplo: const { usuario, esAdmin, cerrarSesion } = useAuth();
 */
import { use } from 'react';
import { AuthContext } from '../context/AuthContext.js';

/**
 * @returns {{
 *   usuario: Object|null, verificando: boolean, esAdmin: boolean, avisoSesion: string|null,
 *   limpiarAviso: Function, iniciarSesion: Function, registrarse: Function, cerrarSesion: Function
 * }}
 */
export function useAuth() {
  const contexto = use(AuthContext);
  if (!contexto) {
    throw new Error('useAuth debe usarse dentro de <AuthProvider>');
  }
  return contexto;
}
