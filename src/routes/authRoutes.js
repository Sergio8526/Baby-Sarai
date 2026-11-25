/**
 * Rutas de autenticación.
 * Prefijo: /api/v1/auth
 */
const express = require('express');
const authController = require('../controllers/authController.js');
const { autenticar } = require('../middlewares/autenticacion.js');

const router = express.Router();

router.post('/registro', authController.registrar); // Crear cuenta de cliente
router.post('/login', authController.iniciarSesion); // Iniciar sesión → token
router.get('/perfil', autenticar, authController.perfil); // Datos del dueño del token

module.exports = router;
