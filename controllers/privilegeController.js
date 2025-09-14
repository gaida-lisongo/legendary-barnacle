const Privilege = require('../models/Privilege');

exports.createPrivilege = async (req, res) => {
  try {
    const privilege = new Privilege(req.body);
    await privilege.save();
    res.status(201).json(privilege);
  } catch (err) {
    if (err.code === 11000) {
      return res.status(400).json({ error: 'Privilege déjà existant pour cet agent / section / rôle.' });
    }
    res.status(400).json({ error: err.message });
  }
};

exports.getPrivileges = async (req, res) => {
  try {
    const filter = {};
    if (req.query.userId) filter.userId = req.query.userId;
    if (req.query.sectionId) filter.sectionId = req.query.sectionId;
    if (req.query.role) filter.role = req.query.role;
    const privileges = await Privilege.find(filter);
    res.json(privileges);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getPrivilege = async (req, res) => {
  try {
    const privilege = await Privilege.findById(req.params.id);
    if (!privilege) return res.status(404).json({ error: 'Privilege introuvable' });
    res.json(privilege);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.updatePrivilege = async (req, res) => {
  try {
    const privilege = await Privilege.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    if (!privilege) return res.status(404).json({ error: 'Privilege introuvable' });
    res.json(privilege);
  } catch (err) {
    if (err.code === 11000) {
      return res.status(400).json({ error: 'Conflit: combinaison déjà utilisée.' });
    }
    res.status(400).json({ error: err.message });
  }
};

exports.deletePrivilege = async (req, res) => {
  try {
    const privilege = await Privilege.findByIdAndDelete(req.params.id);
    if (!privilege) return res.status(404).json({ error: 'Privilege introuvable' });
    res.json({ message: 'Supprimé' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getPrivilegesByUser = async (req, res) => {
  try {
    const list = await Privilege.find({ userId: req.params.userId });
    res.json(list);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getPrivilegesBySection = async (req, res) => {
  try {
    const list = await Privilege.find({ sectionId: req.params.sectionId });
    res.json(list);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.checkUserRoleInSection = async (req, res) => {
  const { userId, sectionId, role } = req.query;
  if (!userId || !sectionId || !role) {
    return res.status(400).json({ error: 'userId, sectionId et role requis.' });
  }
  try {
    const exists = await Privilege.exists({ userId, sectionId, role });
    res.json({ hasPrivilege: !!exists });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};