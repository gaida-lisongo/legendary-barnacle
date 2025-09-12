const Agent = require('../models/Agent');
const crypto = require('crypto');
const jwt = require('jsonwebtoken');

exports.createAgent = async (req, res) => {
  try {
    const agent = new Agent(req.body);
    await agent.save();
    res.status(201).json(agent);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

exports.getAgents = async (req, res) => {
  try {
    const agents = await Agent.find();
    res.json(agents);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getAgent = async (req, res) => {
  try {
    const agent = await Agent.findById(req.params.id);
    if (!agent) return res.status(404).json({ error: 'Not found' });
    res.json(agent);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.updateAgent = async (req, res) => {
  try {
    console.log("Update Agent: ", req.body);
    const agent = await Agent.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!agent) return res.status(404).json({ error: 'Not found' });
    res.json(agent);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

// Créditer le solde d'un agent
exports.creditSolde = async (req, res) => {
  try {
    const { montant } = req.body;
    if (montant === undefined) {
      return res.status(400).json({ error: 'Le champ montant est requis.' });
    }
    const value = Number(montant);
    if (isNaN(value) || value <= 0) {
      return res.status(400).json({ error: 'Montant invalide (doit être > 0).' });
    }
    const agent = await Agent.findById(req.params.id);
    if (!agent) return res.status(404).json({ error: 'Agent introuvable.' });
    agent.solde = (agent.solde || 0) + value;
    await agent.save();
    res.json({ message: 'Solde crédité avec succès', solde: agent.solde, agent });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.deleteAgent = async (req, res) => {
  try {
    const agent = await Agent.findByIdAndDelete(req.params.id);
    if (!agent) return res.status(404).json({ error: 'Not found' });
    res.json({ message: 'Deleted' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Authentification de l'agent
exports.loginAgent = async (req, res) => {
  const { matricule, password } = req.body;
  if (!matricule || !password) {
    return res.status(400).json({ error: 'Matricule et mot de passe requis.' });
  }
  try {
    // Cryptage SHA1 du mot de passe
    console.log("Secure uncrypte: ", password);

    const hash = crypto.createHash('sha1').update(password).digest('hex');
    console.log("Secure crypte: ", hash)
    const agent = await Agent.findOne({ matricule, secure: hash });
    if (!agent) {
      return res.status(401).json({ error: 'Identifiants invalides.' });
    }
    // Génération du token
    const token = jwt.sign({ id: agent._id, matricule: agent.matricule }, 'SECRET_KEY', { expiresIn: '1d' });
    res.json({ token, agent });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
