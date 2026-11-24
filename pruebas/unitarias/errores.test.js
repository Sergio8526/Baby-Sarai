/**
 * Pruebas unitarias del manejador central de errores.
 * Se usa una respuesta falsa (res) que guarda el estado y el JSON enviados.
 */
require('./preparar.js');
const { describe, it, mock } = require('node:test');
const assert = require('node:assert/strict');

const AppError = require('../../src/utils/AppError.js');
const { manejarErrores, rutaNoEncontrada } = require('../../src/middlewares/manejarErrores.js');

/** Respuesta falsa de Express. */
function respuestaFalsa() {
  return {
    estado: null,
    cuerpo: null,
    status(codigo) {
      this.estado = codigo;
      return this;
    },
    json(datos) {
      this.cuerpo = datos;
      return this;
    },
  };
}

/** Error parecido a los que lanza mysql2. */
const errorMysql = (code, sqlMessage) => Object.assign(new Error(sqlMessage), { code, sqlMessage });

describe('manejarErrores', () => {
  it('responde un AppError con su estado y detalles', () => {
    const res = respuestaFalsa();
    manejarErrores(new AppError('Datos no válidos', 400, ['falta el nombre']), {}, res);
    assert.equal(res.estado, 400);
    assert.deepEqual(res.cuerpo, { mensaje: 'Datos no válidos', detalles: ['falta el nombre'] });
  });

  it('traduce un JSON mal escrito a 400', () => {
    const res = respuestaFalsa();
    manejarErrores({ type: 'entity.parse.failed' }, {}, res);
    assert.equal(res.estado, 400);
  });

  it('reconoce un correo repetido por el nombre de la restricción', () => {
    const res = respuestaFalsa();
    manejarErrores(
      errorMysql('ER_DUP_ENTRY', "Duplicate entry 'a@b.co' for key 'usuarios.email'"),
      {},
      res
    );
    assert.equal(res.estado, 409);
    assert.equal(res.cuerpo.mensaje, 'Ya existe una cuenta con ese correo');
  });

  it('explica por qué no se puede borrar un producto vendido', () => {
    const res = respuestaFalsa();
    manejarErrores(
      errorMysql(
        'ER_ROW_IS_REFERENCED_2',
        'Cannot delete ... CONSTRAINT `fk_detalle_productos` FOREIGN KEY'
      ),
      {},
      res
    );
    assert.match(res.cuerpo.mensaje, /Desactívalo/);
  });

  it('oculta los detalles técnicos de un error desconocido (500)', () => {
    const res = respuestaFalsa();
    const consola = mock.method(console, 'error', () => {});
    manejarErrores(new Error('conexión perdida con 10.0.0.5'), {}, res);
    consola.mock.restore();
    assert.equal(res.estado, 500);
    assert.equal(res.cuerpo.mensaje, 'Error interno del servidor');
  });

  it('rutaNoEncontrada responde 404 con la ruta pedida', () => {
    const res = respuestaFalsa();
    rutaNoEncontrada({ method: 'GET', originalUrl: '/api/v1/nada' }, res);
    assert.equal(res.estado, 404);
    assert.equal(res.cuerpo.mensaje, 'No existe la ruta GET /api/v1/nada');
  });
});
