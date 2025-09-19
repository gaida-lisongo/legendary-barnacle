const Session = require('../models/Session');
const Cours = require('../models/Cours');

exports.createSession = async (req, res) => {
  try {
    const session = new Session(req.body);
    await session.save();
    res.status(201).json(session);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

exports.getSessions = async (req, res) => {
  try {
    const sessions = await Session.find().populate(" produitId ");
    res.json(sessions);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getSession = async (req, res) => {
  try {
    const session = await Session.findById(req.params.id).populate("produitId");
    if (!session) return res.status(404).json({ error: 'Not found' });
    res.json(session);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getSessionsByAnneeWithCours = async (req, res) => {
  try {
    const sessions = await Session.find({ anneeId: req.params.anneeId }).populate("produitId");
    if(!sessions || sessions.length === 0) {
      return res.status(404).json({ error: 'No sessions found for this year' });
    }
    // Correction ici : on attend la résolution de tous les cours
    const sessionsDetail = await Promise.all(
      sessions.map(async session => {
        const coursDetails = await Promise.all(
          session.cours.map(coursId => Cours.findById(coursId))
        );
        return { ...session.toObject(), cours: coursDetails };
      })
    );
    res.json(sessionsDetail);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.updateSession = async (req, res) => {
  try {
    const session = await Session.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!session) return res.status(404).json({ error: 'Not found' });
    res.json(session);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

exports.deleteSession = async (req, res) => {
  try {
    const session = await Session.findByIdAndDelete(req.params.id);
    if (!session) return res.status(404).json({ error: 'Not found' });
    res.json({ message: 'Deleted' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
