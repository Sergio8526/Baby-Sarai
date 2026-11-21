# Baby Saraí – Front-end (React)

Módulo front-end de **Baby Saraí**, tienda en línea de ropa y accesorios para bebé (nuevos y de segunda mano).

**Evidencia:** GA7-220501096-AA4-EV03 – Componente front-end del proyecto formativo y proyectos de clase
**Aprendiz:** Sergio Andrés Herrera Castro · Ficha 3186588
**Programa:** Tecnología en Análisis y Desarrollo de Software – SENA

## 1. Qué incluye este módulo

| Parte                   | Páginas                                             | Qué hace                                                                                            |
| ----------------------- | --------------------------------------------------- | --------------------------------------------------------------------------------------------------- |
| Tienda                  | Inicio, Catálogo, Detalle de producto, Carrito, 404 | El cliente busca y filtra productos, ve el detalle, arma su carrito y envía el pedido por WhatsApp. |
| Panel de administración | Resumen, Productos, Categorías                      | La administradora consulta indicadores del inventario y hace el CRUD de productos y categorías.     |

**Diseño:** la tienda conserva el diseño aprobado de `babysarai-web`: el tendedero con prendas ilustradas, las etiquetas colgantes, las costuras punteadas y las tipografías Fraunces y Work Sans. El panel conserva el rediseño de `public/`: barra lateral oscura, tarjetas y mensajes con ícono. Lo que cambia es la tecnología: ahora los datos vienen de la API y no de una lista fija en JavaScript.

El front-end consume la API REST del proyecto (Node.js + Express 5 + MySQL), construida en las evidencias AA2 y AA3:

| Método              | Ruta                                    | Uso en el front-end                     |
| ------------------- | --------------------------------------- | --------------------------------------- |
| GET                 | `/api/productos` · `?soloActivos=true`  | Tabla del panel · catálogo de la tienda |
| GET                 | `/api/productos/:id`                    | Detalle de producto                     |
| POST / PUT / DELETE | `/api/productos[/:id]`                  | Crear, editar y eliminar productos      |
| GET                 | `/api/categorias` · `?soloActivas=true` | Tabla del panel · filtros de la tienda  |
| POST / PUT / DELETE | `/api/categorias[/:id]`                 | Crear, editar y eliminar categorías     |

## 2. Tecnologías

- **React 19** con componentes funcionales y hooks (`useState`, `useEffect`, `useReducer`, `useMemo`, `useCallback`, `use`, `useId`).
- **React Router 7** para la navegación entre páginas.
- **Vite** como herramienta de desarrollo y empaquetado.
- **CSS en tres capas:** `styles/tienda.css` (el sistema de diseño de la tienda, reutilizado), `styles/panel.css` (el del panel, con todas las reglas bajo `.panel`) y **CSS Modules** para los estilos nuevos que solo existen en React.
- **ESLint + Prettier + EditorConfig** para cumplir el estándar de codificación.
- **Git y GitHub** para el control de versiones.

## 3. Cómo ejecutarlo

Requisitos: Node.js 20 o superior y el back-end de Baby Saraí funcionando en `http://localhost:3000`.

```bash
# 1. Encender el back-end (en la raíz del proyecto)
node src/app.js

# 2. En otra terminal, entrar al front-end e instalar dependencias (solo la primera vez)
cd babysarai-frontend
npm install

# 3. Iniciar el front-end
npm run dev
```

Abrir `http://localhost:5173`. Vite reenvía las peticiones `/api` al puerto 3000 (ver `vite.config.js`), así que no hace falta configurar CORS.

| Comando           | Para qué sirve                                |
| ----------------- | --------------------------------------------- |
| `npm run dev`     | Servidor de desarrollo con recarga automática |
| `npm run lint`    | Revisa el código con ESLint                   |
| `npm run format`  | Da formato al código con Prettier             |
| `npm run build`   | Genera la versión de producción en `dist/`    |
| `npm run preview` | Sirve la versión de producción para probarla  |

## 4. Estructura de carpetas

