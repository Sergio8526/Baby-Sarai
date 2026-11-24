/**
 * Pruebas unitarias de componentes de React con Testing Library:
 * se dibujan en un navegador simulado (jsdom) y se usan como lo haría una persona.
 * Los servicios que llaman a la API se reemplazan por mocks.
 */
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter, Route, Routes } from 'react-router';
import { describe, expect, it, vi } from 'vitest';
import CartSummary from '../src/components/carrito/CartSummary.jsx';
import RutaProtegida from '../src/components/auth/RutaProtegida.jsx';
import { AuthContext } from '../src/context/AuthContext.js';
import AuthProvider from '../src/context/AuthProvider.jsx';
import { CartContext } from '../src/context/CartContext.js';
import Ingresar from '../src/pages/cuenta/Ingresar.jsx';
import { destinoDespuesDeIngresar } from '../src/utils/sesion.js';
import * as authService from '../src/services/authService.js';

/** Dibuja una ruta protegida con una sesión simulada. */
function dibujarProtegida(sesion, rol) {
  return render(
    <AuthContext value={{ verificando: false, ...sesion }}>
      <MemoryRouter initialEntries={['/admin']}>
        <Routes>
          <Route path="/ingresar" element={<p>Página de ingreso</p>} />
          <Route path="/" element={<p>Inicio de la tienda</p>} />
          <Route
            path="/admin"
            element={
              <RutaProtegida rol={rol}>
                <p>Contenido privado</p>
              </RutaProtegida>
            }
          />
        </Routes>
      </MemoryRouter>
    </AuthContext>
  );
}

describe('RutaProtegida', () => {
  it('sin sesión lleva a /ingresar', () => {
    dibujarProtegida({ usuario: null }, 'admin');
    expect(screen.getByText('Página de ingreso')).toBeInTheDocument();
  });

  it('un cliente no entra al panel: vuelve al inicio', () => {
    dibujarProtegida({ usuario: { rol: 'cliente' } }, 'admin');
    expect(screen.getByText('Inicio de la tienda')).toBeInTheDocument();
  });

  it('la administradora ve el contenido', () => {
    dibujarProtegida({ usuario: { rol: 'admin' } }, 'admin');
    expect(screen.getByText('Contenido privado')).toBeInTheDocument();
  });
});

describe('CartSummary', () => {
  const dibujar = (items, subtotal) =>
    render(
      <CartContext value={{ items, subtotal }}>
        <MemoryRouter>
          <CartSummary />
        </MemoryRouter>
      </CartContext>
    );

  it('muestra cuánto falta para el envío gratis', () => {
    dibujar([{ id: 1 }], 37000);
    expect(screen.getByText('Te faltan $113.000 para el envío gratis.')).toBeInTheDocument();
    expect(screen.getByRole('link', { name: 'Continuar con la compra' })).toHaveAttribute(
      'href',
      '/checkout'
    );
  });

  it('con $150.000 el envío es gratis', () => {
    dibujar([{ id: 1 }], 150000);
    expect(screen.getByText('Gratis')).toBeInTheDocument();
  });

  it('con el carrito vacío el botón está deshabilitado', () => {
    dibujar([], 0);
    expect(screen.getByRole('button', { name: 'Continuar con la compra' })).toBeDisabled();
  });
});

describe('Ingresar + AuthProvider', () => {
  const dibujar = () =>
    render(
      <AuthProvider>
        <MemoryRouter initialEntries={['/ingresar']}>
          <Routes>
            <Route path="/ingresar" element={<Ingresar />} />
            <Route path="/admin" element={<p>Panel abierto</p>} />
          </Routes>
        </MemoryRouter>
      </AuthProvider>
    );

  it('valida antes de llamar a la API', async () => {
    const espia = vi.spyOn(authService, 'iniciarSesion');
    dibujar();
    await userEvent.click(screen.getByRole('button', { name: 'Ingresar' }));
    expect(screen.getByText('Escribe tu correo')).toBeInTheDocument();
    expect(espia).not.toHaveBeenCalled();
  });

  it('guarda el token y lleva a la administradora al panel', async () => {
    vi.spyOn(authService, 'iniciarSesion').mockResolvedValue({
      token: 'token.de.prueba',
      usuario: { id: 1, nombre: 'Sergio', rol: 'admin' },
    });
    dibujar();
    await userEvent.type(screen.getByLabelText('Correo'), 'admin@babysarai.com');
    await userEvent.type(screen.getByLabelText('Contraseña'), 'Admin2026');
    await userEvent.click(screen.getByRole('button', { name: 'Ingresar' }));
    await waitFor(() => expect(screen.getByText('Panel abierto')).toBeInTheDocument());
    expect(localStorage.getItem('babysarai-token')).toBe('token.de.prueba');
  });

  it('muestra el mensaje de la API si las credenciales son incorrectas', async () => {
    vi.spyOn(authService, 'iniciarSesion').mockRejectedValue(
      new Error('Correo o contraseña incorrectos')
    );
    dibujar();
    await userEvent.type(screen.getByLabelText('Correo'), 'admin@babysarai.com');
    await userEvent.type(screen.getByLabelText('Contraseña'), 'mala');
    await userEvent.click(screen.getByRole('button', { name: 'Ingresar' }));
    expect(await screen.findByRole('alert')).toHaveTextContent('Correo o contraseña incorrectos');
  });
});

describe('destinoDespuesDeIngresar', () => {
  it('la administradora va al panel aunque viniera de una página de cliente', () => {
    expect(destinoDespuesDeIngresar({ rol: 'admin' }, '/mis-pedidos')).toBe('/admin');
    expect(destinoDespuesDeIngresar({ rol: 'admin' }, '/admin/pedidos')).toBe('/admin/pedidos');
  });
  it('el cliente vuelve a donde iba, pero nunca al panel', () => {
    expect(destinoDespuesDeIngresar({ rol: 'cliente' }, '/checkout')).toBe('/checkout');
    expect(destinoDespuesDeIngresar({ rol: 'cliente' }, '/admin')).toBe('/mis-pedidos');
    expect(destinoDespuesDeIngresar({ rol: 'cliente' })).toBe('/mis-pedidos');
  });
});
