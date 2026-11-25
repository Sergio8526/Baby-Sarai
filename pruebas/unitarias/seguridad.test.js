/**
 * Pruebas unitarias del módulo de seguridad: tokens JWT y middlewares
 * autenticar / autorizar. El modelo de usuarios se reemplaza por una versión
 * falsa (stub), así la prueba no necesita MySQL.
 */
require('./preparar.js');
const { describe, it, beforeEach } = require('node:test');
const assert = require('node:assert/strict');
const jwt = require('jsonwebtoken');

const { generarToken, verificarToken } = require('../../src/utils/token.js');
const usuarioModel = require('../../src/models/usuarioModel.js');
const { autenticar, autorizar } = require('../../src/middlewares/autenticacion.js');

const ANA = { id: 5, nombre: 'Ana', rol: 'cliente', activo: true };

/** Crea una petición falsa con el encabezado Authorization. */
const peticion = (token) => ({ headers: token ? { authorization: `Bearer ${token}` } : {} });

/** Ejecuta un middleware y devuelve el error que lanzó (o null si llamó a next). */
async function ejecutar(middleware, req) {
  try {
    let siguio = false;
    await middleware(req, {}, () => {
      siguio = true;
    });
    assert.ok(siguio, 'debía llamar a next()');
    return null;
  } catch (error) {
    return error;
  }
}

describe('token.js', () => {
  it('genera un token que guarda el id y el rol', () => {
    const contenido = verificarToken(generarToken(ANA));
    assert.equal(contenido.sub, '5');
    assert.equal(contenido.rol, 'cliente');
    assert.equal(contenido.exp - contenido.iat, 7200);
  });

  it('rechaza un token firmado con otro secreto', () => {
    const falso = jwt.sign({ sub: '5', rol: 'admin' }, 'otro-secreto');
    assert.throws(() => verificarToken(falso), { name: 'JsonWebTokenError' });
  });
});

describe('middleware autenticar', () => {
  beforeEach(() => {
    // Stub: el "usuario en la base de datos" es Ana
    usuarioModel.obtenerUsuarioPorId = async (id) => (id === 5 ? { ...ANA } : null);
  });

  it('deja pasar un token válido y guarda el usuario en req', async () => {
    const req = peticion(generarToken(ANA));
    assert.equal(await ejecutar(autenticar, req), null);
    assert.equal(req.usuario.nombre, 'Ana');
  });

  it('responde 401 si no hay token', async () => {
    const error = await ejecutar(autenticar, peticion());
    assert.equal(error.estado, 401);
    assert.match(error.message, /Debes iniciar sesión/);
  });

  it('responde 401 "La sesión expiró" con un token vencido', async () => {
    const vencido = jwt.sign(
      { sub: '5', rol: 'cliente', exp: Math.floor(Date.now() / 1000) - 10 },
      process.env.JWT_SECRETO
    );
    const error = await ejecutar(autenticar, peticion(vencido));
    assert.equal(error.message, 'La sesión expiró. Inicia sesión de nuevo');
  });

  it('responde 401 si el usuario fue desactivado', async () => {
    usuarioModel.obtenerUsuarioPorId = async () => ({ ...ANA, activo: false });
    const error = await ejecutar(autenticar, peticion(generarToken(ANA)));
    assert.equal(error.estado, 401);
  });

  it('usa el rol actual de la base de datos, no el del token', async () => {
    usuarioModel.obtenerUsuarioPorId = async () => ({ ...ANA, rol: 'admin' });
    const req = peticion(generarToken(ANA));
    await ejecutar(autenticar, req);
    assert.equal(req.usuario.rol, 'admin');
  });
});

describe('middleware autorizar', () => {
  it('deja pasar el rol permitido', async () => {
    assert.equal(await ejecutar(autorizar('admin'), { usuario: { rol: 'admin' } }), null);
  });

  it('responde 403 a otros roles', async () => {
    const error = await ejecutar(autorizar('admin'), { usuario: { rol: 'cliente' } });
    assert.equal(error.estado, 403);
  });

  it('acepta varios roles', async () => {
    assert.equal(
      await ejecutar(autorizar('admin', 'cliente'), { usuario: { rol: 'cliente' } }),
      null
    );
  });
});
