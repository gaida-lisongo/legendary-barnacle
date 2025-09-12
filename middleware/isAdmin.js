const Admin = require('../models/Admin');

module.exports = async function (req, res, next) {
  try {
    const userId = req.agent && req.agent.id;
    if (!userId) return res.status(401).json({ error: 'Non authentifié' });
    const admin = await Admin.findOne({ userId });
    if (!admin) return res.status(403).json({ error: 'Accès refusé: admin requis' });
    req.admin = admin; // Attacher admin pour usage ultérieur
    next();
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
