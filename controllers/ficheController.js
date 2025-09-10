const Fiche = require('../models/Fiche');

exports.createFiche = async (req, res) => {
  try {
    const fiche = new Fiche(req.body);
    await fiche.save();
    res.status(201).json(fiche);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

exports.getFiches = async (req, res) => {
  try {
    const fiches = await Fiche.find();
    res.json(fiches);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getFiche = async (req, res) => {
  try {
    const fiche = await Fiche.findById(req.params.id);
    if (!fiche) return res.status(404).json({ error: 'Not found' });
    res.json(fiche);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.updateFiche = async (req, res) => {
  try {
    const fiche = await Fiche.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!fiche) return res.status(404).json({ error: 'Not found' });
    res.json(fiche);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

exports.deleteFiche = async (req, res) => {
  try {
    const fiche = await Fiche.findByIdAndDelete(req.params.id);
    if (!fiche) return res.status(404).json({ error: 'Not found' });
    res.json({ message: 'Deleted' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
