/**
 * Plantilla del panel: barra lateral y la sección elegida (<Outlet />).
 * La clase "panel" activa los estilos de styles/panel.css solo aquí adentro.
 */
import { Outlet } from 'react-router';
import Sidebar from '../components/layout/Sidebar.jsx';

export default function AdminLayout() {
  return (
    <div className="panel">
      <Sidebar />
      <main className="panel-contenido">
        <Outlet />
      </main>
    </div>
  );
}
