const jwt = require('jsonwebtoken');

// Middleware pour sécuriser les routes
module.exports = function (req, res, next) {
  const authHeader = req.headers['authorization'];
  console.log("Current Auth Header:", authHeader);
  
  const token = authHeader && authHeader.split(' ')[1];
  console.log("Token:",token);
  if (!token) {
    return res.status(401).json({ error: 'Token manquant.' });
  }
  try {
    const decoded = jwt.verify(token, 'SECRET_KEY');
    console.log("User Decoded :", decoded);
    
    req.agent = decoded;
    next();
  } catch (err) {
    return res.status(403).json({ error: 'Token invalide.' });
  }
};
