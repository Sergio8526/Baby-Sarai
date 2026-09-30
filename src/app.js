const express = require('express');
const path = require('path');
const productoRoutes = require('./routes/productoRoutes.js');

const app = express();
const PUERTO = 3000;

// Permite leer datos enviados en formato JSON y desde formularios HTML
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Sirve los archivos de la carpeta public (formularios HTML)
app.use(express.static(path.join(__dirname, '..', 'public')));

// Rutas del módulo de productos
app.use('/api/productos', productoRoutes);

app.listen(PUERTO, () => {
  console.log(`Servidor Baby Saraí corriendo en http://localhost:${PUERTO}`);
});