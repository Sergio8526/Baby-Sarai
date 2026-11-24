/**
 * Preparación de las pruebas unitarias del front-end (Vitest + Testing Library).
 * - Agrega comparaciones como toBeInTheDocument().
 * - Limpia la pantalla simulada, el localStorage y los mocks después de cada prueba.
 */
import '@testing-library/jest-dom/vitest';
import { cleanup } from '@testing-library/react';
import { afterEach, vi } from 'vitest';

afterEach(() => {
  cleanup();
  localStorage.clear();
  vi.restoreAllMocks();
});
