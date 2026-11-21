/**
 * Plantilla de la tienda: encabezado, la página de la ruta (<Outlet />) y pie de página.
 */
import { Outlet } from 'react-router';
import Footer from '../components/layout/Footer.jsx';
import Header from '../components/layout/Header.jsx';

export default function MainLayout() {
  return (
    <>
      <Header />
      <Outlet />
      <Footer />
    </>
  );
}
