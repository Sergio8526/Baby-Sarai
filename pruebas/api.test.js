/**
 * Pruebas automáticas de los servicios web de Baby Saraí (API v1).
 *
 * Ejecutar con: npm test
 * Requisitos: MySQL encendido, scripts 001 a 004 ejecutados y archivo .env configurado.
 *
 * Las pruebas crean sus propios datos (una categoría, dos productos, un cliente y
 * una administradora con correos únicos) y los borran al terminar, así que no
 * modifican los datos de la tienda.
 */
const { describe, it, before, after } = require('node:test');
const assert = require('node:assert/strict');
const bcrypt = require('bcryptjs');

const app = require('../src/app.js');
const pool = require('../src/config/db.js');
const usuarioModel = require('../src/models/usuarioModel.js');

const SUFIJO = Date.now();
const CLIENTE = {
  nombre: 'Cliente de Prueba',
  email: `cliente.${SUFIJO}@prueba.com`,
  contrasena: 'Cliente2026',
  telefono: '3001234567',
};
const ADMIN = { email: `admin.${SUFIJO}@prueba.com`, contrasena: 'Admin2026' };
const ENVIO = { direccionEnvio: 'Calle 140 # 12-30', ciudad: 'Bogotá', telefono: '3001234567' };

let servidor;
let base;
const datos = {}; // ids y tokens que se van creando

/**
 * Hace una petición a la API y devuelve el estado y el cuerpo en JSON.
 * @param {string} metodo
 * @param {string} ruta - Ruta relativa a /api/v1
 * @param {{token?: string, cuerpo?: Object}} [opciones]
 */
async function pedir(metodo, ruta, { token, cuerpo } = {}) {
  const encabezados = { 'Content-Type': 'application/json' };
  if (token) encabezados.Authorization = `Bearer ${token}`;
  const respuesta = await fetch(`${base}${ruta}`, {
    method: metodo,
    headers: encabezados,
    body: cuerpo === undefined ? undefined : JSON.stringify(cuerpo),
  });
  return {
    estado: respuesta.status,
    cuerpo: await respuesta.json(),
    encabezados: respuesta.headers,
  };
}

/**
 * Consulta el stock actual de un producto directamente en la base de datos.
 */
async function stockDe(productoId) {
  const [filas] = await pool.query('SELECT stock FROM productos WHERE id = ?', [productoId]);
  return filas[0].stock;
}

before(async () => {
  servidor = app.listen(0); // puerto libre cualquiera
  await new Promise((resolver) => servidor.once('listening', resolver));
  base = `http://localhost:${servidor.address().port}/api/v1`;

  // La administradora se crea directamente en la base de datos (como hace npm run crear-admin)
  datos.adminId = await usuarioModel.crearUsuario({
    nombre: 'Admin de Prueba',
    email: ADMIN.email,
    contrasenaHash: await bcrypt.hash(ADMIN.contrasena, 10),
    rol: 'admin',
  });
});

after(async () => {
  // Limpieza en orden: primero lo que depende de otras tablas
  const usuarios = [datos.adminId, datos.clienteId].filter(Boolean);
  if (usuarios.length) {
    await pool.query('DELETE FROM pedidos WHERE usuario_id IN (?)', [usuarios]);
    await pool.query('DELETE FROM usuarios WHERE id IN (?)', [usuarios]);
  }
  if (datos.categoriaId) {
    await pool.query('DELETE FROM productos WHERE categoria_id = ?', [datos.categoriaId]);
    await pool.query('DELETE FROM categorias WHERE id = ?', [datos.categoriaId]);
  }
  await pool.end();
  servidor.close();
});

