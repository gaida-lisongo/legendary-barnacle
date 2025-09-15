const Jury = require('../models/Jury');
const JuryClasse = require('../models/JuryClasse');

exports.createJuryClasse = async (req, res) => {
  try {
    const juryClasse = new JuryClasse(req.body);
    await juryClasse.save();
    res.status(201).json(juryClasse);
  } catch (err) {
    if (err.code === 11000) {
      return res.status(400).json({ error: 'Association déjà existante.' });
    }
    res.status(400).json({ error: err.message });
  }
};

exports.getJuryClasses = async (req, res) => {
  try {
    const list = await JuryClasse.find();
    res.json(list);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getJuryClasse = async (req, res) => {
  try {
    const juryClasse = await JuryClasse.findById(req.params.id);
    if (!juryClasse) return res.status(404).json({ error: 'Association non trouvée' });
    res.json(juryClasse);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};



exports.updateJuryClasse = async (req, res) => {
  try {
    const juryClasse = await JuryClasse.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    if (!juryClasse) return res.status(404).json({ error: 'Association non trouvée' });
    res.json(juryClasse);
  } catch (err) {
    if (err.code === 11000) {
      return res.status(400).json({ error: 'Conflit: association déjà existante.' });
    }
    res.status(400).json({ error: err.message });
  }
};

exports.deleteJuryClasse = async (req, res) => {
  try {
    const juryClasse = await JuryClasse.findByIdAndDelete(req.params.id);
    if (!juryClasse) return res.status(404).json({ error: 'Association non trouvée' });
    res.json({ message: 'Supprimé' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
exports.createJury = async (req, res) => {
  try {
    const jury = new Jury(req.body);
    await jury.save();
    res.status(201).json(jury);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

exports.getJuries = async (req, res) => {
  try {
    const juries = await Jury.find();
    res.json(juries);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getJuriesByAnneeAndSection = async (req, res) => {
  try {
    const { anneeId, sectionId } = req.params;
    const juries = await Jury.find({ anneeId, sectionId });
    res.json(juries);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getJury = async (req, res) => {
  try {
    const jury = await Jury.findById(req.params.id);
    if (!jury) return res.status(404).json({ error: 'Jury non trouvé' });
    res.json(jury);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.updateJury = async (req, res) => {
  try {
    const jury = await Jury.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    if (!jury) return res.status(404).json({ error: 'Jury non trouvé' });
    res.json(jury);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

exports.deleteJury = async (req, res) => {
  try {
    const jury = await Jury.findByIdAndDelete(req.params.id);
    if (!jury) return res.status(404).json({ error: 'Jury non trouvé' });
    res.json({ message: 'Supprimé' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};