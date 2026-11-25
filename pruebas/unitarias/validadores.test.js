/**
 * Pruebas unitarias de los validadores (capa de validación).
 * Cada función recibe un objeto y devuelve datos limpios o lanza AppError (400).
 */
require('./preparar.js');
const { describe, it } = require('node:test');
const assert = require('node:assert/strict');

const AppError = require('../../src/utils/AppError.js');
const { validarId } = require('../../src/validators/comunes.js');
const {
  validarRegistro,
  validarLogin,
  validarCambioUsuario,
} = require('../../src/validators/usuarioValidator.js');
const {
  validarPedido,
  validarEstado,
  validarFiltroEstado,
} = require('../../src/validators/pedidoValidator.js');
const { validarProducto } = require('../../src/validators/productoValidator.js');
const { validarCategoria } = require('../../src/validators/categoriaValidator.js');

/**
 * Ejecuta una función que debe fallar y devuelve el AppError que lanzó.
 */
function capturarError(funcion) {
  try {
    funcion();
  } catch (error) {
    assert.ok(error instanceof AppError, 'debe lanzar AppError');
    return error;
  }
  assert.fail('la función debía lanzar un error');
}

describe('validarId', () => {
  it('convierte un texto numérico en número', () => assert.equal(validarId('7'), 7));
  it('rechaza ceros, negativos, decimales y letras', () => {
    for (const valor of ['0', '-3', '2.5', 'abc']) {
      assert.equal(capturarError(() => validarId(valor)).estado, 400);
    }
  });
});

describe('validarRegistro (usuarios)', () => {
  const valido = { nombre: '  Laura Gómez ', email: 'Laura@Correo.COM', contrasena: 'Clave2026' };

  it('limpia los espacios y pasa el correo a minúsculas', () => {
    const datos = validarRegistro(valido);
    assert.equal(datos.nombre, 'Laura Gómez');
    assert.equal(datos.email, 'laura@correo.com');
    assert.equal(datos.telefono, null);
  });

  it('nunca devuelve un rol, aunque venga en los datos', () => {
    assert.equal(validarRegistro({ ...valido, rol: 'admin' }).rol, undefined);
  });

  it('exige contraseña con letra y número', () => {
    const error = capturarError(() =>
      validarRegistro({ ...valido, contrasena: 'solamenteletras' })
    );
    assert.deepEqual(error.detalles, ['La contraseña debe tener al menos una letra y un número']);
  });

  it('reúne todos los errores en una sola respuesta', () => {
    const error = capturarError(() =>
      validarRegistro({ nombre: 'A', email: 'malo', contrasena: '1' })
    );
    assert.equal(error.detalles.length, 3);
  });

  it('valida el formato del teléfono', () => {
    const error = capturarError(() => validarRegistro({ ...valido, telefono: 'llámame' }));
    assert.match(error.detalles[0], /teléfono/);
  });
});

describe('validarLogin y validarCambioUsuario', () => {
  it('login exige correo y contraseña', () => {
    assert.equal(capturarError(() => validarLogin({})).detalles.length, 2);
  });
  it('solo acepta los roles admin y cliente', () => {
    capturarError(() => validarCambioUsuario({ rol: 'superusuario' }));
    assert.deepEqual(validarCambioUsuario({ rol: 'admin' }), { rol: 'admin' });
  });
  it('activo debe ser booleano', () => {
    capturarError(() => validarCambioUsuario({ activo: 'no' }));
  });
  it('pide al menos un campo', () => {
    capturarError(() => validarCambioUsuario({}));
  });
});

describe('validarPedido', () => {
  const envio = { direccionEnvio: 'Calle 140 # 12-30', ciudad: 'Bogotá', telefono: '3001234567' };

  it('suma las cantidades del mismo producto', () => {
    const datos = validarPedido({
      ...envio,
      items: [
        { productoId: 4, cantidad: 1 },
        { productoId: '4', cantidad: 2 },
        { productoId: 9, cantidad: 1 },
      ],
    });
    assert.deepEqual(datos.items, [
      { productoId: 4, cantidad: 3 },
      { productoId: 9, cantidad: 1 },
    ]);
  });

  it('rechaza un pedido sin productos', () => {
    capturarError(() => validarPedido({ ...envio, items: [] }));
  });

  it('limita a 20 unidades por producto', () => {
    const error = capturarError(() =>
      validarPedido({ ...envio, items: [{ productoId: 1, cantidad: 21 }] })
    );
    assert.match(error.detalles[0], /Máximo 20/);
  });

  it('exige dirección, ciudad y teléfono', () => {
    const error = capturarError(() => validarPedido({ items: [{ productoId: 1, cantidad: 1 }] }));
    assert.equal(error.detalles.length, 3);
  });

  it('valida los estados del pedido', () => {
    assert.equal(validarEstado({ estado: 'pagado' }), 'pagado');
    capturarError(() => validarEstado({ estado: 'perdido' }));
    assert.equal(validarFiltroEstado(''), undefined);
  });
});

describe('validarProducto y validarCategoria (catálogo)', () => {
  it('pone valores por defecto: stock 0, estado nuevo, activo', () => {
    const datos = validarProducto({ nombre: 'Body', precio: '25000', categoriaId: '2' });
    assert.equal(datos.stock, 0);
    assert.equal(datos.estado, 'nuevo');
    assert.equal(datos.activo, true);
    assert.equal(datos.precio, 25000);
  });

  it('rechaza precios negativos y estados desconocidos', () => {
    const error = capturarError(() =>
      validarProducto({ nombre: 'Body', precio: -1, categoriaId: 1, estado: 'roto' })
    );
    assert.equal(error.detalles.length, 2);
  });

  it('la categoría necesita nombre', () => {
    capturarError(() => validarCategoria({ nombre: '   ' }));
    assert.equal(validarCategoria({ nombre: ' Vestidos ' }).nombre, 'Vestidos');
  });
});
