/**
 * Servidor principal de Baby Saraí.
 * Configura Express, las rutas de la API y el manejo de errores.
 */
require('dotenv').config();
const express = require('express');
const path = require('path');

const productoRoutes = require('./routes/productoRoutes.js');
const categoriaRoutes = require('./routes/categoriaRoutes.js');
const { rutaNoEncontrada, manejarErrores } = require('./middlewares/manejarErrores.js');

const app = express();
const PUERTO = process.env.PORT || 3000;

// Lectura de datos en JSON y desde formularios HTML
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Archivos del panel de administración
app.use(express.static(path.join(__dirname, '..', 'public')));

// Rutas de la API
app.use('/api/productos', productoRoutes);
app.use('/api/categorias', categoriaRoutes);

// Rutas de la API que no existen → 404 en JSON
app.use('/api', rutaNoEncontrada);

// Manejo centralizado de errores (siempre debe ir de último)
app.use(manejarErrores);

app.listen(PUERTO, () => {
  console.log(`Servidor Baby Saraí corriendo en http://localhost:${PUERTO}`);
});