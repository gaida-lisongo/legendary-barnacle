const Unite = require('../models/Unite');

exports.createUnite = async (req, res) => {
  try {
    const unite = new Unite(req.body);
    await unite.save();
    res.status(201).json(unite);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

exports.getUnites = async (req, res) => {
  try {
    const unites = await Unite.find();
    res.json(unites);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getUnite = async (req, res) => {
  try {
    const unite = await Unite.findById(req.params.id);
    if (!unite) return res.status(404).json({ error: 'Not found' });
    res.json(unite);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.updateUnite = async (req, res) => {
  try {
    const unite = await Unite.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!unite) return res.status(404).json({ error: 'Not found' });
    res.json(unite);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

exports.deleteUnite = async (req, res) => {
  try {
    const unite = await Unite.findByIdAndDelete(req.params.id);
    if (!unite) return res.status(404).json({ error: 'Not found' });
    res.json({ message: 'Deleted' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
