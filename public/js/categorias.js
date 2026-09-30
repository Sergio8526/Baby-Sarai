/**
 * Lógica de la página de administración de categorías.
 */
import { peticionApi, mostrarMensaje, crearCelda, crearEtiqueta, crearBoton } from './api.js';

const API_CATEGORIAS = '/api/categorias';

// Elementos de la página
const formulario = document.getElementById('formCategoria');
const tituloFormulario = document.getElementById('tituloFormulario');
const btnGuardar = document.getElementById('btnGuardar');
const btnCancelar = document.getElementById('btnCancelar');
const mensaje = document.getElementById('mensaje');
const tabla = document.getElementById('tablaCategorias');

const campos = {
  id: document.getElementById('id'),
  nombre: document.getElementById('nombre'),
  descripcion: document.getElementById('descripcion'),
  activo: document.getElementById('activo'),
};

/**
 * Consulta las categorías y las muestra en la tabla.
 */
async function cargarCategorias() {
  const categorias = await peticionApi(API_CATEGORIAS);
  tabla.replaceChildren();

  if (!categorias.length) {
    const fila = document.createElement('tr');
    const celda = crearCelda('No hay categorías registradas');
    celda.colSpan = 4;
    celda.className = 'vacio';
    fila.append(celda);
    tabla.append(fila);
    return;
  }

  categorias.forEach((categoria) => {
    const fila = document.createElement('tr');
    fila.append(
      crearCelda(categoria.nombre),
      crearCelda(categoria.descripcion || '—'),
      crearCelda(crearEtiqueta(categoria.activo, 'Activa', 'Inactiva')),
      crearCelda(
        crearBoton('Editar', 'pequeno', () => editarCategoria(categoria)),
        ' ',
        crearBoton('Eliminar', 'pequeno peligro', () => eliminarCategoria(categoria))
      )
    );
    tabla.append(fila);
  });
}

/**
 * Pasa el formulario a modo edición con los datos de la categoría.
 * @param {Object} categoria
 */
function editarCategoria(categoria) {
  campos.id.value = categoria.id;
  campos.nombre.value = categoria.nombre;
  campos.descripcion.value = categoria.descripcion ?? '';
  campos.activo.checked = Boolean(categoria.activo);

  tituloFormulario.textContent = `Editar categoría: ${categoria.nombre}`;
  btnGuardar.textContent = 'Actualizar categoría';
  mensaje.textContent = '';
  formulario.scrollIntoView({ behavior: 'smooth' });
}

/**
 * Deja el formulario vacío y en modo "nueva categoría".
 */
function limpiarFormulario() {
  formulario.reset();
  campos.id.value = '';
  tituloFormulario.textContent = 'Nueva categoría';
  btnGuardar.textContent = 'Guardar categoría';
}

/**
 * Envía el formulario: POST si es nueva, PUT si se está editando.
 * @param {SubmitEvent} evento
 */
async function guardarCategoria(evento) {
  evento.preventDefault();

  const id = campos.id.value;
  const datos = {
    nombre: campos.nombre.value,
    descripcion: campos.descripcion.value,
    activo: campos.activo.checked,
  };

  try {
    const respuesta = await peticionApi(id ? `${API_CATEGORIAS}/${id}` : API_CATEGORIAS, {
      metodo: id ? 'PUT' : 'POST',
      datos,
    });
    mostrarMensaje(mensaje, respuesta.mensaje);
    limpiarFormulario();
    await cargarCategorias();
  } catch (error) {
    mostrarMensaje(mensaje, error.message, 'error', error.detalles);
  }
}

/**
 * Elimina una categoría previa confirmación.
 * Si tiene productos asociados, el servidor lo impide y se muestra el motivo.
 * @param {Object} categoria
 */
async function eliminarCategoria(categoria) {
  if (!confirm(`¿Eliminar la categoría "${categoria.nombre}"?`)) return;

  try {
    const respuesta = await peticionApi(`${API_CATEGORIAS}/${categoria.id}`, { metodo: 'DELETE' });
    mostrarMensaje(mensaje, respuesta.mensaje);
    await cargarCategorias();
  } catch (error) {
    mostrarMensaje(mensaje, error.message, 'error', error.detalles);
  }
}

// Eventos
formulario.addEventListener('submit', guardarCategoria);
btnCancelar.addEventListener('click', limpiarFormulario);

// Carga inicial
cargarCategorias().catch((error) => {
  mostrarMensaje(mensaje, `No se pudo cargar la información: ${error.message}`, 'error');
});