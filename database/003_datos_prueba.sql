-- =====================================================
-- Baby Saraí - Script 003: Datos de prueba
-- Productos de ejemplo para ejecutar las pruebas de la
-- evidencia GA7-220501096-AA3-EV02.
-- Ejecutar después de 001_productos.sql y 002_catalogo.sql.
-- =====================================================

USE baby_sarai;

INSERT INTO productos (nombre, descripcion, categoria_id, talla, estado, precio, stock) VALUES
  ('Body manga larga 0-3 meses', 'Body de algodón manga larga, color blanco',
    (SELECT id FROM categorias WHERE nombre = 'Recién nacido'), '0-3 meses', 'nuevo', 25000, 4),
  ('Body manga corta rayas', 'Body de algodón manga corta con rayas azules',
    (SELECT id FROM categorias WHERE nombre = 'Recién nacido'), '0-3 meses', 'usado', 15000, 2),
  ('Body básico rosado', 'Body manga corta 100% algodón',
    (SELECT id FROM categorias WHERE nombre = 'Bodies'), '6-9 meses', 'nuevo', 20000, 6),
  ('Pijama enteriza ositos', 'Pijama enteriza con cierre, estampado de ositos',
    (SELECT id FROM categorias WHERE nombre = 'Pijamas'), '3-6 meses', 'nuevo', 38000, 3),
  ('Gorro tejido', 'Gorro tejido a mano para recién nacido',
    (SELECT id FROM categorias WHERE nombre = 'Accesorios'), 'Única', 'nuevo', 12000, 10),
  ('Producto de prueba', 'Registro para la prueba de eliminación (HU-08)',
    (SELECT id FROM categorias WHERE nombre = 'Conjuntos'), '12 meses', 'usado', 10000, 1);

-- Comprobación: debe mostrar los 6 productos con su categoría
SELECT p.id, p.nombre, c.nombre AS categoria, p.talla, p.estado, p.precio, p.stock
FROM productos p
INNER JOIN categorias c ON c.id = p.categoria_id
ORDER BY p.id;
