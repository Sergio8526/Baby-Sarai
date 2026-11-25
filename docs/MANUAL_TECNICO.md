# Baby Saraí · Manual técnico

Versión del sistema 2.1.1 · API REST v1 · Autor: Sergio Andrés Herrera Castro · Noviembre de 2026

## 1. Propósito del manual

Este manual está dirigido a quien instale, opere o mantenga el sistema Baby Saraí: un desarrollador, un técnico de soporte o el mismo administrador de la tienda. Explica cómo está construido el sistema, cómo se instala desde cero, cómo se configura y qué hacer cuando algo falla.

| Público                         | Secciones recomendadas |
| ------------------------------- | ---------------------- |
| Quien instala por primera vez   | 3, 4 y 5               |
| Quien opera el sistema a diario | 6 y 9                  |
| Quien modifica el código        | 2, 7 y 8               |

## 2. Descripción técnica del sistema

Baby Saraí es una aplicación web de una sola página (SPA) con una API REST. El navegador descarga la interfaz en React una sola vez y después solo intercambia datos en JSON con el servidor.

| Componente              | Tecnología                       | Responsabilidad                                              |
| ----------------------- | -------------------------------- | ------------------------------------------------------------ |
| Front-end               | React 19, React Router 7, Vite 8 | Tienda, cuenta del cliente, compra y panel de administración |
| API                     | Node.js 20+, Express 5           | Servicios web `/api/v1`, seguridad, reglas de negocio        |
| Seguridad               | bcryptjs, jsonwebtoken           | Contraseñas con hash, sesiones con token JWT y roles         |
| Datos                   | MySQL 8.0, mysql2                | Persistencia, transacciones e integridad referencial         |
| Documentación de la API | OpenAPI 3, Swagger UI            | Página interactiva `/api/docs`                               |

## 3. Requisitos

**Hardware mínimo (equipo servidor):** procesador de 2 núcleos, 4 GB de RAM, 1 GB libre en disco.

**Software:**

| Software              | Versión                         | Uso                                          | Descarga                           |
| --------------------- | ------------------------------- | -------------------------------------------- | ---------------------------------- |
| Node.js (incluye npm) | 20 o superior                   | Ejecutar el servidor y compilar el front-end | https://nodejs.org                 |
| MySQL Server          | 8.0                             | Base de datos                                | https://dev.mysql.com/downloads/   |
| MySQL Workbench       | 8.0                             | Ejecutar los scripts SQL                     | Incluido en el instalador de MySQL |
| Git                   | 2.40 o superior                 | Descargar el código                          | https://git-scm.com                |
| Navegador moderno     | Chrome, Edge o Firefox actuales | Usar la aplicación                           | —                                  |
| Postman (opcional)    | Actual                          | Probar la API                                | https://www.postman.com            |

## 4. Instalación paso a paso

### 4.1 Obtener el código

```
git clone https://github.com/Sergio8526/Baby-Sarai.git
cd Baby-Sarai
git switch feature/integracion-modulos
```

También se puede usar la carpeta `Baby_Sarai_Ejecutable` del paquete de entrega, que ya trae el front-end compilado.

### 4.2 Crear la base de datos

1. Verificar que el servicio de MySQL esté encendido (en Windows: _Servicios_ → `MySQL80` → _En ejecución_).
2. Abrir MySQL Workbench y conectarse como `root`.
3. Abrir y ejecutar **con el rayo de “ejecutar todo”** (Ctrl + Shift + Enter), en este orden:
   1. `database/001_productos.sql`
   2. `database/002_catalogo.sql`
   3. `database/003_datos_prueba.sql`
   4. `database/004_usuarios_pedidos.sql`
4. Comprobar con `SHOW TABLES FROM baby_sarai;` que existen 5 tablas: `categorias`, `detalle_pedidos`, `pedidos`, `productos` y `usuarios`.

### 4.3 Configurar el servidor

