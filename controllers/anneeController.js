const Annee = require('../models/Annee');

exports.createAnnee = async (req, res) => {
  try {
    const annee = new Annee(req.body);
    await annee.save();
    res.status(201).json(annee);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

exports.getAnnees = async (req, res) => {
  try {
    const annees = await Annee.find();
    res.json(annees);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getAnnee = async (req, res) => {
  try {
    const annee = await Annee.findById(req.params.id);
    if (!annee) return res.status(404).json({ error: 'Not found' });
    res.json(annee);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.updateAnnee = async (req, res) => {
  try {
    const annee = await Annee.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!annee) return res.status(404).json({ error: 'Not found' });
    res.json(annee);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

exports.deleteAnnee = async (req, res) => {
  try {
    const annee = await Annee.findByIdAndDelete(req.params.id);
    if (!annee) return res.status(404).json({ error: 'Not found' });
    res.json({ message: 'Deleted' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
