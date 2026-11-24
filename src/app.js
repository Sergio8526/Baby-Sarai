/**
 * Aplicación Express de Baby Saraí.
 * Configura los middlewares, la documentación Swagger, las rutas de la API
 * y el manejo de errores. El servidor se inicia en server.js.
 */
const fs = require('node:fs');
const path = require('node:path');
const express = require('express');
const swaggerUi = require('swagger-ui-express');
const YAML = require('yaml');

const rutasV1 = require('./routes/v1.js');
const { rutaNoEncontrada, manejarErrores } = require('./middlewares/manejarErrores.js');
const { version } = require('../package.json');

// Especificación OpenAPI: la misma que se ve en /api/docs
const especificacion = YAML.parse(
  fs.readFileSync(path.join(__dirname, '..', 'docs', 'openapi.yaml'), 'utf8')
);

const app = express();

// No anunciar que el servidor usa Express (menos pistas para un atacante)
app.disable('x-powered-by');

// Lectura de datos en JSON y desde formularios HTML (con tamaño máximo)
app.use(express.json({ limit: '100kb' }));
app.use(express.urlencoded({ extended: true, limit: '100kb' }));

// Archivos del panel de administración
app.use(express.static(path.join(__dirname, '..', 'public')));

// Información general de la API
app.get('/api', (req, res) => {
  res.json({
    nombre: 'API Baby Saraí',
    version,
    versionesDisponibles: ['v1'],
    rutaBase: '/api/v1',
    documentacion: '/api/docs',
  });
});

// Documentación interactiva (Swagger UI) y especificación en JSON
app.get('/api/docs/openapi.json', (req, res) => res.json(especificacion));
app.use(
  '/api/docs',
  swaggerUi.serve,
  swaggerUi.setup(especificacion, {
    customSiteTitle: 'API Baby Saraí · Documentación',
    swaggerOptions: { persistAuthorization: true, validatorUrl: null },
  })
);

// Versión 1 de la API
app.use('/api/v1', rutasV1);

// Compatibilidad: las rutas sin versión (/api/productos, /api/categorias...) siguen
// funcionando para el panel y el front-end actuales, pero se marcan como obsoletas
// para que se cambien a /api/v1.
app.use(
  '/api',
  (req, res, next) => {
    res.set('Deprecation', 'true');
    res.set('Link', '</api/v1>; rel="successor-version"');
    next();
  },
  rutasV1
);

// Rutas de la API que no existen → 404 en JSON
app.use('/api', rutaNoEncontrada);

// Manejo centralizado de errores (siempre debe ir de último)
app.use(manejarErrores);

module.exports = app;