describe('Autenticación', () => {
  it('registra un cliente nuevo (201) sin devolver la contraseña', async () => {
    const { estado, cuerpo } = await pedir('POST', '/auth/registro', {
      cuerpo: { ...CLIENTE, email: CLIENTE.email.toUpperCase() },
    });
    assert.equal(estado, 201);
    assert.equal(cuerpo.usuario.rol, 'cliente');
    assert.equal(cuerpo.usuario.email, CLIENTE.email); // guardado en minúsculas
    assert.equal(cuerpo.usuario.contrasenaHash, undefined);
    datos.clienteId = cuerpo.usuario.id;
  });

  it('rechaza un correo repetido (409)', async () => {
    const { estado, cuerpo } = await pedir('POST', '/auth/registro', { cuerpo: CLIENTE });
    assert.equal(estado, 409);
    assert.equal(cuerpo.mensaje, 'Ya existe una cuenta con ese correo');
  });

  it('valida los datos del registro (400) y lista cada error', async () => {
    const { estado, cuerpo } = await pedir('POST', '/auth/registro', {
      cuerpo: { nombre: 'A', email: 'no-es-correo', contrasena: 'corta' },
    });
    assert.equal(estado, 400);
    assert.equal(cuerpo.detalles.length, 3);
  });

  it('inicia sesión del cliente y devuelve un token (200)', async () => {
    const { estado, cuerpo } = await pedir('POST', '/auth/login', {
      cuerpo: { email: CLIENTE.email, contrasena: CLIENTE.contrasena },
    });
    assert.equal(estado, 200);
    assert.equal(cuerpo.tipo, 'Bearer');
    assert.equal(cuerpo.token.split('.').length, 3);
    datos.tokenCliente = cuerpo.token;
  });

  it('inicia sesión de la administradora (200)', async () => {
    const { estado, cuerpo } = await pedir('POST', '/auth/login', { cuerpo: ADMIN });
    assert.equal(estado, 200);
    assert.equal(cuerpo.usuario.rol, 'admin');
    datos.tokenAdmin = cuerpo.token;
  });

  it('responde lo mismo si la contraseña está mal o el correo no existe (401)', async () => {
    const malaClave = await pedir('POST', '/auth/login', {
      cuerpo: { email: CLIENTE.email, contrasena: 'Incorrecta1' },
    });
    const sinCuenta = await pedir('POST', '/auth/login', {
      cuerpo: { email: `nadie.${SUFIJO}@prueba.com`, contrasena: 'Incorrecta1' },
    });
    assert.equal(malaClave.estado, 401);
    assert.equal(sinCuenta.estado, 401);
    assert.equal(malaClave.cuerpo.mensaje, sinCuenta.cuerpo.mensaje);
  });

  it('devuelve el perfil con un token válido (200)', async () => {
    const { estado, cuerpo } = await pedir('GET', '/auth/perfil', { token: datos.tokenCliente });
    assert.equal(estado, 200);
    assert.equal(cuerpo.email, CLIENTE.email);
  });

  it('rechaza el perfil sin token o con un token alterado (401)', async () => {
    assert.equal((await pedir('GET', '/auth/perfil')).estado, 401);
    const alterado = `${datos.tokenCliente.slice(0, -2)}xx`;
    const { estado, cuerpo } = await pedir('GET', '/auth/perfil', { token: alterado });
    assert.equal(estado, 401);
    assert.equal(cuerpo.mensaje, 'Token inválido');
  });
});

describe('Catálogo protegido por roles', () => {
  it('permite consultar productos sin iniciar sesión (200)', async () => {
    const { estado, cuerpo } = await pedir('GET', '/productos?soloActivos=true');
    assert.equal(estado, 200);
    assert.ok(Array.isArray(cuerpo));
  });

  it('no deja crear categorías sin token (401) ni a un cliente (403)', async () => {
    const sinToken = await pedir('POST', '/categorias', { cuerpo: { nombre: 'X' } });
    const cliente = await pedir('POST', '/categorias', {
      token: datos.tokenCliente,
      cuerpo: { nombre: 'X' },
    });
    assert.equal(sinToken.estado, 401);
    assert.equal(cliente.estado, 403);
  });

  it('la administradora crea una categoría y dos productos (201)', async () => {
    const categoria = await pedir('POST', '/categorias', {
      token: datos.tokenAdmin,
      cuerpo: { nombre: `Prueba ${SUFIJO}`, descripcion: 'Categoría de las pruebas automáticas' },
    });
    assert.equal(categoria.estado, 201);
    datos.categoriaId = categoria.cuerpo.categoria.id;

    const body = await pedir('POST', '/productos', {
      token: datos.tokenAdmin,
      cuerpo: { nombre: 'Body de prueba', categoriaId: datos.categoriaId, precio: 30000, stock: 5 },
    });
    const gorro = await pedir('POST', '/productos', {
      token: datos.tokenAdmin,
      cuerpo: {
        nombre: 'Gorro de prueba',
        categoriaId: datos.categoriaId,
        precio: 60000,
        stock: 2,
      },
    });
    assert.equal(body.estado, 201);
    assert.equal(gorro.estado, 201);
    datos.bodyId = body.cuerpo.producto.id;
    datos.gorroId = gorro.cuerpo.producto.id;
  });

  it('un cliente no puede modificar ni eliminar productos (403)', async () => {
    const editar = await pedir('PUT', `/productos/${datos.bodyId}`, {
      token: datos.tokenCliente,
      cuerpo: { nombre: 'Gratis', categoriaId: datos.categoriaId, precio: 0 },
    });
    const borrar = await pedir('DELETE', `/productos/${datos.bodyId}`, {
      token: datos.tokenCliente,
    });
    assert.equal(editar.estado, 403);
    assert.equal(borrar.estado, 403);
  });
});

