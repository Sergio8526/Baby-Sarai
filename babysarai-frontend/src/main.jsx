/**
 * Punto de entrada: monta la aplicación de React dentro de <div id="root"> (index.html).
 * StrictMode ayuda a detectar errores durante el desarrollo.
 */
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.jsx';
// Orden de los estilos: primero las fuentes, luego la tienda y al final el panel
import './styles/fuentes.css';
import './styles/tienda.css';
import './styles/panel.css';

// La clase "js" activa las animaciones de entrada de tienda.css
// (sin JavaScript, el contenido se muestra completo y quieto).
document.documentElement.classList.add('js');

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>
);
