const Cycle = require('../models/Cycle');

exports.createCycle = async (req, res) => {
  try {
    const cycle = new Cycle(req.body);
    await cycle.save();
    res.status(201).json(cycle);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

exports.getCycles = async (req, res) => {
  try {
    const cycles = await Cycle.find();
    res.json(cycles);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getCycle = async (req, res) => {
  try {
    const cycle = await Cycle.findById(req.params.id);
    if (!cycle) return res.status(404).json({ error: 'Not found' });
    res.json(cycle);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.updateCycle = async (req, res) => {
  try {
    const cycle = await Cycle.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!cycle) return res.status(404).json({ error: 'Not found' });
    res.json(cycle);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

exports.deleteCycle = async (req, res) => {
  try {
    const cycle = await Cycle.findByIdAndDelete(req.params.id);
    if (!cycle) return res.status(404).json({ error: 'Not found' });
    res.json({ message: 'Deleted' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
