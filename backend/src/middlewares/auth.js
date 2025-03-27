const jwt = require('jsonwebtoken');

const authenticateToken = (req, res, next) => {
  // Obtener el token del encabezado Authorization
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1]; // Bearer TOKEN
  
  if (!token) {
    return res.status(401).json({ message: 'Acceso no autorizado' });
  }
  
  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err) {
      return res.status(403).json({ message: 'Token inválido o expirado' });
    }
    
    req.user = user;
    next();
  });
};

module.exports = authenticateToken;
