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
/* ==========================================================================
   Ventana de confirmación
   Reemplaza el confirm() del navegador por una ventana propia del panel,
   con animación de entrada y salida. Devuelve una promesa con true o false.
   ========================================================================== */

const ICONOS_CONFIRMACION = {
  peligro: '<path d="M4 7h16M10 11v6M14 11v6M5 7l1 12a2 2 0 0 0 2 2h8a2 2 0 0 0 2-2l1-12M9 7V4h6v3"/>',
  activar: '<circle cx="12" cy="12" r="9"/><path d="m8 12.5 2.8 2.8L16 10"/>',
  desactivar: '<circle cx="12" cy="12" r="9"/><path d="M10 9v6M14 9v6"/>',
  ocultar: '<path d="M3 3l18 18M10.6 10.6a2 2 0 0 0 2.8 2.8M9.9 5.1A9.8 9.8 0 0 1 12 5c5 0 9 4.5 10 7-.4 1-1.2 2.3-2.4 3.5M6.6 6.6C4.5 8 3.2 10 2 12c1 2.5 5 7 10 7 1.7 0 3.3-.5 4.6-1.3"/>',
  mostrar: '<path d="M2 12c1-2.5 5-7 10-7s9 4.5 10 7c-1 2.5-5 7-10 7S3 14.5 2 12Z"/><circle cx="12" cy="12" r="3"/>',
};

let ventana = null;

/** Crea la ventana una sola vez y la reutiliza. */
function crearVentana() {
  ventana = document.createElement('dialog');
  ventana.className = 'confirmacion';
  ventana.setAttribute('aria-labelledby', 'confirmacionTitulo');
  ventana.setAttribute('aria-describedby', 'confirmacionTexto');
  ventana.innerHTML = `
    <div class="confirmacion-icono" aria-hidden="true">
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round"></svg>
    </div>
    <h2 id="confirmacionTitulo"></h2>
    <p id="confirmacionTexto"></p>
    <div class="confirmacion-botones">
      <button type="button" class="secundario" data-respuesta="no"></button>
      <button type="button" data-respuesta="si"></button>
    </div>`;
  document.body.append(ventana);
  return ventana;
}

/**
 * Pide confirmación al usuario con una ventana animada.
 * @param {Object} opciones
 * @param {string} opciones.titulo - Pregunta principal, por ejemplo "¿Eliminar ...?".
 * @param {string} [opciones.mensaje] - Explicación de lo que va a pasar.
 * @param {string} [opciones.textoAceptar='Aceptar']
 * @param {string} [opciones.textoCancelar='Cancelar']
 * @param {'peligro'|'activar'|'desactivar'|'ocultar'|'mostrar'} [opciones.tipo='peligro']
 * @returns {Promise<boolean>} true si acepta, false si cancela.
 */
export function confirmar({ titulo, mensaje = '', textoAceptar = 'Aceptar', textoCancelar = 'Cancelar', tipo = 'peligro' }) {
  const dialogo = ventana || crearVentana();
  const botonSi = dialogo.querySelector('[data-respuesta="si"]');
  const botonNo = dialogo.querySelector('[data-respuesta="no"]');

  dialogo.dataset.tipo = tipo;
  dialogo.querySelector('svg').innerHTML = ICONOS_CONFIRMACION[tipo] || ICONOS_CONFIRMACION.peligro;
  dialogo.querySelector('h2').textContent = titulo;
  dialogo.querySelector('p').textContent = mensaje;
  dialogo.querySelector('p').hidden = !mensaje;
  botonSi.textContent = textoAceptar;
  botonNo.textContent = textoCancelar;
  botonSi.className = tipo === 'peligro' ? 'peligro-solido' : '';

  return new Promise((resolver) => {
    let respondida = false;

    function cerrar(respuesta) {
      if (respondida) return;
      respondida = true;
      dialogo.removeEventListener('click', alHacerClic);
      dialogo.removeEventListener('cancel', alCancelar);

      // Animación de salida y luego se cierra de verdad
      dialogo.classList.add('cerrando');
      const terminar = () => {
        dialogo.classList.remove('cerrando');
        dialogo.close();
        resolver(respuesta);
      };
      const sinMovimiento = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
      if (sinMovimiento) terminar();
      else dialogo.addEventListener('animationend', terminar, { once: true });
    }

    function alHacerClic(evento) {
      const boton = evento.target.closest('[data-respuesta]');
      if (boton) return cerrar(boton.dataset.respuesta === 'si');
      if (evento.target === dialogo) cerrar(false);       // clic en el fondo oscuro
    }

    function alCancelar(evento) {                         // tecla Escape
      evento.preventDefault();
      cerrar(false);
    }

    dialogo.addEventListener('click', alHacerClic);
    dialogo.addEventListener('cancel', alCancelar);
    dialogo.showModal();
    // En acciones destructivas el foco queda en "Cancelar" para evitar errores
    (tipo === 'peligro' ? botonNo : botonSi).focus();
  });
}