describe('Pedidos', () => {
  it('crea un pedido, calcula el total y descuenta el stock (201)', async () => {
    const { estado, cuerpo, encabezados } = await pedir('POST', '/pedidos', {
      token: datos.tokenCliente,
      cuerpo: {
        ...ENVIO,
        // el mismo producto dos veces: se suman las cantidades
        items: [
          { productoId: datos.bodyId, cantidad: 1 },
          { productoId: datos.bodyId, cantidad: 1 },
        ],
      },
    });
    assert.equal(estado, 201);
    assert.equal(cuerpo.pedido.estado, 'pendiente');
    assert.equal(cuerpo.pedido.items.length, 1);
    assert.equal(cuerpo.pedido.items[0].cantidad, 2);
    assert.equal(cuerpo.pedido.subtotal, 60000);
    assert.equal(cuerpo.pedido.costoEnvio, 10000); // menos de $150.000: paga envío
    assert.equal(cuerpo.pedido.total, 70000);
    assert.equal(encabezados.get('location'), `/api/v1/pedidos/${cuerpo.pedido.id}`);
    assert.equal(await stockDe(datos.bodyId), 3);
    datos.pedidoId = cuerpo.pedido.id;
  });

  it('da envío gratis desde $150.000 (201)', async () => {
    const { cuerpo } = await pedir('POST', '/pedidos', {
      token: datos.tokenCliente,
      cuerpo: {
        ...ENVIO,
        items: [
          { productoId: datos.gorroId, cantidad: 2 },
          { productoId: datos.bodyId, cantidad: 1 },
        ],
      },
    });
    assert.equal(cuerpo.pedido.subtotal, 150000);
    assert.equal(cuerpo.pedido.costoEnvio, 0);
    datos.pedidoGratisId = cuerpo.pedido.id;
  });

  it('rechaza un pedido sin stock suficiente y NO descuenta nada (409)', async () => {
    const stockAntes = await stockDe(datos.bodyId);
    const { estado, cuerpo } = await pedir('POST', '/pedidos', {
      token: datos.tokenCliente,
      cuerpo: {
        ...ENVIO,
        items: [
          { productoId: datos.bodyId, cantidad: 1 },
          { productoId: datos.gorroId, cantidad: 1 }, // ya no quedan gorros
        ],
      },
    });
    assert.equal(estado, 409);
    assert.match(cuerpo.detalles[0], /solo hay 0/);
    assert.equal(await stockDe(datos.bodyId), stockAntes); // la transacción se deshizo
  });

  it('valida los datos del pedido (400)', async () => {
    const { estado, cuerpo } = await pedir('POST', '/pedidos', {
      token: datos.tokenCliente,
      cuerpo: { items: [{ productoId: 'abc', cantidad: 0 }] },
    });
    assert.equal(estado, 400);
    assert.ok(cuerpo.detalles.length >= 4);
  });

  it('exige iniciar sesión para comprar (401)', async () => {
    const { estado } = await pedir('POST', '/pedidos', { cuerpo: { ...ENVIO, items: [] } });
    assert.equal(estado, 401);
  });

  it('el cliente ve solo sus pedidos', async () => {
    const { estado, cuerpo } = await pedir('GET', '/pedidos', { token: datos.tokenCliente });
    assert.equal(estado, 200);
    assert.equal(cuerpo.length, 2);
    assert.ok(cuerpo.every((p) => p.usuarioId === datos.clienteId));
  });

  it('un pedido ajeno responde 404 (no revela que existe)', async () => {
    // La administradora compra; el cliente intenta verlo
    const { cuerpo } = await pedir('POST', '/pedidos', {
      token: datos.tokenAdmin,
      cuerpo: { ...ENVIO, items: [{ productoId: datos.bodyId, cantidad: 1 }] },
    });
    datos.pedidoAdminId = cuerpo.pedido.id;
    const ajeno = await pedir('GET', `/pedidos/${datos.pedidoAdminId}`, {
      token: datos.tokenCliente,
    });
    assert.equal(ajeno.estado, 404);
  });

  it('el cliente no puede cambiar el estado (403)', async () => {
    const { estado } = await pedir('PATCH', `/pedidos/${datos.pedidoId}/estado`, {
      token: datos.tokenCliente,
      cuerpo: { estado: 'entregado' },
    });
    assert.equal(estado, 403);
  });

  it('la administradora sigue el flujo pendiente → pagado → enviado', async () => {
    for (const estado of ['pagado', 'enviado']) {
      const r = await pedir('PATCH', `/pedidos/${datos.pedidoGratisId}/estado`, {
        token: datos.tokenAdmin,
        cuerpo: { estado },
      });
      assert.equal(r.estado, 200);
      assert.equal(r.cuerpo.pedido.estado, estado);
    }
  });

  it('no permite saltos de estado inválidos (409)', async () => {
    const { estado, cuerpo } = await pedir('PATCH', `/pedidos/${datos.pedidoGratisId}/estado`, {
      token: datos.tokenAdmin,
      cuerpo: { estado: 'pendiente' },
    });
    assert.equal(estado, 409);
    assert.match(cuerpo.mensaje, /no puede pasar/);
  });

  it('el cliente cancela su pedido pendiente y el stock vuelve (200)', async () => {
    const stockAntes = await stockDe(datos.bodyId);
    const { estado, cuerpo } = await pedir('PATCH', `/pedidos/${datos.pedidoId}/cancelar`, {
      token: datos.tokenCliente,
    });
    assert.equal(estado, 200);
    assert.equal(cuerpo.pedido.estado, 'cancelado');
    assert.equal(await stockDe(datos.bodyId), stockAntes + 2);
  });

  it('el cliente no puede cancelar un pedido ya enviado (409)', async () => {
    const { estado } = await pedir('PATCH', `/pedidos/${datos.pedidoGratisId}/cancelar`, {
      token: datos.tokenCliente,
    });
    assert.equal(estado, 409);
  });

  it('un producto con pedidos no se puede eliminar (409)', async () => {
    const { estado, cuerpo } = await pedir('DELETE', `/productos/${datos.bodyId}`, {
      token: datos.tokenAdmin,
    });
    assert.equal(estado, 409);
    assert.match(cuerpo.mensaje, /Desactívalo/);
  });
});

