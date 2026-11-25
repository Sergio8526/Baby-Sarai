/**
 * Pruebas unitarias del cliente HTTP (services/api.js).
 * fetch se reemplaza por una función simulada (mock): no se necesita la API encendida.
 */
import { describe, expect, it, vi } from 'vitest';
import {
  ErrorApi,
  EVENTO_SESION_EXPIRADA,
  guardarToken,
  leerToken,
  peticionApi,
} from '../src/services/api.js';

/** Simula una respuesta de fetch. */
function responder(estado, cuerpo) {
  return vi.spyOn(globalThis, 'fetch').mockResolvedValue({
    status: estado,
    ok: estado >= 200 && estado < 300,
    json: async () => cuerpo,
  });
}

describe('peticionApi', () => {
  it('usa la URL de la versión 1 y devuelve el JSON', async () => {
    const fetchSimulado = responder(200, [{ id: 1 }]);
    await expect(peticionApi('/productos')).resolves.toEqual([{ id: 1 }]);
    expect(fetchSimulado.mock.calls[0][0]).toBe('/api/v1/productos');
  });

  it('envía el token guardado en el encabezado Authorization', async () => {
    guardarToken('abc.def.ghi');
    const fetchSimulado = responder(200, {});
    await peticionApi('/auth/perfil');
    expect(fetchSimulado.mock.calls[0][1].headers.Authorization).toBe('Bearer abc.def.ghi');
  });

  it('envía los datos como JSON', async () => {
    const fetchSimulado = responder(201, { mensaje: 'ok' });
    await peticionApi('/pedidos', { metodo: 'POST', datos: { a: 1 } });
    const opciones = fetchSimulado.mock.calls[0][1];
    expect(opciones.method).toBe('POST');
    expect(opciones.headers['Content-Type']).toBe('application/json');
    expect(opciones.body).toBe('{"a":1}');
  });

  it('convierte las respuestas de error en ErrorApi con sus detalles', async () => {
    responder(400, { mensaje: 'Datos no válidos', detalles: ['falta el nombre'] });
    const error = await peticionApi('/productos', { metodo: 'POST', datos: {} }).catch((e) => e);
    expect(error).toBeInstanceOf(ErrorApi);
    expect(error.estado).toBe(400);
    expect(error.detalles).toEqual(['falta el nombre']);
  });

  it('avisa cuando no hay conexión con el servidor', async () => {
    vi.spyOn(globalThis, 'fetch').mockRejectedValue(new TypeError('Failed to fetch'));
    await expect(peticionApi('/productos')).rejects.toMatchObject({ estado: 0 });
  });

  it('con 401 y token: borra el token y dispara el evento de sesión expirada', async () => {
    guardarToken('token.vencido.x');
    responder(401, { mensaje: 'La sesión expiró. Inicia sesión de nuevo' });
    const escucha = vi.fn();
    window.addEventListener(EVENTO_SESION_EXPIRADA, escucha);
    await peticionApi('/pedidos').catch(() => {});
    window.removeEventListener(EVENTO_SESION_EXPIRADA, escucha);
    expect(leerToken()).toBeNull();
    expect(escucha).toHaveBeenCalledOnce();
  });
});
