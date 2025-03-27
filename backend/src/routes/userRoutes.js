const express = require('express');
const userController = require('../controllers/userController');

const router = express.Router();

// Rutas de autenticación
router.post('/register', userController.register);
router.post('/login', userController.login);

module.exports = router;
