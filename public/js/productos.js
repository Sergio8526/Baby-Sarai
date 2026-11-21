/**
 * Lógica de la página de administración de productos.
 */
import {
  peticionApi,
  mostrarMensaje,
  formatearPrecio,
  crearCelda,
  crearEtiqueta,
  crearBoton,
  confirmar,
} from './api.js';

const API_PRODUCTOS = '/api/productos';
const API_CATEGORIAS = '/api/categorias';

// Elementos de la página
const formulario = document.getElementById('formProducto');
const tituloFormulario = document.getElementById('tituloFormulario');
const btnGuardar = document.getElementById('btnGuardar');
const btnCancelar = document.getElementById('btnCancelar');
const mensaje = document.getElementById('mensaje');
const tabla = document.getElementById('tablaProductos');
const filtroCategoria = document.getElementById('filtroCategoria');

// Visibilidad del producto al empezar a editarlo
let visibleOriginal = null;

const campos = {
  id: document.getElementById('id'),
  nombre: document.getElementById('nombre'),
  categoriaId: document.getElementById('categoriaId'),
  precio: document.getElementById('precio'),
  talla: document.getElementById('talla'),
  estado: document.getElementById('estado'),
  stock: document.getElementById('stock'),
  descripcion: document.getElementById('descripcion'),
  activo: document.getElementById('activo'),
};

/**
 * Carga las categorías en el formulario y en el filtro de la tabla.
 */
async function cargarCategorias() {
  const categorias = await peticionApi(API_CATEGORIAS);

  campos.categoriaId.replaceChildren(new Option('Seleccione una categoría', ''));
  filtroCategoria.replaceChildren(new Option('Todas las categorías', ''));

  categorias.forEach((categoria) => {
    const texto = categoria.activo ? categoria.nombre : `${categoria.nombre} (inactiva)`;
    campos.categoriaId.append(new Option(texto, categoria.id));
    filtroCategoria.append(new Option(texto, categoria.id));
  });
}

/**
 * Consulta los productos (según el filtro) y los muestra en la tabla.
 */
async function cargarProductos() {
  const categoriaId = filtroCategoria.value;
  const url = categoriaId ? `${API_PRODUCTOS}?categoriaId=${categoriaId}` : API_PRODUCTOS;
  const productos = await peticionApi(url);

  tabla.replaceChildren();

  if (!productos.length) {
    const fila = document.createElement('tr');
    const celda = crearCelda('No hay productos para mostrar');
    celda.colSpan = 8;
    celda.className = 'vacio';
    fila.append(celda);
    tabla.append(fila);
    return;
  }

  productos.forEach((producto) => {
    const fila = document.createElement('tr');
    fila.append(
      crearCelda(producto.nombre),
      crearCelda(producto.categoriaNombre),
      crearCelda(producto.talla || '—'),
      crearCelda(producto.estado === 'nuevo' ? 'Nuevo' : 'Usado'),
      crearCelda(formatearPrecio(producto.precio)),
      crearCelda(String(producto.stock)),
      crearCelda(crearEtiqueta(producto.activo, 'Visible', 'Oculto')),
      crearCelda(
        crearBoton('Editar', 'pequeno', () => editarProducto(producto)),
        ' ',
        crearBoton('Eliminar', 'pequeno peligro', () => eliminarProducto(producto))
      )
    );
    tabla.append(fila);
  });
}

/**
 * Pasa el formulario a modo edición con los datos del producto.
 * @param {Object} producto
 */
function editarProducto(producto) {
  campos.id.value = producto.id;
  campos.nombre.value = producto.nombre;
  campos.categoriaId.value = producto.categoriaId;
  campos.precio.value = Number(producto.precio);
  campos.talla.value = producto.talla ?? '';
  campos.estado.value = producto.estado;
  campos.stock.value = producto.stock;
  campos.descripcion.value = producto.descripcion ?? '';
  campos.activo.checked = Boolean(producto.activo);
  visibleOriginal = Boolean(producto.activo);

  tituloFormulario.textContent = `Editar producto: ${producto.nombre}`;
  btnGuardar.textContent = 'Actualizar producto';
  mensaje.textContent = '';
  formulario.scrollIntoView({ behavior: 'smooth' });
}

/**
 * Deja el formulario vacío y en modo "nuevo producto".
 */
function limpiarFormulario() {
  formulario.reset();
  campos.id.value = '';
  visibleOriginal = null;
  tituloFormulario.textContent = 'Nuevo producto';
  btnGuardar.textContent = 'Guardar producto';
}

/**
 * Envía el formulario: POST si es nuevo, PUT si se está editando.
 * @param {SubmitEvent} evento
 */
async function guardarProducto(evento) {
  evento.preventDefault();

  const id = campos.id.value;
  const datos = {
    nombre: campos.nombre.value,
    categoriaId: campos.categoriaId.value,
    precio: campos.precio.value,
    talla: campos.talla.value,
    estado: campos.estado.value,
    stock: campos.stock.value,
    descripcion: campos.descripcion.value,
    activo: campos.activo.checked,
  };

  // Si al editar se cambió la visibilidad en la tienda, se pide confirmación
  if (id && visibleOriginal !== null && visibleOriginal !== datos.activo) {
    const acepta = await confirmar(datos.activo
      ? {
          tipo: 'mostrar',
          titulo: `¿Mostrar "${datos.nombre}" en la tienda?`,
          mensaje: 'Los clientes podrán verlo y comprarlo.',
          textoAceptar: 'Sí, mostrar',
        }
      : {
          tipo: 'ocultar',
          titulo: `¿Ocultar "${datos.nombre}" de la tienda?`,
          mensaje: 'No se borra: seguirá en el inventario con la etiqueta "Oculto".',
          textoAceptar: 'Sí, ocultar',
        });
    if (!acepta) return;
  }

  try {
    const respuesta = await peticionApi(id ? `${API_PRODUCTOS}/${id}` : API_PRODUCTOS, {
      metodo: id ? 'PUT' : 'POST',
      datos,
    });
    mostrarMensaje(mensaje, respuesta.mensaje);
    limpiarFormulario();
    await cargarProductos();
  } catch (error) {
    mostrarMensaje(mensaje, error.message, 'error', error.detalles);
  }
}

/**
 * Elimina un producto previa confirmación.
 * @param {Object} producto
 */
async function eliminarProducto(producto) {
  const acepta = await confirmar({
    tipo: 'peligro',
    titulo: `¿Eliminar "${producto.nombre}"?`,
    mensaje: 'Esta acción no se puede deshacer.',
    textoAceptar: 'Sí, eliminar',
  });
  if (!acepta) return;

  try {
    const respuesta = await peticionApi(`${API_PRODUCTOS}/${producto.id}`, { metodo: 'DELETE' });
    mostrarMensaje(mensaje, respuesta.mensaje);
    await cargarProductos();
  } catch (error) {
    mostrarMensaje(mensaje, error.message, 'error', error.detalles);
  }
}

// Eventos
formulario.addEventListener('submit', guardarProducto);
btnCancelar.addEventListener('click', limpiarFormulario);
filtroCategoria.addEventListener('change', () => {
  cargarProductos().catch((error) => mostrarMensaje(mensaje, error.message, 'error'));
});

// Carga inicial
async function iniciar() {
  try {
    await cargarCategorias();
    await cargarProductos();
  } catch (error) {
    mostrarMensaje(mensaje, `No se pudo cargar la información: ${error.message}`, 'error');
  }
}

iniciar();