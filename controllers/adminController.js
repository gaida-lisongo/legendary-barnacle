const Admin = require('../models/Admin');
const Agent = require('../models/Agent');

// Create Admin
exports.createAdmin = async (req, res) => {
  try {
    const { userId, role, quotite } = req.body;
    if (!userId) return res.status(400).json({ error: 'userId requis' });

    // Vérifier existence de l'agent
    const agent = await Agent.findById(userId);
    if (!agent) return res.status(404).json({ error: 'Agent introuvable' });

    // Empêcher doublon
    const existing = await Admin.findOne({ userId });
    if (existing) return res.status(409).json({ error: 'Cet utilisateur est déjà admin' });

    const admin = new Admin({ userId, role, quotite });
    await admin.save();
    res.status(201).json(admin);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Get all admins
exports.getAdmins = async (_req, res) => {
  try {
    const admins = await Admin.find().populate('userId');
    res.json(admins);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Get single admin
exports.getAdmin = async (req, res) => {
  try {
    const admin = await Admin.findById(req.params.id).populate('userId');
    if (!admin) return res.status(404).json({ error: 'Admin introuvable' });
    res.json(admin);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Update admin
exports.updateAdmin = async (req, res) => {
  try {
    const admin = await Admin.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!admin) return res.status(404).json({ error: 'Admin introuvable' });
    res.json(admin);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

// Delete admin
exports.deleteAdmin = async (req, res) => {
  try {
    const admin = await Admin.findByIdAndDelete(req.params.id);
    if (!admin) return res.status(404).json({ error: 'Admin introuvable' });
    res.json({ message: 'Admin supprimé' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Check if current authenticated agent is admin
exports.checkMe = async (req, res) => {
  try {
    const currentId = req.agent && req.agent.id;
    if (!currentId) return res.status(401).json({ error: 'Non authentifié' });
    const admin = await Admin.findOne({ userId: currentId });
    res.json({ isAdmin: !!admin, admin });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Utility: test if arbitrary userId is admin
exports.isUserAdmin = async (req, res) => {
  try {
    const { userId } = req.params;
    const admin = await Admin.findOne({ userId });
    res.json({ isAdmin: !!admin });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
