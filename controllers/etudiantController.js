const Etudiant = require('../models/Etudiant');

exports.createEtudiant = async (req, res) => {
  try {
    const etudiant = new Etudiant(req.body);
    await etudiant.save();
    res.status(201).json(etudiant);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

exports.getEtudiants = async (req, res) => {
  try {
    const etudiants = await Etudiant.find();
    res.json(etudiants);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getEtudiant = async (req, res) => {
  try {
    const etudiant = await Etudiant.findById(req.params.id);
    if (!etudiant) return res.status(404).json({ error: 'Not found' });
    res.json(etudiant);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.updateEtudiant = async (req, res) => {
  try {
    const etudiant = await Etudiant.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!etudiant) return res.status(404).json({ error: 'Not found' });
    res.json(etudiant);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

exports.deleteEtudiant = async (req, res) => {
  try {
    const etudiant = await Etudiant.findByIdAndDelete(req.params.id);
    if (!etudiant) return res.status(404).json({ error: 'Not found' });
    res.json({ message: 'Deleted' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
