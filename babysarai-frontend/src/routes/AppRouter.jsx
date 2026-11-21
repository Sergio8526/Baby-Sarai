/**
 * Mapa de rutas de la aplicación.
 * Cada ruta indica qué página se muestra y dentro de qué plantilla (layout).
 */
import { Route, Routes } from 'react-router';
import AdminLayout from '../layouts/AdminLayout.jsx';
import MainLayout from '../layouts/MainLayout.jsx';
import NotFound from '../pages/NotFound.jsx';
import Dashboard from '../pages/admin/Dashboard.jsx';
import GestionCategorias from '../pages/admin/GestionCategorias.jsx';
import GestionProductos from '../pages/admin/GestionProductos.jsx';
import Carrito from '../pages/tienda/Carrito.jsx';
import Catalogo from '../pages/tienda/Catalogo.jsx';
import DetalleProducto from '../pages/tienda/DetalleProducto.jsx';
import Home from '../pages/tienda/Home.jsx';

export default function AppRouter() {
  return (
    <Routes>
      {/* Tienda: todas estas páginas comparten Header y Footer */}
      <Route element={<MainLayout />}>
        <Route index element={<Home />} />
        <Route path="catalogo" element={<Catalogo />} />
        <Route path="producto/:id" element={<DetalleProducto />} />
        <Route path="carrito" element={<Carrito />} />
        <Route path="*" element={<NotFound />} />
      </Route>

      {/* Panel de administración: comparten el menú lateral (Sidebar).
          Cuando exista el módulo de usuarios, estas rutas se protegerán con login. */}
      <Route path="admin" element={<AdminLayout />}>
        <Route index element={<Dashboard />} />
        <Route path="productos" element={<GestionProductos />} />
        <Route path="categorias" element={<GestionCategorias />} />
      </Route>
    </Routes>
  );
}
