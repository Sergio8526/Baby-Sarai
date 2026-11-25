/**
 * Validación de los datos de los pedidos.
 */
const AppError = require('../utils/AppError.js');
const { textoOpcional } = require('./comunes.js');
const { limpiarTelefono } = require('./usuarioValidator.js');

const ESTADOS = ['pendiente', 'pagado', 'enviado', 'entregado', 'cancelado'];
const MAXIMO_PRODUCTOS = 30; // productos distintos por pedido
const MAXIMO_CANTIDAD = 20; // unidades de un mismo producto

/**
 * Texto obligatorio con longitud máxima.
 */
function textoObligatorio(valor, maximo, campo, errores) {
  const texto = typeof valor === 'string' ? valor.trim() : '';
  if (!texto) {
    errores.push(`${campo} es obligatorio`);
  } else if (texto.length > maximo) {
    errores.push(`${campo} no puede superar ${maximo} caracteres`);
  }
  return texto;
}

/**
 * Datos para crear un pedido.
 * Si el mismo producto viene dos veces, se suman las cantidades.
 * @param {Object} datos - Cuerpo de la petición.
 * @returns {{items: {productoId: number, cantidad: number}[], direccionEnvio: string,
 *   ciudad: string, telefono: string, notas: string|null}}
 */
function validarPedido(datos = {}) {
  const errores = [];
  const cantidades = new Map(); // productoId → cantidad total

  if (!Array.isArray(datos.items) || datos.items.length === 0) {
    errores.push('El pedido debe tener al menos un producto en "items"');
  } else if (datos.items.length > MAXIMO_PRODUCTOS) {
    errores.push(`Un pedido puede tener máximo ${MAXIMO_PRODUCTOS} productos distintos`);
  } else {
    datos.items.forEach((item, i) => {
      const productoId = Number(item?.productoId);
      const cantidad = Number(item?.cantidad);
      if (!Number.isInteger(productoId) || productoId <= 0) {
        errores.push(`items[${i}]: productoId debe ser un número entero positivo`);
        return;
      }
      if (!Number.isInteger(cantidad) || cantidad <= 0) {
        errores.push(`items[${i}]: la cantidad debe ser un número entero mayor que 0`);
        return;
      }
      cantidades.set(productoId, (cantidades.get(productoId) ?? 0) + cantidad);
    });
    for (const [productoId, cantidad] of cantidades) {
      if (cantidad > MAXIMO_CANTIDAD) {
        errores.push(`Máximo ${MAXIMO_CANTIDAD} unidades del producto ${productoId}`);
      }
    }
  }

  const direccionEnvio = textoObligatorio(
    datos.direccionEnvio,
    200,
    'La dirección de envío',
    errores
  );
  const ciudad = textoObligatorio(datos.ciudad, 60, 'La ciudad', errores);
  const telefono = limpiarTelefono(datos.telefono, errores, true);
  const notas = textoOpcional(datos.notas, 255, 'Las notas', errores);

  if (errores.length) {
    throw new AppError('Datos del pedido no válidos', 400, errores);
  }

  const items = [...cantidades].map(([productoId, cantidad]) => ({ productoId, cantidad }));
  return { items, direccionEnvio, ciudad, telefono, notas };
}

/**
 * Valida el nuevo estado de un pedido.
 * @param {Object} datos
 * @returns {string}
 */
function validarEstado(datos = {}) {
  if (!ESTADOS.includes(datos.estado)) {
    throw new AppError(`El estado debe ser uno de: ${ESTADOS.join(', ')}`, 400);
  }
  return datos.estado;
}

/**
 * Valida el filtro opcional ?estado= del listado.
 * @param {string|undefined} valor
 * @returns {string|undefined}
 */
function validarFiltroEstado(valor) {
  if (valor === undefined || valor === '') return undefined;
  return validarEstado({ estado: valor });
}

module.exports = { validarPedido, validarEstado, validarFiltroEstado, ESTADOS };
