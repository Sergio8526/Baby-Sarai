/**
 * Pruebas unitarias de las funciones de utilidad (formato, validaciones y pedidos).
 */
import { describe, expect, it } from 'vitest';
import { formatearFecha, formatearPrecio, normalizarTexto } from '../src/utils/formato.js';
import {
  calcularEnvio,
  faltaParaEnvioGratis,
  infoEstado,
  itemsParaPedido,
  siguientesEstados,
} from '../src/utils/pedidos.js';
import { validarEnvio, validarLogin, validarRegistro } from '../src/utils/validaciones.js';

describe('formato', () => {
  it('muestra precios en pesos colombianos', () => {
    expect(formatearPrecio(25000)).toBe('$25.000');
    expect(formatearPrecio('150000.00')).toBe('$150.000');
  });
  it('normaliza textos para buscar sin tildes', () => {
    expect(normalizarTexto('  Recién Nacido ')).toBe('recien nacido');
  });
  it('devuelve un guion si la fecha no es válida', () => {
    expect(formatearFecha('no-es-fecha')).toBe('—');
    expect(formatearFecha('2026-11-24T15:30:00', { conHora: false })).toMatch(/2026/);
  });
});

describe('reglas de pedidos', () => {
  it('envío de $10.000 por debajo de $150.000 y gratis desde ahí', () => {
    expect(calcularEnvio(0)).toBe(0);
    expect(calcularEnvio(37000)).toBe(10000);
    expect(calcularEnvio(150000)).toBe(0);
    expect(faltaParaEnvioGratis(37000)).toBe(113000);
  });
  it('sigue el mismo flujo de estados de la API', () => {
    expect(siguientesEstados('pendiente')).toEqual(['pagado', 'cancelado']);
    expect(siguientesEstados('entregado')).toEqual([]);
    expect(infoEstado('cancelado').texto).toBe('Cancelado');
  });
  it('convierte el carrito al formato del pedido', () => {
    expect(itemsParaPedido([{ id: 3, nombre: 'Body', cantidad: 2, precio: 1 }])).toEqual([
      { productoId: 3, cantidad: 2 },
    ]);
  });
});

describe('validaciones de formularios', () => {
  const registro = {
    nombre: 'Laura Gómez',
    email: 'laura@correo.com',
    telefono: '',
    contrasena: 'Clave2026',
    confirmacion: 'Clave2026',
  };

  it('acepta un registro válido', () => {
    expect(validarRegistro(registro)).toEqual({});
  });
  it('detecta contraseñas sin números y que no coinciden', () => {
    const errores = validarRegistro({
      ...registro,
      contrasena: 'soloLetras',
      confirmacion: 'otra',
    });
    expect(errores.contrasena).toMatch(/letra y un número/);
    expect(errores.confirmacion).toBeDefined();
  });
  it('el login pide correo y contraseña', () => {
    expect(Object.keys(validarLogin({ email: ' ', contrasena: '' }))).toEqual([
      'email',
      'contrasena',
    ]);
  });
  it('el envío exige dirección, ciudad y un teléfono válido', () => {
    const errores = validarEnvio({ direccionEnvio: '', ciudad: '', telefono: 'abc', notas: '' });
    expect(Object.keys(errores)).toEqual(['direccionEnvio', 'ciudad', 'telefono']);
  });
});
