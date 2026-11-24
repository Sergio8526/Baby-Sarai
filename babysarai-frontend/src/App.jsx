/**
 * Componente raíz. Une los proveedores globales (enrutador, sesión y carrito)
 * con el mapa de rutas.
 */
import { BrowserRouter } from 'react-router';
import AuthProvider from './context/AuthProvider.jsx';
import CartProvider from './context/CartProvider.jsx';
import AppRouter from './routes/AppRouter.jsx';

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <CartProvider>
          <AppRouter />
        </CartProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}
