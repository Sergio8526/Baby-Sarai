/**
 * Conexión a MySQL.
 * Se usa un "pool": un grupo de conexiones abiertas que se reutilizan,
 * en lugar de abrir y cerrar una conexión en cada petición.
 * Los datos de acceso vienen de config/env.js, que los lee del archivo .env.
 */
const mysql = require('mysql2/promise');
const { db } = require('./env.js');

const pool = mysql.createPool({
  ...db,
  waitForConnections: true,
  connectionLimit: 10,
  // Los DECIMAL (precio, total) llegan como número y no como texto
  decimalNumbers: true,
});

module.exports = pool;
