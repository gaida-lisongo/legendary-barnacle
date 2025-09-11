const mongoose = require('mongoose');

const FicheSchema = new mongoose.Schema({
  commandeId: { type: mongoose.Schema.Types.ObjectId, ref: 'Commande' },
  cmi: Number,
  examen: Number,
  rattrapage: Number,
  author: { type: mongoose.Schema.Types.ObjectId, ref: 'Agent' },
  logs: [{
    agentId: { type: mongoose.Schema.Types.ObjectId, ref: 'Agent' },
    justification: String
  }]
});

module.exports = mongoose.model('Fiche', FicheSchema);