describe('Administración de usuarios', () => {
  it('el registro público siempre crea clientes', async () => {
    const { cuerpo } = await pedir('GET', `/usuarios/${datos.clienteId}`, {
      token: datos.tokenAdmin,
    });
    assert.equal(cuerpo.rol, 'cliente');
  });

  it('un cliente no puede listar usuarios (403)', async () => {
    const { estado } = await pedir('GET', '/usuarios', { token: datos.tokenCliente });
    assert.equal(estado, 403);
  });

  it('la administradora no puede desactivarse a sí misma (409)', async () => {
    const { estado } = await pedir('PATCH', `/usuarios/${datos.adminId}`, {
      token: datos.tokenAdmin,
      cuerpo: { activo: false },
    });
    assert.equal(estado, 409);
  });

  it('al desactivar un cliente, su token deja de funcionar (401) y no puede entrar (403)', async () => {
    const r = await pedir('PATCH', `/usuarios/${datos.clienteId}`, {
      token: datos.tokenAdmin,
      cuerpo: { activo: false },
    });
    assert.equal(r.estado, 200);
    assert.equal(r.cuerpo.usuario.activo, false);

    const perfil = await pedir('GET', '/auth/perfil', { token: datos.tokenCliente });
    assert.equal(perfil.estado, 401);
    const login = await pedir('POST', '/auth/login', {
      cuerpo: { email: CLIENTE.email, contrasena: CLIENTE.contrasena },
    });
    assert.equal(login.estado, 403);
  });
});

describe('Versionamiento y documentación', () => {
  it('GET /api informa la versión y la ruta de la documentación', async () => {
    const respuesta = await fetch(base.replace('/v1', ''));
    const cuerpo = await respuesta.json();
    assert.equal(cuerpo.rutaBase, '/api/v1');
    assert.equal(cuerpo.documentacion, '/api/docs');
  });

  it('las rutas sin versión siguen funcionando, marcadas como obsoletas', async () => {
    const respuesta = await fetch(base.replace('/v1', '/productos'));
    assert.equal(respuesta.status, 200);
    assert.equal(respuesta.headers.get('deprecation'), 'true');
  });

  it('publica la especificación OpenAPI con todas las rutas', async () => {
    const respuesta = await fetch(base.replace('/v1', '/docs/openapi.json'));
    const especificacion = await respuesta.json();
    assert.equal(especificacion.openapi, '3.0.3');
    assert.ok(Object.keys(especificacion.paths).length >= 12);
  });

  it('una ruta inexistente responde 404 en JSON', async () => {
    const { estado, cuerpo } = await pedir('GET', '/no-existe');
    assert.equal(estado, 404);
    assert.match(cuerpo.mensaje, /No existe la ruta/);
  });
});
