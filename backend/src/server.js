const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');

// Importar rutas
const userRoutes = require('./routes/userRoutes');
const projectRoutes = require('./routes/projectRoutes');

// Cargar variables de entorno
dotenv.config();

// Inicializar la aplicación
const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors({origin: ['http://localhost:3000', 'http://10.0.4.222:3000']}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Rutas
app.get('/', (req, res) => {
  res.json({ message: 'API de GanttFlow funcionando correctamente' });
});

// Rutas de API
app.use('/api/users', userRoutes);
app.use('/api/projects', projectRoutes);

// Iniciar el servidor
app.listen(PORT, () => {
  console.log(`Servidor ejecutándose en el puerto ${PORT}`);
});

module.exports = app;
