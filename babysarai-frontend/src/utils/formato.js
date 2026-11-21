/**
 * Funciones de formato para mostrar datos en pantalla.
 */

/**
 * Convierte un número en precio colombiano, como en la tienda. Ejemplo: 25000 → "$25.000".
 * MySQL devuelve los DECIMAL como texto, por eso se convierte con Number().
 * @param {number|string} valor
 * @returns {string}
 */
export function formatearPrecio(valor) {
  return '$' + Math.round(Number(valor) || 0).toLocaleString('es-CO');
}

/**
 * Quita tildes y pasa a minúsculas para comparar textos en las búsquedas.
 * Ejemplo: "Recién Nacido" → "recien nacido".
 * @param {string} texto
 * @returns {string}
 */
export function normalizarTexto(texto = '') {
  return texto.normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase().trim();
}
