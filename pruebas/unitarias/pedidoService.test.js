/**
 * Pruebas unitarias del servicio de pedidos (reglas de negocio).
 * La conexión a MySQL y el modelo se reemplazan por versiones falsas que
 * registran lo que se llamó: así se comprueba la transacción sin base de datos.
 */
require('./preparar.js');
const { describe, it, beforeEach } = require('node:test');
const assert = require('node:assert/strict');

const pool = require('../../src/config/db.js');
const pedidoModel = require('../../src/models/pedidoModel.js');
const pedidoService = require('../../src/services/pedidoService.js');

let registro; // lo que pasó dentro de la "transacción"
let productos; // "tabla productos" falsa
let pedido; // pedido falso para cambiarEstado

beforeEach(() => {
  registro = [];
  productos = [
    { id: 1, nombre: 'Body', talla: '0-3M', precio: 30000, stock: 5, activo: 1 },
    { id: 2, nombre: 'Gorro', talla: 'Única', precio: 60000, stock: 1, activo: 1 },
    { id: 3, nombre: 'Oculto', talla: null, precio: 10000, stock: 9, activo: 0 },
  ];
  pedido = { id: 50, usuarioId: 7, estado: 'pendiente' };

  // Conexión falsa: solo anota begin / commit / rollback / release
  pool.getConnection = async () => ({
    beginTransaction: async () => registro.push('BEGIN'),
    commit: async () => registro.push('COMMIT'),
    rollback: async () => registro.push('ROLLBACK'),
    release: () => registro.push('RELEASE'),
  });
  pedidoModel.bloquearProductos = async (_c, ids) => productos.filter((p) => ids.includes(p.id));
  pedidoModel.insertarPedido = async (_c, datos) => {
    registro.push(['pedido', datos]);
    return 99;
  };
  pedidoModel.insertarDetalle = async (_c, _id, lineas) => registro.push(['detalle', lineas]);
  pedidoModel.moverStock = async (_c, id, cantidad) => registro.push(['stock', id, cantidad]);
  pedidoModel.bloquearPedido = async () => ({ ...pedido });
  pedidoModel.devolverStock = async () => registro.push('DEVOLVER');
  pedidoModel.cambiarEstado = async (_c, _id, estado) => registro.push(['estado', estado]);
});

const ENVIO = { direccionEnvio: 'Calle 1', ciudad: 'Bogotá', telefono: '3001234567', notas: null };
const CLIENTE = { id: 7, rol: 'cliente' };
const ADMIN = { id: 1, rol: 'admin' };

describe('calcularEnvio', () => {
  it('cobra $10.000 por debajo de $150.000', () =>
    assert.equal(pedidoService.calcularEnvio(149999), 10000));
  it('es gratis desde $150.000', () => assert.equal(pedidoService.calcularEnvio(150000), 0));
});

describe('crearPedido', () => {
  it('calcula totales con los precios de la base de datos y confirma la transacción', async () => {
    const id = await pedidoService.crearPedido(7, {
      ...ENVIO,
      items: [{ productoId: 1, cantidad: 2 }],
    });
    assert.equal(id, 99);
    const [, datos] = registro.find((r) => r[0] === 'pedido');
    assert.deepEqual([datos.subtotal, datos.costoEnvio, datos.total], [60000, 10000, 70000]);
    assert.deepEqual(
      registro.find((r) => r[0] === 'stock'),
      ['stock', 1, -2]
    );
    assert.deepEqual(
      [registro.at(0), registro.at(-2), registro.at(-1)],
      ['BEGIN', 'COMMIT', 'RELEASE']
    );
  });

  it('copia el nombre y el precio del producto en el detalle', async () => {
    await pedidoService.crearPedido(7, { ...ENVIO, items: [{ productoId: 2, cantidad: 1 }] });
    const [, lineas] = registro.find((r) => r[0] === 'detalle');
    assert.deepEqual(lineas[0], {
      productoId: 2,
      nombreProducto: 'Gorro',
      talla: 'Única',
      cantidad: 1,
      precioUnitario: 60000,
      subtotal: 60000,
    });
  });

  it('sin stock: responde 409, deshace todo y no toca el inventario', async () => {
    await assert.rejects(
      pedidoService.crearPedido(7, {
        ...ENVIO,
        items: [
          { productoId: 1, cantidad: 1 },
          { productoId: 2, cantidad: 3 },
        ],
      }),
      (error) => error.estado === 409 && /solo hay 1/.test(error.detalles[0])
    );
    assert.ok(registro.includes('ROLLBACK'));
    assert.ok(!registro.includes('COMMIT'));
    assert.equal(registro.filter((r) => r[0] === 'stock').length, 0);
  });

  it('no vende productos inactivos ni inexistentes', async () => {
    await assert.rejects(
      pedidoService.crearPedido(7, {
        ...ENVIO,
        items: [
          { productoId: 3, cantidad: 1 },
          { productoId: 404, cantidad: 1 },
        ],
      }),
      (error) => error.detalles.length === 2
    );
  });
});

describe('cambiarEstado', () => {
  it('la administradora sigue el flujo pendiente → pagado', async () => {
    await pedidoService.cambiarEstado(50, 'pagado', ADMIN);
    assert.deepEqual(
      registro.find((r) => r[0] === 'estado'),
      ['estado', 'pagado']
    );
  });

  it('no permite saltos fuera del flujo (409)', async () => {
    await assert.rejects(pedidoService.cambiarEstado(50, 'entregado', ADMIN), { estado: 409 });
  });

  it('al cancelar devuelve el stock', async () => {
    await pedidoService.cambiarEstado(50, 'cancelado', CLIENTE);
    assert.ok(registro.includes('DEVOLVER'));
  });

  it('el cliente solo cancela pedidos pendientes', async () => {
    pedido.estado = 'pagado';
    await assert.rejects(pedidoService.cambiarEstado(50, 'cancelado', CLIENTE), { estado: 409 });
  });

  it('un pedido ajeno es "no encontrado" para el cliente', async () => {
    await assert.rejects(pedidoService.cambiarEstado(50, 'cancelado', { id: 8, rol: 'cliente' }), {
      estado: 404,
    });
  });

  it('los estados finales no tienen salida', () => {
    assert.deepEqual(pedidoService.TRANSICIONES.entregado, []);
    assert.deepEqual(pedidoService.TRANSICIONES.cancelado, []);
  });
});
