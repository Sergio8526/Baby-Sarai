# Baby Saraí – Front-end (React)

Interfaz web de **Baby Saraí**, tienda en línea de ropa y accesorios para bebé (nuevos y de segunda mano), integrada con la API REST v1 del proyecto.

**Evidencias:** GA7-220501096-AA4-EV03 (componente front-end) · GA8-220501096-AA1-EV01 (integración de módulos)
**Aprendiz:** Sergio Andrés Herrera Castro · Ficha 3186588
**Programa:** Tecnología en Análisis y Desarrollo de Software – SENA

## 1. Módulos

| Módulo | Páginas | Acceso |
| --- | --- | --- |
| Catálogo | Inicio, Catálogo, Detalle de producto | Público |
| Carrito | Carrito | Público |
| Cuenta | Ingresar, Crear cuenta | Público |
| Compra | Datos de envío (checkout), Confirmación | Cliente con sesión |
| Mis pedidos | Lista y detalle; cancelar un pedido pendiente | Cliente con sesión |
| Panel | Resumen, Productos, Categorías, Pedidos, Usuarios | Solo administradora |

**Diseño:** conserva el diseño aprobado de `babysarai-web` (tendedero con prendas ilustradas, costuras punteadas, Fraunces y Work Sans) y el del panel de `public/`.

## 2. Servicios de la API que consume

Todas las peticiones salen de `src/services/` hacia `/api/v1`. El token de sesión se envía en el encabezado `Authorization: Bearer <token>`.

| Servicio del front-end | Rutas de la API |
| --- | --- |
| `authService.js` | `POST /auth/registro` · `POST /auth/login` · `GET /auth/perfil` |
| `productoService.js` | `GET/POST /productos` · `GET/PUT/DELETE /productos/:id` |
| `categoriaService.js` | `GET/POST /categorias` · `PUT/DELETE /categorias/:id` |
| `pedidoService.js` | `POST/GET /pedidos` · `GET /pedidos/:id` · `PATCH /pedidos/:id/cancelar` · `PATCH /pedidos/:id/estado` |
| `usuarioService.js` | `GET /usuarios` · `PATCH /usuarios/:id` |

## 3. Tecnologías

| Capa | Herramienta |
| --- | --- |
| Interfaz | React 19 (componentes funcionales y hooks) |
| Navegación | React Router 7 (rutas públicas y protegidas) |
| Estado global | Context API: `AuthProvider` (sesión) y `CartProvider` (carrito con `useReducer`) |
| Estilos | CSS del sistema de diseño (`tienda.css`, `panel.css`, `cuenta.css`) y CSS Modules |
| Empaquetado | Vite 8 |
| Pruebas unitarias | Vitest + Testing Library + jsdom |
| Calidad | ESLint, Prettier, EditorConfig |

## 4. Cómo ejecutarlo

Requisitos: Node.js 20 o superior y la API de Baby Saraí encendida en `http://localhost:3000`.

**Desarrollo** (con recarga automática):

```bash
cd babysarai-frontend
npm install        # solo la primera vez
npm run dev        # abre http://localhost:5173
```

Vite reenvía `/api` al puerto 3000 (ver `vite.config.js`), así que no hace falta configurar CORS.

**Producción** (archivos compilados): `npm run build` genera la carpeta `dist/`. La API la sirve en `http://localhost:3000`, junto con los servicios web.

| Comando | Para qué sirve |
| --- | --- |
| `npm run dev` | Servidor de desarrollo |
| `npm run build` | Compila la versión de producción en `dist/` |
| `npm test` | Ejecuta las pruebas unitarias (31) |
| `npm run lint` | Revisa el código con ESLint |
| `npm run format` | Da formato con Prettier |

## 5. Estructura de carpetas

```
babysarai-frontend/
├── pruebas/                 Pruebas unitarias (Vitest)
├── public/                  Archivos que se copian tal cual (favicon)
└── src/
    ├── components/          Componentes reutilizables por módulo
    │   ├── admin/           Formularios y tablas del panel
    │   ├── auth/            RutaProtegida
    │   ├── carrito/         Ítem, resumen y pasos de la compra
    │   ├── formularios/     CampoTienda
    │   ├── inicio/          Portada (tendedero, buscador de tallas...)
    │   ├── layout/          Header, Footer, Sidebar
    │   ├── pedidos/         EstadoPedido, LineasPedido
    │   ├── prendas/         Ilustraciones SVG de prendas
    │   ├── productos/       Tarjeta, lista y filtros de productos
    │   └── ui/              Loader, Mensaje, Etiqueta, ModalConfirmacion...
    ├── context/             AuthProvider, CartProvider y el reductor del carrito
    ├── hooks/               useAuth, useCart, useConsulta, useRevelar
    ├── layouts/             MainLayout (tienda) y AdminLayout (panel)
    ├── pages/               Páginas: tienda/, cuenta/, admin/
    ├── routes/              AppRouter: mapa de navegación
    ├── services/            Comunicación con la API
    ├── styles/              Hojas de estilo globales
    └── utils/               Constantes, formato, validaciones y reglas de pedidos
```

## 6. Seguridad en el front-end

- `RutaProtegida` envía a `/ingresar` a quien no tiene sesión y al inicio a un cliente que intenta abrir el panel.
- Si la API responde 401 a una petición con token (sesión vencida o cuenta desactivada), `api.js` borra el token y la aplicación pide iniciar sesión de nuevo.
- Las validaciones del front-end solo mejoran la experiencia: la API vuelve a validar todo y revisa el token y el rol en cada petición.

## 7. Repositorio

https://github.com/Sergio8526/Baby-Sarai
