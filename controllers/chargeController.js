const Charge = require('../models/Charge');

exports.createCharge = async (req, res) => {
  try {
    const charge = new Charge(req.body);
    await charge.save();
    res.status(201).json(charge);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

exports.getCharges = async (req, res) => {
  try {
    const charges = await Charge.find();
    res.json(charges);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getCharge = async (req, res) => {
  try {
    const charge = await Charge.findById(req.params.id);
    if (!charge) return res.status(404).json({ error: 'Not found' });
    res.json(charge);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.updateCharge = async (req, res) => {
  try {
    const charge = await Charge.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!charge) return res.status(404).json({ error: 'Not found' });
    res.json(charge);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

exports.deleteCharge = async (req, res) => {
  try {
    const charge = await Charge.findByIdAndDelete(req.params.id);
    if (!charge) return res.status(404).json({ error: 'Not found' });
    res.json({ message: 'Deleted' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