1. Copiar `.env.example` como `.env` en la raíz del proyecto.
2. Completar `DB_PASSWORD` con la clave de MySQL.
3. Generar el secreto de los tokens y pegarlo en `JWT_SECRETO`:
   ```
   node -e "console.log(require('crypto').randomBytes(48).toString('hex'))"
   ```

### 4.4 Instalar dependencias y compilar

```
npm install
npm run install:front
npm run build:front
```

### 4.5 Crear la cuenta de administración

```
npm run crear-admin -- "Nombre Apellido" admin@babysarai.com "Clave2026"
```

La contraseña debe tener entre 8 y 72 caracteres, con al menos una letra y un número.

### 4.6 Iniciar y verificar

```
npm start
```

| Verificación                      | Resultado esperado                                       |
| --------------------------------- | -------------------------------------------------------- |
| Mensaje en la terminal            | `Servidor Baby Saraí corriendo en http://localhost:3000` |
| Abrir `http://localhost:3000`     | Página de inicio de la tienda                            |
| Abrir `http://localhost:3000/api` | JSON con `"version": "2.1.1"`                            |
| Ingresar con la cuenta admin      | Se abre el panel en `/admin`                             |

**En Windows** se pueden reemplazar los pasos 4.3 a 4.6 por un doble clic en `iniciar.bat`: crea el `.env` la primera vez, instala las dependencias, compila si hace falta, inicia el servidor y abre el navegador.

## 5. Configuración

### 5.1 Variables de entorno

| Variable             | Obligatoria | Valor por defecto | Descripción                                                     |
| -------------------- | ----------- | ----------------- | --------------------------------------------------------------- |
| `DB_HOST`            | Sí          | —                 | Servidor de MySQL                                               |
| `DB_PORT`            | No          | 3306              | Puerto de MySQL                                                 |
| `DB_USER`            | Sí          | —                 | Usuario de MySQL                                                |
| `DB_PASSWORD`        | No          | vacío             | Clave de MySQL                                                  |
| `DB_NAME`            | Sí          | —                 | Base de datos (`baby_sarai`)                                    |
| `PORT`               | No          | 3000              | Puerto del servidor                                             |
| `JWT_SECRETO`        | Sí          | —                 | Secreto para firmar los tokens; mínimo 32 caracteres aleatorios |
| `JWT_EXPIRA`         | No          | `2h`              | Duración de la sesión (`15m`, `2h`, `7d`)                       |
| `BCRYPT_RONDAS`      | No          | 10                | Costo del hash de contraseñas                                   |
| `ENVIO_COSTO`        | No          | 10000             | Costo del envío en pesos                                        |
| `ENVIO_GRATIS_DESDE` | No          | 150000            | Subtotal desde el que el envío es gratis                        |

Si se cambian `ENVIO_COSTO` o `ENVIO_GRATIS_DESDE`, se debe actualizar también la constante `ENVIO` en `babysarai-frontend/src/utils/constantes.js` y volver a compilar, para que la tienda muestre el mismo estimado que calcula la API.

### 5.2 Front-end

| Archivo                                    | Para qué                                                                |
| ------------------------------------------ | ----------------------------------------------------------------------- |
| `babysarai-frontend/.env.local` (opcional) | `VITE_API_URL` si la API no está en el mismo servidor                   |
| `babysarai-frontend/vite.config.js`        | Proxy de desarrollo `/api` → `localhost:3000` y configuración de Vitest |

## 6. Operación

