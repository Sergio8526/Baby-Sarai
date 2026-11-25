/**
 * Contexto del carrito de compras.
 * Se crea en un archivo aparte del proveedor para que Vite pueda
 * recargar los componentes sin perder el estado (Fast Refresh).
 */
import { createContext } from 'react';

export const CartContext = createContext(null);
