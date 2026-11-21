/**
 * Decide qué ilustración y qué color le corresponde a cada producto.
 * La tienda estática (GA6) tenía la prenda escrita a mano para cada producto;
 * aquí los productos vienen de MySQL, así que se deduce del nombre y la categoría.
 */
import { normalizarTexto } from './formato.js';

/** Palabras del nombre o de la categoría → dibujo. Se revisan en este orden. */
const REGLAS = [
  { palabras: ['vestido', 'jardinera'], tipo: 'vestido' },
  { palabras: ['overol', 'denim'], tipo: 'overol' },
  { palabras: ['chaqueta', 'buzo', 'saco', 'chaleco'], tipo: 'chaqueta' },
  { palabras: ['conjunto', 'jogger', 'set'], tipo: 'conjunto' },
  { palabras: ['pijama', 'enterizo', 'mameluco'], tipo: 'enterizo' },
  { palabras: ['gorro', 'accesorio', 'babero', 'panalera'], tipo: 'gorro' },
  { palabras: ['escarpin', 'zapato', 'calzado', 'media', 'patuco'], tipo: 'escarpines' },
  { palabras: ['cobija', 'manta', 'frazada'], tipo: 'cobija' },
  { palabras: ['body', 'bodie'], tipo: 'body' },
];

/** Colores de tela de la marca (los mismos de la tienda). */
export const COLORES_TELA = ['#F1CFD6', '#C9DCE3', '#F3D6C0', '#E3E0EE', '#DCE8DC', '#F0DFA8'];

/**
 * Devuelve el tipo de dibujo para un texto (nombre del producto o de la categoría).
 * @param {string} texto
 * @returns {string|null}
 */
function tipoPorTexto(texto) {
  const limpio = normalizarTexto(texto);
  return REGLAS.find((regla) => regla.palabras.some((p) => limpio.includes(p)))?.tipo ?? null;
}

/**
 * Ilustración y color de un producto.
 * @param {{id: number, nombre: string, categoriaNombre?: string}} producto
 * @returns {{tipo: string, color: string}}
 */
export function prendaDeProducto(producto) {
  return {
    tipo: tipoPorTexto(producto.nombre) ?? tipoPorTexto(producto.categoriaNombre ?? '') ?? 'body',
    color: COLORES_TELA[producto.id % COLORES_TELA.length],
  };
}

/**
 * Ilustración de una categoría (mosaico del inicio).
 * @param {string} nombreCategoria
 * @returns {string}
 */
export function prendaDeCategoria(nombreCategoria) {
  return tipoPorTexto(nombreCategoria) ?? 'body';
}
