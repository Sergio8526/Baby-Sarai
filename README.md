# Baby Saraí

Tienda en línea de ropa y accesorios para bebé, nuevos y de segunda mano.
Este repositorio contiene el backend (API REST), el panel de administración del catálogo
y el front-end en React (`babysarai-frontend`).

**Versión actual de la API:** `v1` · **Versión del proyecto:** 2.0.0 (ver [CHANGELOG.md](CHANGELOG.md))

## Tecnologías

- **Node.js** con **Express 5** (servidor y API REST)
- **MySQL** (base de datos `baby_sarai`) con **mysql2** (consultas parametrizadas y transacciones)
- **bcryptjs** (cifrado de contraseñas) y **jsonwebtoken** (tokens JWT)
- **OpenAPI 3** + **swagger-ui-express** (documentación interactiva en `/api/docs`)
- **dotenv** (configuración por variables de entorno)
- **node:test** (pruebas automáticas), **ESLint** y **Prettier** (calidad del código)

## Estructura del proyecto

```
Baby_Sarai_Sena/
├── babysarai-frontend/   Front-end en React (AA4-EV03)
├── babysarai-web/        Sitio web estático de la tienda
├── database/             Scripts SQL, se ejecutan en orden numérico (001 a 004)
├── docs/
│   └── openapi.yaml      Especificación de todos los servicios (Swagger)
├── public/               Panel de administración (HTML, CSS, JS)
├── pruebas/
│   ├── api.test.js       Pruebas automáticas (npm test)
│   └── api.http          Pruebas manuales con REST Client
├── scripts/
│   └── crearAdmin.js     Crea la cuenta de administración
├── src/
│   ├── config/           Variables de entorno y conexión a MySQL
│   ├── controllers/      Reciben las peticiones y devuelven las respuestas
│   ├── middlewares/      Autenticación, roles y manejo de errores
│   ├── models/           Consultas SQL
│   ├── routes/           Rutas de la API (v1.js reúne la versión 1)
│   ├── services/         Reglas de negocio con transacciones (pedidos)
│   ├── utils/            AppError y tokens JWT
│   ├── validators/       Validación de los datos recibidos
│   ├── app.js            Configuración de Express
│   └── server.js         Punto de entrada: inicia el servidor
├── .env.example          Plantilla de variables de entorno
├── CHANGELOG.md          Historial de versiones
└── package.json
```

## Instalación

1. Clonar el repositorio e instalar las dependencias:
   ```
   git clone https://github.com/Sergio8526/Baby-Sarai.git
   cd Baby-Sarai
   npm install
   ```
2. Crear la base de datos ejecutando en MySQL, en este orden:
   `001_productos.sql`, `002_catalogo.sql`, `003_datos_prueba.sql` y `004_usuarios_pedidos.sql`.
3. Copiar `.env.example` como `.env` y completar la contraseña de MySQL y `JWT_SECRETO`.
4. Crear la cuenta de administración:
   ```
   npm run crear-admin -- "Nombre Apellido" admin@babysarai.com "Admin2026"
   ```
5. Iniciar el servidor:
   ```
   npm start
   ```
6. Abrir la documentación en `http://localhost:3000/api/docs`

## Scripts

| Comando | Qué hace |
|---|---|
| `npm start` | Inicia el servidor |
| `npm run dev` | Inicia el servidor y lo reinicia al guardar cambios |
| `npm test` | Ejecuta las 33 pruebas automáticas (requiere MySQL encendido) |
| `npm run lint` | Revisa el código con ESLint |
| `npm run format` | Da formato al código con Prettier |
| `npm run crear-admin` | Crea o promueve la cuenta de administración |

## Servicios de la API v1

Ruta base: `/api/v1`. 🔓 público · 🔑 requiere token · 👑 solo administración.

