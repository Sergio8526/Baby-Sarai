/**
 * Utilidades compartidas del panel de administración.
 * Se importan desde productos.js y categorias.js.
 */

/**
 * Hace una petición a la API y devuelve la respuesta en JSON.
 * Si el servidor responde con error, lanza una excepción con su mensaje.
 * @param {string} url - Dirección de la API.
 * @param {Object} [opciones]
 * @param {string} [opciones.metodo='GET'] - Método HTTP.
 * @param {Object} [opciones.datos] - Cuerpo a enviar en JSON.
 * @returns {Promise<Object>}
 */
export async function peticionApi(url, { metodo = 'GET', datos } = {}) {
  const opciones = { method: metodo, headers: {} };
  if (datos !== undefined) {
    opciones.headers['Content-Type'] = 'application/json';
    opciones.body = JSON.stringify(datos);
  }

  const respuesta = await fetch(url, opciones);
  const cuerpo = await respuesta.json().catch(() => ({}));

  if (!respuesta.ok) {
    const error = new Error(cuerpo.mensaje || 'Ocurrió un error inesperado');
    error.detalles = cuerpo.detalles || [];
    throw error;
  }
  return cuerpo;
}

/**
 * Muestra un mensaje de éxito o error, con una lista opcional de detalles.
 * @param {HTMLElement} elemento - Contenedor del mensaje.
 * @param {string} texto - Mensaje principal.
 * @param {'exito'|'error'} [tipo='exito']
 * @param {string[]} [detalles=[]]
 */
export function mostrarMensaje(elemento, texto, tipo = 'exito', detalles = []) {
  elemento.className = `mensaje ${tipo}`;
  elemento.textContent = texto;

  if (detalles.length) {
    const lista = document.createElement('ul');
    detalles.forEach((detalle) => {
      const item = document.createElement('li');
      item.textContent = detalle;
      lista.appendChild(item);
    });
    elemento.appendChild(lista);
  }
}

/**
 * Da formato de pesos colombianos a un valor numérico.
 * @param {number|string} valor
 * @returns {string} Ejemplo: "$ 25.000"
 */
export function formatearPrecio(valor) {
  return new Intl.NumberFormat('es-CO', {
    style: 'currency',
    currency: 'COP',
    maximumFractionDigits: 0,
  }).format(Number(valor));
}

/**
 * Crea una celda de tabla. Acepta texto o elementos HTML.
 * El texto se inserta de forma segura (sin interpretar HTML).
 * @param {...(string|Node)} contenidos
 * @returns {HTMLTableCellElement}
 */
export function crearCelda(...contenidos) {
  const celda = document.createElement('td');
  celda.append(...contenidos);
  return celda;
}

/**
 * Crea una etiqueta de color para estados activo/inactivo.
 * @param {boolean|number} activo
 * @param {string} textoSi - Texto cuando está activo.
 * @param {string} textoNo - Texto cuando está inactivo.
 * @returns {HTMLSpanElement}
 */
export function crearEtiqueta(activo, textoSi, textoNo) {
  const etiqueta = document.createElement('span');
  etiqueta.className = `etiqueta ${activo ? 'si' : 'no'}`;
  etiqueta.textContent = activo ? textoSi : textoNo;
  return etiqueta;
}

/**
 * Crea un botón con su acción al hacer clic.
 * @param {string} texto
 * @param {string} clases - Clases CSS.
 * @param {Function} alHacerClic
 * @returns {HTMLButtonElement}
 */
export function crearBoton(texto, clases, alHacerClic) {
  const boton = document.createElement('button');
  boton.type = 'button';
  boton.className = clases;
  boton.textContent = texto;
  boton.addEventListener('click', alHacerClic);
  return boton;
}