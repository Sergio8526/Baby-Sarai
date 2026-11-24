/**
 * Reglas de navegación de la sesión.
 */

/**
 * Página a la que se va después de ingresar:
 * la administradora al panel (o a la sección del panel que pidió);
 * el cliente a la página que quería ver, o a sus pedidos.
 * @param {{rol: string}} usuario
 * @param {string} [desde] - Ruta guardada por RutaProtegida.
 * @returns {string}
 */
export function destinoDespuesDeIngresar(usuario, desde) {
  const pidioPanel = desde?.startsWith('/admin');
  if (usuario.rol === 'admin') return pidioPanel ? desde : '/admin';
  return desde && !pidioPanel ? desde : '/mis-pedidos';
}
