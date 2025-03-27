const express = require('express');
const projectController = require('../controllers/projectController');
const authenticateToken = require('../middlewares/auth');

const router = express.Router();

router.use(authenticateToken); // Todas las rutas requieren autenticación

router.get('/', projectController.getAllProjects);
router.post('/', projectController.createProject);
router.get('/:id', projectController.getProjectById);
router.put('/:id', projectController.updateProject);
router.delete('/:id', projectController.deleteProject);

module.exports = router;