| Tarea                                | Cómo                                                                                                                                                                                |
| ------------------------------------ | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Iniciar el sistema                   | `npm start` o `iniciar.bat`                                                                                                                                                         |
| Detener el sistema                   | Ctrl + C en la terminal, o cerrar la ventana de `iniciar.bat`                                                                                                                       |
| Iniciar en modo desarrollo           | `npm run dev` (API) y `npm run dev` dentro de `babysarai-frontend` (interfaz en `localhost:5173`)                                                                                   |
| Crear otra administradora            | `npm run crear-admin -- ...` o, desde el panel, **Usuarios → Hacer admin**                                                                                                          |
| Bloquear a un usuario                | Panel → **Usuarios → Desactivar** (su sesión deja de funcionar de inmediato)                                                                                                        |
| Restablecer una contraseña olvidada  | Generar un hash nuevo con `node -e "console.log(require('bcryptjs').hashSync('NuevaClave2026', 10))"` y guardarlo con `UPDATE usuarios SET contrasena_hash = '...' WHERE id = ...;` |
| Ocultar un producto vendido          | Panel → **Productos → Editar** → desmarcar _Visible en la tienda_ (no se puede eliminar si tiene pedidos)                                                                           |
| Consultar la documentación de la API | `http://localhost:3000/api/docs`                                                                                                                                                    |

### 6.1 Flujo de estados de un pedido

| Estado actual        | Puede pasar a       | Quién                                           |
| -------------------- | ------------------- | ----------------------------------------------- |
| pendiente            | pagado, cancelado   | Administradora (el cliente solo puede cancelar) |
| pagado               | enviado, cancelado  | Administradora                                  |
| enviado              | entregado           | Administradora                                  |
| entregado, cancelado | — (estados finales) | —                                               |

Al cancelar, las unidades vuelven al inventario automáticamente.

## 7. Estructura del código

| Carpeta                       | Contenido                                                                          |
| ----------------------------- | ---------------------------------------------------------------------------------- |
| `src/config/`                 | `env.js` (lee y valida el `.env`) y `db.js` (pool de MySQL)                        |
| `src/routes/`                 | `v1.js` reúne las rutas de cada módulo bajo `/api/v1`                              |
| `src/middlewares/`            | `autenticacion.js` (token y roles) y `manejarErrores.js`                           |
| `src/controllers/`            | Un controlador por módulo                                                          |
| `src/validators/`             | Validación de los datos de entrada                                                 |
| `src/services/`               | `pedidoService.js`: reglas y transacciones de los pedidos                          |
| `src/models/`                 | Consultas SQL por tabla                                                            |
| `src/utils/`                  | `AppError` y manejo de tokens                                                      |
| `scripts/`                    | `crearAdmin.js`                                                                    |
| `database/`                   | Scripts SQL numerados                                                              |
| `docs/openapi.yaml`           | Especificación de los servicios web                                                |
| `pruebas/`                    | Unitarias, integración, `api.http` y colección de Postman                          |
| `babysarai-frontend/src/`     | `pages`, `components`, `context`, `hooks`, `services`, `routes`, `utils`, `styles` |
| `babysarai-frontend/pruebas/` | Pruebas unitarias del front-end                                                    |

**Para agregar un servicio web nuevo:** crear (o ampliar) el modelo en `models/`, el validador en `validators/`, el controlador en `controllers/` y la ruta en `routes/`; registrarla en `routes/v1.js`; documentarla en `docs/openapi.yaml`; agregar su prueba en `pruebas/`.

**Para agregar una página nueva:** crear el componente en `pages/`, registrar la ruta en `routes/AppRouter.jsx` (dentro de `RutaProtegida` si exige sesión) y, si usa la API, su función en `services/`.

## 8. Mantenimiento

### 8.1 Pruebas antes de cada cambio

| Comando                                  | Qué verifica                                | Necesita MySQL                |
| ---------------------------------------- | ------------------------------------------- | ----------------------------- |
| `npm run lint`                           | Estándar de código del back-end             | No                            |
| `npm run test:unit`                      | 47 pruebas unitarias del back-end           | No                            |
| `npm run test:integracion`               | 33 pruebas de la API con la base de datos   | Sí                            |
| `npm test` (en `babysarai-frontend`)     | 33 pruebas unitarias del front-end          | No                            |
| `npm run lint` (en `babysarai-frontend`) | Estándar de código del front-end            | No                            |
| Postman: _Run collection_                | 266 pruebas funcionales de los 21 servicios | Sí, con el servidor encendido |

