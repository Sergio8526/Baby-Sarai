# Historial de versiones

El proyecto usa [versionamiento semántico](https://semver.org/lang/es/): `MAYOR.MENOR.PARCHE`.
La API se versiona en la URL (`/api/v1`).

## [2.0.0] - 2026-11-24 · Evidencia GA7-220501096-AA5-EV03

### Agregado
- Script `database/004_usuarios_pedidos.sql`: tablas `usuarios`, `pedidos` y `detalle_pedidos`.
- Servicio de autenticación: registro de clientes, inicio de sesión con JWT y perfil.
- Roles `admin` y `cliente`, con los middlewares `autenticar` y `autorizar`.
- Servicio de pedidos: crear (con transacción y descuento de stock), listar, consultar,
  cancelar y cambiar estado.
- Servicio de administración de usuarios: listar, consultar, cambiar rol y activar o desactivar.
- Versionamiento de la API: todas las rutas bajo `/api/v1`.
- Documentación OpenAPI 3 en `docs/openapi.yaml`, visible en `/api/docs` (Swagger UI).
- Script `npm run crear-admin` para crear la cuenta de administración.
- 33 pruebas automáticas (`npm test`) y archivo `pruebas/api.http`.
- ESLint, Prettier y EditorConfig.

### Cambiado (incompatible)
- Crear, actualizar y eliminar productos y categorías ahora exige un token de administración.
- El servidor se inicia con `npm start` (`src/server.js`); `src/app.js` solo configura Express.

### Obsoleto
- Las rutas sin versión (`/api/productos`, `/api/categorias`) siguen funcionando, pero responden
  con el encabezado `Deprecation: true`. Se deben cambiar a `/api/v1/...`.

## [1.0.0] - Evidencias AA2 a AA4
- Módulo de catálogo: CRUD de productos y categorías, panel de administración.
