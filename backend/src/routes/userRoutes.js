const express = require('express');
const userController = require('../controllers/userController');
const authenticateToken = require('../middlewares/auth');

const router = express.Router();

router.post('/register', userController.register);
router.post('/login', userController.login);
router.get('/profile', authenticateToken, userController.getProfile);

module.exports = router;