| Método | Ruta | Acceso | Descripción |
|---|---|---|---|
| POST | `/auth/registro` | 🔓 | Crea una cuenta de cliente |
| POST | `/auth/login` | 🔓 | Inicia sesión y devuelve un token JWT |
| GET | `/auth/perfil` | 🔑 | Datos del usuario dueño del token |
| GET | `/categorias` | 🔓 | Lista las categorías (`?soloActivas=true`) |
| GET | `/categorias/:id` | 🔓 | Consulta una categoría |
| POST | `/categorias` | 👑 | Crea una categoría |
| PUT | `/categorias/:id` | 👑 | Actualiza una categoría |
| DELETE | `/categorias/:id` | 👑 | Elimina una categoría sin productos |
| GET | `/productos` | 🔓 | Lista los productos (`?categoriaId=1&soloActivos=true`) |
| GET | `/productos/:id` | 🔓 | Consulta un producto |
| POST | `/productos` | 👑 | Crea un producto |
| PUT | `/productos/:id` | 👑 | Actualiza un producto |
| DELETE | `/productos/:id` | 👑 | Elimina un producto sin pedidos |
| POST | `/pedidos` | 🔑 | Crea un pedido y descuenta el inventario |
| GET | `/pedidos` | 🔑 | Mis pedidos (admin: todos, `?estado=&usuarioId=`) |
| GET | `/pedidos/:id` | 🔑 | Detalle de un pedido propio (admin: cualquiera) |
| PATCH | `/pedidos/:id/cancelar` | 🔑 | Cancela un pedido pendiente; el stock vuelve |
| PATCH | `/pedidos/:id/estado` | 👑 | Cambia el estado del pedido |
| GET | `/usuarios` | 👑 | Lista los usuarios (`?rol=cliente`) |
| GET | `/usuarios/:id` | 👑 | Consulta un usuario |
| PATCH | `/usuarios/:id` | 👑 | Cambia el rol o activa/desactiva una cuenta |

Flujo de un pedido: `pendiente → pagado → enviado → entregado`; se puede cancelar desde
`pendiente` o `pagado`. El envío cuesta $10.000 y es gratis desde $150.000.

### Códigos de respuesta

| Código | Significado |
|---|---|
| 200 | Operación exitosa |
| 201 | Registro creado |
| 400 | Datos no válidos (la respuesta incluye la lista de errores en `detalles`) |
| 401 | Falta el token, es inválido o venció; o correo/contraseña incorrectos |
| 403 | El usuario no tiene permiso (rol) o su cuenta está desactivada |
| 404 | Registro o ruta no encontrada |
| 409 | Conflicto: dato repetido, sin stock, registro con dependencias o cambio de estado no permitido |
| 500 | Error interno del servidor |

### Versionamiento de la API

Las rutas llevan la versión en la URL (`/api/v1/...`). Si un servicio cambia de forma
incompatible se publicará `/api/v2` sin romper a quienes usan `v1`. Las rutas antiguas sin
versión (`/api/productos`) siguen respondiendo, con el encabezado `Deprecation: true`.

## Seguridad

- Contraseñas cifradas con bcrypt (nunca se guardan ni se devuelven en texto plano).
- Tokens JWT firmados con `JWT_SECRETO` y con vencimiento (`JWT_EXPIRA`).
- En cada petición se consulta el usuario: si se desactiva o cambia de rol, el token viejo deja de servir.
- El registro público solo crea clientes; la cuenta de administración se crea con un script.
- Consultas SQL parametrizadas (`?`) contra la inyección SQL.
- Los precios de un pedido se toman de la base de datos, no de lo que envía el cliente.
- Mismo mensaje y mismo tiempo de respuesta si el correo no existe o la contraseña está mal.

## Estándares de codificación

- Variables y funciones en `camelCase`; tablas y columnas en `snake_case`.
- Funciones documentadas con JSDoc; formato automático con Prettier y revisión con ESLint.
- Arquitectura por capas: rutas → middlewares → controladores → validadores → servicios → modelos.
- Credenciales fuera del código, en el archivo `.env` (excluido del repositorio).

## Control de versiones

Se sigue una estrategia basada en GitFlow: cada módulo se desarrolla en una rama `feature/...`
y se une a `master` cuando está terminado y probado. Los mensajes de commit siguen
Conventional Commits (`feat:`, `fix:`, `docs:`, `test:`, `chore:`).
