/**
 * Configuración común de las pruebas unitarias.
 * Las pruebas unitarias NO usan la base de datos: se cargan variables de entorno
 * de prueba para que config/env.js no detenga el proceso si falta el archivo .env.
 * (El pool de MySQL no se conecta hasta que alguien hace una consulta.)
 */
process.env.DB_HOST ||= 'localhost';
process.env.DB_USER ||= 'pruebas';
process.env.DB_NAME ||= 'baby_sarai';
process.env.JWT_SECRETO ||= 'secreto-de-pruebas-unitarias';
process.env.JWT_EXPIRA ||= '2h';
