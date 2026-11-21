/**
 * Componente raíz. Une los proveedores globales (enrutador y carrito)
 * con el mapa de rutas.
 */
import { BrowserRouter } from 'react-router';
import CartProvider from './context/CartProvider.jsx';
import AppRouter from './routes/AppRouter.jsx';

export default function App() {
  return (
    <BrowserRouter>
      <CartProvider>
        <AppRouter />
      </CartProvider>
    </BrowserRouter>
  );
}
