-- =====================================================
-- Baby Saraí - Script 001: Base de datos y tabla productos
-- Estructura inicial creada en la evidencia AA2-EV01.
-- =====================================================
 
CREATE DATABASE IF NOT EXISTS baby_sarai;
USE baby_sarai;
 
CREATE TABLE productos (
  id INT AUTO_INCREMENT PRIMARY KEY,
  nombre VARCHAR(100) NOT NULL,
  descripcion VARCHAR(255),
  precio DECIMAL(10,2) NOT NULL,
  categoria VARCHAR(50),
  stock INT DEFAULT 0,
  fecha_creacion DATETIME DEFAULT CURRENT_TIMESTAMP
);
 