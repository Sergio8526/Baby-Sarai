-- =====================================================
-- Baby Saraí - Script 004: Usuarios y pedidos
-- Evidencia GA7-220501096-AA5-EV03 (servicios web del proyecto).
-- Agrega las tablas usuarios, pedidos y detalle_pedidos según
-- el modelo entidad-relación del proyecto (GA6).
-- Ejecutar después de los scripts 001, 002 y 003.
-- =====================================================

USE baby_sarai;

-- 1. Usuarios de la tienda: la administradora y los clientes
CREATE TABLE IF NOT EXISTS usuarios (
  id              INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  nombre          VARCHAR(100) NOT NULL,
  -- El correo es el usuario para iniciar sesión: no se puede repetir
  email           VARCHAR(120) NOT NULL UNIQUE,
  -- Hash de bcrypt (siempre 60 caracteres). Nunca se guarda la contraseña original.
  contrasena_hash CHAR(60)     NOT NULL,
  rol             ENUM('admin', 'cliente') NOT NULL DEFAULT 'cliente',
  telefono        VARCHAR(20)  NULL,
  activo          TINYINT(1)   NOT NULL DEFAULT 1,
  fecha_creacion  DATETIME     NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- 2. Pedidos: el encabezado de cada compra
CREATE TABLE IF NOT EXISTS pedidos (
  id                  INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  usuario_id          INT UNSIGNED  NOT NULL,
  estado              ENUM('pendiente', 'pagado', 'enviado', 'entregado', 'cancelado')
                      NOT NULL DEFAULT 'pendiente',
  subtotal            DECIMAL(10,2) NOT NULL,
  costo_envio         DECIMAL(10,2) NOT NULL,
  total               DECIMAL(10,2) NOT NULL,
  direccion_envio     VARCHAR(200)  NOT NULL,
  ciudad              VARCHAR(60)   NOT NULL,
  telefono            VARCHAR(20)   NOT NULL,
  notas               VARCHAR(255)  NULL,
  fecha_creacion      DATETIME      NOT NULL DEFAULT CURRENT_TIMESTAMP,
  fecha_actualizacion DATETIME      NULL ON UPDATE CURRENT_TIMESTAMP,
  CONSTRAINT fk_pedidos_usuarios FOREIGN KEY (usuario_id) REFERENCES usuarios(id)
    ON UPDATE CASCADE ON DELETE RESTRICT,
  CONSTRAINT chk_pedidos_valores CHECK (subtotal >= 0 AND costo_envio >= 0 AND total >= 0)
);

-- 3. Detalle de cada pedido: una fila por producto comprado
CREATE TABLE IF NOT EXISTS detalle_pedidos (
  id              INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  pedido_id       INT UNSIGNED  NOT NULL,
  -- INT (con signo) porque así se creó productos.id en el script 001
  producto_id     INT           NOT NULL,
  -- Copia del nombre, la talla y el precio al momento de la compra:
  -- si después el producto cambia de precio, el pedido conserva lo que se cobró
  nombre_producto VARCHAR(100)  NOT NULL,
  talla           VARCHAR(20)   NULL,
  cantidad        INT UNSIGNED  NOT NULL,
  precio_unitario DECIMAL(10,2) NOT NULL,
  subtotal        DECIMAL(10,2) NOT NULL,
  CONSTRAINT fk_detalle_pedidos FOREIGN KEY (pedido_id) REFERENCES pedidos(id)
    ON UPDATE CASCADE ON DELETE CASCADE,
  -- RESTRICT: un producto que ya se vendió no se puede borrar (se oculta con activo = 0)
  CONSTRAINT fk_detalle_productos FOREIGN KEY (producto_id) REFERENCES productos(id)
    ON UPDATE CASCADE ON DELETE RESTRICT,
  CONSTRAINT chk_detalle_cantidad CHECK (cantidad > 0)
);

-- Comprobación: deben aparecer las 5 tablas del proyecto
SHOW TABLES;
