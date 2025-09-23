const Semestre = require('../models/Semestre');
const Cours = require('../models/Cours');
const Unite = require('../models/Unite');

exports.createSemestre = async (req, res) => {
  try {
    const semestre = new Semestre(req.body);
    await semestre.save();
    res.status(201).json(semestre);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

exports.getSemestres = async (req, res) => {
  try {
    const semestres = await Semestre.find();
    res.json(semestres);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getSemestre = async (req, res) => {
  try {
    const semestre = await Semestre.findById(req.params.id);
    if (!semestre) return res.status(404).json({ error: 'Not found' });
    const semestreUnites = semestre.unites.map(async (uniteId) => {
      const unite = await Unite.findById(uniteId);
      if (!unite) return null;

      const uniteCours = unite.cours.map(async (coursId) => {
        const cours = await Cours.findById(coursId);
        if (!cours) return null;
        return cours;
      });
      unite.cours = await Promise.all(uniteCours);
      return unite;
    });
    semestre.unites = await Promise.all(semestreUnites);
    res.json(semestre);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.updateSemestre = async (req, res) => {
  try {
    const semestre = await Semestre.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!semestre) return res.status(404).json({ error: 'Not found' });
    res.json(semestre);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

exports.deleteSemestre = async (req, res) => {
  try {
    const semestre = await Semestre.findByIdAndDelete(req.params.id);
    if (!semestre) return res.status(404).json({ error: 'Not found' });
    res.json({ message: 'Deleted' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
