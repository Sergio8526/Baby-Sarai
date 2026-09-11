# Baby Saraí — Diseño front-end
Evidencia GA6-220501096-AA4-EV03 — Diseño front-end que cumpla con los requerimientos del proyecto

Construido sobre la interfaz de la evidencia GA6-220501096-AA3-EV03, ampliada con
nuevas pantallas y una función de favoritos, aplicando los mismos criterios de
usabilidad y diseño definidos en las evidencias anteriores.

## Cómo abrir
No requiere instalación ni servidor. Abre `index.html` directamente en cualquier
navegador (doble clic, o clic derecho → Abrir con → tu navegador).

## Páginas incluidas (11 en total)

**Flujo de compra**
1. `index.html` — Home
2. `categoria.html` — Listado de productos con filtros por talla/estado y buscador
3. `producto.html` — Detalle de producto, selección de talla y cantidad
4. `carrito.html` — Carrito con productos agregados y resumen del pedido
5. `checkout.html` — Datos de envío, método de pago y confirmación

**Nuevas en esta evidencia**
6. `favoritos.html` — Lista de guardados ("me gusta") persistida en localStorage
7. `guia-tallas.html` — Tabla de tallas por edad/peso/estatura, con consejos
8. `envios-devoluciones.html` — Preguntas frecuentes con acordeón nativo (`<details>`)
9. `nosotros.html` — Historia de la marca y valores
10. `contacto.html` — Formulario de contacto con validación e info de la tienda
11. `404.html` — Página de error personalizada

## Sistema de diseño (definido en `css/styles.css`)

**Color**
- `--color-bg` `#FBF6F1` — fondo general (crema cálido)
- `--color-rose` `#C4667A` / `--color-rose-dark` `#A84F62` — color de marca, botones y enlaces activos
- `--color-blush` `#F1CFD6`, `--color-sky` `#C9DCE3`, `--color-peach` `#F3D6C0` — colores de categoría
- `--color-sage` `#8CA187` — estados positivos (etiqueta "seminuevo", confirmaciones)
- `--color-ink` `#2B211F` / `--color-ink-soft` `#6B5D59` — texto principal y secundario

**Tipografía**
- Fraunces (serif) para títulos y logo.
- Work Sans (sans-serif) para texto de interfaz y cuerpo.

**Componentes reutilizables**
- Header con navegación, buscador, favoritos y carrito (sticky, con menú hamburguesa en móvil).
- Botones, tarjetas de producto y de categoría, botón de favorito (corazón) superpuesto en cada tarjeta.
- Panel de filtros, selector de talla, control de cantidad.
- Formularios con validación (checkout y contacto) y pantalla de confirmación.
- Acordeón de preguntas frecuentes con `<details>`/`<summary>` (sin JavaScript).
- Tabla de tallas semántica (`<table>`).
- Footer de 5 columnas, con enlaces reales a todas las páginas nuevas.

## Funcionalidad implementada (JavaScript, `js/main.js`)
- Carrito persistido en `localStorage`, sincronizado entre páginas.
- **Favoritos**: botón de corazón en tarjetas de producto y en el detalle; persistido en
  `localStorage` de forma independiente al carrito; página dedicada con estado vacío.
- Filtros de categoría por talla y estado, más buscador por nombre (sin recargar la página).
- Selección de talla y cantidad en el detalle de producto.
- Formulario de checkout y formulario de contacto, ambos con validación de campos
  obligatorios y formato de correo electrónico.
- Menú de navegación responsive.

## Usabilidad aplicada
- Enlaces del pie de página que antes eran decorativos ("Guía de tallas", "Envíos y
  devoluciones") ahora llevan a contenido real.
- Página 404 con mensaje amable y salida clara al inicio, en lugar de un error genérico.
- Favoritos como paso intermedio antes de comprar, reduciendo la fricción de decisión.
- Acordeón en preguntas frecuentes para no saturar la página con texto simultáneo.
- Formularios con mensajes de error específicos por campo, no un error genérico.

## Responsive
El diseño se adapta a tres puntos de quiebre: escritorio (>860px), tablet (≤860px)
y móvil (≤560px).

## Pruebas
El proyecto fue validado con un arnés de pruebas automatizado (jsdom) que confirma,
entre otros: filtrado correcto por categoría, funcionamiento del buscador, agregar/quitar
favoritos, persistencia en localStorage, y validación de los formularios de checkout y
contacto. Los archivos de prueba no se incluyen en esta entrega.
