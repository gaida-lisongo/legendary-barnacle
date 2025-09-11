const Cours = require('../models/Cours');

exports.createCours = async (req, res) => {
  try {
    const cours = new Cours(req.body);
    await cours.save();
    res.status(201).json(cours);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

exports.getCoursList = async (req, res) => {
  try {
    const cours = await Cours.find();
    res.json(cours);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getCours = async (req, res) => {
  try {
    const cours = await Cours.findById(req.params.id);
    if (!cours) return res.status(404).json({ error: 'Not found' });
    res.json(cours);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.updateCours = async (req, res) => {
  try {
    const cours = await Cours.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!cours) return res.status(404).json({ error: 'Not found' });
    res.json(cours);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

exports.deleteCours = async (req, res) => {
  try {
    const cours = await Cours.findByIdAndDelete(req.params.id);
    if (!cours) return res.status(404).json({ error: 'Not found' });
    res.json({ message: 'Deleted' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
