/**
 * Mapa de rutas (mapa de navegación) de la aplicación.
 * Cada ruta indica qué página se muestra, dentro de qué plantilla (layout)
 * y si exige sesión (RutaProtegida).
 */
import { Route, Routes } from 'react-router';
import RutaProtegida from '../components/auth/RutaProtegida.jsx';
import AdminLayout from '../layouts/AdminLayout.jsx';
import MainLayout from '../layouts/MainLayout.jsx';
import NotFound from '../pages/NotFound.jsx';
import Dashboard from '../pages/admin/Dashboard.jsx';
import GestionCategorias from '../pages/admin/GestionCategorias.jsx';
import GestionPedidos from '../pages/admin/GestionPedidos.jsx';
import GestionProductos from '../pages/admin/GestionProductos.jsx';
import GestionUsuarios from '../pages/admin/GestionUsuarios.jsx';
import DetallePedido from '../pages/cuenta/DetallePedido.jsx';
import Ingresar from '../pages/cuenta/Ingresar.jsx';
import MisPedidos from '../pages/cuenta/MisPedidos.jsx';
import Registro from '../pages/cuenta/Registro.jsx';
import Carrito from '../pages/tienda/Carrito.jsx';
import Catalogo from '../pages/tienda/Catalogo.jsx';
import Checkout from '../pages/tienda/Checkout.jsx';
import DetalleProducto from '../pages/tienda/DetalleProducto.jsx';
import Home from '../pages/tienda/Home.jsx';

export default function AppRouter() {
  return (
    <Routes>
      {/* Tienda: todas estas páginas comparten Header y Footer */}
      <Route element={<MainLayout />}>
        {/* Públicas */}
        <Route index element={<Home />} />
        <Route path="catalogo" element={<Catalogo />} />
        <Route path="producto/:id" element={<DetalleProducto />} />
        <Route path="carrito" element={<Carrito />} />
        <Route path="ingresar" element={<Ingresar />} />
        <Route path="registro" element={<Registro />} />

        {/* Con sesión (cliente o administradora) */}
        <Route element={<RutaProtegida />}>
          <Route path="checkout" element={<Checkout />} />
          <Route path="mis-pedidos" element={<MisPedidos />} />
          <Route path="mis-pedidos/:id" element={<DetallePedido />} />
        </Route>

        <Route path="*" element={<NotFound />} />
      </Route>

      {/* Panel de administración: solo rol admin. Comparten el menú lateral (Sidebar). */}
      <Route
        path="admin"
        element={
          <RutaProtegida rol="admin">
            <AdminLayout />
          </RutaProtegida>
        }
      >
        <Route index element={<Dashboard />} />
        <Route path="productos" element={<GestionProductos />} />
        <Route path="categorias" element={<GestionCategorias />} />
        <Route path="pedidos" element={<GestionPedidos />} />
        <Route path="usuarios" element={<GestionUsuarios />} />
      </Route>
    </Routes>
  );
}
