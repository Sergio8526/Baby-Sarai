/**
 * Valores fijos que comparten varios componentes.
 * Los límites coinciden con las validaciones del back-end (productoValidator.js
 * y categoriaValidator.js), para que el usuario vea el error antes de enviar.
 */

/**
 * Estados posibles de una prenda (ENUM de la tabla productos).
 * En la base de datos se llama "usado"; en la tienda se muestra "Seminuevo",
 * como en el diseño aprobado de babysarai-web.
 */
export const ESTADOS_PRODUCTO = [
  { valor: 'nuevo', texto: 'Nuevo' },
  { valor: 'usado', texto: 'Seminuevo' },
];

/**
 * Texto que se muestra para un estado.
 * @param {string} estado - 'nuevo' o 'usado'
 * @returns {string}
 */
export function textoEstado(estado) {
  return ESTADOS_PRODUCTO.find((e) => e.valor === estado)?.texto ?? estado;
}

/** Tallas más comunes de ropa de bebé, para sugerir en el formulario. */
export const TALLAS_SUGERIDAS = ['0-3M', '3-6M', '6-9M', '9-12M', '12-18M', '18-24M', 'Única'];

/** Longitudes máximas de los campos de texto. */
export const LIMITES = {
  nombreProducto: 100,
  nombreCategoria: 60,
  descripcion: 255,
  talla: 20,
};

/** Unidades en stock desde las cuales se avisa que quedan pocas. */
export const STOCK_BAJO = 2;

/**
 * Reglas del envío. Deben coincidir con ENVIO_COSTO y ENVIO_GRATIS_DESDE del .env de la API:
 * el front-end solo las usa para MOSTRAR un estimado; el total real lo calcula la API.
 */
export const ENVIO = { costo: 10000, gratisDesde: 150000 };

/**
 * Estados de un pedido (ENUM de la tabla pedidos): texto para mostrar y tono de la etiqueta.
 */
export const ESTADOS_PEDIDO = {
  pendiente: { texto: 'Pendiente', tono: 'aviso' },
  pagado: { texto: 'Pagado', tono: 'si' },
  enviado: { texto: 'Enviado', tono: 'si' },
  entregado: { texto: 'Entregado', tono: 'si' },
  cancelado: { texto: 'Cancelado', tono: 'no' },
};

/**
 * Estados a los que la administradora puede pasar un pedido desde cada estado.
 * Es la misma tabla TRANSICIONES de src/services/pedidoService.js en la API.
 */
export const TRANSICIONES_PEDIDO = {
  pendiente: ['pagado', 'cancelado'],
  pagado: ['enviado', 'cancelado'],
  enviado: ['entregado'],
  entregado: [],
  cancelado: [],
};

/** Roles de usuario (ENUM de la tabla usuarios). */
export const ROLES = { admin: 'Administradora', cliente: 'Cliente' };

/** Opciones de orden del catálogo. */
export const ORDENES_CATALOGO = [
  { valor: 'recientes', texto: 'Más recientes' },
  { valor: 'precio-asc', texto: 'Precio: menor a mayor' },
  { valor: 'precio-desc', texto: 'Precio: mayor a menor' },
  { valor: 'nombre', texto: 'Nombre (A-Z)' },
];

/** Datos de contacto de la tienda. */
export const CONTACTO = {
  whatsapp: '573000000000',
  instagram: 'https://www.instagram.com/',
  facebook: 'https://www.facebook.com/',
};
