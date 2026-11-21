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

/** Costo fijo de envío a cualquier ciudad (política de la tienda). */
export const COSTO_ENVIO = 8000;

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
