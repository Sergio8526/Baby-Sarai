# Baby Saraí

Tienda en línea de ropa y accesorios para bebé, nuevos y de segunda mano.
Este repositorio contiene el backend (API REST) y el panel de administración del catálogo.

## Tecnologías

- **Node.js** con **Express 5** (servidor y API REST)
- **MySQL** (base de datos `baby_sarai`)
- **mysql2** (conexión a la base de datos con consultas parametrizadas)
- **dotenv** (configuración por variables de entorno)
- HTML, CSS y JavaScript (panel de administración)

## Estructura del proyecto

```
Baby_Sarai_Sena/
├── babysarai-web/        Sitio web de la tienda (front-end estático)
├── database/             Scripts SQL, se ejecutan en orden numérico
├── public/               Panel de administración
│   ├── css/              Estilos compartidos
│   ├── js/               Lógica de cada página
│   ├── productos.html
│   └── categorias.html
├── src/
│   ├── config/           Conexión a MySQL
│   ├── controllers/      Reciben las peticiones y devuelven las respuestas
│   ├── middlewares/      Manejo centralizado de errores
│   ├── models/           Consultas SQL
│   ├── routes/           Definición de las rutas de la API
│   ├── utils/            Clases y funciones de apoyo
│   ├── validators/       Validación de los datos recibidos
│   └── app.js            Punto de entrada del servidor
├── .env.example          Plantilla de variables de entorno
└── package.json
```

## Instalación

1. Clonar el repositorio:
   ```
   git clone https://github.com/Sergio8526/Baby-Sarai.git
   cd Baby-Sarai
   ```
2. Instalar las dependencias:
   ```
   npm install
   ```
3. Crear la base de datos ejecutando en MySQL, en este orden:
   - `database/001_productos.sql`
   - `database/002_catalogo.sql`
4. Copiar `.env.example` como `.env` y completar la contraseña de MySQL.
5. Iniciar el servidor:
   ```
   node src/app.js
   ```
6. Abrir el panel en `http://localhost:3000/productos.html`

## API

| Método | Ruta | Descripción |
|---|---|---|
| GET | `/api/categorias` | Lista las categorías (`?soloActivas=true` para filtrar) |
| GET | `/api/categorias/:id` | Consulta una categoría |
| POST | `/api/categorias` | Crea una categoría |
| PUT | `/api/categorias/:id` | Actualiza una categoría |
| DELETE | `/api/categorias/:id` | Elimina una categoría sin productos asociados |
| GET | `/api/productos` | Lista los productos (`?categoriaId=1&soloActivos=true`) |
| GET | `/api/productos/:id` | Consulta un producto |
| POST | `/api/productos` | Crea un producto |
| PUT | `/api/productos/:id` | Actualiza un producto |
| DELETE | `/api/productos/:id` | Elimina un producto |

### Códigos de respuesta

| Código | Significado |
|---|---|
| 200 | Operación exitosa |
| 201 | Registro creado |
| 400 | Datos no válidos (la respuesta incluye la lista de errores en `detalles`) |
| 404 | Registro o ruta no encontrada |
| 409 | Conflicto: nombre repetido o categoría con productos asociados |
| 500 | Error interno del servidor |

## Estándares de codificación

- Variables y funciones en `camelCase`; tablas y columnas de la base de datos en `snake_case`.
- Funciones documentadas con JSDoc.
- Consultas SQL siempre parametrizadas (`?`) para prevenir inyección SQL.
- Credenciales fuera del código, en el archivo `.env` (excluido del repositorio).

## Control de versiones

Se sigue una estrategia basada en GitFlow: cada módulo se desarrolla en una rama `feature/...`
y se une a `master` cuando está terminado y probado. Los mensajes de commit siguen la
convención de Conventional Commits (`feat:`, `fix:`, `chore:`).