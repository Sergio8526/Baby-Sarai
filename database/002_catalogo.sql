-- =====================================================
-- Baby Saraí - Script 002: Módulo de catálogo
-- Crea la tabla categorias y relaciona productos con ella,
-- según el modelo entidad-relación del proyecto (GA6).
-- =====================================================

USE baby_sarai;

-- 1. Tabla de categorías
CREATE TABLE categorias (
  id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  nombre VARCHAR(60) NOT NULL UNIQUE,
  descripcion VARCHAR(255),
  activo TINYINT(1) NOT NULL DEFAULT 1,
  fecha_creacion DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- 2. Categorías iniciales de la tienda
INSERT INTO categorias (nombre, descripcion) VALUES
  ('Recién nacido', 'Prendas para bebés de 0 a 3 meses'),
  ('Bodies', 'Bodies de manga corta y manga larga'),
  ('Pijamas', 'Pijamas y enterizos para dormir'),
  ('Conjuntos', 'Conjuntos de dos o más piezas'),
  ('Accesorios', 'Gorros, baberos, medias y mantas'),
  ('Calzado', 'Zapatos y patucos para bebé');

-- 3. Nuevas columnas en productos
ALTER TABLE productos
  ADD COLUMN categoria_id INT UNSIGNED NULL AFTER descripcion,
  ADD COLUMN talla VARCHAR(20) NULL AFTER categoria_id,
  ADD COLUMN estado ENUM('nuevo', 'usado') NOT NULL DEFAULT 'nuevo' AFTER talla,
  ADD COLUMN activo TINYINT(1) NOT NULL DEFAULT 1 AFTER stock,
  ADD COLUMN fecha_actualizacion DATETIME NULL ON UPDATE CURRENT_TIMESTAMP;

-- 4. Pasar los productos existentes de la columna de texto a la nueva categoría
SET SQL_SAFE_UPDATES = 0;
UPDATE productos
SET categoria_id = (SELECT id FROM categorias WHERE nombre = 'Recién nacido');
SET SQL_SAFE_UPDATES = 1;

-- 5. Relación con categorias, reglas de negocio y limpieza
ALTER TABLE productos
  MODIFY categoria_id INT UNSIGNED NOT NULL,
  ADD CONSTRAINT fk_productos_categorias
    FOREIGN KEY (categoria_id) REFERENCES categorias(id)
    ON UPDATE CASCADE ON DELETE RESTRICT,
  ADD CONSTRAINT chk_productos_precio CHECK (precio >= 0),
  ADD CONSTRAINT chk_productos_stock CHECK (stock >= 0),
  DROP COLUMN categoria;