### 8.2 Respaldo y restauración de la base de datos

```
mysqldump -u root -p baby_sarai > respaldo_baby_sarai_AAAA-MM-DD.sql
mysql -u root -p baby_sarai < respaldo_baby_sarai_AAAA-MM-DD.sql
```

Se recomienda un respaldo diario y antes de cualquier cambio en la estructura de las tablas.

### 8.3 Actualizar a una versión nueva

1. Hacer un respaldo de la base de datos.
2. `git pull` en la rama correspondiente y revisar `CHANGELOG.md`.
3. Ejecutar los scripts SQL nuevos (si los hay), en orden numérico.
4. `npm install`, `npm run install:front` y `npm run build:front`.
5. Ejecutar las pruebas (8.1) y reiniciar el servidor.

### 8.4 Convenciones del proyecto

- Ramas `feature/<nombre>` y commits con Conventional Commits.
- Versionamiento semántico: un cambio incompatible sube la versión mayor y, si es de la API, se publica como `/api/v2`.
- `camelCase` en el código, `PascalCase` en los componentes, `snake_case` en la base de datos.
- Nunca subir el archivo `.env` al repositorio.

## 9. Solución de problemas

| Síntoma                                                                                  | Causa probable                                                        | Solución                                                                            |
| ---------------------------------------------------------------------------------------- | --------------------------------------------------------------------- | ----------------------------------------------------------------------------------- |
| `Faltan variables en el archivo .env: ...` al iniciar                                    | `.env` incompleto o inexistente                                       | Copiar `.env.example` como `.env` y completar las variables indicadas               |
| `No se pudo iniciar el servidor en el puerto 3000`                                       | Otro programa o una terminal anterior usa el puerto                   | Cerrar la otra terminal o cambiar `PORT` en `.env`                                  |
| `ECONNREFUSED 127.0.0.1:3306` o `ER_ACCESS_DENIED_ERROR`                                 | MySQL apagado o clave incorrecta                                      | Encender el servicio `MySQL80` y revisar `DB_USER` / `DB_PASSWORD`                  |
| `Table 'baby_sarai.usuarios' doesn't exist`                                              | Falta ejecutar el script 004 o se ejecutó solo la primera instrucción | Ejecutar el script completo con Ctrl + Shift + Enter                                |
| La tienda muestra “No se pudo conectar con el servidor”                                  | La API no está encendida                                              | Iniciar con `npm start`                                                             |
| Postman: `ECONNREFUSED 127.0.0.1:3000`                                                   | El servidor se detuvo                                                 | Volver a ejecutar `npm start` y dejar esa terminal abierta                          |
| Al guardar en el panel aparece “Debes iniciar sesión” o vuelve al login                  | El token venció (2 horas)                                             | Iniciar sesión de nuevo                                                             |
| `Correo o contraseña incorrectos` con la cuenta admin                                    | Contraseña olvidada o cuenta no creada                                | Ver “Restablecer una contraseña olvidada” en la sección 6, o ejecutar `crear-admin` |
| `http://localhost:3000` muestra un error 404 en JSON solo en `/api` y la tienda no carga | No se ha compilado el front-end                                       | `npm run install:front` y `npm run build:front`                                     |
| `No se puede eliminar el producto porque ya tiene pedidos`                               | Regla de integridad                                                   | Ocultarlo (desmarcar _Visible en la tienda_)                                        |

## 10. Información de contacto y soporte

| Dato                    | Valor                                    |
| ----------------------- | ---------------------------------------- |
| Responsable técnico     | Sergio Andrés Herrera Castro             |
| Repositorio             | https://github.com/Sergio8526/Baby-Sarai |
| Reporte de errores      | Pestaña _Issues_ del repositorio         |
| Documentación de la API | `http://localhost:3000/api/docs`         |
