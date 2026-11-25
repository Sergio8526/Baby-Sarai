/**
 * Pruebas unitarias del reductor del carrito (lógica pura, sin React).
 */
import { describe, expect, it } from 'vitest';
import { carritoReducer } from '../src/context/carritoReducer.js';

const BODY = { id: 1, nombre: 'Body', precio: '25000.00', talla: '0-3M', stock: 3 };

describe('carritoReducer', () => {
  it('agrega un producto nuevo y convierte el precio a número', () => {
    const estado = carritoReducer([], { tipo: 'agregar', producto: BODY, cantidad: 1 });
    expect(estado).toHaveLength(1);
    expect(estado[0].precio).toBe(25000);
  });

  it('suma cantidades sin pasar del stock', () => {
    let estado = carritoReducer([], { tipo: 'agregar', producto: BODY, cantidad: 2 });
    estado = carritoReducer(estado, { tipo: 'agregar', producto: BODY, cantidad: 5 });
    expect(estado[0].cantidad).toBe(3);
  });

  it('no modifica el arreglo original (inmutabilidad)', () => {
    const inicial = [{ ...BODY, precio: 25000, cantidad: 1 }];
    const copia = structuredClone(inicial);
    carritoReducer(inicial, { tipo: 'cambiarCantidad', id: 1, cantidad: 2 });
    expect(inicial).toEqual(copia);
  });

  it('cambiarCantidad mantiene el valor entre 1 y el stock', () => {
    const inicial = [{ ...BODY, precio: 25000, cantidad: 1 }];
    expect(
      carritoReducer(inicial, { tipo: 'cambiarCantidad', id: 1, cantidad: 0 })[0].cantidad
    ).toBe(1);
    expect(
      carritoReducer(inicial, { tipo: 'cambiarCantidad', id: 1, cantidad: 9 })[0].cantidad
    ).toBe(3);
  });

  it('quita y vacía', () => {
    const inicial = [{ ...BODY, cantidad: 1 }];
    expect(carritoReducer(inicial, { tipo: 'quitar', id: 1 })).toEqual([]);
    expect(carritoReducer(inicial, { tipo: 'vaciar' })).toEqual([]);
  });

  it('lanza un error con una acción desconocida', () => {
    expect(() => carritoReducer([], { tipo: 'volar' })).toThrow(/desconocida/);
  });
});
