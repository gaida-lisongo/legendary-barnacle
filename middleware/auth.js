const jwt = require('jsonwebtoken');

// Middleware pour sécuriser les routes
module.exports = function (req, res, next) {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];
  if (!token) {
    return res.status(401).json({ error: 'Token manquant.' });
  }
  try {
    const decoded = jwt.verify(token, 'SECRET_KEY');
    req.agent = decoded;
    next();
  } catch (err) {
    return res.status(403).json({ error: 'Token invalide.' });
  }
};