```
babysarai-frontend/
├── index.html               Página base donde se monta React
├── vite.config.js           Configuración de Vite y proxy hacia la API
├── eslint.config.js         Reglas del estándar de codificación
├── .prettierrc.json         Formato del código
├── .editorconfig            Formato de archivos para cualquier editor
├── .env.example             Variable opcional VITE_API_URL
├── public/                  Archivos estáticos (favicon)
└── src/
    ├── main.jsx             Punto de entrada: monta React y carga los estilos
    ├── App.jsx              Componente raíz: enrutador + carrito
    ├── assets/fonts/        Fraunces y Work Sans (funcionan sin internet)
    ├── styles/              fuentes.css, tienda.css y panel.css
    ├── routes/              AppRouter: mapa de rutas
    ├── layouts/             MainLayout (tienda) y AdminLayout (panel)
    ├── pages/
    │   ├── tienda/          Home, Catalogo, DetalleProducto, Carrito
    │   ├── admin/           Dashboard, GestionProductos, GestionCategorias
    │   └── NotFound.jsx     404 con la media perdida
    ├── components/
    │   ├── layout/          Header, Footer, Sidebar
    │   ├── prendas/         Prenda (ilustración SVG) y dibujos.js
    │   ├── inicio/          Tendedero, MosaicoCategorias, BuscadorTallas
    │   ├── productos/       ProductCard, ProductList, FiltroProductos
    │   ├── carrito/         PasosCompra, CartItem, CartSummary
    │   ├── admin/           CampoPanel, FormularioProducto, FormularioCategoria, TablaProductos, TablaCategorias
    │   └── ui/              Loader, AvisoError, Mensaje, Etiqueta, ModalConfirmacion
    ├── context/             CartContext y CartProvider (estado global del carrito)
    ├── hooks/               useConsulta, useCart y useRevelar
    ├── services/            api.js, productoService.js, categoriaService.js
    └── utils/               constantes, formato, prendas y validaciones
```

## 5. Relación con los artefactos del ciclo de software

| Artefacto                                                   | Cómo se aplicó en el código                                                                                                                                                                                                                                                                                       |
| ----------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Historias de usuario del catálogo (AA3-EV02)                | Registrar, editar, eliminar y listar categorías y productos; filtrar el inventario por categoría; ocultar productos sin borrarlos (campo `activo`).                                                                                                                                                               |
| Diagrama de clases y modelo de datos                        | Los campos del formulario y las tablas son los de las entidades `Producto` (nombre, descripción, categoría, talla, estado, precio, stock, activo) y `Categoria` (nombre, descripción, activo).                                                                                                                    |
| Casos de uso                                                | Cliente: consultar catálogo, ver detalle, gestionar carrito, hacer pedido. Administrador: gestionar productos y categorías, consultar inventario.                                                                                                                                                                 |
| Prototipos en Figma, maquetación HTML (GA6) y rediseño 2026 | La tienda usa el sistema de diseño de `babysarai-web` (`tienda.css`): portada con tendedero, mosaico de categorías, tarjetas con etiqueta colgante, prenda que se mece en el detalle, carrito con pasos y tendedero vacío, y la 404 con la media. El panel usa el diseño de `public/css/admin.css` (`panel.css`). |
| Definición de componentes front-end (AA4-EV02)              | Se implementaron los componentes definidos allí: layouts, páginas, componentes reutilizables, CartContext, hooks propios y servicios de la API.                                                                                                                                                                   |
| Estándares de codificación (AA1-EV02)                       | camelCase para variables y funciones, PascalCase para componentes, comentarios JSDoc, ESLint y Prettier.                                                                                                                                                                                                          |
| Plan de versionamiento (AA1-EV01)                           | Rama `feature/frontend-react` y mensajes de commit con prefijos `feat:`, `fix:`, `docs:`, `style:`, `chore:`.                                                                                                                                                                                                     |

## 6. Estándares de codificación aplicados

- **Nombres:** componentes y sus archivos en PascalCase (`ProductCard.jsx`); variables, funciones y hooks en camelCase (`formatearPrecio`, `useCart`); constantes globales en MAYÚSCULAS (`STOCK_BAJO`). Los nombres están en español, igual que en el back-end.
- **Un componente por archivo.** Los estilos nuevos de React van en un `.module.css` al lado del componente; los del sistema de diseño están en `styles/`.
- **Comentarios:** cada archivo inicia con un bloque que explica su propósito y las funciones y props llevan JSDoc.
- **Separación de responsabilidades:** las páginas coordinan, los componentes muestran, los servicios hablan con la API y las utilidades no dependen de React.
- **Validación en dos capas:** el formulario valida antes de enviar y la API vuelve a validar.
- **Accesibilidad:** etiquetas unidas a cada campo, `aria-*` en menú, alertas y ventana modal, contraste de colores y navegación con teclado.
- `npm run lint` termina sin errores ni advertencias.

## 7. Repositorio

https://github.com/Sergio8526/Baby-Sarai (rama `feature/frontend-react`)
